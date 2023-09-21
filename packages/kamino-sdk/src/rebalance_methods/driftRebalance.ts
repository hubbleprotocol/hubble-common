import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo, RebalanceFieldsDict } from '../utils/types';
import { Dex } from '../utils';
import { priceToTickIndex, sqrtPriceX64ToPrice, tickIndexToPrice } from '@orca-so/whirlpool-sdk';
import { SqrtPriceMath } from '@raydium-io/raydium-sdk';
import { RebalanceRaw } from '../kamino-client/types';
import { RebalanceTypeLabelName } from './consts';
import { upsertManyRebalanceFieldInfos } from './utils';

export const DEFAULT_TICKS_BELOW_MID = new Decimal(10);
export const DEFAULT_TICKS_ABOVE_MID = new Decimal(10);
export const DEFAULT_SECONDS_PER_TICK = new Decimal(60 * 60 * 24 * 3); // 3 days; todo: get a reasonable default from Matt
export const DEFAULT_DIRECTION = new Decimal(1);
export const DriftRebalanceTypeName = 'drift';

export function getDriftRebalanceFieldInfos(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  startMidTick: Decimal,
  ticksBelowMid: Decimal,
  ticksAboveMid: Decimal,
  secondsPerTick: Decimal,
  direction: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: RebalanceTypeLabelName,
    type: 'string',
    value: DriftRebalanceTypeName,
    enabled,
  };
  let startMidTickRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'startMidTick',
    type: 'number',
    value: startMidTick,
    enabled,
  };
  let ticksBelowMidRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'ticksBelowMid',
    type: 'number',
    value: ticksBelowMid,
    enabled,
  };
  let ticksAboveMidRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'ticksAboveMid',
    type: 'number',
    value: ticksAboveMid,
    enabled,
  };
  let secondsPerTickRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'secondsPerTick',
    type: 'number',
    value: secondsPerTick,
    enabled,
  };
  let directionRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'direction',
    type: 'number',
    value: direction,
    enabled,
  };

  let { lowerPrice, upperPrice } = getPositionRangeFromDriftParams(
    dex,
    tokenADecimals,
    tokenBDecimals,
    startMidTick,
    ticksBelowMid,
    ticksAboveMid
  );

  let lowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceLower',
    type: 'number',
    value: lowerPrice,
    enabled: false,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceUpper',
    type: 'number',
    value: upperPrice,
    enabled: false,
  };

  return [
    rebalanceType,
    startMidTickRebalanceFieldInfo,
    ticksBelowMidRebalanceFieldInfo,
    ticksAboveMidRebalanceFieldInfo,
    secondsPerTickRebalanceFieldInfo,
    directionRebalanceFieldInfo,
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
  ];
}

// todo(silviu): see if this is needed
export function getPositionRangeFromTakeProfitFieldInfos(fieldInfos: RebalanceFieldInfo[]) {}

export function getPositionRangeFromDriftParams(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  startMidTick: Decimal,
  ticksBelowMid: Decimal,
  ticksAboveMid: Decimal
): PositionRange {
  let lowerTickIndex = startMidTick.sub(ticksBelowMid);
  let upperTickIndex = startMidTick.add(ticksAboveMid);

  if (dex == 'ORCA') {
    let lowerPrice = tickIndexToPrice(lowerTickIndex.toNumber(), tokenADecimals, tokenBDecimals);
    let upperPrice = tickIndexToPrice(upperTickIndex.toNumber(), tokenADecimals, tokenBDecimals);
    return { lowerPrice, upperPrice };
  } else if (dex == 'RAYDIUM') {
    let lowerPrice = sqrtPriceX64ToPrice(
      SqrtPriceMath.getSqrtPriceX64FromTick(lowerTickIndex.toNumber()),
      tokenADecimals,
      tokenBDecimals
    );

    let upperPrice = sqrtPriceX64ToPrice(
      SqrtPriceMath.getSqrtPriceX64FromTick(upperTickIndex.toNumber()),
      tokenADecimals,
      tokenBDecimals
    );

    return { lowerPrice, upperPrice };
  } else {
    throw new Error(`Unknown DEX ${dex}`);
  }
}

// todo(silviu): get sensible default params from Matt
export function getDefaultDriftRebalanceFieldInfos(
  dex: Dex,
  price: Decimal,
  tokenADecimals: number,
  tokenBDecimals: number
): RebalanceFieldInfo[] {
  let currentTickIndex = priceToTickIndex(price, tokenADecimals, tokenBDecimals);
  let startMidTick = new Decimal(currentTickIndex);

  return getDriftRebalanceFieldInfos(
    dex,
    tokenADecimals,
    tokenBDecimals,
    startMidTick,
    DEFAULT_TICKS_BELOW_MID,
    DEFAULT_TICKS_ABOVE_MID,
    DEFAULT_SECONDS_PER_TICK,
    DEFAULT_DIRECTION
  );
}

export function readDriftRebalanceParamsFromStrategy(rebalanceRaw: RebalanceRaw) {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);
  let params: RebalanceFieldsDict = {};

  params['startMidTick'] = new Decimal(paramsBuffer.readInt32LE(0));
  params['ticksBelowMid'] = new Decimal(paramsBuffer.readInt32LE(4));
  params['ticksAboveMid'] = new Decimal(paramsBuffer.readInt32LE(8));
  params['secondsPerTick'] = new Decimal(paramsBuffer.readBigUint64LE(12).toString());
  params['direction'] = new Decimal(paramsBuffer.readUint8(20));

  return params;
}

export function readRawDriftRebalanceStateFromStrategy(rebalanceRaw: RebalanceRaw) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let state: RebalanceFieldsDict = {};

  state['step'] = new Decimal(stateBuffer.readUInt8(0));
  state['lastDriftTimestamp'] = new Decimal(stateBuffer.readBigUint64LE(1).toString());
  state['lastMidTick'] = new Decimal(stateBuffer.readInt32LE(9));

  return state;
}

export function readDriftRebalanceStateFromStrategy(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let state: RebalanceFieldsDict = {};

  let fields = deserializeDriftRebalanceFromOnchainParams(dex, tokenADecimals, tokenBDecimals, rebalanceRaw);

  let step = new Decimal(stateBuffer.readUInt8(0));
  let lastDriftTimestamp = new Decimal(stateBuffer.readBigUint64LE(1).toString());
  let lastMidTick = new Decimal(stateBuffer.readInt32LE(9));

  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let ticksBelowMid = new Decimal(paramsBuffer.readInt32LE(4));
  let ticksAboveMid = new Decimal(paramsBuffer.readInt32LE(8));

  let lowerTickIndex = lastMidTick.sub(ticksBelowMid);
  let upperTickIndex = lastMidTick.add(ticksAboveMid);

  let lowerPrice: Decimal, upperPrice: Decimal;
  if (dex == 'ORCA') {
    lowerPrice = tickIndexToPrice(lowerTickIndex.toNumber(), tokenADecimals, tokenBDecimals);
    upperPrice = tickIndexToPrice(upperTickIndex.toNumber(), tokenADecimals, tokenBDecimals);
  } else if (dex == 'RAYDIUM') {
    lowerPrice = sqrtPriceX64ToPrice(
      SqrtPriceMath.getSqrtPriceX64FromTick(lowerTickIndex.toNumber()),
      tokenADecimals,
      tokenBDecimals
    );

    upperPrice = sqrtPriceX64ToPrice(
      SqrtPriceMath.getSqrtPriceX64FromTick(upperTickIndex.toNumber()),
      tokenADecimals,
      tokenBDecimals
    );
  } else {
    throw new Error(`Unknown DEX ${dex}`);
  }

  let lowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceLower',
    type: 'number',
    value: lowerPrice,
    enabled: false,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceUpper',
    type: 'number',
    value: upperPrice,
    enabled: false,
  };

  let resetUpperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceLower',
    type: 'number',
    value: lowerPrice,
    enabled: true,
  };
  let resetUpperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceUpper',
    type: 'number',
    value: upperPrice,
    enabled: true,
  };

  return [
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
    resetUpperRangeRebalanceFieldInfo,
    resetUpperBpsRebalanceFieldInfo,
  ];
}

export function deserializeDriftRebalanceFromOnchainParams(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let params = readDriftRebalanceParamsFromStrategy(rebalanceRaw);

  return getDriftRebalanceFieldInfos(
    dex,
    tokenADecimals,
    tokenBDecimals,
    params['startMidTick'],
    params['ticksBelowMid'],
    params['ticksAboveMid'],
    params['secondsPerTick'],
    params['direction']
  );
}

export function deserializeDriftRebalanceWithStateOverride(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  const stateFields = readDriftRebalanceStateFromStrategy(dex, tokenADecimals, tokenBDecimals, rebalanceRaw);

  let fields = deserializeDriftRebalanceFromOnchainParams(dex, tokenADecimals, tokenBDecimals, rebalanceRaw);

  return upsertManyRebalanceFieldInfos(fields, stateFields);
}

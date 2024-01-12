import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo, RebalanceFieldsDict } from '../utils/types';
import { Dex } from '../utils';
import { priceToTickIndex, sqrtPriceX64ToPrice, tickIndexToPrice } from '@orca-so/whirlpool-sdk';
import { SqrtPriceMath } from '@raydium-io/raydium-sdk';
import { RebalanceRaw } from '../kamino-client/types';
import { RebalanceTypeLabelName } from './consts';
import { upsertManyRebalanceFieldInfos } from './utils';
import { getPriceOfBinByBinIdWithDecimals } from '../utils/meteora';

export const DEFAULT_TICKS_BELOW_MID = new Decimal(10);
export const DEFAULT_TICKS_ABOVE_MID = new Decimal(10);
export const DEFAULT_SECONDS_PER_TICK = new Decimal(60 * 60 * 24 * 3); // 3 days; todo: get a reasonable default from Matt
export const DEFAULT_DIRECTION = new Decimal(1);
export const DriftRebalanceTypeName = 'drift';

export function getDriftRebalanceFieldInfos(
  dex: Dex,
  tickSpacing: number,
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
    tickSpacing,
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
  tickSpacing: number,
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
  } else if (dex == 'METEORA') {
    let lowerPrice = getPriceOfBinByBinIdWithDecimals(
      lowerTickIndex.toNumber(),
      tickSpacing,
      tokenADecimals,
      tokenBDecimals
    );

    let upperPrice = getPriceOfBinByBinIdWithDecimals(
      upperTickIndex.toNumber(),
      tickSpacing,
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
  tickSpacing: number,
  price: Decimal,
  tokenADecimals: number,
  tokenBDecimals: number
): RebalanceFieldInfo[] {
  let currentTickIndex = priceToTickIndex(price, tokenADecimals, tokenBDecimals);
  let startMidTick = new Decimal(currentTickIndex);

  return getDriftRebalanceFieldInfos(
    dex,
    tickSpacing,
    tokenADecimals,
    tokenBDecimals,
    startMidTick,
    DEFAULT_TICKS_BELOW_MID,
    DEFAULT_TICKS_ABOVE_MID,
    DEFAULT_SECONDS_PER_TICK,
    DEFAULT_DIRECTION
  );
}

export function readDriftRebalanceParamsFromStrategy(rebalanceRaw: RebalanceRaw): RebalanceFieldsDict {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);
  let params: RebalanceFieldsDict = {};

  params['startMidTick'] = new Decimal(paramsBuffer.readInt32LE(0));
  params['ticksBelowMid'] = new Decimal(paramsBuffer.readInt32LE(4));
  params['ticksAboveMid'] = new Decimal(paramsBuffer.readInt32LE(8));
  params['secondsPerTick'] = new Decimal(paramsBuffer.readBigUInt64LE(12).toString());
  params['direction'] = new Decimal(paramsBuffer.readUint8(20));

  return params;
}

export function readRawDriftRebalanceStateFromStrategy(rebalanceRaw: RebalanceRaw) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let state: RebalanceFieldsDict = {};

  state['step'] = new Decimal(stateBuffer.readUInt8(0));
  state['lastDriftTimestamp'] = new Decimal(stateBuffer.readBigUInt64LE(1).toString());
  state['lastMidTick'] = new Decimal(stateBuffer.readInt32LE(9));

  return state;
}

export function readDriftRebalanceStateFromStrategy(
  dex: Dex,
  tickSpacing: number,
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let lastMidTick = new Decimal(stateBuffer.readInt32LE(9));

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
  } else if (dex == 'METEORA') {
    lowerPrice = getPriceOfBinByBinIdWithDecimals(
      lowerTickIndex.toNumber(),
      tickSpacing,
      tokenADecimals,
      tokenBDecimals
    );

    upperPrice = getPriceOfBinByBinIdWithDecimals(
      upperTickIndex.toNumber(),
      tickSpacing,
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

  return [lowerRangeRebalanceFieldInfo, upperRangeRebalanceFieldInfo];
}

export function deserializeDriftRebalanceFromOnchainParams(
  dex: Dex,
  tickSpacing: number,
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let params = readDriftRebalanceParamsFromStrategy(rebalanceRaw);

  return getDriftRebalanceFieldInfos(
    dex,
    tickSpacing,
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
  tickSpacing: number,
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  const stateFields = readDriftRebalanceStateFromStrategy(
    dex,
    tickSpacing,
    tokenADecimals,
    tokenBDecimals,
    rebalanceRaw
  );

  let fields = deserializeDriftRebalanceFromOnchainParams(
    dex,
    tickSpacing,
    tokenADecimals,
    tokenBDecimals,
    rebalanceRaw
  );

  return upsertManyRebalanceFieldInfos(fields, stateFields);
}

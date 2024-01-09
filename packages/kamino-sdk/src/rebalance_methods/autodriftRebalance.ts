import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo, RebalanceFieldsDict } from '../utils/types';
import { Dex, readPriceOption } from '../utils';
import { priceToTickIndex, sqrtPriceX64ToPrice, tickIndexToPrice } from '@orca-so/whirlpool-sdk';
import { SqrtPriceMath } from '@raydium-io/raydium-sdk';
import { RebalanceRaw } from '../kamino-client/types';
import { RebalanceTypeLabelName } from './consts';
import { upsertManyRebalanceFieldInfos } from './utils';
import { getPriceOfBinByBinIdWithDecimals } from '../utils/meteora';

export const DEFAULT_DRIFT_TICKS_PER_EPOCH = new Decimal(1);
export const DEFAULT_TICKS_BELOW_MID = new Decimal(10);
export const DEFAULT_TICKS_ABOVE_MID = new Decimal(10);
export const DEFAULT_FRONTRUN_MULTIPLIER_BPS = new Decimal(10_000);
export const DEFAULT_STAKING_RATE_SOURCE_A = new Decimal(0);
export const DEFAULT_STAKING_RATE_SOURCE_B = new Decimal(0);
export const DEFAULT_DIRECTION = new Decimal(1);
export const AutodriftRebalanceTypeName = 'autodrift';

export function getAutodriftRebalanceFieldInfos(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  tickSpacing: number,
  lastMidTick: Decimal,
  initDriftTicksPerEpoch: Decimal,
  ticksBelowMid: Decimal,
  ticksAboveMid: Decimal,
  frontrunMultiplierBps: Decimal,
  stakingRateASource: Decimal,
  stakingRateBSource: Decimal,
  initialDriftDirection: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: RebalanceTypeLabelName,
    type: 'string',
    value: AutodriftRebalanceTypeName,
    enabled,
  };
  let lastMidTickRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lastMidTick',
    type: 'number',
    value: lastMidTick,
    enabled: false,
  };
  let initDriftTicksPerEpochRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'initDriftTicksPerEpoch',
    type: 'number',
    value: initDriftTicksPerEpoch,
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
  let fronturnMultiplierBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'frontrunMultiplierBps',
    type: 'number',
    value: frontrunMultiplierBps,
    enabled,
  };
  let stakingRateASourceRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'stakingRateASource',
    type: 'number',
    value: stakingRateASource,
    enabled,
  };
  let stakingRateBSourceRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'stakingRateBSource',
    type: 'number',
    value: stakingRateBSource,
    enabled,
  };
  let initialDriftDirectionRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'initialDriftDirection',
    type: 'number',
    value: initialDriftDirection,
    enabled,
  };

  let { lowerPrice, upperPrice } = getPositionRangeFromAutodriftParams(
    dex,
    tokenADecimals,
    tokenBDecimals,
    lastMidTick,
    ticksBelowMid,
    ticksAboveMid,
    tickSpacing
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
    ticksBelowMidRebalanceFieldInfo,
    ticksAboveMidRebalanceFieldInfo,
    initialDriftDirectionRebalanceFieldInfo,
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
    fronturnMultiplierBpsRebalanceFieldInfo,
    stakingRateASourceRebalanceFieldInfo,
    stakingRateBSourceRebalanceFieldInfo,
    initDriftTicksPerEpochRebalanceFieldInfo,
    lastMidTickRebalanceFieldInfo,
  ];
}

export function getPositionRangeFromAutodriftParams(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  startMidTick: Decimal,
  ticksBelowMid: Decimal,
  ticksAboveMid: Decimal,
  tickSpacing: number
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
export function getDefaultAutodriftRebalanceFieldInfos(
  dex: Dex,
  price: Decimal,
  tokenADecimals: number,
  tokenBDecimals: number,
  tickSpacing: number
): RebalanceFieldInfo[] {
  let currentTickIndex = priceToTickIndex(price, tokenADecimals, tokenBDecimals);
  let startMidTick = new Decimal(currentTickIndex);

  return getAutodriftRebalanceFieldInfos(
    dex,
    tokenADecimals,
    tokenBDecimals,
    tickSpacing,
    startMidTick,
    DEFAULT_DRIFT_TICKS_PER_EPOCH,
    DEFAULT_TICKS_BELOW_MID,
    DEFAULT_TICKS_ABOVE_MID,
    DEFAULT_FRONTRUN_MULTIPLIER_BPS,
    DEFAULT_STAKING_RATE_SOURCE_A,
    DEFAULT_STAKING_RATE_SOURCE_B,
    DEFAULT_DIRECTION
  );
}

export function readAutodriftRebalanceParamsFromStrategy(rebalanceRaw: RebalanceRaw): RebalanceFieldsDict {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);
  let params: RebalanceFieldsDict = {};

  params['initDriftTicksPerEpoch'] = new Decimal(paramsBuffer.readUInt32LE(0));
  params['ticksBelowMid'] = new Decimal(paramsBuffer.readInt32LE(4));
  params['ticksAboveMid'] = new Decimal(paramsBuffer.readInt32LE(8));
  params['frontrunMultiplierBps'] = new Decimal(paramsBuffer.readUInt16LE(12));
  params['stakingRateASource'] = new Decimal(paramsBuffer.readUint8(14));
  params['stakingRateBSource'] = new Decimal(paramsBuffer.readUint8(15));
  params['initialDriftDirection'] = new Decimal(paramsBuffer.readUint8(16));

  return params;
}

export function readRawAutodriftRebalanceStateFromStrategy(rebalanceRaw: RebalanceRaw) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let state: RebalanceFieldsDict = {};

  // prettier-ignore
  {
      let offset = 0;
      [offset, state['last_window_staking_rate_a']     ] = readPriceOption(stateBuffer, offset);
      [offset, state['last_window_staking_rate_b']     ] = readPriceOption(stateBuffer, offset);
      [offset, state['last_window_epoch']              ] = [offset + 8, new Decimal(stateBuffer.readBigUInt64LE(offset).toString())];
      [offset, state['last_window_theoretical_tick']   ] = [offset + 4, new Decimal(stateBuffer.readInt32LE(offset))];
      [offset, state['last_window_strat_mid_tick']     ] = [offset + 4, new Decimal(stateBuffer.readInt32LE(offset))];

      [offset, state['current_window_staking_rate_a']  ] = readPriceOption(stateBuffer, offset);
      [offset, state['current_window_staking_rate_b']  ] = readPriceOption(stateBuffer, offset);
      [offset, state['current_window_epoch']           ] = [offset + 8, new Decimal(stateBuffer.readBigUInt64LE(offset).toString())];
      [offset, state['current_window_theoretical_tick']] = [offset + 4, new Decimal(stateBuffer.readInt32LE(offset))];
      [offset, state['current_window_strat_mid_tick']  ] = [offset + 4, new Decimal(stateBuffer.readInt32LE(offset))];
      [offset, state['autodrift_step']                 ] = [offset + 1, new Decimal(stateBuffer.readInt8(offset))];
  }

  return state;
}

export function readAutodriftRebalanceStateFromStrategy(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  tickSpacing: number,
  rebalanceRaw: RebalanceRaw
) {
  let params = readAutodriftRebalanceParamsFromStrategy(rebalanceRaw);
  let state = readRawAutodriftRebalanceStateFromStrategy(rebalanceRaw);

  let lastMidTick = state['current_window_strat_mid_tick'];

  let ticksBelowMid = params['ticksBelowMid'];
  let ticksAboveMid = params['ticksAboveMid'];

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

export function deserializeAutodriftRebalanceFromOnchainParams(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  tickSpacing: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let params = readAutodriftRebalanceParamsFromStrategy(rebalanceRaw);
  let state = readRawAutodriftRebalanceStateFromStrategy(rebalanceRaw);

  return getAutodriftRebalanceFieldInfos(
    dex,
    tokenADecimals,
    tokenBDecimals,
    tickSpacing,
    state['current_window_strat_mid_tick'],
    params['initDriftTicksPerEpoch'],
    params['ticksBelowMid'],
    params['ticksAboveMid'],
    params['frontrunMultiplierBps'],
    params['stakingRateASource'],
    params['stakingRateBSource'],
    params['initialDriftDirection']
  );
}

export function deserializeAutodriftRebalanceWithStateOverride(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  tickSpacing: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  const stateFields = readAutodriftRebalanceStateFromStrategy(
    dex,
    tokenADecimals,
    tokenBDecimals,
    tickSpacing,
    rebalanceRaw
  );

  let fields = deserializeAutodriftRebalanceFromOnchainParams(
    dex,
    tokenADecimals,
    tokenBDecimals,
    tickSpacing,
    rebalanceRaw
  );

  return upsertManyRebalanceFieldInfos(fields, stateFields);
}

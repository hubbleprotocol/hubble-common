import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { getManualRebalanceFieldInfos } from './manualRebalance';
import { Dex } from '../utils';
import { priceToTickIndex, sqrtPriceX64ToPrice, tickIndexToPrice } from '@orca-so/whirlpool-sdk';
import { SqrtPriceMath } from '@raydium-io/raydium-sdk';
import { token } from '@project-serum/anchor/dist/cjs/utils';

export const DEFAULT_TICKS_BELOW_MID = new Decimal(10);
export const DEFAULT_TICKS_ABOVE_MID = new Decimal(10);
export const DEFAULT_SECONDS_PER_TICK = new Decimal(60 * 60 * 24 * 3); // 3 days; todo: get a reasonable default from Matt
export const DEFAULT_DIRECTION = new Decimal(1);

export function getDriftRebalanceFieldInfos(
  startMidTick: Decimal,
  ticksBelowMid: Decimal,
  ticksAboveMid: Decimal,
  secondsPerTick: Decimal,
  direction: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
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

  return [
    startMidTickRebalanceFieldInfo,
    ticksBelowMidRebalanceFieldInfo,
    ticksAboveMidRebalanceFieldInfo,
    secondsPerTickRebalanceFieldInfo,
    directionRebalanceFieldInfo,
  ];
}

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
  let upperTickIndex = startMidTick.sub(ticksAboveMid);

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
  let { lowerPrice, upperPrice } = getPositionRangeFromDriftParams(
    dex,
    tokenADecimals,
    tokenBDecimals,
    startMidTick,
    DEFAULT_TICKS_BELOW_MID,
    DEFAULT_TICKS_ABOVE_MID
  );

  let fieldInfos = getDriftRebalanceFieldInfos(
    startMidTick,
    DEFAULT_TICKS_BELOW_MID,
    DEFAULT_TICKS_ABOVE_MID,
    DEFAULT_SECONDS_PER_TICK,
    DEFAULT_DIRECTION
  ).concat(getManualRebalanceFieldInfos(lowerPrice, upperPrice, false));
  return fieldInfos;
}

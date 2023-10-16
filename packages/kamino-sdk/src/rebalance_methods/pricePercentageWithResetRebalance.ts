import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo, RebalanceFieldsDict } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { RebalanceRaw } from '../kamino-client/types';
import { RebalanceTypeLabelName } from './consts';
import { Dex, readBigUint128LE } from '../utils';
import { sqrtPriceX64ToPrice } from '@orca-so/whirlpool-sdk';
import BN from 'bn.js';
import { upsertManyRebalanceFieldInfos } from './utils';
import { getPriceRangeFromPriceAndDiffBPS, getResetRangeFromPriceAndDiffBPS } from './math_utils';

export const PricePercentageWithResetRebalanceTypeName = 'pricePercentageWithReset';

export function getPricePercentageWithResetRebalanceFieldInfos(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  resetLowerPercentageBPS: Decimal,
  resetUpperPercentageBPS: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: RebalanceTypeLabelName,
    type: 'string',
    value: PricePercentageWithResetRebalanceTypeName,
    enabled,
  };
  let lowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lowerRangeBps',
    type: 'number',
    value: lowerPercentageBPS,
    enabled,
  };
  let upperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'upperRangeBps',
    type: 'number',
    value: upperPercentageBPS,
    enabled,
  };
  let resetLowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetLowerRangeBps',
    type: 'number',
    value: resetLowerPercentageBPS,
    enabled,
  };
  let resetUpperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetUpperRangeBps',
    type: 'number',
    value: resetUpperPercentageBPS,
    enabled,
  };

  let { lowerPrice, upperPrice } = getPositionRangeFromPricePercentageWithResetParams(
    price,
    lowerPercentageBPS,
    upperPercentageBPS
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

  let { lowerPrice: resetLowerPrice, upperPrice: resetUpperPrice } =
    getPositionResetRangeFromPricePercentageWithResetParams(
      price,
      lowerPercentageBPS,
      upperPercentageBPS,
      resetLowerPercentageBPS,
      resetUpperPercentageBPS
    );
  let resetLowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceLower',
    type: 'number',
    value: resetLowerPrice,
    enabled: false,
  };
  let resetUpperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceUpper',
    type: 'number',
    value: resetUpperPrice,
    enabled: false,
  };

  return [
    rebalanceType,
    lowerBpsRebalanceFieldInfo,
    upperBpsRebalanceFieldInfo,
    resetLowerBpsRebalanceFieldInfo,
    resetUpperBpsRebalanceFieldInfo,
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
    resetLowerRangeRebalanceFieldInfo,
    resetUpperRangeRebalanceFieldInfo,
  ];
}

export function getPositionRangeFromPricePercentageWithResetParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal
): PositionRange {
  return getPriceRangeFromPriceAndDiffBPS(price, lowerPercentageBPS, upperPercentageBPS);
}

export function getPositionResetRangeFromPricePercentageWithResetParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  resetLowerPercentageBPS: Decimal,
  resetUpperPercentageBPS: Decimal
): PositionRange {
  return getResetRangeFromPriceAndDiffBPS(
    price,
    lowerPercentageBPS,
    upperPercentageBPS,
    resetLowerPercentageBPS,
    resetUpperPercentageBPS
  );
}

export function getDefaultPricePercentageWithResetRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let fieldInfos = getPricePercentageWithResetRebalanceFieldInfos(
    price,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal
  );
  return fieldInfos;
}

export function readPricePercentageWithResetRebalanceParamsFromStrategy(
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let lowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lowerRangeBps',
    type: 'number',
    value: new Decimal(paramsBuffer.readUint16LE(0)),
    enabled: true,
  };
  let upperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'upperRangeBps',
    type: 'number',
    value: new Decimal(paramsBuffer.readUint16LE(2)),
    enabled: true,
  };
  let resetLowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetLowerRangeBps',
    type: 'number',
    value: new Decimal(paramsBuffer.readUint16LE(4)),
    enabled: true,
  };
  let resetUpperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetUpperRangeBps',
    type: 'number',
    value: new Decimal(paramsBuffer.readUint16LE(6)),
    enabled: true,
  };

  return [
    lowerBpsRebalanceFieldInfo,
    upperBpsRebalanceFieldInfo,
    resetLowerBpsRebalanceFieldInfo,
    resetUpperBpsRebalanceFieldInfo,
  ];
}

export function readRawPricePercentageWithResetRebalanceStateFromStrategy(
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let stateBuffer = Buffer.from(rebalanceRaw.state);

  let lowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lastRebalanceLowerResetPoolPrice',
    type: 'number',
    value: new Decimal(readBigUint128LE(stateBuffer, 0).toString()),
    enabled: false,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lastRebalanceUpperResetPoolPrice',
    type: 'number',
    value: new Decimal(readBigUint128LE(stateBuffer, 16).toString()),
    enabled: false,
  };
  return [lowerRangeRebalanceFieldInfo, upperRangeRebalanceFieldInfo];
}

export function readPricePercentageWithResetRebalanceStateFromStrategy(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let params = readPricePercentageWithResetRebalanceParamsFromStrategy(rebalanceRaw);
  let lowerRangeBps = new Decimal(params.find((param) => param.label == 'lowerRangeBps')?.value.toString()!);
  let upperRangeBps = new Decimal(params.find((param) => param.label == 'upperRangeBps')?.value!.toString()!);
  let resetLowerRangeBps = new Decimal(params.find((param) => param.label == 'resetLowerRangeBps')?.value.toString()!);
  let resetUpperRangeBps = new Decimal(params.find((param) => param.label == 'resetUpperRangeBps')?.value!.toString()!);

  let lowerResetSqrtPriceX64 = readBigUint128LE(stateBuffer, 0).toString();
  let upperResetSqrtPriceX64 = readBigUint128LE(stateBuffer, 16).toString();

  let lowerResetPrice: Decimal, upperResetPrice: Decimal;

  if (dex == 'ORCA') {
    lowerResetPrice = sqrtPriceX64ToPrice(new BN(lowerResetSqrtPriceX64.toString()), tokenADecimals, tokenBDecimals);
    upperResetPrice = sqrtPriceX64ToPrice(new BN(upperResetSqrtPriceX64.toString()), tokenADecimals, tokenBDecimals);
  } else if (dex == 'RAYDIUM') {
    lowerResetPrice = sqrtPriceX64ToPrice(new BN(lowerResetSqrtPriceX64.toString()), tokenADecimals, tokenBDecimals);
    upperResetPrice = sqrtPriceX64ToPrice(new BN(upperResetSqrtPriceX64.toString()), tokenADecimals, tokenBDecimals);
  } else {
    throw new Error(`Unknown DEX ${dex}`);
  }

  let resetLowerFactor = resetLowerRangeBps.mul(lowerRangeBps).div(FullBPSDecimal);
  let resetUpperFactor = resetUpperRangeBps.mul(upperRangeBps).div(FullBPSDecimal);
  let lowerPositionPrice = lowerResetPrice
    .mul(FullBPSDecimal.sub(lowerRangeBps))
    .div(FullBPSDecimal.sub(resetLowerFactor));
  let upperPositionPrice = upperResetPrice
    .mul(FullBPSDecimal.add(upperRangeBps))
    .div(FullBPSDecimal.add(resetUpperFactor));

  let lowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceLower',
    type: 'number',
    value: lowerPositionPrice,
    enabled: true,
  };
  let upperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceUpper',
    type: 'number',
    value: upperPositionPrice,
    enabled: true,
  };
  let resetLowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceLower',
    type: 'number',
    value: lowerResetPrice,
    enabled: true,
  };
  let resetUpperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceUpper',
    type: 'number',
    value: upperResetPrice,
    enabled: true,
  };

  return [
    lowerBpsRebalanceFieldInfo,
    upperBpsRebalanceFieldInfo,
    resetLowerBpsRebalanceFieldInfo,
    resetUpperBpsRebalanceFieldInfo,
  ];
}

export function deserializePricePercentageWithResetRebalanceFromOnchainParams(
  price: Decimal,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let params = readPricePercentageWithResetRebalanceParamsFromStrategy(rebalanceRaw);

  let lowerRangeBps = new Decimal(params.find((param) => param.label == 'lowerRangeBps')?.value.toString()!);
  let upperRangeBps = new Decimal(params.find((param) => param.label == 'upperRangeBps')?.value.toString()!);
  let lowerResetRangeBps = new Decimal(params.find((param) => param.label == 'resetLowerRangeBps')?.value.toString()!);
  let upperResetRangeBps = new Decimal(params.find((param) => param.label == 'resetUpperRangeBps')?.value.toString()!);

  return getPricePercentageWithResetRebalanceFieldInfos(
    price,
    lowerRangeBps,
    upperRangeBps,
    lowerResetRangeBps,
    upperResetRangeBps
  );
}

export function deserializePricePercentageWithResetRebalanceWithStateOverride(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  price: Decimal,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  const stateFields = readPricePercentageWithResetRebalanceStateFromStrategy(
    dex,
    tokenADecimals,
    tokenBDecimals,
    rebalanceRaw
  );

  let fields = deserializePricePercentageWithResetRebalanceFromOnchainParams(price, rebalanceRaw);

  return upsertManyRebalanceFieldInfos(fields, stateFields);
}

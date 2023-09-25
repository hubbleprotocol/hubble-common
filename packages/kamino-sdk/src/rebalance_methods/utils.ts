import { Price } from '@hubbleprotocol/scope-sdk';
import { RebalanceTypeKind } from '../kamino-client/types';
import {
  Manual,
  PricePercentage,
  PricePercentageWithReset,
  Expander,
  Drift,
  TakeProfit,
  PeriodicRebalance,
} from '../kamino-client/types/RebalanceType';
import { RebalanceFieldInfo } from '../utils';
import {
  DriftRebalanceMethod,
  ExpanderMethod,
  ManualRebalanceMethod,
  PeriodicRebalanceMethod,
  PricePercentageRebalanceMethod,
  PricePercentageWithResetRangeRebalanceMethod,
  RebalanceMethod,
  TakeProfitMethod,
} from '../utils/CreationParameters';
import { DriftRebalanceTypeName } from './driftRebalance';
import { ExpanderRebalanceTypeName } from './expanderRebalance';
import { ManualRebalanceTypeName } from './manualRebalance';
import { PeriodicRebalanceTypeName } from './periodicRebalance';
import { PricePercentageRebalanceTypeName } from './pricePercentageRebalance';
import { PricePercentageWithResetRebalanceTypeName } from './pricePercentageWithResetRebalance';
import { TakeProfitRebalanceTypeName } from './takeProfitRebalance';

export function getRebalanceTypeFromRebalanceFields(rebalanceFieldInfos: RebalanceFieldInfo[]): RebalanceTypeKind {
  let rebalanceTypeField = rebalanceFieldInfos.find((field) => field.label === 'rebalanceType');
  if (!rebalanceTypeField) {
    throw new Error('Rebalance type field not found');
  }

  switch (rebalanceTypeField.value) {
    case ManualRebalanceTypeName:
      return new Manual();
    case PricePercentageRebalanceTypeName:
      return new PricePercentage();
    case PricePercentageWithResetRebalanceTypeName:
      return new PricePercentageWithReset();
    case DriftRebalanceTypeName:
      return new Drift();
    case TakeProfitRebalanceTypeName:
      return new TakeProfit();
    case PeriodicRebalanceTypeName:
      return new PeriodicRebalance();
    case ExpanderRebalanceTypeName:
      return new Expander();
    default:
      throw new Error(`Invalid rebalance type ${rebalanceTypeField.value}`);
  }
}

export function rebalanceTypeToRebalanceMethod(rebalanceType: RebalanceTypeKind): RebalanceMethod {
  switch (rebalanceType.kind) {
    case Manual.kind:
      return ManualRebalanceMethod;
    case PricePercentage.kind:
      return PricePercentageRebalanceMethod;
    case PricePercentageWithReset.kind:
      return PricePercentageWithResetRangeRebalanceMethod;
    case Drift.kind:
      return DriftRebalanceMethod;
    case TakeProfit.kind:
      return TakeProfitMethod;
    case PeriodicRebalance.kind:
      return PeriodicRebalanceMethod;
    case Expander.kind:
      return ExpanderMethod;
    default:
      throw new Error(`Invalid rebalance type ${rebalanceType}`);
  }
}

export function getRebalanceMethodFromRebalanceFields(rebalanceFieldInfos: RebalanceFieldInfo[]): RebalanceMethod {
  let rebalanceType = getRebalanceTypeFromRebalanceFields(rebalanceFieldInfos);
  return rebalanceTypeToRebalanceMethod(rebalanceType);
}

export function upsertRebalanceFieldInfo(
  rebalanceFieldInfos: RebalanceFieldInfo[],
  newFieldInfo: RebalanceFieldInfo
): RebalanceFieldInfo[] {
  let newRebalanceFieldInfoIndex = rebalanceFieldInfos.findIndex((fieldInfo) => fieldInfo.label === newFieldInfo.label);

  // if the field is not found, add it
  if (newRebalanceFieldInfoIndex === -1) {
    return [...rebalanceFieldInfos, newFieldInfo];
  } else {
    // if the field is found, update it
    let newRebalanceFieldInfos = [...rebalanceFieldInfos];
    newRebalanceFieldInfos[newRebalanceFieldInfoIndex] = newFieldInfo;
    return newRebalanceFieldInfos;
  }
}

export function upsertManyRebalanceFieldInfos(
  rebalanceFieldInfos: RebalanceFieldInfo[],
  newFieldInfos: RebalanceFieldInfo[]
): RebalanceFieldInfo[] {
  let updatedFieldInfos = [...rebalanceFieldInfos];
  for (let newFieldInfo of newFieldInfos) {
    updatedFieldInfos = upsertRebalanceFieldInfo(updatedFieldInfos, newFieldInfo);
  }

  return updatedFieldInfos;
}

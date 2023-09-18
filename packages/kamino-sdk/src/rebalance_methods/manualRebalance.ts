import Decimal from 'decimal.js';
import { RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { RebalanceTypeLabelName } from './consts';

export const ManualRebalanceTypeName = 'manual';

export function getManualRebalanceFieldInfos(
  lowerPrice: Decimal,
  upperPrice: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: RebalanceTypeLabelName,
    type: 'string',
    value: ManualRebalanceTypeName,
    enabled,
  };
  let lowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceLower',
    type: 'number',
    value: lowerPrice,
    enabled,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceUpper',
    type: 'number',
    value: upperPrice,
    enabled,
  };
  return [rebalanceType, lowerRangeRebalanceFieldInfo, upperRangeRebalanceFieldInfo];
}

export function getDefaultManualRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let lowerPrice = price.mul(FullBPSDecimal.sub(DefaultLowerPercentageBPSDecimal)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(DefaultUpperPercentageBPSDecimal)).div(FullBPSDecimal);

  return getManualRebalanceFieldInfos(lowerPrice, upperPrice);
}

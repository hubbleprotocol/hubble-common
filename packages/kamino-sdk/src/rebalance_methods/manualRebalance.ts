import Decimal from 'decimal.js';
import { RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';

export function getManualRebalanceFieldInfos(
  lowerPrice: Decimal,
  upperPrice: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let lowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'priceLower',
    type: 'number',
    value: lowerPrice,
    enabled,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'priceUpper',
    type: 'number',
    value: upperPrice,
    enabled,
  };
  return [lowerRangeRebalanceFieldInfo, upperRangeRebalanceFieldInfo];
}

export function getDefaultManualRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let lowerPrice = price.mul(FullBPSDecimal.sub(DefaultLowerPercentageBPSDecimal)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(DefaultUpperPercentageBPSDecimal)).div(FullBPSDecimal);

  return getManualRebalanceFieldInfos(lowerPrice, upperPrice);
}

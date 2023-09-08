import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { getManualRebalanceFieldInfos } from './manualRebalance';

export function getPricePercentageRebalanceFieldInfos(
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let lowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lowerThresholdBps',
    type: 'number',
    value: lowerPercentageBPS,
    enabled,
  };
  let upperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'upperThresholdBps',
    type: 'number',
    value: upperPercentageBPS,
    enabled,
  };

  return [lowerBpsRebalanceFieldInfo, upperBpsRebalanceFieldInfo];
}

export function getPositionRangeForPricePercentageRebalanceParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal
): PositionRange {
  let lowerPrice = price.mul(FullBPSDecimal.sub(lowerPercentageBPS)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(upperPercentageBPS)).div(FullBPSDecimal);
  return { lowerPrice, upperPrice };
}
export function getDefaultPricePercentageRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let { lowerPrice, upperPrice } = getPositionRangeForPricePercentageRebalanceParams(
    price,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal
  );
  let fieldInfos = getPricePercentageRebalanceFieldInfos(
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal
  ).concat(getManualRebalanceFieldInfos(lowerPrice, upperPrice, false));
  return fieldInfos;
}

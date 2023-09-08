import Decimal from "decimal.js";
import { RebalanceFieldInfo } from "../utils/types";
import { DefaultLowerPercentageBPSDecimal, DefaultUpperPercentageBPSDecimal, FullBPSDecimal } from "../utils/CreationParameters";
import { getManualRebalanceFieldInfos } from "./manualRebalance";

export function getPricePercentageWithResetRebalanceFieldInfos(
    lowerPercentageBPS: Decimal,
    upperPercentageBPS: Decimal,
    resetLowerPercentageBPS: Decimal,
    resetUpperPercentageBPS: Decimal,
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
    let resetLowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
      label: 'resetLowerThresholdBps',
      type: 'number',
      value: resetLowerPercentageBPS,
      enabled,
    };
    let resetUpperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
      label: 'resetUpperThresholdBps',
      type: 'number',
      value: resetUpperPercentageBPS,
      enabled,
    };
  
    return [
      lowerBpsRebalanceFieldInfo,
      upperBpsRebalanceFieldInfo,
      resetLowerBpsRebalanceFieldInfo,
      resetUpperBpsRebalanceFieldInfo,
    ];
  }

  

  export function getDefaultPricePercentageWithResterRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
    let lowerPrice = price.mul(FullBPSDecimal.sub(DefaultLowerPercentageBPSDecimal)).div(FullBPSDecimal);
    let upperPrice = price.mul(FullBPSDecimal.add(DefaultUpperPercentageBPSDecimal)).div(FullBPSDecimal);

    let fieldInfos = getPricePercentageWithResetRebalanceFieldInfos(DefaultLowerPercentageBPSDecimal, DefaultUpperPercentageBPSDecimal, DefaultLowerPercentageBPSDecimal, DefaultUpperPercentageBPSDecimal).concat(
        getManualRebalanceFieldInfos(lowerPrice, upperPrice, false)
        );
    return fieldInfos;
}



import { Manual, PricePercentage } from "../../kamino-client/types/RebalanceType";

export const DefaultLowerPercentageBPS: number = 1000;
export const DefaultUpperPercentageBPS: number = 1000;

export interface RebalanceMethod {
    label: String;
    value: number;
}

export const ManualRebalanceMethod: RebalanceMethod = {
    label: "Manual",
    value: Manual.discriminator
};
export const PricePercentageRebalanceMethod: RebalanceMethod = {
    label: "Price Percentage",
    value: PricePercentage.discriminator
};


export interface RebalanceFieldInfo {
    label: string,
    type: string,
    value: number, 
}


export function getManualRebalanceFieldInfos(lowerPrice: number, upperPrice: number) {
    let lowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
        label: 'priceLower',
        type: 'number',
        value: lowerPrice,
      };
      let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
        label: 'priceUpper',
        type: 'number',
        value: upperPrice,
      };
    return [lowerRangeRebalanceFieldInfo, upperRangeRebalanceFieldInfo];
}


export function getPricePercentageRebalanceFieldInfos(lowerPercentageBPS: number, upperPercentageBPS: number) {
    let lowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
        label: 'lowerThresholdBps',
        type: 'number',
        value: lowerPercentageBPS,
      };
      let upperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
        label: 'upperThresholdBps',
        type: 'number',
        value: upperPercentageBPS,
      };

    return [lowerBpsRebalanceFieldInfo, upperBpsRebalanceFieldInfo];
}

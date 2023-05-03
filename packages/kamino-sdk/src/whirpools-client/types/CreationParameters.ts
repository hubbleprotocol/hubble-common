
import { Manual, PricePercentage } from "../../kamino-client/types/RebalanceType";

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


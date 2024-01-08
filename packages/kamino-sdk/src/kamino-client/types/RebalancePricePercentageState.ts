import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface RebalancePricePercentageStateFields {
  lastRebalanceLowerPoolPrice: BN
  lastRebalanceUpperPoolPrice: BN
}

export interface RebalancePricePercentageStateJSON {
  lastRebalanceLowerPoolPrice: string
  lastRebalanceUpperPoolPrice: string
}

export class RebalancePricePercentageState {
  readonly lastRebalanceLowerPoolPrice: BN
  readonly lastRebalanceUpperPoolPrice: BN

  constructor(fields: RebalancePricePercentageStateFields) {
    this.lastRebalanceLowerPoolPrice = fields.lastRebalanceLowerPoolPrice
    this.lastRebalanceUpperPoolPrice = fields.lastRebalanceUpperPoolPrice
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u128("lastRebalanceLowerPoolPrice"),
        borsh.u128("lastRebalanceUpperPoolPrice"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalancePricePercentageState({
      lastRebalanceLowerPoolPrice: obj.lastRebalanceLowerPoolPrice,
      lastRebalanceUpperPoolPrice: obj.lastRebalanceUpperPoolPrice,
    })
  }

  static toEncodable(fields: RebalancePricePercentageStateFields) {
    return {
      lastRebalanceLowerPoolPrice: fields.lastRebalanceLowerPoolPrice,
      lastRebalanceUpperPoolPrice: fields.lastRebalanceUpperPoolPrice,
    }
  }

  toJSON(): RebalancePricePercentageStateJSON {
    return {
      lastRebalanceLowerPoolPrice: this.lastRebalanceLowerPoolPrice.toString(),
      lastRebalanceUpperPoolPrice: this.lastRebalanceUpperPoolPrice.toString(),
    }
  }

  static fromJSON(
    obj: RebalancePricePercentageStateJSON
  ): RebalancePricePercentageState {
    return new RebalancePricePercentageState({
      lastRebalanceLowerPoolPrice: new BN(obj.lastRebalanceLowerPoolPrice),
      lastRebalanceUpperPoolPrice: new BN(obj.lastRebalanceUpperPoolPrice),
    })
  }

  toEncodable() {
    return RebalancePricePercentageState.toEncodable(this)
  }
}

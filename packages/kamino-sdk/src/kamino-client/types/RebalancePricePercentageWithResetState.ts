import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface RebalancePricePercentageWithResetStateFields {
  lastRebalanceLowerResetPoolPrice: BN
  lastRebalanceUpperResetPoolPrice: BN
}

export interface RebalancePricePercentageWithResetStateJSON {
  lastRebalanceLowerResetPoolPrice: string
  lastRebalanceUpperResetPoolPrice: string
}

export class RebalancePricePercentageWithResetState {
  readonly lastRebalanceLowerResetPoolPrice: BN
  readonly lastRebalanceUpperResetPoolPrice: BN

  constructor(fields: RebalancePricePercentageWithResetStateFields) {
    this.lastRebalanceLowerResetPoolPrice =
      fields.lastRebalanceLowerResetPoolPrice
    this.lastRebalanceUpperResetPoolPrice =
      fields.lastRebalanceUpperResetPoolPrice
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u128("lastRebalanceLowerResetPoolPrice"),
        borsh.u128("lastRebalanceUpperResetPoolPrice"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalancePricePercentageWithResetState({
      lastRebalanceLowerResetPoolPrice: obj.lastRebalanceLowerResetPoolPrice,
      lastRebalanceUpperResetPoolPrice: obj.lastRebalanceUpperResetPoolPrice,
    })
  }

  static toEncodable(fields: RebalancePricePercentageWithResetStateFields) {
    return {
      lastRebalanceLowerResetPoolPrice: fields.lastRebalanceLowerResetPoolPrice,
      lastRebalanceUpperResetPoolPrice: fields.lastRebalanceUpperResetPoolPrice,
    }
  }

  toJSON(): RebalancePricePercentageWithResetStateJSON {
    return {
      lastRebalanceLowerResetPoolPrice:
        this.lastRebalanceLowerResetPoolPrice.toString(),
      lastRebalanceUpperResetPoolPrice:
        this.lastRebalanceUpperResetPoolPrice.toString(),
    }
  }

  static fromJSON(
    obj: RebalancePricePercentageWithResetStateJSON
  ): RebalancePricePercentageWithResetState {
    return new RebalancePricePercentageWithResetState({
      lastRebalanceLowerResetPoolPrice: new BN(
        obj.lastRebalanceLowerResetPoolPrice
      ),
      lastRebalanceUpperResetPoolPrice: new BN(
        obj.lastRebalanceUpperResetPoolPrice
      ),
    })
  }

  toEncodable() {
    return RebalancePricePercentageWithResetState.toEncodable(this)
  }
}

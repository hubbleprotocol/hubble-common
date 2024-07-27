import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface LiquidityOneSideParameterFields {
  /** Amount of X token or Y token to deposit */
  amount: BN
  /** Active bin that integrator observe off-chain */
  activeId: number
  /** max active bin slippage allowed */
  maxActiveBinSlippage: number
  /** Liquidity distribution to each bins */
  binLiquidityDist: Array<types.BinLiquidityDistributionByWeightFields>
}

export interface LiquidityOneSideParameterJSON {
  /** Amount of X token or Y token to deposit */
  amount: string
  /** Active bin that integrator observe off-chain */
  activeId: number
  /** max active bin slippage allowed */
  maxActiveBinSlippage: number
  /** Liquidity distribution to each bins */
  binLiquidityDist: Array<types.BinLiquidityDistributionByWeightJSON>
}

export class LiquidityOneSideParameter {
  /** Amount of X token or Y token to deposit */
  readonly amount: BN
  /** Active bin that integrator observe off-chain */
  readonly activeId: number
  /** max active bin slippage allowed */
  readonly maxActiveBinSlippage: number
  /** Liquidity distribution to each bins */
  readonly binLiquidityDist: Array<types.BinLiquidityDistributionByWeight>

  constructor(fields: LiquidityOneSideParameterFields) {
    this.amount = fields.amount
    this.activeId = fields.activeId
    this.maxActiveBinSlippage = fields.maxActiveBinSlippage
    this.binLiquidityDist = fields.binLiquidityDist.map(
      (item) => new types.BinLiquidityDistributionByWeight({ ...item })
    )
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("amount"),
        borsh.i32("activeId"),
        borsh.i32("maxActiveBinSlippage"),
        borsh.vec(
          types.BinLiquidityDistributionByWeight.layout(),
          "binLiquidityDist"
        ),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new LiquidityOneSideParameter({
      amount: obj.amount,
      activeId: obj.activeId,
      maxActiveBinSlippage: obj.maxActiveBinSlippage,
      binLiquidityDist: obj.binLiquidityDist.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.BinLiquidityDistributionByWeight.fromDecoded(item)
      ),
    })
  }

  static toEncodable(fields: LiquidityOneSideParameterFields) {
    return {
      amount: fields.amount,
      activeId: fields.activeId,
      maxActiveBinSlippage: fields.maxActiveBinSlippage,
      binLiquidityDist: fields.binLiquidityDist.map((item) =>
        types.BinLiquidityDistributionByWeight.toEncodable(item)
      ),
    }
  }

  toJSON(): LiquidityOneSideParameterJSON {
    return {
      amount: this.amount.toString(),
      activeId: this.activeId,
      maxActiveBinSlippage: this.maxActiveBinSlippage,
      binLiquidityDist: this.binLiquidityDist.map((item) => item.toJSON()),
    }
  }

  static fromJSON(
    obj: LiquidityOneSideParameterJSON
  ): LiquidityOneSideParameter {
    return new LiquidityOneSideParameter({
      amount: new BN(obj.amount),
      activeId: obj.activeId,
      maxActiveBinSlippage: obj.maxActiveBinSlippage,
      binLiquidityDist: obj.binLiquidityDist.map((item) =>
        types.BinLiquidityDistributionByWeight.fromJSON(item)
      ),
    })
  }

  toEncodable() {
    return LiquidityOneSideParameter.toEncodable(this)
  }
}

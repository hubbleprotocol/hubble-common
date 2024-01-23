import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface LiquidityParameterByStrategyOneSideFields {
  /** Amount of X token or Y token to deposit */
  amount: BN
  /** Active bin that integrator observe off-chain */
  activeId: number
  /** max active bin slippage allowed */
  maxActiveBinSlippage: number
  /** strategy parameters */
  strategyParameters: types.StrategyParametersFields
}

export interface LiquidityParameterByStrategyOneSideJSON {
  /** Amount of X token or Y token to deposit */
  amount: string
  /** Active bin that integrator observe off-chain */
  activeId: number
  /** max active bin slippage allowed */
  maxActiveBinSlippage: number
  /** strategy parameters */
  strategyParameters: types.StrategyParametersJSON
}

export class LiquidityParameterByStrategyOneSide {
  /** Amount of X token or Y token to deposit */
  readonly amount: BN
  /** Active bin that integrator observe off-chain */
  readonly activeId: number
  /** max active bin slippage allowed */
  readonly maxActiveBinSlippage: number
  /** strategy parameters */
  readonly strategyParameters: types.StrategyParameters

  constructor(fields: LiquidityParameterByStrategyOneSideFields) {
    this.amount = fields.amount
    this.activeId = fields.activeId
    this.maxActiveBinSlippage = fields.maxActiveBinSlippage
    this.strategyParameters = new types.StrategyParameters({
      ...fields.strategyParameters,
    })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("amount"),
        borsh.i32("activeId"),
        borsh.i32("maxActiveBinSlippage"),
        types.StrategyParameters.layout("strategyParameters"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new LiquidityParameterByStrategyOneSide({
      amount: obj.amount,
      activeId: obj.activeId,
      maxActiveBinSlippage: obj.maxActiveBinSlippage,
      strategyParameters: types.StrategyParameters.fromDecoded(
        obj.strategyParameters
      ),
    })
  }

  static toEncodable(fields: LiquidityParameterByStrategyOneSideFields) {
    return {
      amount: fields.amount,
      activeId: fields.activeId,
      maxActiveBinSlippage: fields.maxActiveBinSlippage,
      strategyParameters: types.StrategyParameters.toEncodable(
        fields.strategyParameters
      ),
    }
  }

  toJSON(): LiquidityParameterByStrategyOneSideJSON {
    return {
      amount: this.amount.toString(),
      activeId: this.activeId,
      maxActiveBinSlippage: this.maxActiveBinSlippage,
      strategyParameters: this.strategyParameters.toJSON(),
    }
  }

  static fromJSON(
    obj: LiquidityParameterByStrategyOneSideJSON
  ): LiquidityParameterByStrategyOneSide {
    return new LiquidityParameterByStrategyOneSide({
      amount: new BN(obj.amount),
      activeId: obj.activeId,
      maxActiveBinSlippage: obj.maxActiveBinSlippage,
      strategyParameters: types.StrategyParameters.fromJSON(
        obj.strategyParameters
      ),
    })
  }

  toEncodable() {
    return LiquidityParameterByStrategyOneSide.toEncodable(this)
  }
}

import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface LiquidityParameterByStrategyFields {
  /** Amount of X token to deposit */
  amountX: BN
  /** Amount of Y token to deposit */
  amountY: BN
  /** Active bin that integrator observe off-chain */
  activeId: number
  /** max active bin slippage allowed */
  maxActiveBinSlippage: number
  /** strategy parameters */
  strategyParameters: types.StrategyParametersFields
}

export interface LiquidityParameterByStrategyJSON {
  /** Amount of X token to deposit */
  amountX: string
  /** Amount of Y token to deposit */
  amountY: string
  /** Active bin that integrator observe off-chain */
  activeId: number
  /** max active bin slippage allowed */
  maxActiveBinSlippage: number
  /** strategy parameters */
  strategyParameters: types.StrategyParametersJSON
}

export class LiquidityParameterByStrategy {
  /** Amount of X token to deposit */
  readonly amountX: BN
  /** Amount of Y token to deposit */
  readonly amountY: BN
  /** Active bin that integrator observe off-chain */
  readonly activeId: number
  /** max active bin slippage allowed */
  readonly maxActiveBinSlippage: number
  /** strategy parameters */
  readonly strategyParameters: types.StrategyParameters

  constructor(fields: LiquidityParameterByStrategyFields) {
    this.amountX = fields.amountX
    this.amountY = fields.amountY
    this.activeId = fields.activeId
    this.maxActiveBinSlippage = fields.maxActiveBinSlippage
    this.strategyParameters = new types.StrategyParameters({
      ...fields.strategyParameters,
    })
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("amountX"),
        borsh.u64("amountY"),
        borsh.i32("activeId"),
        borsh.i32("maxActiveBinSlippage"),
        types.StrategyParameters.layout("strategyParameters"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new LiquidityParameterByStrategy({
      amountX: obj.amountX,
      amountY: obj.amountY,
      activeId: obj.activeId,
      maxActiveBinSlippage: obj.maxActiveBinSlippage,
      strategyParameters: types.StrategyParameters.fromDecoded(
        obj.strategyParameters
      ),
    })
  }

  static toEncodable(fields: LiquidityParameterByStrategyFields) {
    return {
      amountX: fields.amountX,
      amountY: fields.amountY,
      activeId: fields.activeId,
      maxActiveBinSlippage: fields.maxActiveBinSlippage,
      strategyParameters: types.StrategyParameters.toEncodable(
        fields.strategyParameters
      ),
    }
  }

  toJSON(): LiquidityParameterByStrategyJSON {
    return {
      amountX: this.amountX.toString(),
      amountY: this.amountY.toString(),
      activeId: this.activeId,
      maxActiveBinSlippage: this.maxActiveBinSlippage,
      strategyParameters: this.strategyParameters.toJSON(),
    }
  }

  static fromJSON(
    obj: LiquidityParameterByStrategyJSON
  ): LiquidityParameterByStrategy {
    return new LiquidityParameterByStrategy({
      amountX: new BN(obj.amountX),
      amountY: new BN(obj.amountY),
      activeId: obj.activeId,
      maxActiveBinSlippage: obj.maxActiveBinSlippage,
      strategyParameters: types.StrategyParameters.fromJSON(
        obj.strategyParameters
      ),
    })
  }

  toEncodable() {
    return LiquidityParameterByStrategy.toEncodable(this)
  }
}

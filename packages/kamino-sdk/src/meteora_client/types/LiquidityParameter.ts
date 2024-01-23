import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface LiquidityParameterFields {
  /** Amount of X token to deposit */
  amountX: BN
  /** Amount of Y token to deposit */
  amountY: BN
  /** Liquidity distribution to each bins */
  binLiquidityDist: Array<types.BinLiquidityDistributionFields>
}

export interface LiquidityParameterJSON {
  /** Amount of X token to deposit */
  amountX: string
  /** Amount of Y token to deposit */
  amountY: string
  /** Liquidity distribution to each bins */
  binLiquidityDist: Array<types.BinLiquidityDistributionJSON>
}

export class LiquidityParameter {
  /** Amount of X token to deposit */
  readonly amountX: BN
  /** Amount of Y token to deposit */
  readonly amountY: BN
  /** Liquidity distribution to each bins */
  readonly binLiquidityDist: Array<types.BinLiquidityDistribution>

  constructor(fields: LiquidityParameterFields) {
    this.amountX = fields.amountX
    this.amountY = fields.amountY
    this.binLiquidityDist = fields.binLiquidityDist.map(
      (item) => new types.BinLiquidityDistribution({ ...item })
    )
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("amountX"),
        borsh.u64("amountY"),
        borsh.vec(types.BinLiquidityDistribution.layout(), "binLiquidityDist"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new LiquidityParameter({
      amountX: obj.amountX,
      amountY: obj.amountY,
      binLiquidityDist: obj.binLiquidityDist.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.BinLiquidityDistribution.fromDecoded(item)
      ),
    })
  }

  static toEncodable(fields: LiquidityParameterFields) {
    return {
      amountX: fields.amountX,
      amountY: fields.amountY,
      binLiquidityDist: fields.binLiquidityDist.map((item) =>
        types.BinLiquidityDistribution.toEncodable(item)
      ),
    }
  }

  toJSON(): LiquidityParameterJSON {
    return {
      amountX: this.amountX.toString(),
      amountY: this.amountY.toString(),
      binLiquidityDist: this.binLiquidityDist.map((item) => item.toJSON()),
    }
  }

  static fromJSON(obj: LiquidityParameterJSON): LiquidityParameter {
    return new LiquidityParameter({
      amountX: new BN(obj.amountX),
      amountY: new BN(obj.amountY),
      binLiquidityDist: obj.binLiquidityDist.map((item) =>
        types.BinLiquidityDistribution.fromJSON(item)
      ),
    })
  }

  toEncodable() {
    return LiquidityParameter.toEncodable(this)
  }
}

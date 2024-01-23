import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface BinFields {
  /** Amount of token X in the bin. This already excluded protocol fees. */
  amountX: BN
  /** Amount of token Y in the bin. This already excluded protocol fees. */
  amountY: BN
  /** Bin price */
  price: BN
  /** Liquidities of the bin. This is the same as LP mint supply. q-number */
  liquiditySupply: BN
  /** reward_a_per_token_stored */
  rewardPerTokenStored: Array<BN>
  /** Swap fee amount of token X per liquidity deposited. */
  feeAmountXPerTokenStored: BN
  /** Swap fee amount of token Y per liquidity deposited. */
  feeAmountYPerTokenStored: BN
  /** Total token X swap into the bin. Only used for tracking purpose. */
  amountXIn: BN
  /** Total token Y swap into he bin. Only used for tracking purpose. */
  amountYIn: BN
}

export interface BinJSON {
  /** Amount of token X in the bin. This already excluded protocol fees. */
  amountX: string
  /** Amount of token Y in the bin. This already excluded protocol fees. */
  amountY: string
  /** Bin price */
  price: string
  /** Liquidities of the bin. This is the same as LP mint supply. q-number */
  liquiditySupply: string
  /** reward_a_per_token_stored */
  rewardPerTokenStored: Array<string>
  /** Swap fee amount of token X per liquidity deposited. */
  feeAmountXPerTokenStored: string
  /** Swap fee amount of token Y per liquidity deposited. */
  feeAmountYPerTokenStored: string
  /** Total token X swap into the bin. Only used for tracking purpose. */
  amountXIn: string
  /** Total token Y swap into he bin. Only used for tracking purpose. */
  amountYIn: string
}

export class Bin {
  /** Amount of token X in the bin. This already excluded protocol fees. */
  readonly amountX: BN
  /** Amount of token Y in the bin. This already excluded protocol fees. */
  readonly amountY: BN
  /** Bin price */
  readonly price: BN
  /** Liquidities of the bin. This is the same as LP mint supply. q-number */
  readonly liquiditySupply: BN
  /** reward_a_per_token_stored */
  readonly rewardPerTokenStored: Array<BN>
  /** Swap fee amount of token X per liquidity deposited. */
  readonly feeAmountXPerTokenStored: BN
  /** Swap fee amount of token Y per liquidity deposited. */
  readonly feeAmountYPerTokenStored: BN
  /** Total token X swap into the bin. Only used for tracking purpose. */
  readonly amountXIn: BN
  /** Total token Y swap into he bin. Only used for tracking purpose. */
  readonly amountYIn: BN

  constructor(fields: BinFields) {
    this.amountX = fields.amountX
    this.amountY = fields.amountY
    this.price = fields.price
    this.liquiditySupply = fields.liquiditySupply
    this.rewardPerTokenStored = fields.rewardPerTokenStored
    this.feeAmountXPerTokenStored = fields.feeAmountXPerTokenStored
    this.feeAmountYPerTokenStored = fields.feeAmountYPerTokenStored
    this.amountXIn = fields.amountXIn
    this.amountYIn = fields.amountYIn
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("amountX"),
        borsh.u64("amountY"),
        borsh.u128("price"),
        borsh.u128("liquiditySupply"),
        borsh.array(borsh.u128(), 2, "rewardPerTokenStored"),
        borsh.u128("feeAmountXPerTokenStored"),
        borsh.u128("feeAmountYPerTokenStored"),
        borsh.u128("amountXIn"),
        borsh.u128("amountYIn"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Bin({
      amountX: obj.amountX,
      amountY: obj.amountY,
      price: obj.price,
      liquiditySupply: obj.liquiditySupply,
      rewardPerTokenStored: obj.rewardPerTokenStored,
      feeAmountXPerTokenStored: obj.feeAmountXPerTokenStored,
      feeAmountYPerTokenStored: obj.feeAmountYPerTokenStored,
      amountXIn: obj.amountXIn,
      amountYIn: obj.amountYIn,
    })
  }

  static toEncodable(fields: BinFields) {
    return {
      amountX: fields.amountX,
      amountY: fields.amountY,
      price: fields.price,
      liquiditySupply: fields.liquiditySupply,
      rewardPerTokenStored: fields.rewardPerTokenStored,
      feeAmountXPerTokenStored: fields.feeAmountXPerTokenStored,
      feeAmountYPerTokenStored: fields.feeAmountYPerTokenStored,
      amountXIn: fields.amountXIn,
      amountYIn: fields.amountYIn,
    }
  }

  toJSON(): BinJSON {
    return {
      amountX: this.amountX.toString(),
      amountY: this.amountY.toString(),
      price: this.price.toString(),
      liquiditySupply: this.liquiditySupply.toString(),
      rewardPerTokenStored: this.rewardPerTokenStored.map((item) =>
        item.toString()
      ),
      feeAmountXPerTokenStored: this.feeAmountXPerTokenStored.toString(),
      feeAmountYPerTokenStored: this.feeAmountYPerTokenStored.toString(),
      amountXIn: this.amountXIn.toString(),
      amountYIn: this.amountYIn.toString(),
    }
  }

  static fromJSON(obj: BinJSON): Bin {
    return new Bin({
      amountX: new BN(obj.amountX),
      amountY: new BN(obj.amountY),
      price: new BN(obj.price),
      liquiditySupply: new BN(obj.liquiditySupply),
      rewardPerTokenStored: obj.rewardPerTokenStored.map(
        (item) => new BN(item)
      ),
      feeAmountXPerTokenStored: new BN(obj.feeAmountXPerTokenStored),
      feeAmountYPerTokenStored: new BN(obj.feeAmountYPerTokenStored),
      amountXIn: new BN(obj.amountXIn),
      amountYIn: new BN(obj.amountYIn),
    })
  }

  toEncodable() {
    return Bin.toEncodable(this)
  }
}

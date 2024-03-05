import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export type UniformFields = {
  currentBinIndex: number
  lowerBinIndex: number
  upperBinIndex: number
  amountXToDeposit: BN
  amountYToDeposit: BN
  xCurrentBin: BN
  yCurrentBin: BN
}
export type UniformValue = {
  currentBinIndex: number
  lowerBinIndex: number
  upperBinIndex: number
  amountXToDeposit: BN
  amountYToDeposit: BN
  xCurrentBin: BN
  yCurrentBin: BN
}

export interface UniformJSON {
  kind: "Uniform"
  value: {
    currentBinIndex: number
    lowerBinIndex: number
    upperBinIndex: number
    amountXToDeposit: string
    amountYToDeposit: string
    xCurrentBin: string
    yCurrentBin: string
  }
}

export class Uniform {
  static readonly discriminator = 0
  static readonly kind = "Uniform"
  readonly discriminator = 0
  readonly kind = "Uniform"
  readonly value: UniformValue

  constructor(value: UniformFields) {
    this.value = {
      currentBinIndex: value.currentBinIndex,
      lowerBinIndex: value.lowerBinIndex,
      upperBinIndex: value.upperBinIndex,
      amountXToDeposit: value.amountXToDeposit,
      amountYToDeposit: value.amountYToDeposit,
      xCurrentBin: value.xCurrentBin,
      yCurrentBin: value.yCurrentBin,
    }
  }

  toJSON(): UniformJSON {
    return {
      kind: "Uniform",
      value: {
        currentBinIndex: this.value.currentBinIndex,
        lowerBinIndex: this.value.lowerBinIndex,
        upperBinIndex: this.value.upperBinIndex,
        amountXToDeposit: this.value.amountXToDeposit.toString(),
        amountYToDeposit: this.value.amountYToDeposit.toString(),
        xCurrentBin: this.value.xCurrentBin.toString(),
        yCurrentBin: this.value.yCurrentBin.toString(),
      },
    }
  }

  toEncodable() {
    return {
      Uniform: {
        currentBinIndex: this.value.currentBinIndex,
        lowerBinIndex: this.value.lowerBinIndex,
        upperBinIndex: this.value.upperBinIndex,
        amountXToDeposit: this.value.amountXToDeposit,
        amountYToDeposit: this.value.amountYToDeposit,
        xCurrentBin: this.value.xCurrentBin,
        yCurrentBin: this.value.yCurrentBin,
      },
    }
  }
}

export type CurrentTickFields = [number]
export type CurrentTickValue = [number]

export interface CurrentTickJSON {
  kind: "CurrentTick"
  value: [number]
}

export class CurrentTick {
  static readonly discriminator = 1
  static readonly kind = "CurrentTick"
  readonly discriminator = 1
  readonly kind = "CurrentTick"
  readonly value: CurrentTickValue

  constructor(value: CurrentTickFields) {
    this.value = [value[0]]
  }

  toJSON(): CurrentTickJSON {
    return {
      kind: "CurrentTick",
      value: [this.value[0]],
    }
  }

  toEncodable() {
    return {
      CurrentTick: {
        _0: this.value[0],
      },
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.BinAddLiquidityStrategyKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Uniform" in obj) {
    const val = obj["Uniform"]
    return new Uniform({
      currentBinIndex: val["currentBinIndex"],
      lowerBinIndex: val["lowerBinIndex"],
      upperBinIndex: val["upperBinIndex"],
      amountXToDeposit: val["amountXToDeposit"],
      amountYToDeposit: val["amountYToDeposit"],
      xCurrentBin: val["xCurrentBin"],
      yCurrentBin: val["yCurrentBin"],
    })
  }
  if ("CurrentTick" in obj) {
    const val = obj["CurrentTick"]
    return new CurrentTick([val["_0"]])
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.BinAddLiquidityStrategyJSON
): types.BinAddLiquidityStrategyKind {
  switch (obj.kind) {
    case "Uniform": {
      return new Uniform({
        currentBinIndex: obj.value.currentBinIndex,
        lowerBinIndex: obj.value.lowerBinIndex,
        upperBinIndex: obj.value.upperBinIndex,
        amountXToDeposit: new BN(obj.value.amountXToDeposit),
        amountYToDeposit: new BN(obj.value.amountYToDeposit),
        xCurrentBin: new BN(obj.value.xCurrentBin),
        yCurrentBin: new BN(obj.value.yCurrentBin),
      })
    }
    case "CurrentTick": {
      return new CurrentTick([obj.value[0]])
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct(
      [
        borsh.i32("currentBinIndex"),
        borsh.i32("lowerBinIndex"),
        borsh.i32("upperBinIndex"),
        borsh.u64("amountXToDeposit"),
        borsh.u64("amountYToDeposit"),
        borsh.u64("xCurrentBin"),
        borsh.u64("yCurrentBin"),
      ],
      "Uniform"
    ),
    borsh.struct([borsh.i32("_0")], "CurrentTick"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

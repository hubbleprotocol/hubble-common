import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface UninitializedJSON {
  kind: "Uninitialized"
}

export class Uninitialized {
  static readonly discriminator = 0
  static readonly kind = "Uninitialized"
  readonly discriminator = 0
  readonly kind = "Uninitialized"

  toJSON(): UninitializedJSON {
    return {
      kind: "Uninitialized",
    }
  }

  toEncodable() {
    return {
      Uninitialized: {},
    }
  }
}

export interface TakingProfitJSON {
  kind: "TakingProfit"
}

export class TakingProfit {
  static readonly discriminator = 1
  static readonly kind = "TakingProfit"
  readonly discriminator = 1
  readonly kind = "TakingProfit"

  toJSON(): TakingProfitJSON {
    return {
      kind: "TakingProfit",
    }
  }

  toEncodable() {
    return {
      TakingProfit: {},
    }
  }
}

export interface FinishedJSON {
  kind: "Finished"
}

export class Finished {
  static readonly discriminator = 2
  static readonly kind = "Finished"
  readonly discriminator = 2
  readonly kind = "Finished"

  toJSON(): FinishedJSON {
    return {
      kind: "Finished",
    }
  }

  toEncodable() {
    return {
      Finished: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RebalanceTakeProfitStepKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Uninitialized" in obj) {
    return new Uninitialized()
  }
  if ("TakingProfit" in obj) {
    return new TakingProfit()
  }
  if ("Finished" in obj) {
    return new Finished()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RebalanceTakeProfitStepJSON
): types.RebalanceTakeProfitStepKind {
  switch (obj.kind) {
    case "Uninitialized": {
      return new Uninitialized()
    }
    case "TakingProfit": {
      return new TakingProfit()
    }
    case "Finished": {
      return new Finished()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Uninitialized"),
    borsh.struct([], "TakingProfit"),
    borsh.struct([], "Finished"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

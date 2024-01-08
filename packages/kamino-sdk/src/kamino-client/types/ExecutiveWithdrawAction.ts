import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface FreezeJSON {
  kind: "Freeze"
}

export class Freeze {
  static readonly discriminator = 0
  static readonly kind = "Freeze"
  readonly discriminator = 0
  readonly kind = "Freeze"

  toJSON(): FreezeJSON {
    return {
      kind: "Freeze",
    }
  }

  toEncodable() {
    return {
      Freeze: {},
    }
  }
}

export interface UnfreezeJSON {
  kind: "Unfreeze"
}

export class Unfreeze {
  static readonly discriminator = 1
  static readonly kind = "Unfreeze"
  readonly discriminator = 1
  readonly kind = "Unfreeze"

  toJSON(): UnfreezeJSON {
    return {
      kind: "Unfreeze",
    }
  }

  toEncodable() {
    return {
      Unfreeze: {},
    }
  }
}

export interface RebalanceJSON {
  kind: "Rebalance"
}

export class Rebalance {
  static readonly discriminator = 2
  static readonly kind = "Rebalance"
  readonly discriminator = 2
  readonly kind = "Rebalance"

  toJSON(): RebalanceJSON {
    return {
      kind: "Rebalance",
    }
  }

  toEncodable() {
    return {
      Rebalance: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ExecutiveWithdrawActionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Freeze" in obj) {
    return new Freeze()
  }
  if ("Unfreeze" in obj) {
    return new Unfreeze()
  }
  if ("Rebalance" in obj) {
    return new Rebalance()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.ExecutiveWithdrawActionJSON
): types.ExecutiveWithdrawActionKind {
  switch (obj.kind) {
    case "Freeze": {
      return new Freeze()
    }
    case "Unfreeze": {
      return new Unfreeze()
    }
    case "Rebalance": {
      return new Rebalance()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Freeze"),
    borsh.struct([], "Unfreeze"),
    borsh.struct([], "Rebalance"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

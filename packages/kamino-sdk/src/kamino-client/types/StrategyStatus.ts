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

export interface ActiveJSON {
  kind: "Active"
}

export class Active {
  static readonly discriminator = 1
  static readonly kind = "Active"
  readonly discriminator = 1
  readonly kind = "Active"

  toJSON(): ActiveJSON {
    return {
      kind: "Active",
    }
  }

  toEncodable() {
    return {
      Active: {},
    }
  }
}

export interface FrozenJSON {
  kind: "Frozen"
}

export class Frozen {
  static readonly discriminator = 2
  static readonly kind = "Frozen"
  readonly discriminator = 2
  readonly kind = "Frozen"

  toJSON(): FrozenJSON {
    return {
      kind: "Frozen",
    }
  }

  toEncodable() {
    return {
      Frozen: {},
    }
  }
}

export interface RebalancingJSON {
  kind: "Rebalancing"
}

export class Rebalancing {
  static readonly discriminator = 3
  static readonly kind = "Rebalancing"
  readonly discriminator = 3
  readonly kind = "Rebalancing"

  toJSON(): RebalancingJSON {
    return {
      kind: "Rebalancing",
    }
  }

  toEncodable() {
    return {
      Rebalancing: {},
    }
  }
}

export interface NoPositionJSON {
  kind: "NoPosition"
}

export class NoPosition {
  static readonly discriminator = 4
  static readonly kind = "NoPosition"
  readonly discriminator = 4
  readonly kind = "NoPosition"

  toJSON(): NoPositionJSON {
    return {
      kind: "NoPosition",
    }
  }

  toEncodable() {
    return {
      NoPosition: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.StrategyStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Uninitialized" in obj) {
    return new Uninitialized()
  }
  if ("Active" in obj) {
    return new Active()
  }
  if ("Frozen" in obj) {
    return new Frozen()
  }
  if ("Rebalancing" in obj) {
    return new Rebalancing()
  }
  if ("NoPosition" in obj) {
    return new NoPosition()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.StrategyStatusJSON
): types.StrategyStatusKind {
  switch (obj.kind) {
    case "Uninitialized": {
      return new Uninitialized()
    }
    case "Active": {
      return new Active()
    }
    case "Frozen": {
      return new Frozen()
    }
    case "Rebalancing": {
      return new Rebalancing()
    }
    case "NoPosition": {
      return new NoPosition()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Uninitialized"),
    borsh.struct([], "Active"),
    borsh.struct([], "Frozen"),
    borsh.struct([], "Rebalancing"),
    borsh.struct([], "NoPosition"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

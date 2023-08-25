import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ManualJSON {
  kind: "Manual"
}

export class Manual {
  static readonly discriminator = 0
  static readonly kind = "Manual"
  readonly discriminator = 0
  readonly kind = "Manual"

  toJSON(): ManualJSON {
    return {
      kind: "Manual",
    }
  }

  toEncodable() {
    return {
      Manual: {},
    }
  }
}

export interface PricePercentageJSON {
  kind: "PricePercentage"
}

export class PricePercentage {
  static readonly discriminator = 1
  static readonly kind = "PricePercentage"
  readonly discriminator = 1
  readonly kind = "PricePercentage"

  toJSON(): PricePercentageJSON {
    return {
      kind: "PricePercentage",
    }
  }

  toEncodable() {
    return {
      PricePercentage: {},
    }
  }
}

export interface PricePercentageWithResetJSON {
  kind: "PricePercentageWithReset"
}

export class PricePercentageWithReset {
  static readonly discriminator = 2
  static readonly kind = "PricePercentageWithReset"
  readonly discriminator = 2
  readonly kind = "PricePercentageWithReset"

  toJSON(): PricePercentageWithResetJSON {
    return {
      kind: "PricePercentageWithReset",
    }
  }

  toEncodable() {
    return {
      PricePercentageWithReset: {},
    }
  }
}

export interface DriftJSON {
  kind: "Drift"
}

export class Drift {
  static readonly discriminator = 3
  static readonly kind = "Drift"
  readonly discriminator = 3
  readonly kind = "Drift"

  toJSON(): DriftJSON {
    return {
      kind: "Drift",
    }
  }

  toEncodable() {
    return {
      Drift: {},
    }
  }
}

export interface TakeProfitJSON {
  kind: "TakeProfit"
}

export class TakeProfit {
  static readonly discriminator = 4
  static readonly kind = "TakeProfit"
  readonly discriminator = 4
  readonly kind = "TakeProfit"

  toJSON(): TakeProfitJSON {
    return {
      kind: "TakeProfit",
    }
  }

  toEncodable() {
    return {
      TakeProfit: {},
    }
  }
}

export interface PeriodicRebalanceJSON {
  kind: "PeriodicRebalance"
}

export class PeriodicRebalance {
  static readonly discriminator = 5
  static readonly kind = "PeriodicRebalance"
  readonly discriminator = 5
  readonly kind = "PeriodicRebalance"

  toJSON(): PeriodicRebalanceJSON {
    return {
      kind: "PeriodicRebalance",
    }
  }

  toEncodable() {
    return {
      PeriodicRebalance: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RebalanceTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Manual" in obj) {
    return new Manual()
  }
  if ("PricePercentage" in obj) {
    return new PricePercentage()
  }
  if ("PricePercentageWithReset" in obj) {
    return new PricePercentageWithReset()
  }
  if ("Drift" in obj) {
    return new Drift()
  }
  if ("TakeProfit" in obj) {
    return new TakeProfit()
  }
  if ("PeriodicRebalance" in obj) {
    return new PeriodicRebalance()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RebalanceTypeJSON
): types.RebalanceTypeKind {
  switch (obj.kind) {
    case "Manual": {
      return new Manual()
    }
    case "PricePercentage": {
      return new PricePercentage()
    }
    case "PricePercentageWithReset": {
      return new PricePercentageWithReset()
    }
    case "Drift": {
      return new Drift()
    }
    case "TakeProfit": {
      return new TakeProfit()
    }
    case "PeriodicRebalance": {
      return new PeriodicRebalance()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Manual"),
    borsh.struct([], "PricePercentage"),
    borsh.struct([], "PricePercentageWithReset"),
    borsh.struct([], "Drift"),
    borsh.struct([], "TakeProfit"),
    borsh.struct([], "PeriodicRebalance"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

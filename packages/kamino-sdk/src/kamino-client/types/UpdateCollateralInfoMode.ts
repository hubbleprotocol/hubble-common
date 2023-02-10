import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CollateralIdJSON {
  kind: "CollateralId"
}

export class CollateralId {
  static readonly discriminator = 0
  static readonly kind = "CollateralId"
  readonly discriminator = 0
  readonly kind = "CollateralId"

  toJSON(): CollateralIdJSON {
    return {
      kind: "CollateralId",
    }
  }

  toEncodable() {
    return {
      CollateralId: {},
    }
  }
}

export interface LowerHeuristicJSON {
  kind: "LowerHeuristic"
}

export class LowerHeuristic {
  static readonly discriminator = 1
  static readonly kind = "LowerHeuristic"
  readonly discriminator = 1
  readonly kind = "LowerHeuristic"

  toJSON(): LowerHeuristicJSON {
    return {
      kind: "LowerHeuristic",
    }
  }

  toEncodable() {
    return {
      LowerHeuristic: {},
    }
  }
}

export interface UpperHeuristicJSON {
  kind: "UpperHeuristic"
}

export class UpperHeuristic {
  static readonly discriminator = 2
  static readonly kind = "UpperHeuristic"
  readonly discriminator = 2
  readonly kind = "UpperHeuristic"

  toJSON(): UpperHeuristicJSON {
    return {
      kind: "UpperHeuristic",
    }
  }

  toEncodable() {
    return {
      UpperHeuristic: {},
    }
  }
}

export interface ExpHeuristicJSON {
  kind: "ExpHeuristic"
}

export class ExpHeuristic {
  static readonly discriminator = 3
  static readonly kind = "ExpHeuristic"
  readonly discriminator = 3
  readonly kind = "ExpHeuristic"

  toJSON(): ExpHeuristicJSON {
    return {
      kind: "ExpHeuristic",
    }
  }

  toEncodable() {
    return {
      ExpHeuristic: {},
    }
  }
}

export interface TwapDivergenceJSON {
  kind: "TwapDivergence"
}

export class TwapDivergence {
  static readonly discriminator = 4
  static readonly kind = "TwapDivergence"
  readonly discriminator = 4
  readonly kind = "TwapDivergence"

  toJSON(): TwapDivergenceJSON {
    return {
      kind: "TwapDivergence",
    }
  }

  toEncodable() {
    return {
      TwapDivergence: {},
    }
  }
}

export interface UpdateScopeTwapJSON {
  kind: "UpdateScopeTwap"
}

export class UpdateScopeTwap {
  static readonly discriminator = 5
  static readonly kind = "UpdateScopeTwap"
  readonly discriminator = 5
  readonly kind = "UpdateScopeTwap"

  toJSON(): UpdateScopeTwapJSON {
    return {
      kind: "UpdateScopeTwap",
    }
  }

  toEncodable() {
    return {
      UpdateScopeTwap: {},
    }
  }
}

export interface UpdateScopeChainJSON {
  kind: "UpdateScopeChain"
}

export class UpdateScopeChain {
  static readonly discriminator = 6
  static readonly kind = "UpdateScopeChain"
  readonly discriminator = 6
  readonly kind = "UpdateScopeChain"

  toJSON(): UpdateScopeChainJSON {
    return {
      kind: "UpdateScopeChain",
    }
  }

  toEncodable() {
    return {
      UpdateScopeChain: {},
    }
  }
}

export interface UpdateNameJSON {
  kind: "UpdateName"
}

export class UpdateName {
  static readonly discriminator = 7
  static readonly kind = "UpdateName"
  readonly discriminator = 7
  readonly kind = "UpdateName"

  toJSON(): UpdateNameJSON {
    return {
      kind: "UpdateName",
    }
  }

  toEncodable() {
    return {
      UpdateName: {},
    }
  }
}

export interface UpdatePriceMaxAgeJSON {
  kind: "UpdatePriceMaxAge"
}

export class UpdatePriceMaxAge {
  static readonly discriminator = 8
  static readonly kind = "UpdatePriceMaxAge"
  readonly discriminator = 8
  readonly kind = "UpdatePriceMaxAge"

  toJSON(): UpdatePriceMaxAgeJSON {
    return {
      kind: "UpdatePriceMaxAge",
    }
  }

  toEncodable() {
    return {
      UpdatePriceMaxAge: {},
    }
  }
}

export interface UpdateTwapMaxAgeJSON {
  kind: "UpdateTwapMaxAge"
}

export class UpdateTwapMaxAge {
  static readonly discriminator = 9
  static readonly kind = "UpdateTwapMaxAge"
  readonly discriminator = 9
  readonly kind = "UpdateTwapMaxAge"

  toJSON(): UpdateTwapMaxAgeJSON {
    return {
      kind: "UpdateTwapMaxAge",
    }
  }

  toEncodable() {
    return {
      UpdateTwapMaxAge: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.UpdateCollateralInfoModeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("CollateralId" in obj) {
    return new CollateralId()
  }
  if ("LowerHeuristic" in obj) {
    return new LowerHeuristic()
  }
  if ("UpperHeuristic" in obj) {
    return new UpperHeuristic()
  }
  if ("ExpHeuristic" in obj) {
    return new ExpHeuristic()
  }
  if ("TwapDivergence" in obj) {
    return new TwapDivergence()
  }
  if ("UpdateScopeTwap" in obj) {
    return new UpdateScopeTwap()
  }
  if ("UpdateScopeChain" in obj) {
    return new UpdateScopeChain()
  }
  if ("UpdateName" in obj) {
    return new UpdateName()
  }
  if ("UpdatePriceMaxAge" in obj) {
    return new UpdatePriceMaxAge()
  }
  if ("UpdateTwapMaxAge" in obj) {
    return new UpdateTwapMaxAge()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.UpdateCollateralInfoModeJSON
): types.UpdateCollateralInfoModeKind {
  switch (obj.kind) {
    case "CollateralId": {
      return new CollateralId()
    }
    case "LowerHeuristic": {
      return new LowerHeuristic()
    }
    case "UpperHeuristic": {
      return new UpperHeuristic()
    }
    case "ExpHeuristic": {
      return new ExpHeuristic()
    }
    case "TwapDivergence": {
      return new TwapDivergence()
    }
    case "UpdateScopeTwap": {
      return new UpdateScopeTwap()
    }
    case "UpdateScopeChain": {
      return new UpdateScopeChain()
    }
    case "UpdateName": {
      return new UpdateName()
    }
    case "UpdatePriceMaxAge": {
      return new UpdatePriceMaxAge()
    }
    case "UpdateTwapMaxAge": {
      return new UpdateTwapMaxAge()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "CollateralId"),
    borsh.struct([], "LowerHeuristic"),
    borsh.struct([], "UpperHeuristic"),
    borsh.struct([], "ExpHeuristic"),
    borsh.struct([], "TwapDivergence"),
    borsh.struct([], "UpdateScopeTwap"),
    borsh.struct([], "UpdateScopeChain"),
    borsh.struct([], "UpdateName"),
    borsh.struct([], "UpdatePriceMaxAge"),
    borsh.struct([], "UpdateTwapMaxAge"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

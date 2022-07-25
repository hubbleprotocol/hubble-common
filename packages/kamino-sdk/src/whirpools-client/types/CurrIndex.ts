import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface BelowJSON {
  kind: "Below"
}

export class Below {
  static readonly discriminator = 0
  static readonly kind = "Below"
  readonly discriminator = 0
  readonly kind = "Below"

  toJSON(): BelowJSON {
    return {
      kind: "Below",
    }
  }

  toEncodable() {
    return {
      Below: {},
    }
  }
}

export interface InsideJSON {
  kind: "Inside"
}

export class Inside {
  static readonly discriminator = 1
  static readonly kind = "Inside"
  readonly discriminator = 1
  readonly kind = "Inside"

  toJSON(): InsideJSON {
    return {
      kind: "Inside",
    }
  }

  toEncodable() {
    return {
      Inside: {},
    }
  }
}

export interface AboveJSON {
  kind: "Above"
}

export class Above {
  static readonly discriminator = 2
  static readonly kind = "Above"
  readonly discriminator = 2
  readonly kind = "Above"

  toJSON(): AboveJSON {
    return {
      kind: "Above",
    }
  }

  toEncodable() {
    return {
      Above: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.CurrIndexKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Below" in obj) {
    return new Below()
  }
  if ("Inside" in obj) {
    return new Inside()
  }
  if ("Above" in obj) {
    return new Above()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.CurrIndexJSON): types.CurrIndexKind {
  switch (obj.kind) {
    case "Below": {
      return new Below()
    }
    case "Inside": {
      return new Inside()
    }
    case "Above": {
      return new Above()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Below"),
    borsh.struct([], "Inside"),
    borsh.struct([], "Above"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

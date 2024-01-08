import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface IGNOREDJSON {
  kind: "IGNORED"
}

export class IGNORED {
  static readonly discriminator = 0
  static readonly kind = "IGNORED"
  readonly discriminator = 0
  readonly kind = "IGNORED"

  toJSON(): IGNOREDJSON {
    return {
      kind: "IGNORED",
    }
  }

  toEncodable() {
    return {
      IGNORED: {},
    }
  }
}

export interface SHADOWJSON {
  kind: "SHADOW"
}

export class SHADOW {
  static readonly discriminator = 1
  static readonly kind = "SHADOW"
  readonly discriminator = 1
  readonly kind = "SHADOW"

  toJSON(): SHADOWJSON {
    return {
      kind: "SHADOW",
    }
  }

  toEncodable() {
    return {
      SHADOW: {},
    }
  }
}

export interface LIVEJSON {
  kind: "LIVE"
}

export class LIVE {
  static readonly discriminator = 2
  static readonly kind = "LIVE"
  readonly discriminator = 2
  readonly kind = "LIVE"

  toJSON(): LIVEJSON {
    return {
      kind: "LIVE",
    }
  }

  toEncodable() {
    return {
      LIVE: {},
    }
  }
}

export interface DEPRECATEDJSON {
  kind: "DEPRECATED"
}

export class DEPRECATED {
  static readonly discriminator = 3
  static readonly kind = "DEPRECATED"
  readonly discriminator = 3
  readonly kind = "DEPRECATED"

  toJSON(): DEPRECATEDJSON {
    return {
      kind: "DEPRECATED",
    }
  }

  toEncodable() {
    return {
      DEPRECATED: {},
    }
  }
}

export interface STAGINGJSON {
  kind: "STAGING"
}

export class STAGING {
  static readonly discriminator = 4
  static readonly kind = "STAGING"
  readonly discriminator = 4
  readonly kind = "STAGING"

  toJSON(): STAGINGJSON {
    return {
      kind: "STAGING",
    }
  }

  toEncodable() {
    return {
      STAGING: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.CreationStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("IGNORED" in obj) {
    return new IGNORED()
  }
  if ("SHADOW" in obj) {
    return new SHADOW()
  }
  if ("LIVE" in obj) {
    return new LIVE()
  }
  if ("DEPRECATED" in obj) {
    return new DEPRECATED()
  }
  if ("STAGING" in obj) {
    return new STAGING()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.CreationStatusJSON
): types.CreationStatusKind {
  switch (obj.kind) {
    case "IGNORED": {
      return new IGNORED()
    }
    case "SHADOW": {
      return new SHADOW()
    }
    case "LIVE": {
      return new LIVE()
    }
    case "DEPRECATED": {
      return new DEPRECATED()
    }
    case "STAGING": {
      return new STAGING()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "IGNORED"),
    borsh.struct([], "SHADOW"),
    borsh.struct([], "LIVE"),
    borsh.struct([], "DEPRECATED"),
    borsh.struct([], "STAGING"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

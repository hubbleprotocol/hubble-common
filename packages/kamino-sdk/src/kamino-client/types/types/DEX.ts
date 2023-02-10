import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface OrcaJSON {
  kind: "Orca"
}

export class Orca {
  static readonly discriminator = 0
  static readonly kind = "Orca"
  readonly discriminator = 0
  readonly kind = "Orca"

  toJSON(): OrcaJSON {
    return {
      kind: "Orca",
    }
  }

  toEncodable() {
    return {
      Orca: {},
    }
  }
}

export interface RaydiumJSON {
  kind: "Raydium"
}

export class Raydium {
  static readonly discriminator = 1
  static readonly kind = "Raydium"
  readonly discriminator = 1
  readonly kind = "Raydium"

  toJSON(): RaydiumJSON {
    return {
      kind: "Raydium",
    }
  }

  toEncodable() {
    return {
      Raydium: {},
    }
  }
}

export interface CremaJSON {
  kind: "Crema"
}

export class Crema {
  static readonly discriminator = 2
  static readonly kind = "Crema"
  readonly discriminator = 2
  readonly kind = "Crema"

  toJSON(): CremaJSON {
    return {
      kind: "Crema",
    }
  }

  toEncodable() {
    return {
      Crema: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.DEXKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Orca" in obj) {
    return new Orca()
  }
  if ("Raydium" in obj) {
    return new Raydium()
  }
  if ("Crema" in obj) {
    return new Crema()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.DEXJSON): types.DEXKind {
  switch (obj.kind) {
    case "Orca": {
      return new Orca()
    }
    case "Raydium": {
      return new Raydium()
    }
    case "Crema": {
      return new Crema()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Orca"),
    borsh.struct([], "Raydium"),
    borsh.struct([], "Crema"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

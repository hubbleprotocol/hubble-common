import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface AddJSON {
  kind: "Add"
}

export class Add {
  static readonly discriminator = 0
  static readonly kind = "Add"
  readonly discriminator = 0
  readonly kind = "Add"

  toJSON(): AddJSON {
    return {
      kind: "Add",
    }
  }

  toEncodable() {
    return {
      Add: {},
    }
  }
}

export interface RemoveJSON {
  kind: "Remove"
}

export class Remove {
  static readonly discriminator = 1
  static readonly kind = "Remove"
  readonly discriminator = 1
  readonly kind = "Remove"

  toJSON(): RemoveJSON {
    return {
      kind: "Remove",
    }
  }

  toEncodable() {
    return {
      Remove: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.WithdrawalCapActionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Add" in obj) {
    return new Add()
  }
  if ("Remove" in obj) {
    return new Remove()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.WithdrawalCapActionJSON
): types.WithdrawalCapActionKind {
  switch (obj.kind) {
    case "Add": {
      return new Add()
    }
    case "Remove": {
      return new Remove()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Add"),
    borsh.struct([], "Remove"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

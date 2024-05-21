import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface PriceChainTooLongJSON {
  kind: "PriceChainTooLong"
}

export class PriceChainTooLong {
  static readonly discriminator = 0
  static readonly kind = "PriceChainTooLong"
  readonly discriminator = 0
  readonly kind = "PriceChainTooLong"

  toJSON(): PriceChainTooLongJSON {
    return {
      kind: "PriceChainTooLong",
    }
  }

  toEncodable() {
    return {
      PriceChainTooLong: {},
    }
  }
}

export interface PriceChainConversionFailureJSON {
  kind: "PriceChainConversionFailure"
}

export class PriceChainConversionFailure {
  static readonly discriminator = 1
  static readonly kind = "PriceChainConversionFailure"
  readonly discriminator = 1
  readonly kind = "PriceChainConversionFailure"

  toJSON(): PriceChainConversionFailureJSON {
    return {
      kind: "PriceChainConversionFailure",
    }
  }

  toEncodable() {
    return {
      PriceChainConversionFailure: {},
    }
  }
}

export interface NoChainForTokenJSON {
  kind: "NoChainForToken"
}

export class NoChainForToken {
  static readonly discriminator = 2
  static readonly kind = "NoChainForToken"
  readonly discriminator = 2
  readonly kind = "NoChainForToken"

  toJSON(): NoChainForTokenJSON {
    return {
      kind: "NoChainForToken",
    }
  }

  toEncodable() {
    return {
      NoChainForToken: {},
    }
  }
}

export interface InvalidPricesInChainJSON {
  kind: "InvalidPricesInChain"
}

export class InvalidPricesInChain {
  static readonly discriminator = 3
  static readonly kind = "InvalidPricesInChain"
  readonly discriminator = 3
  readonly kind = "InvalidPricesInChain"

  toJSON(): InvalidPricesInChainJSON {
    return {
      kind: "InvalidPricesInChain",
    }
  }

  toEncodable() {
    return {
      InvalidPricesInChain: {},
    }
  }
}

export interface MathOverflowJSON {
  kind: "MathOverflow"
}

export class MathOverflow {
  static readonly discriminator = 4
  static readonly kind = "MathOverflow"
  readonly discriminator = 4
  readonly kind = "MathOverflow"

  toJSON(): MathOverflowJSON {
    return {
      kind: "MathOverflow",
    }
  }

  toEncodable() {
    return {
      MathOverflow: {},
    }
  }
}

export interface IntegerConversionOverflowJSON {
  kind: "IntegerConversionOverflow"
}

export class IntegerConversionOverflow {
  static readonly discriminator = 5
  static readonly kind = "IntegerConversionOverflow"
  readonly discriminator = 5
  readonly kind = "IntegerConversionOverflow"

  toJSON(): IntegerConversionOverflowJSON {
    return {
      kind: "IntegerConversionOverflow",
    }
  }

  toEncodable() {
    return {
      IntegerConversionOverflow: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ScopeChainErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("PriceChainTooLong" in obj) {
    return new PriceChainTooLong()
  }
  if ("PriceChainConversionFailure" in obj) {
    return new PriceChainConversionFailure()
  }
  if ("NoChainForToken" in obj) {
    return new NoChainForToken()
  }
  if ("InvalidPricesInChain" in obj) {
    return new InvalidPricesInChain()
  }
  if ("MathOverflow" in obj) {
    return new MathOverflow()
  }
  if ("IntegerConversionOverflow" in obj) {
    return new IntegerConversionOverflow()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.ScopeChainErrorJSON
): types.ScopeChainErrorKind {
  switch (obj.kind) {
    case "PriceChainTooLong": {
      return new PriceChainTooLong()
    }
    case "PriceChainConversionFailure": {
      return new PriceChainConversionFailure()
    }
    case "NoChainForToken": {
      return new NoChainForToken()
    }
    case "InvalidPricesInChain": {
      return new InvalidPricesInChain()
    }
    case "MathOverflow": {
      return new MathOverflow()
    }
    case "IntegerConversionOverflow": {
      return new IntegerConversionOverflow()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "PriceChainTooLong"),
    borsh.struct([], "PriceChainConversionFailure"),
    borsh.struct([], "NoChainForToken"),
    borsh.struct([], "InvalidPricesInChain"),
    borsh.struct([], "MathOverflow"),
    borsh.struct([], "IntegerConversionOverflow"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}

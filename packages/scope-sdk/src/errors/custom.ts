export type CustomError =
  | IntegerOverflow
  | ConversionFailure
  | MathOverflow
  | OutOfRangeIntegralConversion
  | UnexpectedAccount
  | PriceNotValid
  | AccountsAndTokenMismatch
  | BadTokenNb
  | BadTokenType
  | SwitchboardV2Error

export class IntegerOverflow extends Error {
  readonly code = 6000
  readonly name = "IntegerOverflow"
  readonly msg = "Integer overflow"

  constructor() {
    super("6000: Integer overflow")
  }
}

export class ConversionFailure extends Error {
  readonly code = 6001
  readonly name = "ConversionFailure"
  readonly msg = "Conversion failure"

  constructor() {
    super("6001: Conversion failure")
  }
}

export class MathOverflow extends Error {
  readonly code = 6002
  readonly name = "MathOverflow"
  readonly msg = "Mathematical operation with overflow"

  constructor() {
    super("6002: Mathematical operation with overflow")
  }
}

export class OutOfRangeIntegralConversion extends Error {
  readonly code = 6003
  readonly name = "OutOfRangeIntegralConversion"
  readonly msg = "Out of range integral conversion attempted"

  constructor() {
    super("6003: Out of range integral conversion attempted")
  }
}

export class UnexpectedAccount extends Error {
  readonly code = 6004
  readonly name = "UnexpectedAccount"
  readonly msg = "Unexpected account in instruction"

  constructor() {
    super("6004: Unexpected account in instruction")
  }
}

export class PriceNotValid extends Error {
  readonly code = 6005
  readonly name = "PriceNotValid"
  readonly msg = "Price is not valid"

  constructor() {
    super("6005: Price is not valid")
  }
}

export class AccountsAndTokenMismatch extends Error {
  readonly code = 6006
  readonly name = "AccountsAndTokenMismatch"
  readonly msg =
    "The number of tokens is different from the number of received accounts"

  constructor() {
    super(
      "6006: The number of tokens is different from the number of received accounts"
    )
  }
}

export class BadTokenNb extends Error {
  readonly code = 6007
  readonly name = "BadTokenNb"
  readonly msg = "The token index received is out of range"

  constructor() {
    super("6007: The token index received is out of range")
  }
}

export class BadTokenType extends Error {
  readonly code = 6008
  readonly name = "BadTokenType"
  readonly msg = "The token type received is invalid"

  constructor() {
    super("6008: The token type received is invalid")
  }
}

export class SwitchboardV2Error extends Error {
  readonly code = 6009
  readonly name = "SwitchboardV2Error"
  readonly msg = "There was an error with the Switchboard V2 retrieval"

  constructor() {
    super("6009: There was an error with the Switchboard V2 retrieval")
  }
}

export function fromCode(code: number): CustomError | null {
  switch (code) {
    case 6000:
      return new IntegerOverflow()
    case 6001:
      return new ConversionFailure()
    case 6002:
      return new MathOverflow()
    case 6003:
      return new OutOfRangeIntegralConversion()
    case 6004:
      return new UnexpectedAccount()
    case 6005:
      return new PriceNotValid()
    case 6006:
      return new AccountsAndTokenMismatch()
    case 6007:
      return new BadTokenNb()
    case 6008:
      return new BadTokenType()
    case 6009:
      return new SwitchboardV2Error()
  }

  return null
}

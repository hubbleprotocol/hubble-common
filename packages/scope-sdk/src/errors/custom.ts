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
  | InvalidAccountDiscriminator
  | UnableToDeserializeAccount
  | BadScopeChainOrPrices
  | RefreshInCPI
  | RefreshWithUnexpectedIxs
  | InvalidTokenUpdateMode
  | UnableToDerivePDA
  | BadTimestamp
  | BadSlot
  | PriceAccountNotExpected
  | TwapSourceIndexOutOfRange
  | TwapSampleTooFrequent
  | UnexpectedJlpConfiguration
  | TwapNotEnoughSamplesInPeriod
  | EmptyTokenList
  | StakeFeeTooHigh
  | KTokenUnderlyingPriceNotValid
  | KTokenHoldingsCalculationError
  | CannotResizeAccount
  | FixedPriceInvalid

export class IntegerOverflow extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "IntegerOverflow"
  readonly msg = "Integer overflow"

  constructor(readonly logs?: string[]) {
    super("6000: Integer overflow")
  }
}

export class ConversionFailure extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "ConversionFailure"
  readonly msg = "Conversion failure"

  constructor(readonly logs?: string[]) {
    super("6001: Conversion failure")
  }
}

export class MathOverflow extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "MathOverflow"
  readonly msg = "Mathematical operation with overflow"

  constructor(readonly logs?: string[]) {
    super("6002: Mathematical operation with overflow")
  }
}

export class OutOfRangeIntegralConversion extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "OutOfRangeIntegralConversion"
  readonly msg = "Out of range integral conversion attempted"

  constructor(readonly logs?: string[]) {
    super("6003: Out of range integral conversion attempted")
  }
}

export class UnexpectedAccount extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "UnexpectedAccount"
  readonly msg = "Unexpected account in instruction"

  constructor(readonly logs?: string[]) {
    super("6004: Unexpected account in instruction")
  }
}

export class PriceNotValid extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "PriceNotValid"
  readonly msg = "Price is not valid"

  constructor(readonly logs?: string[]) {
    super("6005: Price is not valid")
  }
}

export class AccountsAndTokenMismatch extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "AccountsAndTokenMismatch"
  readonly msg =
    "The number of tokens is different from the number of received accounts"

  constructor(readonly logs?: string[]) {
    super(
      "6006: The number of tokens is different from the number of received accounts"
    )
  }
}

export class BadTokenNb extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "BadTokenNb"
  readonly msg = "The token index received is out of range"

  constructor(readonly logs?: string[]) {
    super("6007: The token index received is out of range")
  }
}

export class BadTokenType extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "BadTokenType"
  readonly msg = "The token type received is invalid"

  constructor(readonly logs?: string[]) {
    super("6008: The token type received is invalid")
  }
}

export class SwitchboardV2Error extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "SwitchboardV2Error"
  readonly msg = "There was an error with the Switchboard V2 retrieval"

  constructor(readonly logs?: string[]) {
    super("6009: There was an error with the Switchboard V2 retrieval")
  }
}

export class InvalidAccountDiscriminator extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "InvalidAccountDiscriminator"
  readonly msg = "Invalid account discriminator"

  constructor(readonly logs?: string[]) {
    super("6010: Invalid account discriminator")
  }
}

export class UnableToDeserializeAccount extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "UnableToDeserializeAccount"
  readonly msg = "Unable to deserialize account"

  constructor(readonly logs?: string[]) {
    super("6011: Unable to deserialize account")
  }
}

export class BadScopeChainOrPrices extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = "BadScopeChainOrPrices"
  readonly msg = "Error while computing price with ScopeChain"

  constructor(readonly logs?: string[]) {
    super("6012: Error while computing price with ScopeChain")
  }
}

export class RefreshInCPI extends Error {
  static readonly code = 6013
  readonly code = 6013
  readonly name = "RefreshInCPI"
  readonly msg = "Refresh price instruction called in a CPI"

  constructor(readonly logs?: string[]) {
    super("6013: Refresh price instruction called in a CPI")
  }
}

export class RefreshWithUnexpectedIxs extends Error {
  static readonly code = 6014
  readonly code = 6014
  readonly name = "RefreshWithUnexpectedIxs"
  readonly msg = "Refresh price instruction preceded by unexpected ixs"

  constructor(readonly logs?: string[]) {
    super("6014: Refresh price instruction preceded by unexpected ixs")
  }
}

export class InvalidTokenUpdateMode extends Error {
  static readonly code = 6015
  readonly code = 6015
  readonly name = "InvalidTokenUpdateMode"
  readonly msg = "Invalid token metadata update mode"

  constructor(readonly logs?: string[]) {
    super("6015: Invalid token metadata update mode")
  }
}

export class UnableToDerivePDA extends Error {
  static readonly code = 6016
  readonly code = 6016
  readonly name = "UnableToDerivePDA"
  readonly msg = "Unable to derive PDA address"

  constructor(readonly logs?: string[]) {
    super("6016: Unable to derive PDA address")
  }
}

export class BadTimestamp extends Error {
  static readonly code = 6017
  readonly code = 6017
  readonly name = "BadTimestamp"
  readonly msg = "Invalid timestamp"

  constructor(readonly logs?: string[]) {
    super("6017: Invalid timestamp")
  }
}

export class BadSlot extends Error {
  static readonly code = 6018
  readonly code = 6018
  readonly name = "BadSlot"
  readonly msg = "Invalid slot"

  constructor(readonly logs?: string[]) {
    super("6018: Invalid slot")
  }
}

export class PriceAccountNotExpected extends Error {
  static readonly code = 6019
  readonly code = 6019
  readonly name = "PriceAccountNotExpected"
  readonly msg = "TWAP price account is different than Scope ID"

  constructor(readonly logs?: string[]) {
    super("6019: TWAP price account is different than Scope ID")
  }
}

export class TwapSourceIndexOutOfRange extends Error {
  static readonly code = 6020
  readonly code = 6020
  readonly name = "TwapSourceIndexOutOfRange"
  readonly msg = "TWAP source index out of range"

  constructor(readonly logs?: string[]) {
    super("6020: TWAP source index out of range")
  }
}

export class TwapSampleTooFrequent extends Error {
  static readonly code = 6021
  readonly code = 6021
  readonly name = "TwapSampleTooFrequent"
  readonly msg = "TWAP sample is too close to the previous one"

  constructor(readonly logs?: string[]) {
    super("6021: TWAP sample is too close to the previous one")
  }
}

export class UnexpectedJlpConfiguration extends Error {
  static readonly code = 6022
  readonly code = 6022
  readonly name = "UnexpectedJlpConfiguration"
  readonly msg = "Unexpected JLP configuration"

  constructor(readonly logs?: string[]) {
    super("6022: Unexpected JLP configuration")
  }
}

export class TwapNotEnoughSamplesInPeriod extends Error {
  static readonly code = 6023
  readonly code = 6023
  readonly name = "TwapNotEnoughSamplesInPeriod"
  readonly msg = "Not enough price samples in period to compute TWAP"

  constructor(readonly logs?: string[]) {
    super("6023: Not enough price samples in period to compute TWAP")
  }
}

export class EmptyTokenList extends Error {
  static readonly code = 6024
  readonly code = 6024
  readonly name = "EmptyTokenList"
  readonly msg = "The provided token list to refresh is empty"

  constructor(readonly logs?: string[]) {
    super("6024: The provided token list to refresh is empty")
  }
}

export class StakeFeeTooHigh extends Error {
  static readonly code = 6025
  readonly code = 6025
  readonly name = "StakeFeeTooHigh"
  readonly msg = "The stake pool fee is higher than the maximum allowed"

  constructor(readonly logs?: string[]) {
    super("6025: The stake pool fee is higher than the maximum allowed")
  }
}

export class KTokenUnderlyingPriceNotValid extends Error {
  static readonly code = 6026
  readonly code = 6026
  readonly name = "KTokenUnderlyingPriceNotValid"
  readonly msg = "Cannot get a valid price for the tokens composing the Ktoken"

  constructor(readonly logs?: string[]) {
    super("6026: Cannot get a valid price for the tokens composing the Ktoken")
  }
}

export class KTokenHoldingsCalculationError extends Error {
  static readonly code = 6027
  readonly code = 6027
  readonly name = "KTokenHoldingsCalculationError"
  readonly msg = "Error while computing the Ktoken pool holdings"

  constructor(readonly logs?: string[]) {
    super("6027: Error while computing the Ktoken pool holdings")
  }
}

export class CannotResizeAccount extends Error {
  static readonly code = 6028
  readonly code = 6028
  readonly name = "CannotResizeAccount"
  readonly msg = "Cannot resize the account we only allow it to grow in size"

  constructor(readonly logs?: string[]) {
    super("6028: Cannot resize the account we only allow it to grow in size")
  }
}

export class FixedPriceInvalid extends Error {
  static readonly code = 6029
  readonly code = 6029
  readonly name = "FixedPriceInvalid"
  readonly msg = "The provided fixed price is invalid"

  constructor(readonly logs?: string[]) {
    super("6029: The provided fixed price is invalid")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new IntegerOverflow(logs)
    case 6001:
      return new ConversionFailure(logs)
    case 6002:
      return new MathOverflow(logs)
    case 6003:
      return new OutOfRangeIntegralConversion(logs)
    case 6004:
      return new UnexpectedAccount(logs)
    case 6005:
      return new PriceNotValid(logs)
    case 6006:
      return new AccountsAndTokenMismatch(logs)
    case 6007:
      return new BadTokenNb(logs)
    case 6008:
      return new BadTokenType(logs)
    case 6009:
      return new SwitchboardV2Error(logs)
    case 6010:
      return new InvalidAccountDiscriminator(logs)
    case 6011:
      return new UnableToDeserializeAccount(logs)
    case 6012:
      return new BadScopeChainOrPrices(logs)
    case 6013:
      return new RefreshInCPI(logs)
    case 6014:
      return new RefreshWithUnexpectedIxs(logs)
    case 6015:
      return new InvalidTokenUpdateMode(logs)
    case 6016:
      return new UnableToDerivePDA(logs)
    case 6017:
      return new BadTimestamp(logs)
    case 6018:
      return new BadSlot(logs)
    case 6019:
      return new PriceAccountNotExpected(logs)
    case 6020:
      return new TwapSourceIndexOutOfRange(logs)
    case 6021:
      return new TwapSampleTooFrequent(logs)
    case 6022:
      return new UnexpectedJlpConfiguration(logs)
    case 6023:
      return new TwapNotEnoughSamplesInPeriod(logs)
    case 6024:
      return new EmptyTokenList(logs)
    case 6025:
      return new StakeFeeTooHigh(logs)
    case 6026:
      return new KTokenUnderlyingPriceNotValid(logs)
    case 6027:
      return new KTokenHoldingsCalculationError(logs)
    case 6028:
      return new CannotResizeAccount(logs)
    case 6029:
      return new FixedPriceInvalid(logs)
  }

  return null
}

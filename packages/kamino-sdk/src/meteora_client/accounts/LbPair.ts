import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface LbPairFields {
  parameters: types.StaticParametersFields
  vParameters: types.VariableParametersFields
  bumpSeed: Array<number>
  /** Bin step signer seed */
  binStepSeed: Array<number>
  /** Type of the pair */
  pairType: number
  /** Active bin id */
  activeId: number
  /** Bin step. Represent the price increment / decrement. */
  binStep: number
  /** Status of the pair. Check PairStatus enum. */
  status: number
  requireBaseFactorSeed: number
  baseFactorSeed: Array<number>
  padding1: Array<number>
  /** Token X mint */
  tokenXMint: PublicKey
  /** Token Y mint */
  tokenYMint: PublicKey
  /** LB token X vault */
  reserveX: PublicKey
  /** LB token Y vault */
  reserveY: PublicKey
  /** Uncollected protocol fee */
  protocolFee: types.ProtocolFeeFields
  /** Protocol fee owner, */
  feeOwner: PublicKey
  /** Farming reward information */
  rewardInfos: Array<types.RewardInfoFields>
  /** Oracle pubkey */
  oracle: PublicKey
  /** Packed initialized bin array state */
  binArrayBitmap: Array<BN>
  /** Last time the pool fee parameter was updated */
  lastUpdatedAt: BN
  /** Whitelisted wallet */
  whitelistedWallet: Array<PublicKey>
  /** Base keypair. Only required for permission pair */
  baseKey: PublicKey
  /** Slot to enable the pair. Only applicable for permission pair. */
  activationSlot: BN
  /** Last slot until pool remove max_swapped_amount for buying */
  swapCapDeactivateSlot: BN
  /** Max X swapped amount user can swap from y to x between activation_slot and last_slot */
  maxSwappedAmount: BN
  /** Liquidity lock duration for positions which created before activate. Only applicable for permission pair. */
  lockDurationsInSlot: BN
  /** Pool creator */
  creator: PublicKey
  /** Reserved space for future use */
  reserved: Array<number>
}

export interface LbPairJSON {
  parameters: types.StaticParametersJSON
  vParameters: types.VariableParametersJSON
  bumpSeed: Array<number>
  /** Bin step signer seed */
  binStepSeed: Array<number>
  /** Type of the pair */
  pairType: number
  /** Active bin id */
  activeId: number
  /** Bin step. Represent the price increment / decrement. */
  binStep: number
  /** Status of the pair. Check PairStatus enum. */
  status: number
  requireBaseFactorSeed: number
  baseFactorSeed: Array<number>
  padding1: Array<number>
  /** Token X mint */
  tokenXMint: string
  /** Token Y mint */
  tokenYMint: string
  /** LB token X vault */
  reserveX: string
  /** LB token Y vault */
  reserveY: string
  /** Uncollected protocol fee */
  protocolFee: types.ProtocolFeeJSON
  /** Protocol fee owner, */
  feeOwner: string
  /** Farming reward information */
  rewardInfos: Array<types.RewardInfoJSON>
  /** Oracle pubkey */
  oracle: string
  /** Packed initialized bin array state */
  binArrayBitmap: Array<string>
  /** Last time the pool fee parameter was updated */
  lastUpdatedAt: string
  /** Whitelisted wallet */
  whitelistedWallet: Array<string>
  /** Base keypair. Only required for permission pair */
  baseKey: string
  /** Slot to enable the pair. Only applicable for permission pair. */
  activationSlot: string
  /** Last slot until pool remove max_swapped_amount for buying */
  swapCapDeactivateSlot: string
  /** Max X swapped amount user can swap from y to x between activation_slot and last_slot */
  maxSwappedAmount: string
  /** Liquidity lock duration for positions which created before activate. Only applicable for permission pair. */
  lockDurationsInSlot: string
  /** Pool creator */
  creator: string
  /** Reserved space for future use */
  reserved: Array<number>
}

export class LbPair {
  readonly parameters: types.StaticParameters
  readonly vParameters: types.VariableParameters
  readonly bumpSeed: Array<number>
  /** Bin step signer seed */
  readonly binStepSeed: Array<number>
  /** Type of the pair */
  readonly pairType: number
  /** Active bin id */
  readonly activeId: number
  /** Bin step. Represent the price increment / decrement. */
  readonly binStep: number
  /** Status of the pair. Check PairStatus enum. */
  readonly status: number
  readonly requireBaseFactorSeed: number
  readonly baseFactorSeed: Array<number>
  readonly padding1: Array<number>
  /** Token X mint */
  readonly tokenXMint: PublicKey
  /** Token Y mint */
  readonly tokenYMint: PublicKey
  /** LB token X vault */
  readonly reserveX: PublicKey
  /** LB token Y vault */
  readonly reserveY: PublicKey
  /** Uncollected protocol fee */
  readonly protocolFee: types.ProtocolFee
  /** Protocol fee owner, */
  readonly feeOwner: PublicKey
  /** Farming reward information */
  readonly rewardInfos: Array<types.RewardInfo>
  /** Oracle pubkey */
  readonly oracle: PublicKey
  /** Packed initialized bin array state */
  readonly binArrayBitmap: Array<BN>
  /** Last time the pool fee parameter was updated */
  readonly lastUpdatedAt: BN
  /** Whitelisted wallet */
  readonly whitelistedWallet: Array<PublicKey>
  /** Base keypair. Only required for permission pair */
  readonly baseKey: PublicKey
  /** Slot to enable the pair. Only applicable for permission pair. */
  readonly activationSlot: BN
  /** Last slot until pool remove max_swapped_amount for buying */
  readonly swapCapDeactivateSlot: BN
  /** Max X swapped amount user can swap from y to x between activation_slot and last_slot */
  readonly maxSwappedAmount: BN
  /** Liquidity lock duration for positions which created before activate. Only applicable for permission pair. */
  readonly lockDurationsInSlot: BN
  /** Pool creator */
  readonly creator: PublicKey
  /** Reserved space for future use */
  readonly reserved: Array<number>

  static readonly discriminator = Buffer.from([
    33, 11, 49, 98, 181, 101, 177, 13,
  ])

  static readonly layout = borsh.struct([
    types.StaticParameters.layout("parameters"),
    types.VariableParameters.layout("vParameters"),
    borsh.array(borsh.u8(), 1, "bumpSeed"),
    borsh.array(borsh.u8(), 2, "binStepSeed"),
    borsh.u8("pairType"),
    borsh.i32("activeId"),
    borsh.u16("binStep"),
    borsh.u8("status"),
    borsh.u8("requireBaseFactorSeed"),
    borsh.array(borsh.u8(), 2, "baseFactorSeed"),
    borsh.array(borsh.u8(), 2, "padding1"),
    borsh.publicKey("tokenXMint"),
    borsh.publicKey("tokenYMint"),
    borsh.publicKey("reserveX"),
    borsh.publicKey("reserveY"),
    types.ProtocolFee.layout("protocolFee"),
    borsh.publicKey("feeOwner"),
    borsh.array(types.RewardInfo.layout(), 2, "rewardInfos"),
    borsh.publicKey("oracle"),
    borsh.array(borsh.u64(), 16, "binArrayBitmap"),
    borsh.i64("lastUpdatedAt"),
    borsh.array(borsh.publicKey(), 2, "whitelistedWallet"),
    borsh.publicKey("baseKey"),
    borsh.u64("activationSlot"),
    borsh.u64("swapCapDeactivateSlot"),
    borsh.u64("maxSwappedAmount"),
    borsh.u64("lockDurationsInSlot"),
    borsh.publicKey("creator"),
    borsh.array(borsh.u8(), 24, "reserved"),
  ])

  constructor(fields: LbPairFields) {
    this.parameters = new types.StaticParameters({ ...fields.parameters })
    this.vParameters = new types.VariableParameters({ ...fields.vParameters })
    this.bumpSeed = fields.bumpSeed
    this.binStepSeed = fields.binStepSeed
    this.pairType = fields.pairType
    this.activeId = fields.activeId
    this.binStep = fields.binStep
    this.status = fields.status
    this.requireBaseFactorSeed = fields.requireBaseFactorSeed
    this.baseFactorSeed = fields.baseFactorSeed
    this.padding1 = fields.padding1
    this.tokenXMint = fields.tokenXMint
    this.tokenYMint = fields.tokenYMint
    this.reserveX = fields.reserveX
    this.reserveY = fields.reserveY
    this.protocolFee = new types.ProtocolFee({ ...fields.protocolFee })
    this.feeOwner = fields.feeOwner
    this.rewardInfos = fields.rewardInfos.map(
      (item) => new types.RewardInfo({ ...item })
    )
    this.oracle = fields.oracle
    this.binArrayBitmap = fields.binArrayBitmap
    this.lastUpdatedAt = fields.lastUpdatedAt
    this.whitelistedWallet = fields.whitelistedWallet
    this.baseKey = fields.baseKey
    this.activationSlot = fields.activationSlot
    this.swapCapDeactivateSlot = fields.swapCapDeactivateSlot
    this.maxSwappedAmount = fields.maxSwappedAmount
    this.lockDurationsInSlot = fields.lockDurationsInSlot
    this.creator = fields.creator
    this.reserved = fields.reserved
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<LbPair | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<LbPair | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): LbPair {
    if (!data.slice(0, 8).equals(LbPair.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = LbPair.layout.decode(data.slice(8))

    return new LbPair({
      parameters: types.StaticParameters.fromDecoded(dec.parameters),
      vParameters: types.VariableParameters.fromDecoded(dec.vParameters),
      bumpSeed: dec.bumpSeed,
      binStepSeed: dec.binStepSeed,
      pairType: dec.pairType,
      activeId: dec.activeId,
      binStep: dec.binStep,
      status: dec.status,
      requireBaseFactorSeed: dec.requireBaseFactorSeed,
      baseFactorSeed: dec.baseFactorSeed,
      padding1: dec.padding1,
      tokenXMint: dec.tokenXMint,
      tokenYMint: dec.tokenYMint,
      reserveX: dec.reserveX,
      reserveY: dec.reserveY,
      protocolFee: types.ProtocolFee.fromDecoded(dec.protocolFee),
      feeOwner: dec.feeOwner,
      rewardInfos: dec.rewardInfos.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.RewardInfo.fromDecoded(item)
      ),
      oracle: dec.oracle,
      binArrayBitmap: dec.binArrayBitmap,
      lastUpdatedAt: dec.lastUpdatedAt,
      whitelistedWallet: dec.whitelistedWallet,
      baseKey: dec.baseKey,
      activationSlot: dec.activationSlot,
      swapCapDeactivateSlot: dec.swapCapDeactivateSlot,
      maxSwappedAmount: dec.maxSwappedAmount,
      lockDurationsInSlot: dec.lockDurationsInSlot,
      creator: dec.creator,
      reserved: dec.reserved,
    })
  }

  toJSON(): LbPairJSON {
    return {
      parameters: this.parameters.toJSON(),
      vParameters: this.vParameters.toJSON(),
      bumpSeed: this.bumpSeed,
      binStepSeed: this.binStepSeed,
      pairType: this.pairType,
      activeId: this.activeId,
      binStep: this.binStep,
      status: this.status,
      requireBaseFactorSeed: this.requireBaseFactorSeed,
      baseFactorSeed: this.baseFactorSeed,
      padding1: this.padding1,
      tokenXMint: this.tokenXMint.toString(),
      tokenYMint: this.tokenYMint.toString(),
      reserveX: this.reserveX.toString(),
      reserveY: this.reserveY.toString(),
      protocolFee: this.protocolFee.toJSON(),
      feeOwner: this.feeOwner.toString(),
      rewardInfos: this.rewardInfos.map((item) => item.toJSON()),
      oracle: this.oracle.toString(),
      binArrayBitmap: this.binArrayBitmap.map((item) => item.toString()),
      lastUpdatedAt: this.lastUpdatedAt.toString(),
      whitelistedWallet: this.whitelistedWallet.map((item) => item.toString()),
      baseKey: this.baseKey.toString(),
      activationSlot: this.activationSlot.toString(),
      swapCapDeactivateSlot: this.swapCapDeactivateSlot.toString(),
      maxSwappedAmount: this.maxSwappedAmount.toString(),
      lockDurationsInSlot: this.lockDurationsInSlot.toString(),
      creator: this.creator.toString(),
      reserved: this.reserved,
    }
  }

  static fromJSON(obj: LbPairJSON): LbPair {
    return new LbPair({
      parameters: types.StaticParameters.fromJSON(obj.parameters),
      vParameters: types.VariableParameters.fromJSON(obj.vParameters),
      bumpSeed: obj.bumpSeed,
      binStepSeed: obj.binStepSeed,
      pairType: obj.pairType,
      activeId: obj.activeId,
      binStep: obj.binStep,
      status: obj.status,
      requireBaseFactorSeed: obj.requireBaseFactorSeed,
      baseFactorSeed: obj.baseFactorSeed,
      padding1: obj.padding1,
      tokenXMint: new PublicKey(obj.tokenXMint),
      tokenYMint: new PublicKey(obj.tokenYMint),
      reserveX: new PublicKey(obj.reserveX),
      reserveY: new PublicKey(obj.reserveY),
      protocolFee: types.ProtocolFee.fromJSON(obj.protocolFee),
      feeOwner: new PublicKey(obj.feeOwner),
      rewardInfos: obj.rewardInfos.map((item) =>
        types.RewardInfo.fromJSON(item)
      ),
      oracle: new PublicKey(obj.oracle),
      binArrayBitmap: obj.binArrayBitmap.map((item) => new BN(item)),
      lastUpdatedAt: new BN(obj.lastUpdatedAt),
      whitelistedWallet: obj.whitelistedWallet.map(
        (item) => new PublicKey(item)
      ),
      baseKey: new PublicKey(obj.baseKey),
      activationSlot: new BN(obj.activationSlot),
      swapCapDeactivateSlot: new BN(obj.swapCapDeactivateSlot),
      maxSwappedAmount: new BN(obj.maxSwappedAmount),
      lockDurationsInSlot: new BN(obj.lockDurationsInSlot),
      creator: new PublicKey(obj.creator),
      reserved: obj.reserved,
    })
  }
}

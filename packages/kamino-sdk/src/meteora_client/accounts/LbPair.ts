import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
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
  whitelistedWallet: PublicKey
  /** Address allowed to swap when the current slot is greater than or equal to the pre-activation slot. The pre-activation slot is calculated as `activation_slot - pre_activation_slot_duration`. */
  preActivationSwapAddress: PublicKey
  /** Base keypair. Only required for permission pair */
  baseKey: PublicKey
  /** Slot to enable the pair. Only applicable for permission pair. */
  activationSlot: BN
  /** Number of slot before activation slot. Used to calculate pre-activation slot for pre_activation_swap_address */
  preActivationSlotDuration: BN
  /** _padding2 is reclaimed free space from swap_cap_deactivate_slot and swap_cap_amount before, BE CAREFUL FOR TOMBSTONE WHEN REUSE !! */
  padding2: Array<number>
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
  whitelistedWallet: string
  /** Address allowed to swap when the current slot is greater than or equal to the pre-activation slot. The pre-activation slot is calculated as `activation_slot - pre_activation_slot_duration`. */
  preActivationSwapAddress: string
  /** Base keypair. Only required for permission pair */
  baseKey: string
  /** Slot to enable the pair. Only applicable for permission pair. */
  activationSlot: string
  /** Number of slot before activation slot. Used to calculate pre-activation slot for pre_activation_swap_address */
  preActivationSlotDuration: string
  /** _padding2 is reclaimed free space from swap_cap_deactivate_slot and swap_cap_amount before, BE CAREFUL FOR TOMBSTONE WHEN REUSE !! */
  padding2: Array<number>
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
  readonly whitelistedWallet: PublicKey
  /** Address allowed to swap when the current slot is greater than or equal to the pre-activation slot. The pre-activation slot is calculated as `activation_slot - pre_activation_slot_duration`. */
  readonly preActivationSwapAddress: PublicKey
  /** Base keypair. Only required for permission pair */
  readonly baseKey: PublicKey
  /** Slot to enable the pair. Only applicable for permission pair. */
  readonly activationSlot: BN
  /** Number of slot before activation slot. Used to calculate pre-activation slot for pre_activation_swap_address */
  readonly preActivationSlotDuration: BN
  /** _padding2 is reclaimed free space from swap_cap_deactivate_slot and swap_cap_amount before, BE CAREFUL FOR TOMBSTONE WHEN REUSE !! */
  readonly padding2: Array<number>
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
    borsh.publicKey("whitelistedWallet"),
    borsh.publicKey("preActivationSwapAddress"),
    borsh.publicKey("baseKey"),
    borsh.u64("activationSlot"),
    borsh.u64("preActivationSlotDuration"),
    borsh.array(borsh.u8(), 8, "padding2"),
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
    this.preActivationSwapAddress = fields.preActivationSwapAddress
    this.baseKey = fields.baseKey
    this.activationSlot = fields.activationSlot
    this.preActivationSlotDuration = fields.preActivationSlotDuration
    this.padding2 = fields.padding2
    this.lockDurationsInSlot = fields.lockDurationsInSlot
    this.creator = fields.creator
    this.reserved = fields.reserved
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<LbPair | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<LbPair | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(programId)) {
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
      preActivationSwapAddress: dec.preActivationSwapAddress,
      baseKey: dec.baseKey,
      activationSlot: dec.activationSlot,
      preActivationSlotDuration: dec.preActivationSlotDuration,
      padding2: dec.padding2,
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
      whitelistedWallet: this.whitelistedWallet.toString(),
      preActivationSwapAddress: this.preActivationSwapAddress.toString(),
      baseKey: this.baseKey.toString(),
      activationSlot: this.activationSlot.toString(),
      preActivationSlotDuration: this.preActivationSlotDuration.toString(),
      padding2: this.padding2,
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
      whitelistedWallet: new PublicKey(obj.whitelistedWallet),
      preActivationSwapAddress: new PublicKey(obj.preActivationSwapAddress),
      baseKey: new PublicKey(obj.baseKey),
      activationSlot: new BN(obj.activationSlot),
      preActivationSlotDuration: new BN(obj.preActivationSlotDuration),
      padding2: obj.padding2,
      lockDurationsInSlot: new BN(obj.lockDurationsInSlot),
      creator: new PublicKey(obj.creator),
      reserved: obj.reserved,
    })
  }
}

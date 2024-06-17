import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface GlobalConfigFields {
  emergencyMode: BN
  blockDeposit: BN
  blockInvest: BN
  blockWithdraw: BN
  blockCollectFees: BN
  blockCollectRewards: BN
  blockSwapRewards: BN
  blockSwapUnevenVaults: number
  blockEmergencySwap: number
  minWithdrawalFeeBps: BN
  scopeProgramId: PublicKey
  scopePriceId: PublicKey
  swapRewardsDiscountBps: Array<BN>
  actionsAuthority: PublicKey
  adminAuthority: PublicKey
  treasuryFeeVaults: Array<PublicKey>
  tokenInfos: PublicKey
  blockLocalAdmin: BN
  minPerformanceFeeBps: BN
  minSwapUnevenSlippageToleranceBps: BN
  minReferencePriceSlippageToleranceBps: BN
  actionsAfterRebalanceDelaySeconds: BN
  treasuryFeeVaultReceiver: PublicKey
  padding: Array<BN>
}

export interface GlobalConfigJSON {
  emergencyMode: string
  blockDeposit: string
  blockInvest: string
  blockWithdraw: string
  blockCollectFees: string
  blockCollectRewards: string
  blockSwapRewards: string
  blockSwapUnevenVaults: number
  blockEmergencySwap: number
  minWithdrawalFeeBps: string
  scopeProgramId: string
  scopePriceId: string
  swapRewardsDiscountBps: Array<string>
  actionsAuthority: string
  adminAuthority: string
  treasuryFeeVaults: Array<string>
  tokenInfos: string
  blockLocalAdmin: string
  minPerformanceFeeBps: string
  minSwapUnevenSlippageToleranceBps: string
  minReferencePriceSlippageToleranceBps: string
  actionsAfterRebalanceDelaySeconds: string
  treasuryFeeVaultReceiver: string
  padding: Array<string>
}

export class GlobalConfig {
  readonly emergencyMode: BN
  readonly blockDeposit: BN
  readonly blockInvest: BN
  readonly blockWithdraw: BN
  readonly blockCollectFees: BN
  readonly blockCollectRewards: BN
  readonly blockSwapRewards: BN
  readonly blockSwapUnevenVaults: number
  readonly blockEmergencySwap: number
  readonly minWithdrawalFeeBps: BN
  readonly scopeProgramId: PublicKey
  readonly scopePriceId: PublicKey
  readonly swapRewardsDiscountBps: Array<BN>
  readonly actionsAuthority: PublicKey
  readonly adminAuthority: PublicKey
  readonly treasuryFeeVaults: Array<PublicKey>
  readonly tokenInfos: PublicKey
  readonly blockLocalAdmin: BN
  readonly minPerformanceFeeBps: BN
  readonly minSwapUnevenSlippageToleranceBps: BN
  readonly minReferencePriceSlippageToleranceBps: BN
  readonly actionsAfterRebalanceDelaySeconds: BN
  readonly treasuryFeeVaultReceiver: PublicKey
  readonly padding: Array<BN>

  static readonly discriminator = Buffer.from([
    149, 8, 156, 202, 160, 252, 176, 217,
  ])

  static readonly layout = borsh.struct([
    borsh.u64("emergencyMode"),
    borsh.u64("blockDeposit"),
    borsh.u64("blockInvest"),
    borsh.u64("blockWithdraw"),
    borsh.u64("blockCollectFees"),
    borsh.u64("blockCollectRewards"),
    borsh.u64("blockSwapRewards"),
    borsh.u32("blockSwapUnevenVaults"),
    borsh.u32("blockEmergencySwap"),
    borsh.u64("minWithdrawalFeeBps"),
    borsh.publicKey("scopeProgramId"),
    borsh.publicKey("scopePriceId"),
    borsh.array(borsh.u64(), 256, "swapRewardsDiscountBps"),
    borsh.publicKey("actionsAuthority"),
    borsh.publicKey("adminAuthority"),
    borsh.array(borsh.publicKey(), 256, "treasuryFeeVaults"),
    borsh.publicKey("tokenInfos"),
    borsh.u64("blockLocalAdmin"),
    borsh.u64("minPerformanceFeeBps"),
    borsh.u64("minSwapUnevenSlippageToleranceBps"),
    borsh.u64("minReferencePriceSlippageToleranceBps"),
    borsh.u64("actionsAfterRebalanceDelaySeconds"),
    borsh.publicKey("treasuryFeeVaultReceiver"),
    borsh.array(borsh.u64(), 2035, "padding"),
  ])

  constructor(fields: GlobalConfigFields) {
    this.emergencyMode = fields.emergencyMode
    this.blockDeposit = fields.blockDeposit
    this.blockInvest = fields.blockInvest
    this.blockWithdraw = fields.blockWithdraw
    this.blockCollectFees = fields.blockCollectFees
    this.blockCollectRewards = fields.blockCollectRewards
    this.blockSwapRewards = fields.blockSwapRewards
    this.blockSwapUnevenVaults = fields.blockSwapUnevenVaults
    this.blockEmergencySwap = fields.blockEmergencySwap
    this.minWithdrawalFeeBps = fields.minWithdrawalFeeBps
    this.scopeProgramId = fields.scopeProgramId
    this.scopePriceId = fields.scopePriceId
    this.swapRewardsDiscountBps = fields.swapRewardsDiscountBps
    this.actionsAuthority = fields.actionsAuthority
    this.adminAuthority = fields.adminAuthority
    this.treasuryFeeVaults = fields.treasuryFeeVaults
    this.tokenInfos = fields.tokenInfos
    this.blockLocalAdmin = fields.blockLocalAdmin
    this.minPerformanceFeeBps = fields.minPerformanceFeeBps
    this.minSwapUnevenSlippageToleranceBps =
      fields.minSwapUnevenSlippageToleranceBps
    this.minReferencePriceSlippageToleranceBps =
      fields.minReferencePriceSlippageToleranceBps
    this.actionsAfterRebalanceDelaySeconds =
      fields.actionsAfterRebalanceDelaySeconds
    this.treasuryFeeVaultReceiver = fields.treasuryFeeVaultReceiver
    this.padding = fields.padding
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<GlobalConfig | null> {
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
  ): Promise<Array<GlobalConfig | null>> {
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

  static decode(data: Buffer): GlobalConfig {
    if (!data.slice(0, 8).equals(GlobalConfig.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = GlobalConfig.layout.decode(data.slice(8))

    return new GlobalConfig({
      emergencyMode: dec.emergencyMode,
      blockDeposit: dec.blockDeposit,
      blockInvest: dec.blockInvest,
      blockWithdraw: dec.blockWithdraw,
      blockCollectFees: dec.blockCollectFees,
      blockCollectRewards: dec.blockCollectRewards,
      blockSwapRewards: dec.blockSwapRewards,
      blockSwapUnevenVaults: dec.blockSwapUnevenVaults,
      blockEmergencySwap: dec.blockEmergencySwap,
      minWithdrawalFeeBps: dec.minWithdrawalFeeBps,
      scopeProgramId: dec.scopeProgramId,
      scopePriceId: dec.scopePriceId,
      swapRewardsDiscountBps: dec.swapRewardsDiscountBps,
      actionsAuthority: dec.actionsAuthority,
      adminAuthority: dec.adminAuthority,
      treasuryFeeVaults: dec.treasuryFeeVaults,
      tokenInfos: dec.tokenInfos,
      blockLocalAdmin: dec.blockLocalAdmin,
      minPerformanceFeeBps: dec.minPerformanceFeeBps,
      minSwapUnevenSlippageToleranceBps: dec.minSwapUnevenSlippageToleranceBps,
      minReferencePriceSlippageToleranceBps:
        dec.minReferencePriceSlippageToleranceBps,
      actionsAfterRebalanceDelaySeconds: dec.actionsAfterRebalanceDelaySeconds,
      treasuryFeeVaultReceiver: dec.treasuryFeeVaultReceiver,
      padding: dec.padding,
    })
  }

  toJSON(): GlobalConfigJSON {
    return {
      emergencyMode: this.emergencyMode.toString(),
      blockDeposit: this.blockDeposit.toString(),
      blockInvest: this.blockInvest.toString(),
      blockWithdraw: this.blockWithdraw.toString(),
      blockCollectFees: this.blockCollectFees.toString(),
      blockCollectRewards: this.blockCollectRewards.toString(),
      blockSwapRewards: this.blockSwapRewards.toString(),
      blockSwapUnevenVaults: this.blockSwapUnevenVaults,
      blockEmergencySwap: this.blockEmergencySwap,
      minWithdrawalFeeBps: this.minWithdrawalFeeBps.toString(),
      scopeProgramId: this.scopeProgramId.toString(),
      scopePriceId: this.scopePriceId.toString(),
      swapRewardsDiscountBps: this.swapRewardsDiscountBps.map((item) =>
        item.toString()
      ),
      actionsAuthority: this.actionsAuthority.toString(),
      adminAuthority: this.adminAuthority.toString(),
      treasuryFeeVaults: this.treasuryFeeVaults.map((item) => item.toString()),
      tokenInfos: this.tokenInfos.toString(),
      blockLocalAdmin: this.blockLocalAdmin.toString(),
      minPerformanceFeeBps: this.minPerformanceFeeBps.toString(),
      minSwapUnevenSlippageToleranceBps:
        this.minSwapUnevenSlippageToleranceBps.toString(),
      minReferencePriceSlippageToleranceBps:
        this.minReferencePriceSlippageToleranceBps.toString(),
      actionsAfterRebalanceDelaySeconds:
        this.actionsAfterRebalanceDelaySeconds.toString(),
      treasuryFeeVaultReceiver: this.treasuryFeeVaultReceiver.toString(),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: GlobalConfigJSON): GlobalConfig {
    return new GlobalConfig({
      emergencyMode: new BN(obj.emergencyMode),
      blockDeposit: new BN(obj.blockDeposit),
      blockInvest: new BN(obj.blockInvest),
      blockWithdraw: new BN(obj.blockWithdraw),
      blockCollectFees: new BN(obj.blockCollectFees),
      blockCollectRewards: new BN(obj.blockCollectRewards),
      blockSwapRewards: new BN(obj.blockSwapRewards),
      blockSwapUnevenVaults: obj.blockSwapUnevenVaults,
      blockEmergencySwap: obj.blockEmergencySwap,
      minWithdrawalFeeBps: new BN(obj.minWithdrawalFeeBps),
      scopeProgramId: new PublicKey(obj.scopeProgramId),
      scopePriceId: new PublicKey(obj.scopePriceId),
      swapRewardsDiscountBps: obj.swapRewardsDiscountBps.map(
        (item) => new BN(item)
      ),
      actionsAuthority: new PublicKey(obj.actionsAuthority),
      adminAuthority: new PublicKey(obj.adminAuthority),
      treasuryFeeVaults: obj.treasuryFeeVaults.map(
        (item) => new PublicKey(item)
      ),
      tokenInfos: new PublicKey(obj.tokenInfos),
      blockLocalAdmin: new BN(obj.blockLocalAdmin),
      minPerformanceFeeBps: new BN(obj.minPerformanceFeeBps),
      minSwapUnevenSlippageToleranceBps: new BN(
        obj.minSwapUnevenSlippageToleranceBps
      ),
      minReferencePriceSlippageToleranceBps: new BN(
        obj.minReferencePriceSlippageToleranceBps
      ),
      actionsAfterRebalanceDelaySeconds: new BN(
        obj.actionsAfterRebalanceDelaySeconds
      ),
      treasuryFeeVaultReceiver: new PublicKey(obj.treasuryFeeVaultReceiver),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }
}

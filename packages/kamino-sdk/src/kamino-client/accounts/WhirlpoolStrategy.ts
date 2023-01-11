import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface WhirlpoolStrategyFields {
  adminAuthority: PublicKey
  globalConfig: PublicKey
  baseVaultAuthority: PublicKey
  baseVaultAuthorityBump: BN
  pool: PublicKey
  poolTokenVaultA: PublicKey
  poolTokenVaultB: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  position: PublicKey
  positionMint: PublicKey
  positionMetadata: PublicKey
  positionTokenAccount: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  tokenAVaultAuthority: PublicKey
  tokenBVaultAuthority: PublicKey
  tokenAVaultAuthorityBump: BN
  tokenBVaultAuthorityBump: BN
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  tokenAMintDecimals: BN
  tokenBMintDecimals: BN
  tokenAAmounts: BN
  tokenBAmounts: BN
  tokenACollateralId: BN
  tokenBCollateralId: BN
  scopePrices: PublicKey
  scopeProgram: PublicKey
  sharesMint: PublicKey
  sharesMintDecimals: BN
  sharesMintAuthority: PublicKey
  sharesMintAuthorityBump: BN
  sharesIssued: BN
  status: BN
  reward0Amount: BN
  reward0Vault: PublicKey
  reward0CollateralId: BN
  reward0Decimals: BN
  reward1Amount: BN
  reward1Vault: PublicKey
  reward1CollateralId: BN
  reward1Decimals: BN
  reward2Amount: BN
  reward2Vault: PublicKey
  reward2CollateralId: BN
  reward2Decimals: BN
  depositCapUsd: BN
  feesACumulative: BN
  feesBCumulative: BN
  reward0AmountCumulative: BN
  reward1AmountCumulative: BN
  reward2AmountCumulative: BN
  depositCapUsdPerIxn: BN
  withdrawalCapA: types.WithdrawalCapsFields
  withdrawalCapB: types.WithdrawalCapsFields
  maxPriceDeviationBps: BN
  swapVaultMaxSlippage: BN
  strategyType: BN
  depositFee: BN
  withdrawFee: BN
  feesFee: BN
  reward0Fee: BN
  reward1Fee: BN
  reward2Fee: BN
  positionTimestamp: BN
  kaminoRewards: Array<types.KaminoRewardInfoFields>
  strategyDex: BN
  raydiumProtocolPositionOrBaseVaultAuthority: PublicKey
  blockDeposit: BN
  raydiumPoolConfigOrBaseVaultAuthority: PublicKey
  depositBlocked: number
  reservedFlag0: number
  investBlocked: number
  reservedFlag1: number
  withdrawBlocked: number
  reservedFlag2: number
  localAdminBlocked: number
  flashVaultSwapAllowed: number
  padding1: Array<BN>
  padding2: Array<BN>
  padding3: Array<BN>
  padding4: Array<BN>
  padding5: Array<BN>
  padding6: Array<BN>
}

export interface WhirlpoolStrategyJSON {
  adminAuthority: string
  globalConfig: string
  baseVaultAuthority: string
  baseVaultAuthorityBump: string
  pool: string
  poolTokenVaultA: string
  poolTokenVaultB: string
  tickArrayLower: string
  tickArrayUpper: string
  position: string
  positionMint: string
  positionMetadata: string
  positionTokenAccount: string
  tokenAVault: string
  tokenBVault: string
  tokenAVaultAuthority: string
  tokenBVaultAuthority: string
  tokenAVaultAuthorityBump: string
  tokenBVaultAuthorityBump: string
  tokenAMint: string
  tokenBMint: string
  tokenAMintDecimals: string
  tokenBMintDecimals: string
  tokenAAmounts: string
  tokenBAmounts: string
  tokenACollateralId: string
  tokenBCollateralId: string
  scopePrices: string
  scopeProgram: string
  sharesMint: string
  sharesMintDecimals: string
  sharesMintAuthority: string
  sharesMintAuthorityBump: string
  sharesIssued: string
  status: string
  reward0Amount: string
  reward0Vault: string
  reward0CollateralId: string
  reward0Decimals: string
  reward1Amount: string
  reward1Vault: string
  reward1CollateralId: string
  reward1Decimals: string
  reward2Amount: string
  reward2Vault: string
  reward2CollateralId: string
  reward2Decimals: string
  depositCapUsd: string
  feesACumulative: string
  feesBCumulative: string
  reward0AmountCumulative: string
  reward1AmountCumulative: string
  reward2AmountCumulative: string
  depositCapUsdPerIxn: string
  withdrawalCapA: types.WithdrawalCapsJSON
  withdrawalCapB: types.WithdrawalCapsJSON
  maxPriceDeviationBps: string
  swapVaultMaxSlippage: string
  strategyType: string
  depositFee: string
  withdrawFee: string
  feesFee: string
  reward0Fee: string
  reward1Fee: string
  reward2Fee: string
  positionTimestamp: string
  kaminoRewards: Array<types.KaminoRewardInfoJSON>
  strategyDex: string
  raydiumProtocolPositionOrBaseVaultAuthority: string
  blockDeposit: string
  raydiumPoolConfigOrBaseVaultAuthority: string
  depositBlocked: number
  reservedFlag0: number
  investBlocked: number
  reservedFlag1: number
  withdrawBlocked: number
  reservedFlag2: number
  localAdminBlocked: number
  flashVaultSwapAllowed: number
  padding1: Array<string>
  padding2: Array<string>
  padding3: Array<string>
  padding4: Array<string>
  padding5: Array<string>
  padding6: Array<string>
}

export class WhirlpoolStrategy {
  readonly adminAuthority: PublicKey
  readonly globalConfig: PublicKey
  readonly baseVaultAuthority: PublicKey
  readonly baseVaultAuthorityBump: BN
  readonly pool: PublicKey
  readonly poolTokenVaultA: PublicKey
  readonly poolTokenVaultB: PublicKey
  readonly tickArrayLower: PublicKey
  readonly tickArrayUpper: PublicKey
  readonly position: PublicKey
  readonly positionMint: PublicKey
  readonly positionMetadata: PublicKey
  readonly positionTokenAccount: PublicKey
  readonly tokenAVault: PublicKey
  readonly tokenBVault: PublicKey
  readonly tokenAVaultAuthority: PublicKey
  readonly tokenBVaultAuthority: PublicKey
  readonly tokenAVaultAuthorityBump: BN
  readonly tokenBVaultAuthorityBump: BN
  readonly tokenAMint: PublicKey
  readonly tokenBMint: PublicKey
  readonly tokenAMintDecimals: BN
  readonly tokenBMintDecimals: BN
  readonly tokenAAmounts: BN
  readonly tokenBAmounts: BN
  readonly tokenACollateralId: BN
  readonly tokenBCollateralId: BN
  readonly scopePrices: PublicKey
  readonly scopeProgram: PublicKey
  readonly sharesMint: PublicKey
  readonly sharesMintDecimals: BN
  readonly sharesMintAuthority: PublicKey
  readonly sharesMintAuthorityBump: BN
  readonly sharesIssued: BN
  readonly status: BN
  readonly reward0Amount: BN
  readonly reward0Vault: PublicKey
  readonly reward0CollateralId: BN
  readonly reward0Decimals: BN
  readonly reward1Amount: BN
  readonly reward1Vault: PublicKey
  readonly reward1CollateralId: BN
  readonly reward1Decimals: BN
  readonly reward2Amount: BN
  readonly reward2Vault: PublicKey
  readonly reward2CollateralId: BN
  readonly reward2Decimals: BN
  readonly depositCapUsd: BN
  readonly feesACumulative: BN
  readonly feesBCumulative: BN
  readonly reward0AmountCumulative: BN
  readonly reward1AmountCumulative: BN
  readonly reward2AmountCumulative: BN
  readonly depositCapUsdPerIxn: BN
  readonly withdrawalCapA: types.WithdrawalCaps
  readonly withdrawalCapB: types.WithdrawalCaps
  readonly maxPriceDeviationBps: BN
  readonly swapVaultMaxSlippage: BN
  readonly strategyType: BN
  readonly depositFee: BN
  readonly withdrawFee: BN
  readonly feesFee: BN
  readonly reward0Fee: BN
  readonly reward1Fee: BN
  readonly reward2Fee: BN
  readonly positionTimestamp: BN
  readonly kaminoRewards: Array<types.KaminoRewardInfo>
  readonly strategyDex: BN
  readonly raydiumProtocolPositionOrBaseVaultAuthority: PublicKey
  readonly blockDeposit: BN
  readonly raydiumPoolConfigOrBaseVaultAuthority: PublicKey
  readonly depositBlocked: number
  readonly reservedFlag0: number
  readonly investBlocked: number
  readonly reservedFlag1: number
  readonly withdrawBlocked: number
  readonly reservedFlag2: number
  readonly localAdminBlocked: number
  readonly flashVaultSwapAllowed: number
  readonly padding1: Array<BN>
  readonly padding2: Array<BN>
  readonly padding3: Array<BN>
  readonly padding4: Array<BN>
  readonly padding5: Array<BN>
  readonly padding6: Array<BN>

  static readonly discriminator = Buffer.from([
    190, 178, 231, 184, 49, 186, 103, 13,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("adminAuthority"),
    borsh.publicKey("globalConfig"),
    borsh.publicKey("baseVaultAuthority"),
    borsh.u64("baseVaultAuthorityBump"),
    borsh.publicKey("pool"),
    borsh.publicKey("poolTokenVaultA"),
    borsh.publicKey("poolTokenVaultB"),
    borsh.publicKey("tickArrayLower"),
    borsh.publicKey("tickArrayUpper"),
    borsh.publicKey("position"),
    borsh.publicKey("positionMint"),
    borsh.publicKey("positionMetadata"),
    borsh.publicKey("positionTokenAccount"),
    borsh.publicKey("tokenAVault"),
    borsh.publicKey("tokenBVault"),
    borsh.publicKey("tokenAVaultAuthority"),
    borsh.publicKey("tokenBVaultAuthority"),
    borsh.u64("tokenAVaultAuthorityBump"),
    borsh.u64("tokenBVaultAuthorityBump"),
    borsh.publicKey("tokenAMint"),
    borsh.publicKey("tokenBMint"),
    borsh.u64("tokenAMintDecimals"),
    borsh.u64("tokenBMintDecimals"),
    borsh.u64("tokenAAmounts"),
    borsh.u64("tokenBAmounts"),
    borsh.u64("tokenACollateralId"),
    borsh.u64("tokenBCollateralId"),
    borsh.publicKey("scopePrices"),
    borsh.publicKey("scopeProgram"),
    borsh.publicKey("sharesMint"),
    borsh.u64("sharesMintDecimals"),
    borsh.publicKey("sharesMintAuthority"),
    borsh.u64("sharesMintAuthorityBump"),
    borsh.u64("sharesIssued"),
    borsh.u64("status"),
    borsh.u64("reward0Amount"),
    borsh.publicKey("reward0Vault"),
    borsh.u64("reward0CollateralId"),
    borsh.u64("reward0Decimals"),
    borsh.u64("reward1Amount"),
    borsh.publicKey("reward1Vault"),
    borsh.u64("reward1CollateralId"),
    borsh.u64("reward1Decimals"),
    borsh.u64("reward2Amount"),
    borsh.publicKey("reward2Vault"),
    borsh.u64("reward2CollateralId"),
    borsh.u64("reward2Decimals"),
    borsh.u64("depositCapUsd"),
    borsh.u64("feesACumulative"),
    borsh.u64("feesBCumulative"),
    borsh.u64("reward0AmountCumulative"),
    borsh.u64("reward1AmountCumulative"),
    borsh.u64("reward2AmountCumulative"),
    borsh.u64("depositCapUsdPerIxn"),
    types.WithdrawalCaps.layout("withdrawalCapA"),
    types.WithdrawalCaps.layout("withdrawalCapB"),
    borsh.u64("maxPriceDeviationBps"),
    borsh.u64("swapVaultMaxSlippage"),
    borsh.u64("strategyType"),
    borsh.u64("depositFee"),
    borsh.u64("withdrawFee"),
    borsh.u64("feesFee"),
    borsh.u64("reward0Fee"),
    borsh.u64("reward1Fee"),
    borsh.u64("reward2Fee"),
    borsh.u64("positionTimestamp"),
    borsh.array(types.KaminoRewardInfo.layout(), 3, "kaminoRewards"),
    borsh.u64("strategyDex"),
    borsh.publicKey("raydiumProtocolPositionOrBaseVaultAuthority"),
    borsh.u64("blockDeposit"),
    borsh.publicKey("raydiumPoolConfigOrBaseVaultAuthority"),
    borsh.u8("depositBlocked"),
    borsh.u8("reservedFlag0"),
    borsh.u8("investBlocked"),
    borsh.u8("reservedFlag1"),
    borsh.u8("withdrawBlocked"),
    borsh.u8("reservedFlag2"),
    borsh.u8("localAdminBlocked"),
    borsh.u8("flashVaultSwapAllowed"),
    borsh.array(borsh.u64(), 2, "padding1"),
    borsh.array(borsh.u128(), 23, "padding2"),
    borsh.array(borsh.u128(), 32, "padding3"),
    borsh.array(borsh.u128(), 32, "padding4"),
    borsh.array(borsh.u128(), 32, "padding5"),
    borsh.array(borsh.u128(), 32, "padding6"),
  ])

  constructor(fields: WhirlpoolStrategyFields) {
    this.adminAuthority = fields.adminAuthority
    this.globalConfig = fields.globalConfig
    this.baseVaultAuthority = fields.baseVaultAuthority
    this.baseVaultAuthorityBump = fields.baseVaultAuthorityBump
    this.pool = fields.pool
    this.poolTokenVaultA = fields.poolTokenVaultA
    this.poolTokenVaultB = fields.poolTokenVaultB
    this.tickArrayLower = fields.tickArrayLower
    this.tickArrayUpper = fields.tickArrayUpper
    this.position = fields.position
    this.positionMint = fields.positionMint
    this.positionMetadata = fields.positionMetadata
    this.positionTokenAccount = fields.positionTokenAccount
    this.tokenAVault = fields.tokenAVault
    this.tokenBVault = fields.tokenBVault
    this.tokenAVaultAuthority = fields.tokenAVaultAuthority
    this.tokenBVaultAuthority = fields.tokenBVaultAuthority
    this.tokenAVaultAuthorityBump = fields.tokenAVaultAuthorityBump
    this.tokenBVaultAuthorityBump = fields.tokenBVaultAuthorityBump
    this.tokenAMint = fields.tokenAMint
    this.tokenBMint = fields.tokenBMint
    this.tokenAMintDecimals = fields.tokenAMintDecimals
    this.tokenBMintDecimals = fields.tokenBMintDecimals
    this.tokenAAmounts = fields.tokenAAmounts
    this.tokenBAmounts = fields.tokenBAmounts
    this.tokenACollateralId = fields.tokenACollateralId
    this.tokenBCollateralId = fields.tokenBCollateralId
    this.scopePrices = fields.scopePrices
    this.scopeProgram = fields.scopeProgram
    this.sharesMint = fields.sharesMint
    this.sharesMintDecimals = fields.sharesMintDecimals
    this.sharesMintAuthority = fields.sharesMintAuthority
    this.sharesMintAuthorityBump = fields.sharesMintAuthorityBump
    this.sharesIssued = fields.sharesIssued
    this.status = fields.status
    this.reward0Amount = fields.reward0Amount
    this.reward0Vault = fields.reward0Vault
    this.reward0CollateralId = fields.reward0CollateralId
    this.reward0Decimals = fields.reward0Decimals
    this.reward1Amount = fields.reward1Amount
    this.reward1Vault = fields.reward1Vault
    this.reward1CollateralId = fields.reward1CollateralId
    this.reward1Decimals = fields.reward1Decimals
    this.reward2Amount = fields.reward2Amount
    this.reward2Vault = fields.reward2Vault
    this.reward2CollateralId = fields.reward2CollateralId
    this.reward2Decimals = fields.reward2Decimals
    this.depositCapUsd = fields.depositCapUsd
    this.feesACumulative = fields.feesACumulative
    this.feesBCumulative = fields.feesBCumulative
    this.reward0AmountCumulative = fields.reward0AmountCumulative
    this.reward1AmountCumulative = fields.reward1AmountCumulative
    this.reward2AmountCumulative = fields.reward2AmountCumulative
    this.depositCapUsdPerIxn = fields.depositCapUsdPerIxn
    this.withdrawalCapA = new types.WithdrawalCaps({ ...fields.withdrawalCapA })
    this.withdrawalCapB = new types.WithdrawalCaps({ ...fields.withdrawalCapB })
    this.maxPriceDeviationBps = fields.maxPriceDeviationBps
    this.swapVaultMaxSlippage = fields.swapVaultMaxSlippage
    this.strategyType = fields.strategyType
    this.depositFee = fields.depositFee
    this.withdrawFee = fields.withdrawFee
    this.feesFee = fields.feesFee
    this.reward0Fee = fields.reward0Fee
    this.reward1Fee = fields.reward1Fee
    this.reward2Fee = fields.reward2Fee
    this.positionTimestamp = fields.positionTimestamp
    this.kaminoRewards = fields.kaminoRewards.map(
      (item) => new types.KaminoRewardInfo({ ...item })
    )
    this.strategyDex = fields.strategyDex
    this.raydiumProtocolPositionOrBaseVaultAuthority =
      fields.raydiumProtocolPositionOrBaseVaultAuthority
    this.blockDeposit = fields.blockDeposit
    this.raydiumPoolConfigOrBaseVaultAuthority =
      fields.raydiumPoolConfigOrBaseVaultAuthority
    this.depositBlocked = fields.depositBlocked
    this.reservedFlag0 = fields.reservedFlag0
    this.investBlocked = fields.investBlocked
    this.reservedFlag1 = fields.reservedFlag1
    this.withdrawBlocked = fields.withdrawBlocked
    this.reservedFlag2 = fields.reservedFlag2
    this.localAdminBlocked = fields.localAdminBlocked
    this.flashVaultSwapAllowed = fields.flashVaultSwapAllowed
    this.padding1 = fields.padding1
    this.padding2 = fields.padding2
    this.padding3 = fields.padding3
    this.padding4 = fields.padding4
    this.padding5 = fields.padding5
    this.padding6 = fields.padding6
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<WhirlpoolStrategy | null> {
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
  ): Promise<Array<WhirlpoolStrategy | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        console.log('SILVIU info.owner', info.owner.toString());
        console.log('SILVIU PROGRAM_ID', PROGRAM_ID.toString());
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): WhirlpoolStrategy {
    if (!data.slice(0, 8).equals(WhirlpoolStrategy.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = WhirlpoolStrategy.layout.decode(data.slice(8))

    return new WhirlpoolStrategy({
      adminAuthority: dec.adminAuthority,
      globalConfig: dec.globalConfig,
      baseVaultAuthority: dec.baseVaultAuthority,
      baseVaultAuthorityBump: dec.baseVaultAuthorityBump,
      pool: dec.pool,
      poolTokenVaultA: dec.poolTokenVaultA,
      poolTokenVaultB: dec.poolTokenVaultB,
      tickArrayLower: dec.tickArrayLower,
      tickArrayUpper: dec.tickArrayUpper,
      position: dec.position,
      positionMint: dec.positionMint,
      positionMetadata: dec.positionMetadata,
      positionTokenAccount: dec.positionTokenAccount,
      tokenAVault: dec.tokenAVault,
      tokenBVault: dec.tokenBVault,
      tokenAVaultAuthority: dec.tokenAVaultAuthority,
      tokenBVaultAuthority: dec.tokenBVaultAuthority,
      tokenAVaultAuthorityBump: dec.tokenAVaultAuthorityBump,
      tokenBVaultAuthorityBump: dec.tokenBVaultAuthorityBump,
      tokenAMint: dec.tokenAMint,
      tokenBMint: dec.tokenBMint,
      tokenAMintDecimals: dec.tokenAMintDecimals,
      tokenBMintDecimals: dec.tokenBMintDecimals,
      tokenAAmounts: dec.tokenAAmounts,
      tokenBAmounts: dec.tokenBAmounts,
      tokenACollateralId: dec.tokenACollateralId,
      tokenBCollateralId: dec.tokenBCollateralId,
      scopePrices: dec.scopePrices,
      scopeProgram: dec.scopeProgram,
      sharesMint: dec.sharesMint,
      sharesMintDecimals: dec.sharesMintDecimals,
      sharesMintAuthority: dec.sharesMintAuthority,
      sharesMintAuthorityBump: dec.sharesMintAuthorityBump,
      sharesIssued: dec.sharesIssued,
      status: dec.status,
      reward0Amount: dec.reward0Amount,
      reward0Vault: dec.reward0Vault,
      reward0CollateralId: dec.reward0CollateralId,
      reward0Decimals: dec.reward0Decimals,
      reward1Amount: dec.reward1Amount,
      reward1Vault: dec.reward1Vault,
      reward1CollateralId: dec.reward1CollateralId,
      reward1Decimals: dec.reward1Decimals,
      reward2Amount: dec.reward2Amount,
      reward2Vault: dec.reward2Vault,
      reward2CollateralId: dec.reward2CollateralId,
      reward2Decimals: dec.reward2Decimals,
      depositCapUsd: dec.depositCapUsd,
      feesACumulative: dec.feesACumulative,
      feesBCumulative: dec.feesBCumulative,
      reward0AmountCumulative: dec.reward0AmountCumulative,
      reward1AmountCumulative: dec.reward1AmountCumulative,
      reward2AmountCumulative: dec.reward2AmountCumulative,
      depositCapUsdPerIxn: dec.depositCapUsdPerIxn,
      withdrawalCapA: types.WithdrawalCaps.fromDecoded(dec.withdrawalCapA),
      withdrawalCapB: types.WithdrawalCaps.fromDecoded(dec.withdrawalCapB),
      maxPriceDeviationBps: dec.maxPriceDeviationBps,
      swapVaultMaxSlippage: dec.swapVaultMaxSlippage,
      strategyType: dec.strategyType,
      depositFee: dec.depositFee,
      withdrawFee: dec.withdrawFee,
      feesFee: dec.feesFee,
      reward0Fee: dec.reward0Fee,
      reward1Fee: dec.reward1Fee,
      reward2Fee: dec.reward2Fee,
      positionTimestamp: dec.positionTimestamp,
      kaminoRewards: dec.kaminoRewards.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.KaminoRewardInfo.fromDecoded(item)
      ),
      strategyDex: dec.strategyDex,
      raydiumProtocolPositionOrBaseVaultAuthority:
        dec.raydiumProtocolPositionOrBaseVaultAuthority,
      blockDeposit: dec.blockDeposit,
      raydiumPoolConfigOrBaseVaultAuthority:
        dec.raydiumPoolConfigOrBaseVaultAuthority,
      depositBlocked: dec.depositBlocked,
      reservedFlag0: dec.reservedFlag0,
      investBlocked: dec.investBlocked,
      reservedFlag1: dec.reservedFlag1,
      withdrawBlocked: dec.withdrawBlocked,
      reservedFlag2: dec.reservedFlag2,
      localAdminBlocked: dec.localAdminBlocked,
      flashVaultSwapAllowed: dec.flashVaultSwapAllowed,
      padding1: dec.padding1,
      padding2: dec.padding2,
      padding3: dec.padding3,
      padding4: dec.padding4,
      padding5: dec.padding5,
      padding6: dec.padding6,
    })
  }

  toJSON(): WhirlpoolStrategyJSON {
    return {
      adminAuthority: this.adminAuthority.toString(),
      globalConfig: this.globalConfig.toString(),
      baseVaultAuthority: this.baseVaultAuthority.toString(),
      baseVaultAuthorityBump: this.baseVaultAuthorityBump.toString(),
      pool: this.pool.toString(),
      poolTokenVaultA: this.poolTokenVaultA.toString(),
      poolTokenVaultB: this.poolTokenVaultB.toString(),
      tickArrayLower: this.tickArrayLower.toString(),
      tickArrayUpper: this.tickArrayUpper.toString(),
      position: this.position.toString(),
      positionMint: this.positionMint.toString(),
      positionMetadata: this.positionMetadata.toString(),
      positionTokenAccount: this.positionTokenAccount.toString(),
      tokenAVault: this.tokenAVault.toString(),
      tokenBVault: this.tokenBVault.toString(),
      tokenAVaultAuthority: this.tokenAVaultAuthority.toString(),
      tokenBVaultAuthority: this.tokenBVaultAuthority.toString(),
      tokenAVaultAuthorityBump: this.tokenAVaultAuthorityBump.toString(),
      tokenBVaultAuthorityBump: this.tokenBVaultAuthorityBump.toString(),
      tokenAMint: this.tokenAMint.toString(),
      tokenBMint: this.tokenBMint.toString(),
      tokenAMintDecimals: this.tokenAMintDecimals.toString(),
      tokenBMintDecimals: this.tokenBMintDecimals.toString(),
      tokenAAmounts: this.tokenAAmounts.toString(),
      tokenBAmounts: this.tokenBAmounts.toString(),
      tokenACollateralId: this.tokenACollateralId.toString(),
      tokenBCollateralId: this.tokenBCollateralId.toString(),
      scopePrices: this.scopePrices.toString(),
      scopeProgram: this.scopeProgram.toString(),
      sharesMint: this.sharesMint.toString(),
      sharesMintDecimals: this.sharesMintDecimals.toString(),
      sharesMintAuthority: this.sharesMintAuthority.toString(),
      sharesMintAuthorityBump: this.sharesMintAuthorityBump.toString(),
      sharesIssued: this.sharesIssued.toString(),
      status: this.status.toString(),
      reward0Amount: this.reward0Amount.toString(),
      reward0Vault: this.reward0Vault.toString(),
      reward0CollateralId: this.reward0CollateralId.toString(),
      reward0Decimals: this.reward0Decimals.toString(),
      reward1Amount: this.reward1Amount.toString(),
      reward1Vault: this.reward1Vault.toString(),
      reward1CollateralId: this.reward1CollateralId.toString(),
      reward1Decimals: this.reward1Decimals.toString(),
      reward2Amount: this.reward2Amount.toString(),
      reward2Vault: this.reward2Vault.toString(),
      reward2CollateralId: this.reward2CollateralId.toString(),
      reward2Decimals: this.reward2Decimals.toString(),
      depositCapUsd: this.depositCapUsd.toString(),
      feesACumulative: this.feesACumulative.toString(),
      feesBCumulative: this.feesBCumulative.toString(),
      reward0AmountCumulative: this.reward0AmountCumulative.toString(),
      reward1AmountCumulative: this.reward1AmountCumulative.toString(),
      reward2AmountCumulative: this.reward2AmountCumulative.toString(),
      depositCapUsdPerIxn: this.depositCapUsdPerIxn.toString(),
      withdrawalCapA: this.withdrawalCapA.toJSON(),
      withdrawalCapB: this.withdrawalCapB.toJSON(),
      maxPriceDeviationBps: this.maxPriceDeviationBps.toString(),
      swapVaultMaxSlippage: this.swapVaultMaxSlippage.toString(),
      strategyType: this.strategyType.toString(),
      depositFee: this.depositFee.toString(),
      withdrawFee: this.withdrawFee.toString(),
      feesFee: this.feesFee.toString(),
      reward0Fee: this.reward0Fee.toString(),
      reward1Fee: this.reward1Fee.toString(),
      reward2Fee: this.reward2Fee.toString(),
      positionTimestamp: this.positionTimestamp.toString(),
      kaminoRewards: this.kaminoRewards.map((item) => item.toJSON()),
      strategyDex: this.strategyDex.toString(),
      raydiumProtocolPositionOrBaseVaultAuthority:
        this.raydiumProtocolPositionOrBaseVaultAuthority.toString(),
      blockDeposit: this.blockDeposit.toString(),
      raydiumPoolConfigOrBaseVaultAuthority:
        this.raydiumPoolConfigOrBaseVaultAuthority.toString(),
      depositBlocked: this.depositBlocked,
      reservedFlag0: this.reservedFlag0,
      investBlocked: this.investBlocked,
      reservedFlag1: this.reservedFlag1,
      withdrawBlocked: this.withdrawBlocked,
      reservedFlag2: this.reservedFlag2,
      localAdminBlocked: this.localAdminBlocked,
      flashVaultSwapAllowed: this.flashVaultSwapAllowed,
      padding1: this.padding1.map((item) => item.toString()),
      padding2: this.padding2.map((item) => item.toString()),
      padding3: this.padding3.map((item) => item.toString()),
      padding4: this.padding4.map((item) => item.toString()),
      padding5: this.padding5.map((item) => item.toString()),
      padding6: this.padding6.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: WhirlpoolStrategyJSON): WhirlpoolStrategy {
    return new WhirlpoolStrategy({
      adminAuthority: new PublicKey(obj.adminAuthority),
      globalConfig: new PublicKey(obj.globalConfig),
      baseVaultAuthority: new PublicKey(obj.baseVaultAuthority),
      baseVaultAuthorityBump: new BN(obj.baseVaultAuthorityBump),
      pool: new PublicKey(obj.pool),
      poolTokenVaultA: new PublicKey(obj.poolTokenVaultA),
      poolTokenVaultB: new PublicKey(obj.poolTokenVaultB),
      tickArrayLower: new PublicKey(obj.tickArrayLower),
      tickArrayUpper: new PublicKey(obj.tickArrayUpper),
      position: new PublicKey(obj.position),
      positionMint: new PublicKey(obj.positionMint),
      positionMetadata: new PublicKey(obj.positionMetadata),
      positionTokenAccount: new PublicKey(obj.positionTokenAccount),
      tokenAVault: new PublicKey(obj.tokenAVault),
      tokenBVault: new PublicKey(obj.tokenBVault),
      tokenAVaultAuthority: new PublicKey(obj.tokenAVaultAuthority),
      tokenBVaultAuthority: new PublicKey(obj.tokenBVaultAuthority),
      tokenAVaultAuthorityBump: new BN(obj.tokenAVaultAuthorityBump),
      tokenBVaultAuthorityBump: new BN(obj.tokenBVaultAuthorityBump),
      tokenAMint: new PublicKey(obj.tokenAMint),
      tokenBMint: new PublicKey(obj.tokenBMint),
      tokenAMintDecimals: new BN(obj.tokenAMintDecimals),
      tokenBMintDecimals: new BN(obj.tokenBMintDecimals),
      tokenAAmounts: new BN(obj.tokenAAmounts),
      tokenBAmounts: new BN(obj.tokenBAmounts),
      tokenACollateralId: new BN(obj.tokenACollateralId),
      tokenBCollateralId: new BN(obj.tokenBCollateralId),
      scopePrices: new PublicKey(obj.scopePrices),
      scopeProgram: new PublicKey(obj.scopeProgram),
      sharesMint: new PublicKey(obj.sharesMint),
      sharesMintDecimals: new BN(obj.sharesMintDecimals),
      sharesMintAuthority: new PublicKey(obj.sharesMintAuthority),
      sharesMintAuthorityBump: new BN(obj.sharesMintAuthorityBump),
      sharesIssued: new BN(obj.sharesIssued),
      status: new BN(obj.status),
      reward0Amount: new BN(obj.reward0Amount),
      reward0Vault: new PublicKey(obj.reward0Vault),
      reward0CollateralId: new BN(obj.reward0CollateralId),
      reward0Decimals: new BN(obj.reward0Decimals),
      reward1Amount: new BN(obj.reward1Amount),
      reward1Vault: new PublicKey(obj.reward1Vault),
      reward1CollateralId: new BN(obj.reward1CollateralId),
      reward1Decimals: new BN(obj.reward1Decimals),
      reward2Amount: new BN(obj.reward2Amount),
      reward2Vault: new PublicKey(obj.reward2Vault),
      reward2CollateralId: new BN(obj.reward2CollateralId),
      reward2Decimals: new BN(obj.reward2Decimals),
      depositCapUsd: new BN(obj.depositCapUsd),
      feesACumulative: new BN(obj.feesACumulative),
      feesBCumulative: new BN(obj.feesBCumulative),
      reward0AmountCumulative: new BN(obj.reward0AmountCumulative),
      reward1AmountCumulative: new BN(obj.reward1AmountCumulative),
      reward2AmountCumulative: new BN(obj.reward2AmountCumulative),
      depositCapUsdPerIxn: new BN(obj.depositCapUsdPerIxn),
      withdrawalCapA: types.WithdrawalCaps.fromJSON(obj.withdrawalCapA),
      withdrawalCapB: types.WithdrawalCaps.fromJSON(obj.withdrawalCapB),
      maxPriceDeviationBps: new BN(obj.maxPriceDeviationBps),
      swapVaultMaxSlippage: new BN(obj.swapVaultMaxSlippage),
      strategyType: new BN(obj.strategyType),
      depositFee: new BN(obj.depositFee),
      withdrawFee: new BN(obj.withdrawFee),
      feesFee: new BN(obj.feesFee),
      reward0Fee: new BN(obj.reward0Fee),
      reward1Fee: new BN(obj.reward1Fee),
      reward2Fee: new BN(obj.reward2Fee),
      positionTimestamp: new BN(obj.positionTimestamp),
      kaminoRewards: obj.kaminoRewards.map((item) =>
        types.KaminoRewardInfo.fromJSON(item)
      ),
      strategyDex: new BN(obj.strategyDex),
      raydiumProtocolPositionOrBaseVaultAuthority: new PublicKey(
        obj.raydiumProtocolPositionOrBaseVaultAuthority
      ),
      blockDeposit: new BN(obj.blockDeposit),
      raydiumPoolConfigOrBaseVaultAuthority: new PublicKey(
        obj.raydiumPoolConfigOrBaseVaultAuthority
      ),
      depositBlocked: obj.depositBlocked,
      reservedFlag0: obj.reservedFlag0,
      investBlocked: obj.investBlocked,
      reservedFlag1: obj.reservedFlag1,
      withdrawBlocked: obj.withdrawBlocked,
      reservedFlag2: obj.reservedFlag2,
      localAdminBlocked: obj.localAdminBlocked,
      flashVaultSwapAllowed: obj.flashVaultSwapAllowed,
      padding1: obj.padding1.map((item) => new BN(item)),
      padding2: obj.padding2.map((item) => new BN(item)),
      padding3: obj.padding3.map((item) => new BN(item)),
      padding4: obj.padding4.map((item) => new BN(item)),
      padding5: obj.padding5.map((item) => new BN(item)),
      padding6: obj.padding6.map((item) => new BN(item)),
    })
  }
}

import {
  getCollateralMintByAddress,
  getConfigByCluster,
  HubbleConfig,
  SolanaCluster,
} from '@hubbleprotocol/hubble-config';
import {
  AccountInfo,
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { setKaminoProgramId } from './kamino-client/programId';
import { GlobalConfig, WhirlpoolStrategy } from './kamino-client/accounts';
import Decimal from 'decimal.js';
import { Position, Whirlpool } from './whirpools-client/accounts';
import { getMintDecimals } from '@project-serum/serum/lib/market';
import {
  getNearestValidTickIndexFromTickIndex,
  getStartTickIndex,
  Percentage,
  priceToTickIndex,
  RemoveLiquidityQuote,
  RemoveLiquidityQuoteParam,
} from '@orca-so/whirlpool-sdk';
import { OrcaDAL } from '@orca-so/whirlpool-sdk/dist/dal/orca-dal';
import { OrcaPosition } from '@orca-so/whirlpool-sdk/dist/position/orca-position';
import {
  Data,
  Holdings,
  KaminoPosition,
  ShareData,
  StrategyBalances,
  StrategyVaultBalances,
  TreasuryFeeVault,
} from './models';
import { PROGRAM_ID_CLI as WHIRLPOOL_PROGRAM_ID } from './whirpools-client/programId';
import { StrategyHolder } from './models/StrategyHolder';
import { Scope, SupportedToken } from '@hubbleprotocol/scope-sdk';
import { KaminoToken } from './models/KaminoToken';
import { PriceData } from './models/PriceData';
import {
  batchFetch,
  createAssociatedTokenAccountInstruction,
  Dex,
  dexToNumber,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressAndData,
  getDexProgramId,
  getReadOnlyWallet,
} from './utils';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  collectFeesAndRewards,
  CollectFeesAndRewardsAccounts,
  deposit,
  DepositAccounts,
  DepositArgs,
  executiveWithdraw,
  ExecutiveWithdrawAccounts,
  ExecutiveWithdrawArgs,
  initializeStrategy,
  InitializeStrategyAccounts,
  InitializeStrategyArgs,
  invest,
  InvestAccounts,
  openLiquidityPosition,
  OpenLiquidityPositionAccounts,
  OpenLiquidityPositionArgs,
  withdraw,
  WithdrawAccounts,
  WithdrawArgs,
} from './kamino-client/instructions';
import BN from 'bn.js';
import { StrategyWithAddress } from './models/StrategyWithAddress';
import { StrategyProgramAddress } from './models/StrategyProgramAddress';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { Rebalancing, Uninitialized } from './kamino-client/types/StrategyStatus';
import { METADATA_PROGRAM_ID, METADATA_UPDATE_AUTH } from './constants/metadata';
import { ExecutiveWithdrawActionKind, StrategyStatus, StrategyStatusKind } from './kamino-client/types';
import { Rebalance } from './kamino-client/types/ExecutiveWithdrawAction';
import { PoolState, PersonalPositionState } from './raydium_client/accounts';
import { LiquidityMath, SqrtPriceMath, TickMath } from '@raydium-io/raydium-sdk/lib/ammV3/utils/math';
import { PROGRAM_ID_CLI as RAYDIUM_PROGRAM_ID } from './raydium_client/programId';
import { i32ToBytes, TickUtils } from '@raydium-io/raydium-sdk';

import KaminoIdl from './kamino-client/kamino.json';
export const KAMINO_IDL = KaminoIdl;

export class Kamino {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  readonly _config: HubbleConfig;
  private _globalConfig: PublicKey;
  private readonly _scope: Scope;
  private readonly _provider: Provider;
  private _kaminoProgram: Program;
  private _kaminoProgramId: PublicKey;

  private readonly _tokenMap: KaminoToken[] = [
    { name: 'USDC', id: 0 },
    { name: 'USDH', id: 1 },
    { name: 'SOL', id: 2 },
    { name: 'ETH', id: 3 },
    { name: 'BTC', id: 4 },
    { name: 'MSOL', id: 5 },
    { name: 'STSOL', id: 6 },
    { name: 'USDT', id: 7 },
    { name: 'ORCA', id: 8 },
    { name: 'MNDE', id: 9 },
    { name: 'HBB', id: 10 },
    { name: 'JSOL', id: 11 },
    { name: 'USH', id: 12 },
    { name: 'DAI', id: 13 },
    { name: 'LDO', id: 14 },
    { name: 'scnSOL', id: 15 },
    { name: 'UXD', id: 16 },
    { name: 'HDG', id: 17 },
    { name: 'DUST', id: 18 },
    { name: 'USDR', id: 19 },
    { name: 'RATIO', id: 20 },
    { name: 'UXP', id: 21 },
    { name: 'JITOSOL', id: 22 },
    { name: 'RAY', id: 23 },
    { name: 'BONK', id: 24 },
  ];

  /**
   * Create a new instance of the Kamino SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   */
  constructor(cluster: SolanaCluster, connection: Connection, programId: PublicKey, globalConfig: PublicKey) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
    this._globalConfig = globalConfig;
    this._provider = new Provider(connection, getReadOnlyWallet(), {
      commitment: connection.commitment,
    });
    this._kaminoProgram = new Program(KAMINO_IDL as Idl, programId, this._provider);
    this._kaminoProgramId = programId;
    this._scope = new Scope(cluster, connection);
    setKaminoProgramId(programId);
    console.log('programId', programId.toString());
  }

  getConnection() {
    return this._connection;
  }

  getProgramID() {
    return this._kaminoProgramId;
  }

  getProgram() {
    return this._kaminoProgram;
  }

  setGlobalConfig(globalConfig: PublicKey) {
    this._globalConfig = globalConfig;
  }

  getGlobalConfig() {
    return this._globalConfig;
  }

  /**
   * Return a list of all Kamino whirlpool strategies
   * @param strategies Limit results to these strategy addresses
   */
  async getStrategies(
    strategies: Array<PublicKey> = this._config.kamino.strategies
  ): Promise<Array<WhirlpoolStrategy | null>> {
    return await batchFetch(strategies, (chunk) => WhirlpoolStrategy.fetchMultiple(this._connection, chunk));
  }

  /**
   * Get a Kamino whirlpool strategy by its public key address
   * @param address
   */
  getStrategyByAddress(address: PublicKey) {
    console.log('getStrategyByAddress ', address.toString());
    return WhirlpoolStrategy.fetch(this._connection, address);
  }

  /**
   * Get the strategy share data (price + balances) of the specified Kamino whirlpool strategy
   * @param strategy
   */
  async getStrategyShareData(strategy: PublicKey | StrategyWithAddress): Promise<ShareData> {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const sharesFactor = Decimal.pow(10, strategyState.strategy.sharesMintDecimals.toString());
    const sharesIssued = new Decimal(strategyState.strategy.sharesIssued.toString());
    const balances = await this.getStrategyBalances(strategyState.strategy);
    if (sharesIssued.isZero()) {
      return { price: new Decimal(1), balance: balances };
    } else {
      return { price: balances.computedHoldings.totalSum.div(sharesIssued).mul(sharesFactor), balance: balances };
    }
  }

  /**
   * Get the strategy share price of the specified Kamino whirlpool strategy
   * @param strategy
   */
  async getStrategySharePrice(strategy: PublicKey | StrategyWithAddress): Promise<Decimal> {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const sharesFactor = Decimal.pow(10, strategyState.strategy.sharesMintDecimals.toString());
    const sharesIssued = new Decimal(strategyState.strategy.sharesIssued.toString());
    const balances = await this.getStrategyBalances(strategyState.strategy);
    if (sharesIssued.isZero()) {
      return new Decimal(1);
    } else {
      return balances.computedHoldings.totalSum.div(sharesIssued).mul(sharesFactor);
    }
  }

  private async getTokenAccountBalance(tokenAccount: PublicKey): Promise<Decimal> {
    const tokenAccountBalance = await this._connection.getTokenAccountBalance(tokenAccount);
    if (!tokenAccountBalance.value) {
      throw new Error(`Could not get token account balance for ${tokenAccount.toString()}.`);
    }
    return new Decimal(tokenAccountBalance.value.uiAmountString!);
  }

  private async getStrategyBalances(strategy: WhirlpoolStrategy) {
    if (strategy.strategyDex.toNumber() == dexToNumber('ORCA')) {
      return this.getStrategyBalancesOrca(strategy);
    } else if (strategy.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      return this.getStrategyBalancesRaydium(strategy);
    } else {
      throw new Error(`Invalid dex ${strategy.strategyDex.toString()}`);
    }
  }

  private async getStrategyBalancesOrca(strategy: WhirlpoolStrategy) {
    console.log('getStrategyBalancesOrca whirlpool', strategy.pool.toString());
    const whirlpool = await Whirlpool.fetch(this._connection, strategy.pool);
    const position = await Position.fetch(this._connection, strategy.position);

    if (!position) {
      throw new Error(`Position ${strategy.position.toString()} could not be found.`);
    }
    if (!whirlpool) {
      throw new Error(`Whirlpool ${strategy.pool.toString()} could not be found.`);
    }

    const decimalsA = await getMintDecimals(this._connection, whirlpool.tokenMintA);
    const decimalsB = await getMintDecimals(this._connection, whirlpool.tokenMintB);

    const aVault = await this.getTokenAccountBalance(strategy.tokenAVault);
    const bVault = await this.getTokenAccountBalance(strategy.tokenBVault);

    // 2. Calc given Max B (3 tokens) - what is max a, max b, etc
    const accessor = new OrcaDAL(whirlpool.whirlpoolsConfig, WHIRLPOOL_PROGRAM_ID, this._connection);
    const orcaPosition = new OrcaPosition(accessor);
    const params: RemoveLiquidityQuoteParam = {
      positionAddress: strategy.position,
      liquidity: position.liquidity,
      refresh: true,
      slippageTolerance: Percentage.fromFraction(0, 1000),
    };
    const removeLiquidityQuote: RemoveLiquidityQuote = await orcaPosition.getRemoveLiquidityQuote(params);

    const vaultBalances: StrategyVaultBalances = {
      a: aVault,
      b: bVault,
    };
    const prices = await this.getPrices(strategy);
    const aAvailable = new Decimal(strategy.tokenAAmounts.toString());
    const bAvailable = new Decimal(strategy.tokenBAmounts.toString());
    const aInvested = new Decimal(removeLiquidityQuote.estTokenA.toString());
    const bInvested = new Decimal(removeLiquidityQuote.estTokenB.toString());

    let computedHoldings: Holdings = this.getStrategyHoldingsUsd(
      aAvailable,
      bAvailable,
      aInvested,
      bInvested,
      decimalsA,
      decimalsB,
      prices.aPrice,
      prices.bPrice
    );

    const balances: StrategyBalances = {
      computedHoldings,
      vaultBalances,
      prices,
      tokenAAmounts: aAvailable.plus(aInvested),
      tokenBAmounts: bAvailable.plus(bInvested),
    };
    return balances;
  }

  private async getStrategyBalancesRaydium(strategy: WhirlpoolStrategy) {
    let poolState = await PoolState.fetch(this._connection, strategy.pool);
    let positionState = await PersonalPositionState.fetch(this._connection, strategy.position);

    if (!positionState) {
      throw new Error(`Raydium position ${strategy.position.toString()} could not be found.`);
    }
    if (!poolState) {
      throw new Error(`Raydium pool ${strategy.pool.toString()} could not be found.`);
    }

    const decimalsA = await getMintDecimals(this._connection, poolState.tokenMint0);
    const decimalsB = await getMintDecimals(this._connection, poolState.tokenMint1);

    const aVault = await this.getTokenAccountBalance(strategy.tokenAVault);
    const bVault = await this.getTokenAccountBalance(strategy.tokenBVault);
    let lowerSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(positionState.tickLowerIndex);
    let upperSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(positionState.tickUpperIndex);

    positionState.tickLowerIndex;

    const { amountA, amountB } = LiquidityMath.getAmountsFromLiquidity(
      poolState.sqrtPriceX64,
      new BN(lowerSqrtPriceX64),
      new BN(upperSqrtPriceX64),
      positionState.liquidity,
      true
    );

    const vaultBalances: StrategyVaultBalances = {
      a: aVault,
      b: bVault,
    };
    const prices = await this.getPrices(strategy);
    const aAvailable = new Decimal(strategy.tokenAAmounts.toNumber());
    const bAvailable = new Decimal(strategy.tokenBAmounts.toNumber());
    const aInvested = new Decimal(amountA.toNumber());
    const bInvested = new Decimal(amountB.toNumber());

    let computedHoldings: Holdings = this.getStrategyHoldingsUsd(
      aAvailable,
      bAvailable,
      aInvested,
      bInvested,
      decimalsA,
      decimalsB,
      prices.aPrice,
      prices.bPrice
    );

    const balances: StrategyBalances = {
      computedHoldings,
      vaultBalances,
      prices,
      tokenAAmounts: aAvailable.plus(aInvested),
      tokenBAmounts: bAvailable.plus(bInvested),
    };
    return balances;
  }

  private getStrategyHoldingsUsd(
    aAvailable: Decimal,
    bAvailable: Decimal,
    aInvested: Decimal,
    bInvested: Decimal,
    decimalsA: number,
    decimalsB: number,
    aPrice: Decimal,
    bPrice: Decimal
  ): Holdings {
    const aAvailableScaled = aAvailable.div(Decimal.pow(10, decimalsA));
    const bAvailableScaled = bAvailable.div(Decimal.pow(10, decimalsB));

    const aInvestedScaled = aInvested.div(Decimal.pow(10, decimalsA));
    const bInvestedScaled = bInvested.div(Decimal.pow(10, decimalsB));

    const availableUsd = aAvailableScaled.mul(aPrice).add(bAvailableScaled.mul(bPrice));
    const investedUsd = aInvestedScaled.mul(aPrice).add(bInvestedScaled.mul(bPrice));

    return {
      available: {
        a: aAvailableScaled,
        b: bAvailableScaled,
      },
      availableUsd: availableUsd,
      invested: {
        a: aInvestedScaled,
        b: bInvestedScaled,
      },
      investedUsd: investedUsd,
      totalSum: availableUsd.add(investedUsd),
    };
  }

  private async getPrices(strategy: WhirlpoolStrategy): Promise<PriceData> {
    const collateralMintA = getCollateralMintByAddress(strategy.tokenAMint, this._config);
    const collateralMintB = getCollateralMintByAddress(strategy.tokenBMint, this._config);
    if (!collateralMintA) {
      throw Error(`Could not map token mint with scope price token (token A: ${strategy.tokenAMint.toBase58()})`);
    }
    if (!collateralMintB) {
      throw Error(`Could not map token mint with scope price token (token B: ${strategy.tokenBMint.toBase58()})`);
    }
    const tokens: SupportedToken[] = [];
    const rewardToken0 = this.getRewardToken(strategy.reward0CollateralId.toNumber(), tokens);
    const rewardToken1 = this.getRewardToken(strategy.reward1CollateralId.toNumber(), tokens);
    const rewardToken2 = this.getRewardToken(strategy.reward2CollateralId.toNumber(), tokens);
    // tokens.push(collateralMintA.scopeToken as SupportedToken);
    // tokens.push(collateralMintB.scopeToken as SupportedToken);
    tokens.push("USDC");

    console.log('before get prices');
    const prices = await this._scope.getPrices([...new Set(tokens)]);
    console.log("after get prices");
    const aPrice = prices.find((x) => x.name === collateralMintA.scopeToken);
    const bPrice = prices.find((x) => x.name === collateralMintB.scopeToken);

    const reward0Price = prices.find((x) => x.name === rewardToken0?.name)?.price ?? new Decimal(0);
    const reward1Price = prices.find((x) => x.name === rewardToken1?.name)?.price ?? new Decimal(0);
    const reward2Price = prices.find((x) => x.name === rewardToken2?.name)?.price ?? new Decimal(0);

    if (!aPrice) {
      throw Error(`Could not get token price from scope for ${collateralMintA.scopeToken}`);
    }
    if (!bPrice) {
      throw Error(`Could not get token price from scope for ${collateralMintB.scopeToken}`);
    }
    return { aPrice: aPrice.price, bPrice: bPrice.price, reward0Price, reward1Price, reward2Price };
  }

  private getRewardToken(tokenId: number, tokens: SupportedToken[]) {
    const rewardToken = this._tokenMap.find((x) => x.id === tokenId);
    if (rewardToken) {
      tokens.push(rewardToken.name);
    }
    return rewardToken;
  }

  /**
   * Get all token accounts for the specified share mint
   */
  getShareTokenAccounts(shareMint: PublicKey) {
    //how to get all token accounts for specific mint: https://spl.solana.com/token#finding-all-token-accounts-for-a-specific-mint
    //get it from the hardcoded token program and create a filter with the actual mint address
    //datasize:165 filter selects all token accounts, memcmp filter selects based on the mint address withing each token account
    return this._connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [{ dataSize: 165 }, { memcmp: { offset: 0, bytes: shareMint.toBase58() } }],
    });
  }

  /**
   * Get all token accounts for the specified wallet
   */
  getAllTokenAccounts(wallet: PublicKey) {
    //how to get all token accounts for specific wallet: https://spl.solana.com/token#finding-all-token-accounts-for-a-wallet
    return this._connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [{ dataSize: 165 }, { memcmp: { offset: 32, bytes: wallet.toString() } }],
    });
  }

  /**
   * Get all token accounts that are holding a specific Kamino whirlpool strategy
   */
  async getStrategyTokenAccounts(strategy: PublicKey | StrategyWithAddress) {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    return this.getShareTokenAccounts(strategyState.strategy.sharesMint);
  }

  /**
   * Get all strategy token holders
   * @param strategy
   */
  async getStrategyHolders(strategy: PublicKey | StrategyWithAddress): Promise<StrategyHolder[]> {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const tokenAccounts = await this.getStrategyTokenAccounts(strategyState);
    const result: StrategyHolder[] = [];
    for (const tokenAccount of tokenAccounts) {
      const accountData = tokenAccount.account.data as Data;
      result.push({
        holderPubkey: new PublicKey(accountData.parsed.info.owner),
        amount: new Decimal(accountData.parsed.info.tokenAmount.uiAmountString),
      });
    }
    return result;
  }

  /**
   * Get a list of whirlpools from public keys
   * @param whirlpools
   */
  getWhirlpools(whirlpools: PublicKey[]) {
    return batchFetch(whirlpools, (chunk) => Whirlpool.fetchMultiple(this._connection, chunk));
  }

  /**
   * Get whirlpool from public key
   * @param whirlpool pubkey of the orca whirlpool
   */
  getWhirlpoolByAddress(whirlpool: PublicKey) {
    return Whirlpool.fetch(this._connection, whirlpool);
  }

  /**
   * Get a list of Raydium pools from public keys
   * @param pools
   */
  getRaydiumPools(pools: PublicKey[]) {
    return batchFetch(pools, (chunk) => PoolState.fetchMultiple(this._connection, chunk));
  }

  /**
   * Get Raydium pool from public key
   * @param pool pubkey of the orca whirlpool
   */
  getRaydiumPoollByAddress(pool: PublicKey) {
    return PoolState.fetch(this._connection, pool);
  }

  /**
   * Get scope token name from a kamino strategy collateral ID
   * @param collateralId ID of the collateral token
   * @returns Kamino token name
   */
  getTokenName(collateralId: number) {
    const token = this._tokenMap.find((x) => x.id === collateralId);
    if (!token) {
      throw Error(`Token with collateral ID ${collateralId} does not exist.`);
    }
    return token.name;
  }

  /**
   * Get Kamino collateral ID from token name
   * @param name Name of the collateral token
   * @returns Kamino collateral ID
   */
  getCollateralId(name: SupportedToken) {
    const token = this._tokenMap.find((x) => x.name === name);
    if (!token) {
      throw Error(`Token with collateral name ${name} does not exist.`);
    }
    return token.id;
  }

  /**
   * Return transaction instruction to withdraw shares from a strategy owner (wallet) and get back token A and token B
   * @param strategy strategy public key
   * @param sharesAmount amount of shares (decimal representation), NOT in lamports
   * @param owner shares owner (wallet with shares)
   * @returns transaction instruction
   */
  async withdrawShares(strategy: PublicKey | StrategyWithAddress, sharesAmount: Decimal, owner: PublicKey) {
    if (sharesAmount.lessThanOrEqualTo(0)) {
      throw Error('Shares amount cant be lower than or equal to 0.');
    }
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);

    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority } =
      await this.getTreasuryFeeVaultPDAs(strategyState.strategy.tokenAMint, strategyState.strategy.tokenBMint);

    const sharesAta = await getAssociatedTokenAddress(strategyState.strategy.sharesMint, owner);
    const tokenAAta = await getAssociatedTokenAddress(strategyState.strategy.tokenAMint, owner);
    const tokenBAta = await getAssociatedTokenAddress(strategyState.strategy.tokenBMint, owner);

    const sharesAmountInLamports = sharesAmount.mul(
      new Decimal(10).pow(strategyState.strategy.sharesMintDecimals.toString())
    );

    let programId = getDexProgramId(strategyState.strategy);

    const args: WithdrawArgs = { sharesAmount: new BN(sharesAmountInLamports.toNumber()) };
    const accounts: WithdrawAccounts = {
      user: owner,
      strategy: strategyState.address,
      globalConfig: strategyState.strategy.globalConfig,
      pool: strategyState.strategy.pool,
      position: strategyState.strategy.position,
      tickArrayLower: strategyState.strategy.tickArrayLower,
      tickArrayUpper: strategyState.strategy.tickArrayUpper,
      tokenAVault: strategyState.strategy.tokenAVault,
      tokenBVault: strategyState.strategy.tokenBVault,
      baseVaultAuthority: strategyState.strategy.baseVaultAuthority,
      poolTokenVaultA: strategyState.strategy.poolTokenVaultA,
      poolTokenVaultB: strategyState.strategy.poolTokenVaultB,
      tokenAAta: tokenAAta,
      tokenBAta: tokenBAta,
      tokenAMint: strategyState.strategy.tokenAMint,
      tokenBMint: strategyState.strategy.tokenBMint,
      userSharesAta: sharesAta,
      sharesMint: strategyState.strategy.sharesMint,
      sharesMintAuthority: strategyState.strategy.sharesMintAuthority,
      treasuryFeeTokenAVault,
      treasuryFeeTokenBVault,
      treasuryFeeVaultAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      positionTokenAccount: strategyState.strategy.positionTokenAccount,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.strategy.raydiumProtocolPositionOrBaseVaultAuthority,
      poolProgram: programId,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    return withdraw(args, accounts);
  }

  /**
   * Get transaction instructions that create associated token accounts if they don't exist (token A, B and share)
   * @param owner wallet owner (shareholder)
   * @param strategyState kamino strategy state
   * @param tokenAData token A data of the owner's wallet
   * @param tokenAAta associated token account for token B
   * @param tokenBData token B data of the owner's wallet
   * @param tokenBAta associated token account for token B
   * @param sharesMintData shares data of the owner's wallet
   * @param sharesAta associated token account for shares
   * @returns list of transaction instructions (empty if all accounts already exist)
   */
  async getCreateAssociatedTokenAccountInstructionsIfNotExist(
    owner: PublicKey,
    strategyState: StrategyWithAddress,
    tokenAData: AccountInfo<Buffer> | null,
    tokenAAta: PublicKey,
    tokenBData: AccountInfo<Buffer> | null,
    tokenBAta: PublicKey,
    sharesMintData: AccountInfo<Buffer> | null,
    sharesAta: PublicKey
  ) {
    const instructions: TransactionInstruction[] = [];
    if (!tokenAData) {
      instructions.push(
        createAssociatedTokenAccountInstruction(owner, tokenAAta, owner, strategyState.strategy.tokenAMint)
      );
    }
    if (!tokenBData) {
      instructions.push(
        createAssociatedTokenAccountInstruction(owner, tokenBAta, owner, strategyState.strategy.tokenBMint)
      );
    }
    if (!sharesMintData) {
      instructions.push(
        createAssociatedTokenAccountInstruction(owner, sharesAta, owner, strategyState.strategy.sharesMint)
      );
    }
    return instructions;
  }

  /**
   * Check if strategy has already been fetched (is StrategyWithAddress type) and return that,
   * otherwise fetch it first from PublicKey and return it
   * @param strategy
   * @private
   */
  private async getStrategyStateIfNotFetched(strategy: PublicKey | StrategyWithAddress) {
    const hasStrategyBeenFetched = (object: PublicKey | StrategyWithAddress): object is StrategyWithAddress => {
      return 'strategy' in object;
    };

    if (hasStrategyBeenFetched(strategy)) {
      return strategy;
    } else {
      const strategyState = await this.getStrategyByAddress(strategy);
      if (!strategyState) {
        throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
      }
      return { strategy: strategyState, address: strategy };
    }
  }

  /**
   * Get treasury fee vault program addresses from for token A and B mints
   * @param tokenAMint
   * @param tokenBMint
   * @private
   */
  private async getTreasuryFeeVaultPDAs(tokenAMint: PublicKey, tokenBMint: PublicKey): Promise<TreasuryFeeVault> {
    const [treasuryFeeTokenAVault, _treasuryFeeTokenAVaultBump] = await PublicKey.findProgramAddress(
      [Buffer.from('treasury_fee_vault'), tokenAMint.toBuffer()],
      this.getProgramID()
    );
    const [treasuryFeeTokenBVault, _treasuryFeeTokenBVaultBump] = await PublicKey.findProgramAddress(
      [Buffer.from('treasury_fee_vault'), tokenBMint.toBuffer()],
      this.getProgramID()
    );
    const [treasuryFeeVaultAuthority, _treasuryFeeVaultAuthorityBump] = await PublicKey.findProgramAddress(
      [Buffer.from('treasury_fee_vault_authority')],
      this.getProgramID()
    );
    return { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority };
  }

  /**
   * Get a transaction instruction to withdraw all strategy shares from a specific wallet into token A and B
   * @param strategy public key of the strategy
   * @param owner public key of the owner (shareholder)
   * @returns transaction instruction or null if no shares or no sharesMint ATA present in the wallet
   */
  async withdrawAllShares(strategy: PublicKey | StrategyWithAddress, owner: PublicKey) {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const [sharesAta, sharesData] = await getAssociatedTokenAddressAndData(
      this._connection,
      strategyState.strategy.sharesMint,
      owner
    );
    if (!sharesData) {
      return null;
    }
    const balance = await this.getTokenAccountBalance(sharesAta);
    if (balance.isZero()) {
      return null;
    }
    return this.withdrawShares(strategyState, balance, owner);
  }

  /**
   * Get transaction instruction to deposit token A and B into a strategy.
   * @param strategy Kamino strategy public key or on-chain object
   * @param amountA Amount of token A to deposit into strategy
   * @param amountB Amount of token B to deposit into strategy
   * @param owner Owner (wallet, shareholder) public key
   * @returns transaction instruction for depositing tokens into a strategy
   */
  async deposit(strategy: PublicKey | StrategyWithAddress, amountA: Decimal, amountB: Decimal, owner: PublicKey) {
    if (amountA.lessThanOrEqualTo(0) || amountB.lessThanOrEqualTo(0)) {
      throw Error('Token A or B amount cant be lower than or equal to 0.');
    }
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);

    const globalConfig = await GlobalConfig.fetch(this._connection, strategyState.strategy.globalConfig);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${strategyState.strategy.globalConfig.toString()}`);
    }

    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority } =
      await this.getTreasuryFeeVaultPDAs(strategyState.strategy.tokenAMint, strategyState.strategy.tokenBMint);
    console.log('treasuryFeeTokenAVault', treasuryFeeTokenAVault.toString());
    console.log('treasuryFeeTokenBVault', treasuryFeeTokenBVault.toString());
    console.log('treasuryFeeVaultAuthority', treasuryFeeVaultAuthority.toString());

    const sharesAta = await getAssociatedTokenAddress(strategyState.strategy.sharesMint, owner);
    const tokenAAta = await getAssociatedTokenAddress(strategyState.strategy.tokenAMint, owner);
    const tokenBAta = await getAssociatedTokenAddress(strategyState.strategy.tokenBMint, owner);

    const lamportsA = amountA.mul(new Decimal(10).pow(strategyState.strategy.tokenAMintDecimals.toString()));
    const lamportsB = amountB.mul(new Decimal(10).pow(strategyState.strategy.tokenBMintDecimals.toString()));

    const depositArgs: DepositArgs = {
      tokenMaxA: new BN(lamportsA.toNumber()),
      tokenMaxB: new BN(lamportsB.toNumber()),
    };

    const depositAccounts: DepositAccounts = {
      user: owner,
      strategy: strategyState.address,
      globalConfig: strategyState.strategy.globalConfig,
      pool: strategyState.strategy.pool,
      position: strategyState.strategy.position,
      tokenAVault: strategyState.strategy.tokenAVault,
      tokenBVault: strategyState.strategy.tokenBVault,
      baseVaultAuthority: strategyState.strategy.baseVaultAuthority,
      treasuryFeeTokenAVault,
      treasuryFeeTokenBVault,
      treasuryFeeVaultAuthority,
      tokenAAta,
      tokenBAta,
      tokenAMint: strategyState.strategy.tokenAMint,
      tokenBMint: strategyState.strategy.tokenBMint,
      userSharesAta: sharesAta,
      sharesMint: strategyState.strategy.sharesMint,
      sharesMintAuthority: strategyState.strategy.sharesMintAuthority,
      scopePrices: strategyState.strategy.scopePrices,
      tokenInfos: globalConfig.tokenInfos,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    return deposit(depositArgs, depositAccounts);
  }

  /**
   * Get transaction instruction to create a new Kamino strategy.
   * Current limitations:
   *   - strategy can only be created by the owner (admin) of the global config, we will need to allow non-admins to bypass this check
   *   - after the strategy is created, only the owner (admin) can update the treasury fee vault with token A/B, we need to allow non-admins to be able to do (and require) this as well
   * @param strategy public key of the new strategy to create
   * @param pool public key of the CLMM pool (either Orca or Raydium)
   * @param owner public key of the strategy owner (admin authority)
   * @param tokenA name of the token A collateral used in the strategy
   * @param tokenB name of the token B collateral used in the strategy
   * @returns transaction instruction for Kamino strategy creation
   */
  async createStrategy(
    strategy: PublicKey,
    pool: PublicKey,
    owner: PublicKey,
    tokenA: SupportedToken,
    tokenB: SupportedToken,
    dex: Dex
  ) {
    console.log('in silviu createStrategy');
    let tokenMintA = PublicKey.default;
    let tokenMintB = PublicKey.default;
    if (dex == 'ORCA') {
      const whirlpoolState = await Whirlpool.fetch(this._connection, pool);
      if (!whirlpoolState) {
        throw Error(`Could not fetch whirlpool state with pubkey ${pool.toString()}`);
      }
      tokenMintA = whirlpoolState.tokenMintA;
      tokenMintB = whirlpoolState.tokenMintB;
      console.log('whirlpoolState.tokenMintA', whirlpoolState.tokenMintA.toString());
      console.log('whirlpoolState.tokenMintB', whirlpoolState.tokenMintB.toString());
    } else if (dex == 'RAYDIUM') {
      console.log('in silviu createStrategy RAYDIUM');
      const raydiumPoolState = await PoolState.fetch(this._connection, pool);
      if (!raydiumPoolState) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${pool.toString()}`);
      }
      tokenMintA = raydiumPoolState.tokenMint0;
      tokenMintB = raydiumPoolState.tokenMint1;
    } else {
      throw new Error(`Invalid dex ${dex.toString()}`);
    }

    let config = await GlobalConfig.fetch(this._connection, this._globalConfig);
    if (!config) {
      throw Error(`Could not fetch globalConfig  with pubkey ${this.getGlobalConfig().toString()}`);
    }

    const programAddresses = await this.getStrategyProgramAddresses(strategy, tokenMintA, tokenMintB);
    const strategyArgs: InitializeStrategyArgs = {
      tokenACollateralId: new BN(this.getCollateralId(tokenA)),
      tokenBCollateralId: new BN(this.getCollateralId(tokenB)),
      strategyType: new BN(dexToNumber(dex)),
    };

    console.log('adminAuthority:', owner.toString());
    console.log('strategy:', strategy.toString());
    console.log('globalConfig:', this._globalConfig.toString());
    console.log('pool:', pool.toString());
    console.log('tokenAMint:', tokenMintA.toString());
    console.log('tokenBMint:', tokenMintB.toString());
    console.log('tokenAVault:', programAddresses.tokenAVault.toString());
    console.log('tokenBVault:', programAddresses.tokenBVault.toString());
    console.log('baseVaultAuthority:', programAddresses.baseVaultAuthority.toString());
    console.log('sharesMint:', programAddresses.sharesMint.toString());
    console.log('sharesMintAuthority:', programAddresses.sharesMintAuthority.toString());
    console.log('scopePriceId:', config.scopePriceId.toString());
    console.log('scopeProgramId:', config.scopeProgramId.toString());
    console.log('tokenInfos:', config.tokenInfos.toString());
    console.log('systemProgram:', SystemProgram.programId.toString());
    console.log('rent:', SYSVAR_RENT_PUBKEY.toString());
    console.log('tokenProgram:', TOKEN_PROGRAM_ID.toString());
    console.log('associatedTokenProgram:', ASSOCIATED_TOKEN_PROGRAM_ID.toString());

    const strategyAccounts: InitializeStrategyAccounts = {
      adminAuthority: owner,
      strategy,
      globalConfig: this._globalConfig,
      pool,
      tokenAMint: tokenMintA,
      tokenBMint: tokenMintB,
      tokenAVault: programAddresses.tokenAVault,
      tokenBVault: programAddresses.tokenBVault,
      baseVaultAuthority: programAddresses.baseVaultAuthority,
      sharesMint: programAddresses.sharesMint,
      sharesMintAuthority: programAddresses.sharesMintAuthority,
      scopePriceId: config.scopePriceId,
      scopeProgramId: config.scopeProgramId,
      tokenInfos: config.tokenInfos,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    return initializeStrategy(strategyArgs, strategyAccounts);
  }

  /**
   * Find program adresses required for kamino strategy creation
   * @param strategy
   * @param tokenMintA
   * @param tokenMintB
   * @private
   * @returns object with program addresses for kamino strategy creation
   */
  private async getStrategyProgramAddresses(
    strategy: PublicKey,
    tokenMintA: PublicKey,
    tokenMintB: PublicKey
  ): Promise<StrategyProgramAddress> {
    const [tokenAVault, tokenABump] = await PublicKey.findProgramAddress(
      [Buffer.from('svault_a'), strategy.toBuffer()],
      this.getProgramID()
    );
    const [tokenBVault, tokenBBump] = await PublicKey.findProgramAddress(
      [Buffer.from('svault_b'), strategy.toBuffer()],
      this.getProgramID()
    );
    const [baseVaultAuthority, baseVaultAuthorityBump] = await PublicKey.findProgramAddress(
      [Buffer.from('authority'), tokenAVault.toBuffer(), tokenBVault.toBuffer()],
      this.getProgramID()
    );
    const [sharesMint, sharesMintBump] = await PublicKey.findProgramAddress(
      [Buffer.from('shares'), strategy.toBuffer(), tokenMintA.toBuffer(), tokenMintB.toBuffer()],
      this.getProgramID()
    );
    const [sharesMintAuthority, sharesMintAuthorityBump] = await PublicKey.findProgramAddress(
      [Buffer.from('authority'), sharesMint.toBuffer()],
      this.getProgramID()
    );

    console.log('!!! tokenAVault', tokenAVault.toString());
    console.log('!!! tokenBVault', tokenBVault.toString());
    console.log('baseVaultAuthority', baseVaultAuthority.toString());
    console.log('strategy', strategy.toString());
    // console.log
    return {
      sharesMintAuthority,
      tokenAVault,
      tokenBVault,
      baseVaultAuthority,
      baseVaultAuthorityBump,
      sharesMintAuthorityBump,
      sharesMintBump,
      tokenBBump,
      sharesMint,
      tokenABump,
    };
  }

  /**
   * Get transaction instruction to create a new rent exempt strategy account
   * @param payer transaction payer (signer) public key
   * @param newStrategy public key of the new strategy
   * @returns transaction instruction to create the account
   */
  async createStrategyAccount(payer: PublicKey, newStrategy: PublicKey) {
    const accountSize = this._kaminoProgram.account.whirlpoolStrategy.size;
    return this.createAccountRentExempt(payer, newStrategy, accountSize);
  }

  async createAccountRentExempt(payer: PublicKey, newAccountPubkey: PublicKey, size: number) {
    const lamports = await this._connection.getMinimumBalanceForRentExemption(size);
    return SystemProgram.createAccount({
      programId: this.getProgramID(),
      fromPubkey: payer,
      newAccountPubkey,
      space: size,
      lamports,
    });
  }

  /**
   * Get transaction instruction to collect strategy fees from the treasury fee
   * vaults and rewards from the reward vaults.
   * @param strategy strategy public key or already fetched object
   * @returns transaction instruction to collect strategy fees and rewards
   */
  async collectFeesAndRewards(strategy: PublicKey | StrategyWithAddress) {
    const { address: strategyPubkey, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority } =
      await this.getTreasuryFeeVaultPDAs(strategyState.tokenAMint, strategyState.tokenBMint);

    let programId = WHIRLPOOL_PROGRAM_ID;
    let poolTokenVaultA = PublicKey.default;
    let poolTokenVaultB = PublicKey.default;
    let poolRewardVault0 = PublicKey.default;
    let poolRewardVault1 = PublicKey.default;
    let poolRewardVault2 = PublicKey.default;
    if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
      const whirlpool = await Whirlpool.fetch(this._connection, strategyState.pool);
      if (!whirlpool) {
        throw Error(`Could not fetch whirlpool state with pubkey ${strategyState.pool.toString()}`);
      }

      poolTokenVaultA = whirlpool.tokenVaultA;
      poolTokenVaultB = whirlpool.tokenVaultB;
      poolRewardVault0 = whirlpool.rewardInfos[0].vault;
      poolRewardVault1 = whirlpool.rewardInfos[1].vault;
      poolRewardVault2 = whirlpool.rewardInfos[2].vault;
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      programId = RAYDIUM_PROGRAM_ID;

      const poolState = await PoolState.fetch(this._connection, strategyState.pool);
      if (!poolState) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${strategyState.pool.toString()}`);
      }
      poolTokenVaultA = poolState.tokenVault0;
      poolTokenVaultB = poolState.tokenVault1;
      poolRewardVault0 = poolState.rewardInfos[0].tokenVault;
      poolRewardVault1 = poolState.rewardInfos[1].tokenVault;
      poolRewardVault2 = poolState.rewardInfos[2].tokenVault;
    }

    const accounts: CollectFeesAndRewardsAccounts = {
      user: strategyState.adminAuthority,
      strategy: strategyPubkey,
      globalConfig: strategyState.globalConfig,
      pool: strategyState.pool,
      position: strategyState.position,
      positionTokenAccount: strategyState.positionTokenAccount,
      treasuryFeeTokenAVault,
      treasuryFeeTokenBVault,
      treasuryFeeVaultAuthority,
      tokenAMint: strategyState.tokenAMint,
      tokenBMint: strategyState.tokenBMint,
      tokenAVault: strategyState.tokenAVault,
      tokenBVault: strategyState.tokenBVault,
      poolTokenVaultA: strategyState.poolTokenVaultA,
      poolTokenVaultB: strategyState.poolTokenVaultB,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      reward0Vault: strategyState.reward0Vault,
      reward1Vault: strategyState.reward1Vault,
      reward2Vault: strategyState.reward2Vault,
      poolRewardVault0:
        strategyState.reward0Decimals.toNumber() > 0 ? poolRewardVault0 : strategyState.baseVaultAuthority,
      poolRewardVault1:
        strategyState.reward1Decimals.toNumber() > 0 ? poolRewardVault1 : strategyState.baseVaultAuthority,
      poolRewardVault2:
        strategyState.reward2Decimals.toNumber() > 0 ? poolRewardVault2 : strategyState.baseVaultAuthority,
      tickArrayLower: strategyState.tickArrayLower,
      tickArrayUpper: strategyState.tickArrayUpper,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.raydiumProtocolPositionOrBaseVaultAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      poolProgram: programId,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    return collectFeesAndRewards(accounts);
  }

  /**
   * Get orca position metadata program addresses
   * @param positionMint mint account of the position
   */
  async getMetadataProgramAddressesOrca(positionMint: PublicKey) {
    const [position, positionBump] = await PublicKey.findProgramAddress(
      [Buffer.from('position'), positionMint.toBuffer()],
      WHIRLPOOL_PROGRAM_ID
    );

    const [positionMetadata, positionMetadataBump] = await PublicKey.findProgramAddress(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), positionMint.toBuffer()],
      METADATA_PROGRAM_ID
    );

    return {
      position,
      positionBump,
      positionMetadata,
      positionMetadataBump,
    };
  }

  async getMetadataProgramAddressesRaydium(
    positionMint: PublicKey,
    pool: PublicKey,
    tickLowerIndex: number,
    tickUpperIndex: number
  ) {
    const [protocolPosition, _protocolPositionBump] = await PublicKey.findProgramAddress(
      [Buffer.from('position'), pool.toBuffer(), i32ToBytes(tickLowerIndex), i32ToBytes(tickUpperIndex)],
      RAYDIUM_PROGRAM_ID
    );

    const [position, positionBump] = await PublicKey.findProgramAddress(
      [Buffer.from('position'), positionMint.toBuffer()],
      RAYDIUM_PROGRAM_ID
    );

    const [positionMetadata, positionMetadataBump] = await PublicKey.findProgramAddress(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), positionMint.toBuffer()],
      METADATA_PROGRAM_ID
    );

    return {
      position,
      positionBump,
      protocolPosition,
      positionMetadata,
      positionMetadataBump,
    };
  }

  private async getStartEndTicketIndexProgramAddressesOrca(
    whirlpool: PublicKey,
    whirlpoolState: Whirlpool,
    tickLowerIndex: number,
    tickUpperIndex: number
  ) {
    const startTickIndex = getStartTickIndex(tickLowerIndex, whirlpoolState.tickSpacing, 0);
    const endTickIndex = getStartTickIndex(tickUpperIndex, whirlpoolState.tickSpacing, 0);

    const [startTickIndexPubkey, startTickIndexBump] = await PublicKey.findProgramAddress(
      [Buffer.from('tick_array'), whirlpool.toBuffer(), Buffer.from(startTickIndex.toString())],
      WHIRLPOOL_PROGRAM_ID
    );
    const [endTickIndexPubkey, endTickIndexBump] = await PublicKey.findProgramAddress(
      [Buffer.from('tick_array'), whirlpool.toBuffer(), Buffer.from(endTickIndex.toString())],
      WHIRLPOOL_PROGRAM_ID
    );
    return {
      startTickIndex: startTickIndexPubkey,
      startTickIndexBump,
      endTickIndex: endTickIndexPubkey,
      endTickIndexBump,
    };
  }

  private async getStartEndTicketIndexProgramAddressesRaydium(
    pool: PublicKey,
    poolState: PoolState,
    tickLowerIndex: number,
    tickUpperIndex: number
  ) {
    const startTickIndex = getStartTickIndex(tickLowerIndex, poolState.tickSpacing, 0);
    const endTickIndex = getStartTickIndex(tickUpperIndex, poolState.tickSpacing, 0);

    const [startTickIndexPubkey, startTickIndexBump] = await PublicKey.findProgramAddress(
      [Buffer.from('tick_array'), pool.toBuffer(), i32ToBytes(startTickIndex)],
      RAYDIUM_PROGRAM_ID
    );
    const [endTickIndexPubkey, endTickIndexBump] = await PublicKey.findProgramAddress(
      [Buffer.from('tick_array'), pool.toBuffer(), i32ToBytes(endTickIndex)],
      RAYDIUM_PROGRAM_ID
    );
    return {
      startTickIndex: startTickIndexPubkey,
      startTickIndexBump,
      endTickIndex: endTickIndexPubkey,
      endTickIndexBump,
    };
  }

  /**
   * Get a transaction to open liquidity position for a Kamino strategy
   * @param strategy strategy you want to open liquidity position for
   * @param newPosition new liquidity position account pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   */
  async openPosition(
    strategy: PublicKey,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    status: StrategyStatusKind = new Uninitialized()
  ): Promise<TransactionInstruction> {
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    let tickSpacing = 0;
    if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
      return this.openPositionOrca(strategy, positionMint, priceLower, priceUpper, status);
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      return this.openPositionRaydium(strategy, positionMint, priceLower, priceUpper, status);
    } else {
      throw new Error(`Invalid dex ${strategyState.strategyDex.toString()}`);
    }
  }

  /**
   * Get a transaction to open liquidity position for a Kamino strategy
   * @param strategy strategy you want to open liquidity position for
   * @param positionMint new liquidity position account pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   */
  async openPositionOrca(
    strategy: PublicKey,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    status: StrategyStatusKind = new Uninitialized()
  ): Promise<TransactionInstruction> {
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    const whirlpool = await Whirlpool.fetch(this._connection, strategyState.pool);
    if (!whirlpool) {
      throw Error(`Could not fetch whirlpool state with pubkey ${strategyState.pool.toString()}`);
    }

    const isRebalancing = status.discriminator === Rebalancing.discriminator;

    const tickLowerIndex = getNearestValidTickIndexFromTickIndex(
      priceToTickIndex(
        priceLower,
        strategyState.tokenAMintDecimals.toNumber(),
        strategyState.tokenBMintDecimals.toNumber()
      ),
      whirlpool.tickSpacing
    );
    const tickUpperIndex = getNearestValidTickIndexFromTickIndex(
      priceToTickIndex(
        priceUpper,
        strategyState.tokenAMintDecimals.toNumber(),
        strategyState.tokenBMintDecimals.toNumber()
      ),
      whirlpool.tickSpacing
    );

    const { position, positionBump, positionMetadata } = await this.getMetadataProgramAddressesOrca(positionMint);

    const positionTokenAccount = await getAssociatedTokenAddress(positionMint, strategyState.baseVaultAuthority);

    const args: OpenLiquidityPositionArgs = {
      tickLowerIndex: new BN(tickLowerIndex),
      tickUpperIndex: new BN(tickUpperIndex),
      bump: positionBump,
    };

    const { startTickIndex, endTickIndex } = await this.getStartEndTicketIndexProgramAddressesOrca(
      strategyState.pool,
      whirlpool,
      tickLowerIndex,
      tickUpperIndex
    );

    const accounts: OpenLiquidityPositionAccounts = {
      adminAuthority: strategyState.adminAuthority,
      strategy,
      pool: strategyState.pool,
      tickArrayLower: startTickIndex,
      tickArrayUpper: endTickIndex,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      position,
      positionMint,
      positionMetadataAccount: positionMetadata,
      positionTokenAccount,
      rent: SYSVAR_RENT_PUBKEY,
      system: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_ID,
      metadataUpdateAuth: METADATA_UPDATE_AUTH,
      poolProgram: WHIRLPOOL_PROGRAM_ID,
      oldPositionOrBaseVaultAuthority: isRebalancing ? strategyState.position : strategyState.baseVaultAuthority,
      oldPositionMintOrBaseVaultAuthority: isRebalancing
        ? strategyState.positionMint
        : strategyState.baseVaultAuthority,
      oldPositionTokenAccountOrBaseVaultAuthority: isRebalancing
        ? strategyState.positionTokenAccount
        : strategyState.baseVaultAuthority,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.baseVaultAuthority,
      adminTokenAAtaOrBaseVaultAuthority: strategyState.baseVaultAuthority,
      adminTokenBAtaOrBaseVaultAuthority: strategyState.baseVaultAuthority,
      poolTokenVaultAOrBaseVaultAuthority: strategyState.baseVaultAuthority,
      poolTokenVaultBOrBaseVaultAuthority: strategyState.baseVaultAuthority,
    };

    return openLiquidityPosition(args, accounts);
  }

  /**
   * Get a transaction to open liquidity position for a Kamino strategy
   * @param strategy strategy you want to open liquidity position for
   * @param positionMint new liquidity position account pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   */
  async openPositionRaydium(
    strategy: PublicKey,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    status: StrategyStatusKind = new Uninitialized()
  ): Promise<TransactionInstruction> {
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    const poolState = await PoolState.fetch(this._connection, strategyState.pool);
    if (!poolState) {
      throw Error(`Could not fetch Raydium pool state with pubkey ${strategyState.pool.toString()}`);
    }

    const isRebalancing = status.discriminator === Rebalancing.discriminator;

    let tickLowerIndex = TickMath.getTickWithPriceAndTickspacing(
      priceLower,
      poolState.tickSpacing,
      strategyState.tokenAMintDecimals.toNumber(),
      strategyState.tokenBMintDecimals.toNumber()
    );

    let tickUpperIndex = TickMath.getTickWithPriceAndTickspacing(
      priceUpper,
      poolState.tickSpacing,
      strategyState.tokenAMintDecimals.toNumber(),
      strategyState.tokenBMintDecimals.toNumber()
    );

    const { position, positionBump, protocolPosition, positionMetadata, positionMetadataBump } =
      await this.getMetadataProgramAddressesRaydium(positionMint, strategyState.pool, tickLowerIndex, tickUpperIndex);

    const positionTokenAccount = await getAssociatedTokenAddress(positionMint, strategyState.baseVaultAuthority);

    const args: OpenLiquidityPositionArgs = {
      tickLowerIndex: new BN(tickLowerIndex),
      tickUpperIndex: new BN(tickUpperIndex),
      bump: positionBump,
    };

    const { startTickIndex, endTickIndex } = await this.getStartEndTicketIndexProgramAddressesRaydium(
      strategyState.pool,
      poolState,
      tickLowerIndex,
      tickUpperIndex
    );

    const accounts: OpenLiquidityPositionAccounts = {
      adminAuthority: strategyState.adminAuthority,
      strategy,
      pool: strategyState.pool,
      tickArrayLower: startTickIndex,
      tickArrayUpper: endTickIndex,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      position,
      positionMint,
      positionMetadataAccount: positionMetadata,
      positionTokenAccount,
      rent: SYSVAR_RENT_PUBKEY,
      system: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_ID,
      metadataUpdateAuth: METADATA_UPDATE_AUTH,
      poolProgram: RAYDIUM_PROGRAM_ID,
      oldPositionOrBaseVaultAuthority: isRebalancing ? strategyState.position : strategyState.baseVaultAuthority,
      oldPositionMintOrBaseVaultAuthority: isRebalancing
        ? strategyState.positionMint
        : strategyState.baseVaultAuthority,
      oldPositionTokenAccountOrBaseVaultAuthority: isRebalancing
        ? strategyState.positionTokenAccount
        : strategyState.baseVaultAuthority,
      raydiumProtocolPositionOrBaseVaultAuthority: protocolPosition,
      adminTokenAAtaOrBaseVaultAuthority: strategyState.tokenAVault,
      adminTokenBAtaOrBaseVaultAuthority: strategyState.tokenBVault,
      poolTokenVaultAOrBaseVaultAuthority: poolState.tokenVault0,
      poolTokenVaultBOrBaseVaultAuthority: poolState.tokenVault1,
    };

    return openLiquidityPosition(args, accounts);
  }

  /**
   * Get a transaction for executive withdrawal from a Kamino strategy.
   * @param strategy strategy pubkey or object
   * @param action withdrawal action
   * @returns transaction for executive withdrawal
   */
  async executiveWithdraw(strategy: PublicKey | StrategyWithAddress, action: ExecutiveWithdrawActionKind) {
    const { address: strategyPubkey, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const args: ExecutiveWithdrawArgs = {
      action: action.discriminator,
    };

    let programId = WHIRLPOOL_PROGRAM_ID;
    if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      programId = RAYDIUM_PROGRAM_ID;
    }

    const accounts: ExecutiveWithdrawAccounts = {
      adminAuthority: strategyState.adminAuthority,
      strategy: strategyPubkey,
      globalConfig: strategyState.globalConfig,
      pool: strategyState.pool,
      position: strategyState.position,
      positionTokenAccount: strategyState.positionTokenAccount,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      tickArrayLower: strategyState.tickArrayLower,
      tickArrayUpper: strategyState.tickArrayUpper,
      tokenAVault: strategyState.tokenAVault,
      tokenBVault: strategyState.tokenBVault,
      poolTokenVaultA: strategyState.poolTokenVaultA,
      poolTokenVaultB: strategyState.poolTokenVaultB,
      tokenAMint: strategyState.tokenAMint,
      tokenBMint: strategyState.tokenBMint,
      scopePrices: strategyState.scopePrices,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.raydiumProtocolPositionOrBaseVaultAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      poolProgram: programId,
    };

    return executiveWithdraw(args, accounts);
  }

  /**
   * Get a transaction to invest funds from the Kamino vaults and put them into the DEX pool as liquidity.
   * @param strategy strategy pubkey or object
   * @param payer transaction payer
   */
  async invest(strategy: PublicKey, payer: PublicKey) {
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    const globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${strategyState.globalConfig.toString()}`);
    }

    let programId = WHIRLPOOL_PROGRAM_ID;
    if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      programId = RAYDIUM_PROGRAM_ID;
    }

    const accounts: InvestAccounts = {
      position: strategyState.position,
      positionTokenAccount: strategyState.positionTokenAccount,
      pool: strategyState.pool,
      tokenAVault: strategyState.tokenAVault,
      tokenBVault: strategyState.tokenBVault,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      payer,
      strategy: strategy,
      globalConfig: strategyState.globalConfig,
      tokenProgram: TOKEN_PROGRAM_ID,
      poolTokenVaultA: strategyState.poolTokenVaultA,
      poolTokenVaultB: strategyState.poolTokenVaultB,
      tickArrayLower: strategyState.tickArrayLower,
      tickArrayUpper: strategyState.tickArrayUpper,
      scopePrices: globalConfig.scopePriceId,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.raydiumProtocolPositionOrBaseVaultAuthority,
      poolProgram: programId,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    return invest(accounts);
  }

  /**
   * Get a list of transactions to rebalance a Kamino strategy.
   * @param strategy strategy pubkey or object
   * @param newPosition new liquidity position account pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   * @param payer transaction payer pubkey
   * @returns list of transactions to rebalance (executive withdraw, collect fees/rewards, open new position, invest)
   */
  async rebalance(
    strategy: PublicKey,
    newPosition: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    payer: PublicKey
  ) {
    return [
      await this.executiveWithdraw(strategy, new Rebalance()),
      await this.collectFeesAndRewards(strategy),
      await this.openPosition(strategy, newPosition, priceLower, priceUpper, new Rebalancing()),
    ];
  }

  /**
   * Get a list of user's Kamino strategy positions
   * @param wallet user wallet address
   * @returns list of kamino strategy positions
   */
  async getUserPositions(wallet: PublicKey): Promise<KaminoPosition[]> {
    const userTokenAccounts = await this.getAllTokenAccounts(wallet);
    const positions: KaminoPosition[] = [];
    for (const tokenAccount of userTokenAccounts) {
      const accountData = tokenAccount.account.data as Data;
      const strategy = this._config.kamino.liveStrategies.find(
        (x) => x.shareMint.toString() === accountData.parsed.info.mint.toString()
      );
      if (strategy) {
        positions.push({
          shareMint: strategy.shareMint,
          strategy: strategy.address,
          sharesAmount: new Decimal(accountData.parsed.info.tokenAmount.uiAmountString),
        });
      }
    }
    return positions;
  }
}

export default Kamino;

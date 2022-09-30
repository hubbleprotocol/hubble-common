import {
  getCollateralMintByAddress,
  getConfigByCluster,
  HubbleConfig,
  SolanaCluster,
} from '@hubbleprotocol/hubble-config';
import {
  AccountInfo,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import { setKaminoProgramId } from './kamino-client/programId';
import { WhirlpoolStrategy } from './kamino-client/accounts';
import Decimal from 'decimal.js';
import { Position, Whirlpool } from './whirpools-client/accounts';
import { getMintDecimals } from '@project-serum/serum/lib/market';
import { Percentage, RemoveLiquidityQuote, RemoveLiquidityQuoteParam } from '@orca-so/whirlpool-sdk';
import { OrcaDAL } from '@orca-so/whirlpool-sdk/dist/dal/orca-dal';
import { OrcaPosition } from '@orca-so/whirlpool-sdk/dist/position/orca-position';
import { PROGRAM_ID_CLI as WHIRLPOOL_PROGRAM_ID } from './whirpools-client/programId';
import { Holdings, ShareData, StrategyBalances, StrategyVaultBalances, TreasuryFeeVault } from './models';
import { Data } from './models';
import { StrategyHolder } from './models/StrategyHolder';
import { Scope, SupportedToken } from '@hubbleprotocol/scope-sdk';
import { KaminoToken } from './models/KaminoToken';
import { PriceData } from './models/PriceData';
import { batchFetch } from './utils';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { withdraw, WithdrawAccounts, WithdrawArgs } from './kamino-client/instructions';
import BN from 'bn.js';
import {
  createAddExtraComputeUnitsTransaction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressAndData,
} from './utils/tokenUtils';
import { StrategyWithAddress } from './models/StrategyWithAddress';

export class Kamino {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  readonly _config: HubbleConfig;
  private readonly _scope: Scope;

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
  ];

  /**
   * Create a new instance of the Kamino SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   */
  constructor(cluster: SolanaCluster, connection: Connection) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
    this._scope = new Scope(cluster, connection);
    setKaminoProgramId(this._config.kamino.programId);
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
    return WhirlpoolStrategy.fetch(this._connection, address);
  }

  /**
   * Get the strategy share data (price + balances) of the specified Kamino whirlpool strategy
   * @param strategy
   */
  async getStrategyShareData(strategy: PublicKey | StrategyWithAddress): Promise<ShareData> {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const sharesFactor = Decimal.pow(10, strategyState.strategy.sharesMintDecimals.toNumber());
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
    const sharesFactor = Decimal.pow(10, strategyState.strategy.sharesMintDecimals.toNumber());
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
    const whirlpool = await Whirlpool.fetch(this._connection, strategy.whirlpool);
    const position = await Position.fetch(this._connection, strategy.position);

    if (!position) {
      throw new Error(`Position ${strategy.position.toString()} could not be found.`);
    }
    if (!whirlpool) {
      throw new Error(`Whirlpool ${strategy.whirlpool.toString()} could not be found.`);
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
    const aAvailable = new Decimal(strategy.tokenAAmounts.toNumber());
    const bAvailable = new Decimal(strategy.tokenBAmounts.toNumber());
    const aInvested = new Decimal(removeLiquidityQuote.estTokenA.toNumber());
    const bInvested = new Decimal(removeLiquidityQuote.estTokenB.toNumber());

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
    tokens.push(collateralMintA.scopeToken as SupportedToken);
    tokens.push(collateralMintB.scopeToken as SupportedToken);

    const prices = await this._scope.getPrices([...new Set(tokens)]);
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
    const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    return this._connection.getParsedProgramAccounts(tokenProgram, {
      filters: [{ dataSize: 165 }, { memcmp: { offset: 0, bytes: shareMint.toBase58() } }],
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

  getWhirlpools(whirlpools: PublicKey[]) {
    return batchFetch(whirlpools, (chunk) => Whirlpool.fetchMultiple(this._connection, chunk));
  }

  getTokenName(collateralId: number) {
    const tokenName = this._tokenMap.find((x) => x.id === collateralId);
    if (!tokenName) {
      throw Error(`Token with collateral ID ${collateralId} does not exist.`);
    }
    return tokenName.name;
  }

  /**
   * Withdraw shares from a strategy for a specific wallet and get back token A and token B
   * @param strategy strategy public key
   * @param sharesAmount amount of shares (decimal representation), NOT in lamports
   * @param wallet wallet keypair that will pay for the tx and has shares
   * @returns transaction hash
   */
  async withdrawShares(strategy: PublicKey | StrategyWithAddress, sharesAmount: Decimal, wallet: Keypair) {
    if (sharesAmount.lessThanOrEqualTo(0)) {
      throw Error('Shares amount cant be lower than or equal to 0.');
    }
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);

    const whirlpoolState = await Whirlpool.fetch(this._connection, strategyState.strategy.whirlpool);
    if (!whirlpoolState) {
      throw Error(`Could not fetch whirlpool state with pubkey ${strategyState.strategy.whirlpool.toString()}`);
    }
    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority } =
      await this.getTreasuryFeeVaultPDAs(strategyState.strategy.tokenAMint, strategyState.strategy.tokenBMint);

    const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(
      this._connection,
      strategyState.strategy.sharesMint,
      wallet.publicKey
    );
    if (!sharesMintData) {
      throw Error(
        `Cannot withdraw from strategy (${strategy.toString()}) because strategy hasn't been initialized yet (no shares deposited).
        Shares associated token address (${sharesAta}) does not exist.
        Please deposit some shares into the strategy first.`
      );
    }
    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(
      this._connection,
      strategyState.strategy.tokenAMint,
      wallet.publicKey
    );
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(
      this._connection,
      strategyState.strategy.tokenBMint,
      wallet.publicKey
    );

    const sharesAmountInLamports = sharesAmount.mul(
      new Decimal(10).pow(strategyState.strategy.sharesMintDecimals.toString())
    );

    const args: WithdrawArgs = { sharesAmount: new BN(sharesAmountInLamports.toNumber()) };
    const accounts: WithdrawAccounts = {
      user: wallet.publicKey,
      strategy: strategyState.address,
      globalConfig: strategyState.strategy.globalConfig,
      whirlpool: strategyState.strategy.whirlpool,
      position: strategyState.strategy.position,
      tickArrayLower: strategyState.strategy.tickArrayLower,
      tickArrayUpper: strategyState.strategy.tickArrayUpper,
      tokenAVault: strategyState.strategy.tokenAVault,
      tokenBVault: strategyState.strategy.tokenBVault,
      baseVaultAuthority: strategyState.strategy.baseVaultAuthority,
      whirlpoolTokenVaultA: whirlpoolState.tokenVaultA,
      whirlpoolTokenVaultB: whirlpoolState.tokenVaultB,
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
      whirlpoolProgram: WHIRLPOOL_PROGRAM_ID,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    let tx = new Transaction();
    const increaseBudgetIx = createAddExtraComputeUnitsTransaction(wallet.publicKey, 400000);
    tx.add(increaseBudgetIx);
    tx = await this.addShareAtasToTransaction(
      tx,
      wallet,
      strategyState,
      tokenAData,
      tokenAAta,
      tokenBData,
      tokenBAta,
      sharesMintData,
      sharesAta
    );
    const withdrawIx = withdraw(args, accounts);
    tx.add(withdrawIx);

    const { blockhash, lastValidBlockHeight } = await this._connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    tx.lastValidBlockHeight = lastValidBlockHeight;

    return await sendAndConfirmTransaction(this._connection, tx, [wallet], {
      commitment: 'confirmed',
    });
  }

  /**
   * Add associated token accounts to the share transaction (token A, B and share)
   */
  private async addShareAtasToTransaction(
    tx: Transaction,
    wallet: Keypair,
    strategyState: StrategyWithAddress,
    tokenAData: AccountInfo<Buffer> | null,
    tokenAAta: PublicKey,
    tokenBData: AccountInfo<Buffer> | null,
    tokenBAta: PublicKey,
    sharesMintData: AccountInfo<Buffer> | null,
    sharesAta: PublicKey
  ) {
    if (!tokenAData) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          tokenAAta,
          wallet.publicKey,
          strategyState.strategy.tokenAMint
        )
      );
    }
    if (!tokenBData) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          tokenBAta,
          wallet.publicKey,
          strategyState.strategy.tokenBMint
        )
      );
    }
    if (!sharesMintData) {
      tx.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          sharesAta,
          wallet.publicKey,
          strategyState.strategy.sharesMint
        )
      );
    }
    return tx;
  }

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

  private async getTreasuryFeeVaultPDAs(tokenAMint: PublicKey, tokenBMint: PublicKey): Promise<TreasuryFeeVault> {
    const [treasuryFeeTokenAVault, _treasuryFeeTokenAVaultBump] = await PublicKey.findProgramAddress(
      [Buffer.from('treasury_fee_vault'), tokenAMint.toBuffer()],
      this._config.kamino.programId
    );
    const [treasuryFeeTokenBVault, _treasuryFeeTokenBVaultBump] = await PublicKey.findProgramAddress(
      [Buffer.from('treasury_fee_vault'), tokenBMint.toBuffer()],
      this._config.kamino.programId
    );
    const [treasuryFeeVaultAuthority, _treasuryFeeVaultAuthorityBump] = await PublicKey.findProgramAddress(
      [Buffer.from('treasury_fee_vault_authority')],
      this._config.kamino.programId
    );
    return { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority };
  }

  /**
   * Withdraw all strategy shares from a specific wallet into token A and B
   * @param strategy public key of the strategy
   * @param wallet keypair of the wallet (tx payer)
   * @returns transaction hash or null if no shares are present in the wallet
   */
  async withdrawAllShares(strategy: PublicKey | StrategyWithAddress, wallet: Keypair) {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const [sharesAta] = await getAssociatedTokenAddressAndData(
      this._connection,
      strategyState.strategy.sharesMint,
      wallet.publicKey
    );
    const balance = await this.getTokenAccountBalance(sharesAta);
    if (balance.isZero()) {
      return null;
    }
    return this.withdrawShares(strategyState, balance, wallet);
  }
}

export default Kamino;

import { PublicKey } from '@solana/web3.js';
import { PythConfig } from './PythConfig';
import { VaultConfig } from './VaultConfig';
import { SerumMarketsConfig } from './SerumMarketsConfig';
import { SaberConfig } from './SaberConfig';

export type BorrowingConfig = {
  programId: PublicKey;
  accounts: {
    stablecoinMint: PublicKey;
    stablecoinMintAuthority: PublicKey;
    mint: {
      ETH: PublicKey;
      BTC: PublicKey;
      SRM: PublicKey;
      RAY: PublicKey;
      FTT: PublicKey;
      HBB: PublicKey;
      LDO: PublicKey;
      ORCA: PublicKey;
      WSOL: PublicKey | undefined;
      MSOL: PublicKey | undefined;
    };
    collateralVault: {
      SOL: VaultConfig | PublicKey;
      ETH: VaultConfig | PublicKey;
      BTC: VaultConfig | PublicKey;
      SRM: VaultConfig | PublicKey;
      RAY: VaultConfig | PublicKey;
      FTT: VaultConfig | PublicKey;
      MSOL: VaultConfig | PublicKey | undefined;
    };
    borrowingVaultsV2: PublicKey;
    borrowingMarketStates: PublicKey[];
    borrowingMarketState: PublicKey;
    stabilityPoolState: PublicKey;
    epochToScaleToSum: PublicKey;
    stablecoinStabilityPoolVault: PublicKey;
    stabilityVaults: PublicKey;
    stablecoinStabilityPoolVaultAuthority: PublicKey;
    liquidationRewardsVaultSol: PublicKey;
    liquidationRewardsVaultSrm: PublicKey;
    liquidationRewardsVaultEth: PublicKey;
    liquidationRewardsVaultBtc: PublicKey;
    liquidationRewardsVaultRay: PublicKey;
    liquidationsQueue: PublicKey;
    redemptionCandidatesQueue: PublicKey | undefined;
    USDC: PublicKey | undefined;

    liquidationRewardsVaultFtt: PublicKey;
    borrowingVaults: PublicKey;
    stakingPoolState: PublicKey;
    borrowingFeesAccount: PublicKey;

    redemptionsQueue: PublicKey | undefined;
    liquidationRewardsVaultMsol: PublicKey | undefined;
    liquidationRewardsVaultAuthority: PublicKey | undefined;
    globalConfig: PublicKey | undefined;
    oracleMappings: PublicKey | undefined;
    borrowingFeesVaultAuthority: PublicKey | undefined;
    stakingVault: PublicKey | undefined;
    treasuryVault: PublicKey | undefined;
    burningVault: PublicKey | undefined;
    burningVaultAuthority: PublicKey | undefined;

    hbbMintAuthority: PublicKey | undefined;
    collateralVaultsAuthority: PublicKey | undefined;

    pyth: PythConfig | undefined;
    serumMarkets: SerumMarketsConfig | undefined;
    saber: SaberConfig;
  };
};

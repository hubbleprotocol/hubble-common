import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection, PublicKey } from '@solana/web3.js';
import StakingPoolState from './models/StakingPoolState';
import StabilityPoolState from './models/StabilityPoolState';
import BorrowingMarketState from './models/BorrowingMarketState';
import { AnchorProvider, Idl, Program, Provider } from '@project-serum/anchor';
import { BORROWING_IDL } from '@hubbleprotocol/hubble-idl';
import {
  calculatePendingGains,
  calculateStabilityProvided,
  calculateTotalCollateral,
  calculateTotalDebt,
  getReadOnlyWallet,
  replaceBigNumberWithDecimal,
} from './utils';
import UserStakingState from './models/UserStakingState';
import StabilityProviderState from './models/StabilityProviderState';
import UserMetadata from './models/UserMetadata';
import Loan from './models/Loan';
import { DECIMAL_FACTOR, HBB_DECIMALS, STABLECOIN_DECIMALS, STREAMFLOW_HBB_CONTRACT } from './constants';
import Decimal from 'decimal.js';
import UserMetadataWithJson from './models/UserMetadataWithJson';
import Stream, { Cluster } from '@streamflow/stream';
import StabilityProviderStateWithJson from './models/StabilityProviderStateWithJson';
import { HbbVault, PsmReserve, UsdhVault } from './models';
import GlobalConfig from './models/GlobalConfig';
import { SwapInfo } from './models/SwapInfo';

export class Hubble {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  private readonly _config: HubbleConfig;
  private readonly _provider: Provider;
  private _borrowingProgram: Program;

  /**
   * Create a new instance of the Hubble SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   */
  constructor(cluster: SolanaCluster, connection: Connection) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
    this._provider = new AnchorProvider(connection, getReadOnlyWallet(), {
      commitment: connection.commitment,
    });
    const newIdl = `{
"version": "0.1.0",
"name": "borrowing",
"instructions": [
{
"name": "initializeBorrowingMarket",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": true,
"isSigner": true
},
{
"name": "oracleMappings",
"isMut": true,
"isSigner": true
},
{
"name": "stablecoinMint",
"isMut": true,
"isSigner": false
},
{
"name": "hbbMint",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
},
{
"name": "clock",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "createAdditionalBorrowingMarket",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "additionalBorrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "originalBorrowingMarketState",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "updateMarketLinkage",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "updateMarketOwner",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "newOwner",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "initializeCollateralVaultsNew",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingFeesVault",
"isMut": true,
"isSigner": false
},
{
"name": "burningVault",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinStabilityPoolVault",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "addNewVault",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": true,
"isSigner": false
},
{
"name": "newVault",
"isMut": true,
"isSigner": false
},
{
"name": "newMint",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "mintId",
"type": "u8"
},
{
"name": "setVaultToPda",
"type": "bool"
},
{
"name": "vaultIsForLiquidationRewards",
"type": "bool"
}
]
},
{
"name": "updateGlobalConfig",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": true,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "key",
"type": "u16"
},
{
"name": "value",
"type": {
"array": [
"u8",
32
]
}
}
]
},
{
"name": "modifySupportedCollaterals",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
}
],
"args": [
{
"name": "action",
"type": "u8"
},
{
"name": "tokenId",
"type": "u8"
}
]
},
{
"name": "updateMarketTokenDepositCap",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
}
],
"args": [
{
"name": "collateral",
"type": "u8"
},
{
"name": "capInLamports",
"type": "u64"
}
]
},
{
"name": "updateOracleMapping",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": true,
"isSigner": false
},
{
"name": "pythProductInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythPriceInfo",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "collateral",
"type": "u8"
}
]
},
{
"name": "updateScopeMapping",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": true,
"isSigner": false
},
{
"name": "scopePricesAccount",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "approveTrove",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinAta",
"isMut": true,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "depositCollateral",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": false
},
{
"name": "collateralFrom",
"isMut": true,
"isSigner": false
},
{
"name": "collateralTo",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amountInLamports",
"type": "u64"
},
{
"name": "collateral",
"type": "u8"
}
]
},
{
"name": "borrowStablecoin",
"accounts": [
{
"name": "owner",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMint",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "stablecoinBorrowingAssociatedAccount",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingFeesVault",
"isMut": true,
"isSigner": false
},
{
"name": "treasuryVault",
"isMut": true,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": false,
"isSigner": false
},
{
"name": "pythSolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythEthPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythBtcPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythSrmPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythRayPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythFttPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythMsolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "scopePrices",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "depositCollateralAndBorrowStablecoin",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMint",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "collateralFrom",
"isMut": true,
"isSigner": false
},
{
"name": "collateralTo",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinBorrowingAssociatedAccount",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingFeesVault",
"isMut": true,
"isSigner": false
},
{
"name": "treasuryVault",
"isMut": true,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": false,
"isSigner": false
},
{
"name": "pythSolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythEthPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythBtcPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythSrmPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythRayPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythFttPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythMsolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "scopePrices",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "depositAmount",
"type": "u64"
},
{
"name": "depositAsset",
"type": "u8"
},
{
"name": "borrowAmount",
"type": "u64"
}
]
},
{
"name": "repayLoan",
"accounts": [
{
"name": "owner",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMint",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "stablecoinBorrowingAssociatedAccount",
"isMut": true,
"isSigner": false
},
{
"name": "burningVault",
"isMut": true,
"isSigner": false
},
{
"name": "burningVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "withdrawCollateral",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": false
},
{
"name": "collateralFrom",
"isMut": true,
"isSigner": false
},
{
"name": "collateralVaultsAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "collateralTo",
"isMut": true,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": false,
"isSigner": false
},
{
"name": "pythSolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythEthPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythBtcPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythSrmPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythRayPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythFttPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythMsolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "scopePrices",
"isMut": false,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
},
{
"name": "collateral",
"type": "u8"
}
]
},
{
"name": "stabilityInitialize",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": true
},
{
"name": "epochToScaleToSum",
"isMut": true,
"isSigner": false
},
{
"name": "liquidationsQueue",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
},
{
"name": "clock",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "stabilityApprove",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "stabilityProviderState",
"isMut": true,
"isSigner": true
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "stabilityProvide",
"accounts": [
{
"name": "owner",
"isMut": false,
"isSigner": true
},
{
"name": "stabilityProviderState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": true,
"isSigner": false
},
{
"name": "epochToScaleToSum",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinStabilityPoolVault",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinAta",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "clock",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "stabilityWithdraw",
"accounts": [
{
"name": "owner",
"isMut": false,
"isSigner": true
},
{
"name": "stabilityProviderState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "epochToScaleToSum",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinStabilityPoolVault",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinStabilityPoolVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "stablecoinAta",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "clock",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "tryLiquidate",
"accounts": [
{
"name": "liquidator",
"isMut": true,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": false
},
{
"name": "epochToScaleToSum",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "liquidationsQueue",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMint",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "stablecoinStabilityPoolVault",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinStabilityPoolVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": false,
"isSigner": false
},
{
"name": "pythSolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythEthPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythBtcPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythSrmPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythRayPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythFttPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythMsolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "scopePrices",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "clock",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "tryLiquidateCashBased",
"accounts": [
{
"name": "liquidator",
"isMut": true,
"isSigner": true
},
{
"name": "liquidatorUsdhAta",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": false
},
{
"name": "epochToScaleToSum",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "liquidationsQueue",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMint",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "stablecoinStabilityPoolVault",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinStabilityPoolVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": false,
"isSigner": false
},
{
"name": "pythSolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythEthPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythBtcPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythSrmPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythRayPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythFttPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythMsolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "scopePrices",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "debtToRepay",
"type": "u64"
}
]
},
{
"name": "harvestLiquidationGains",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "stabilityProviderState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "liquidationsQueue",
"isMut": true,
"isSigner": false
},
{
"name": "epochToScaleToSum",
"isMut": true,
"isSigner": false
},
{
"name": "liquidationRewardsVault",
"isMut": true,
"isSigner": false
},
{
"name": "liquidationRewardsVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "liquidationRewardsTo",
"isMut": true,
"isSigner": false
},
{
"name": "hbbMint",
"isMut": true,
"isSigner": false
},
{
"name": "hbbMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "hbbAta",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "clock",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "token",
"type": "u8"
}
]
},
{
"name": "clearLiquidationGains",
"accounts": [
{
"name": "clearingAgent",
"isMut": true,
"isSigner": true
},
{
"name": "clearingAgentAta",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "liquidationsQueue",
"isMut": true,
"isSigner": false
},
{
"name": "collateralVault",
"isMut": true,
"isSigner": false
},
{
"name": "collateralVaultsAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "liquidationRewardsVault",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "clock",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "token",
"type": "u8"
}
]
},
{
"name": "stakingInitialize",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": true,
"isSigner": true
},
{
"name": "stakingVault",
"isMut": true,
"isSigner": false
},
{
"name": "treasuryVault",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "stakingApprove",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "userStakingState",
"isMut": true,
"isSigner": true
},
{
"name": "stakingPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "stakingStakeHbb",
"accounts": [
{
"name": "owner",
"isMut": false,
"isSigner": true
},
{
"name": "userStakingState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "stakingVault",
"isMut": true,
"isSigner": false
},
{
"name": "userHbbStakingAta",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "withdrawFromTreasury",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "stablecoinMint",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "treasuryVault",
"isMut": false,
"isSigner": false
},
{
"name": "treasuryVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "toAccount",
"isMut": true,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "resetPlaceholders",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": true,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": true,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": true,
"isSigner": false
}
],
"args": []
},
{
"name": "stakingHarvestReward",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "userStakingState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "userStablecoinRewardsAta",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingFeesVault",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingFeesVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "unstakeHbb",
"accounts": [
{
"name": "owner",
"isMut": false,
"isSigner": true
},
{
"name": "userStakingState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "userHbbStakingAta",
"isMut": true,
"isSigner": false
},
{
"name": "userStablecoinRewardsAta",
"isMut": true,
"isSigner": false
},
{
"name": "stakingVault",
"isMut": true,
"isSigner": false
},
{
"name": "stakingVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingFeesVault",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingFeesVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "serumInitAccount",
"accounts": [
{
"name": "dexProgram",
"isMut": false,
"isSigner": false
},
{
"name": "openOrders",
"isMut": true,
"isSigner": false
},
{
"name": "orderPayerAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "market",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "serumSwapWithdrawCollateral",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": false
},
{
"name": "collateralFrom",
"isMut": true,
"isSigner": false
},
{
"name": "collateralFromAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "collateralTo",
"isMut": true,
"isSigner": false
},
{
"name": "pythSolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythEthPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythBtcPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythSrmPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythRayPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythFttPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "pythMsolPriceInfo",
"isMut": false,
"isSigner": false
},
{
"name": "oracleMappings",
"isMut": false,
"isSigner": false
},
{
"name": "market",
"isMut": true,
"isSigner": false
},
{
"name": "vaultSigner",
"isMut": false,
"isSigner": false
},
{
"name": "openOrders",
"isMut": true,
"isSigner": false
},
{
"name": "requestQueue",
"isMut": true,
"isSigner": false
},
{
"name": "eventQueue",
"isMut": true,
"isSigner": false
},
{
"name": "bids",
"isMut": true,
"isSigner": false
},
{
"name": "asks",
"isMut": true,
"isSigner": false
},
{
"name": "coinVault",
"isMut": true,
"isSigner": false
},
{
"name": "pcVault",
"isMut": true,
"isSigner": false
},
{
"name": "dexSwapAccount",
"isMut": true,
"isSigner": false
},
{
"name": "dexProgram",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
},
{
"name": "collateral",
"type": "u8"
}
]
},
{
"name": "serumCloseAccount",
"accounts": [
{
"name": "openOrders",
"isMut": true,
"isSigner": false
},
{
"name": "authority",
"isMut": false,
"isSigner": true
},
{
"name": "destination",
"isMut": true,
"isSigner": false
},
{
"name": "market",
"isMut": false,
"isSigner": false
},
{
"name": "dexProgram",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "delegateMarinadeDeposit",
"accounts": [
{
"name": "owner",
"isMut": true,
"isSigner": true
},
{
"name": "intermedAta",
"isMut": true,
"isSigner": false
},
{
"name": "mintTo",
"isMut": true,
"isSigner": false
},
{
"name": "userMetadata",
"isMut": true,
"isSigner": false
},
{
"name": "marinadeProgramId",
"isMut": false,
"isSigner": false
},
{
"name": "marinadeState",
"isMut": true,
"isSigner": false
},
{
"name": "stSolMint",
"isMut": true,
"isSigner": false
},
{
"name": "liqPoolSolLegPda",
"isMut": true,
"isSigner": false
},
{
"name": "liqPoolStSolLeg",
"isMut": true,
"isSigner": false
},
{
"name": "liqPoolStSolLegAuth",
"isMut": false,
"isSigner": false
},
{
"name": "reservePda",
"isMut": true,
"isSigner": false
},
{
"name": "stSolMintAuth",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "collateralVault",
"isMut": true,
"isSigner": false
},
{
"name": "collateralFromAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "nativeMint",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "delegateMarinadeEmergencyWithdraw",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "marinadeProgramId",
"isMut": false,
"isSigner": false
},
{
"name": "marinadeState",
"isMut": true,
"isSigner": false
},
{
"name": "stSolMint",
"isMut": true,
"isSigner": false
},
{
"name": "liqPoolSolLegPda",
"isMut": true,
"isSigner": false
},
{
"name": "liqPoolStSolLeg",
"isMut": true,
"isSigner": false
},
{
"name": "treasuryMsolAccount",
"isMut": true,
"isSigner": false
},
{
"name": "getMsolFrom",
"isMut": true,
"isSigner": false
},
{
"name": "getMsolFromAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "transferSolTo",
"isMut": true,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "airdropHbb",
"accounts": [
{
"name": "adminAuthority",
"isMut": true,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "userHbbAta",
"isMut": true,
"isSigner": false
},
{
"name": "hbbMint",
"isMut": true,
"isSigner": false
},
{
"name": "hbbMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "rent",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "airdropUsdh",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "stablecoinAta",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMint",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "psmInitialize",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "psmReserve",
"isMut": true,
"isSigner": false
},
{
"name": "otherStablecoinMint",
"isMut": false,
"isSigner": false
},
{
"name": "psmVault",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
},
{
"name": "systemProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "bump",
"type": "u8"
},
{
"name": "maxCapacity",
"type": "u64"
}
]
},
{
"name": "psmChangeMaxCapacity",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "psmReserve",
"isMut": true,
"isSigner": false
}
],
"args": [
{
"name": "maxCapacity",
"type": "u64"
}
]
},
{
"name": "psmChangeWithdrawalCap",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "psmReserve",
"isMut": true,
"isSigner": false
}
],
"args": [
{
"name": "maxCapacity",
"type": "u64"
},
{
"name": "interval",
"type": "u64"
},
{
"name": "changeStableCap",
"type": "bool"
},
{
"name": "resetAccums",
"type": "bool"
}
]
},
{
"name": "psmMint",
"accounts": [
{
"name": "owner",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "psmReserve",
"isMut": true,
"isSigner": false
},
{
"name": "psmVault",
"isMut": true,
"isSigner": false
},
{
"name": "usdhAta",
"isMut": true,
"isSigner": false
},
{
"name": "usdhMint",
"isMut": true,
"isSigner": false
},
{
"name": "usdhMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "otherStablecoinAta",
"isMut": true,
"isSigner": false
},
{
"name": "otherStablecoinMint",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "psmBurn",
"accounts": [
{
"name": "owner",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": false,
"isSigner": false
},
{
"name": "globalConfig",
"isMut": false,
"isSigner": false
},
{
"name": "psmReserve",
"isMut": true,
"isSigner": false
},
{
"name": "usdhAta",
"isMut": true,
"isSigner": false
},
{
"name": "usdhMint",
"isMut": true,
"isSigner": false
},
{
"name": "otherStablecoinAta",
"isMut": true,
"isSigner": false
},
{
"name": "otherStablecoinMint",
"isMut": false,
"isSigner": false
},
{
"name": "psmVault",
"isMut": true,
"isSigner": false
},
{
"name": "psmVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "burningVault",
"isMut": true,
"isSigner": false
},
{
"name": "burningVaultAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "amount",
"type": "u64"
}
]
},
{
"name": "dripStabilityFees",
"accounts": [
{
"name": "stabilityPoolProvider",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMint",
"isMut": true,
"isSigner": false
},
{
"name": "stablecoinMintAuthority",
"isMut": false,
"isSigner": false
},
{
"name": "stabilityFeesVault",
"isMut": true,
"isSigner": false
},
{
"name": "stabilityPoolState",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingVaults",
"isMut": false,
"isSigner": false
},
{
"name": "epochToScaleToSum",
"isMut": true,
"isSigner": false
},
{
"name": "stakingPoolState",
"isMut": false,
"isSigner": false
},
{
"name": "treasuryVault",
"isMut": true,
"isSigner": false
},
{
"name": "borrowingFeesVault",
"isMut": true,
"isSigner": false
},
{
"name": "tokenProgram",
"isMut": false,
"isSigner": false
}
],
"args": []
},
{
"name": "updateMarketConfig",
"accounts": [
{
"name": "adminAuthority",
"isMut": false,
"isSigner": true
},
{
"name": "borrowingMarketState",
"isMut": true,
"isSigner": false
},
{
"name": "clock",
"isMut": false,
"isSigner": false
}
],
"args": [
{
"name": "newValue",
"type": "u64"
},
{
"name": "updateMode",
"type": "u8"
}
]
}
],
"accounts": [
{
"name": "GlobalConfig",
"type": {
"kind": "struct",
"fields": [
{
"name": "version",
"type": "u8"
},
{
"name": "placeholder0",
"type": "publicKey"
},
{
"name": "userBorrowMin",
"type": "u64"
},
{
"name": "userBorrowMax",
"type": "u64"
},
{
"name": "userDebtMin",
"type": "u64"
},
{
"name": "userDebtMax",
"type": "u64"
},
{
"name": "placeholder1",
"type": "u64"
},
{
"name": "treasuryFeeRate",
"type": "u64"
},
{
"name": "protocolEpoch",
"type": "u64"
},
{
"name": "placeholder2",
"type": "u64"
},
{
"name": "oracleProgramId",
"type": "publicKey"
},
{
"name": "delegateCollateralAllowActiveOnly",
"type": "bool"
},
{
"name": "blockWithdrawCollateral",
"type": "bool"
},
{
"name": "blockTryLiquidate",
"type": "bool"
},
{
"name": "blockBorrow",
"type": "bool"
},
{
"name": "blockDepositAndBorrow",
"type": "bool"
},
{
"name": "blockClearLiquidationGains",
"type": "bool"
},
{
"name": "blockHarvestLiquidationGains",
"type": "bool"
},
{
"name": "blockWithdrawStability",
"type": "bool"
},
{
"name": "blockAirdropHbb",
"type": "bool"
},
{
"name": "blockPsmMint",
"type": "bool"
},
{
"name": "emergencyMode",
"type": "bool"
},
{
"name": "userDepositMax",
"type": "u64"
},
{
"name": "totalDepositMax",
"type": "u64"
},
{
"name": "issuancePerSecond",
"type": "u64"
},
{
"name": "blockPsmBurn",
"type": "bool"
},
{
"name": "blockDepositCollateral",
"type": "bool"
},
{
"name": "placeholder3",
"type": {
"array": [
"u8",
7
]
}
},
{
"name": "scopeProgramId",
"type": "publicKey"
},
{
"name": "padding1",
"type": {
"array": [
"u128",
29
]
}
},
{
"name": "padding2",
"type": {
"array": [
"u128",
31
]
}
},
{
"name": "padding3",
"type": {
"array": [
"u8",
15
]
}
}
]
}
},
{
"name": "BorrowingMarketState",
"type": {
"kind": "struct",
"fields": [
{
"name": "version",
"type": "u64"
},
{
"name": "adminAuthority",
"type": "publicKey"
},
{
"name": "initialMarketOwner",
"type": "publicKey"
},
{
"name": "placeholder1",
"type": "publicKey"
},
{
"name": "stablecoinMint",
"type": "publicKey"
},
{
"name": "stablecoinMintAuthority",
"type": "publicKey"
},
{
"name": "stablecoinMintSeed",
"type": "u64"
},
{
"name": "hbbMint",
"type": "publicKey"
},
{
"name": "hbbMintAuthority",
"type": "publicKey"
},
{
"name": "hbbMintSeed",
"type": "u64"
},
{
"name": "numUsers",
"type": "u64"
},
{
"name": "numActiveUsers",
"type": "u64"
},
{
"name": "stablecoinBorrowed",
"type": "u64"
},
{
"name": "depositedCollateral",
"type": {
"defined": "MarketCollateralAmounts"
}
},
{
"name": "reserved1",
"type": {
"array": [
"u64",
407
]
}
},
{
"name": "inactiveCollateral",
"type": {
"defined": "MarketCollateralAmounts"
}
},
{
"name": "reserved2",
"type": {
"array": [
"u64",
407
]
}
},
{
"name": "baseRateBps",
"type": "u64"
},
{
"name": "lastFeeEvent",
"type": "u64"
},
{
"name": "placeholder2",
"type": "u64"
},
{
"name": "totalStake",
"type": "u64"
},
{
"name": "collateralRewardPerToken",
"type": {
"defined": "TokenMap"
}
},
{
"name": "stablecoinRewardPerToken",
"type": "u128"
},
{
"name": "totalStakeSnapshot",
"type": "u64"
},
{
"name": "borrowedStablecoinSnapshot",
"type": "u64"
},
{
"name": "marketType",
"type": "u64"
},
{
"name": "marketMcr",
"type": "u64"
},
{
"name": "totalDebtMax",
"type": "u64"
},
{
"name": "globalConfig",
"type": "publicKey"
},
{
"name": "borrowingVaults",
"type": "publicKey"
},
{
"name": "oracleMappings",
"type": "publicKey"
},
{
"name": "stabilityPoolState",
"type": "publicKey"
},
{
"name": "stakingPoolState",
"type": "publicKey"
},
{
"name": "stabilityFeeBps",
"type": "u64"
},
{
"name": "stabilityFeeLastEventTimestamp",
"type": "u64"
},
{
"name": "stabilityFeeLastLoss",
"type": "u128"
},
{
"name": "stabilityFeeAccrued",
"type": "u64"
},
{
"name": "stabilityFeeTreasuryPct",
"type": "u16"
},
{
"name": "stabilityFeeStakingPct",
"type": "u16"
},
{
"name": "stabilityFeeStabilityPct",
"type": "u16"
},
{
"name": "placeholder3",
"type": "u16"
},
{
"name": "supportedCollaterals",
"type": {
"array": [
{
"defined": "SupportedCollateral"
},
32
]
}
},
{
"name": "liquidationPenaltyPoolBased",
"type": "u64"
},
{
"name": "liquidationPenaltyCashBased",
"type": "u64"
},
{
"name": "minCashBasedLiquidationRepayment",
"type": "u64"
},
{
"name": "reserved",
"type": {
"array": [
"u64",
928
]
}
}
]
}
},
{
"name": "PsmReserve",
"type": {
"kind": "struct",
"fields": [
{
"name": "version",
"type": "u64"
},
{
"name": "bump",
"type": "u8"
},
{
"name": "borrowingMarketState",
"type": "publicKey"
},
{
"name": "depositedStablecoin",
"type": "u64"
},
{
"name": "maxCapacity",
"type": "u64"
},
{
"name": "mintedUsdh",
"type": "u64"
},
{
"name": "stablecoinMintDecimals",
"type": "u8"
},
{
"name": "stablecoinMint",
"type": "publicKey"
},
{
"name": "psmVault",
"type": "publicKey"
},
{
"name": "psmVaultAuthority",
"type": "publicKey"
},
{
"name": "psmVaultAuthoritySeed",
"type": "u64"
},
{
"name": "withdrawalCapUsdh",
"type": {
"defined": "WithdrawalCaps"
}
},
{
"name": "withdrawalCapStable",
"type": {
"defined": "WithdrawalCaps"
}
},
{
"name": "padding",
"type": {
"array": [
"u64",
24
]
}
}
]
}
},
{
"name": "BorrowingVaultsNew",
"type": {
"kind": "struct",
"fields": [
{
"name": "placeholder0",
"type": "publicKey"
},
{
"name": "stabilityPoolState",
"type": "publicKey"
},
{
"name": "burningVault",
"type": "publicKey"
},
{
"name": "burningVaultAuthority",
"type": "publicKey"
},
{
"name": "burningVaultSeed",
"type": "u64"
},
{
"name": "borrowingFeesVault",
"type": "publicKey"
},
{
"name": "borrowingFeesVaultAuthority",
"type": "publicKey"
},
{
"name": "borrowingFeesVaultSeed",
"type": "u64"
},
{
"name": "collateralVaults",
"type": {
"array": [
"publicKey",
500
]
}
},
{
"name": "collateralMints",
"type": {
"array": [
"publicKey",
500
]
}
},
{
"name": "liquidationRewardsVaults",
"type": {
"array": [
"publicKey",
32
]
}
},
{
"name": "liquidationRewardsMints",
"type": {
"array": [
"publicKey",
32
]
}
},
{
"name": "stablecoinStabilityPoolVault",
"type": "publicKey"
},
{
"name": "stablecoinStabilityPoolVaultAuthority",
"type": "publicKey"
},
{
"name": "stablecoinStabilityPoolVaultSeed",
"type": "u64"
},
{
"name": "liquidationRewardsVaultAuthority",
"type": "publicKey"
},
{
"name": "liquidationRewardsVaultSeed",
"type": "u64"
},
{
"name": "collateralVaultsAuthority",
"type": "publicKey"
},
{
"name": "collateralVaultsSeed",
"type": "u64"
},
{
"name": "placeholder1",
"type": "publicKey"
},
{
"name": "padding",
"type": {
"array": [
"u64",
496
]
}
}
]
}
},
{
"name": "OracleMappings",
"type": {
"kind": "struct",
"fields": [
{
"name": "placeholder0",
"type": "publicKey"
},
{
"name": "pythSolPriceInfo",
"type": "publicKey"
},
{
"name": "pythSrmPriceInfo",
"type": "publicKey"
},
{
"name": "pythEthPriceInfo",
"type": "publicKey"
},
{
"name": "pythBtcPriceInfo",
"type": "publicKey"
},
{
"name": "pythRayPriceInfo",
"type": "publicKey"
},
{
"name": "pythFttPriceInfo",
"type": "publicKey"
},
{
"name": "pythMsolPriceInfo",
"type": "publicKey"
},
{
"name": "scopePrices",
"type": "publicKey"
},
{
"name": "reserved",
"type": {
"array": [
"u64",
64
]
}
},
{
"name": "reserved2",
"type": {
"array": [
"u64",
32
]
}
},
{
"name": "reserved3",
"type": {
"array": [
"u64",
28
]
}
}
]
}
},
{
"name": "StabilityPoolState",
"type": {
"kind": "struct",
"fields": [
{
"name": "placeholder0",
"type": "publicKey"
},
{
"name": "epochToScaleToSum",
"type": "publicKey"
},
{
"name": "liquidationsQueue",
"type": "publicKey"
},
{
"name": "version",
"type": "u8"
},
{
"name": "numUsers",
"type": "u64"
},
{
"name": "totalUsersProvidingStability",
"type": "u64"
},
{
"name": "stablecoinDeposited",
"type": "u64"
},
{
"name": "placeholder1",
"type": "u64"
},
{
"name": "cumulativeGainsTotal",
"type": {
"defined": "StabilityTokenMap"
}
},
{
"name": "pendingCollateralGains",
"type": {
"defined": "StabilityTokenMap"
}
},
{
"name": "currentEpoch",
"type": "u64"
},
{
"name": "currentScale",
"type": "u64"
},
{
"name": "p",
"type": "u128"
},
{
"name": "lastStablecoinLossErrorOffset",
"type": "u64"
},
{
"name": "lastCollLossErrorOffset",
"type": {
"defined": "StabilityCollateralAmounts"
}
},
{
"name": "lastIssuanceTimestamp",
"type": "u64"
},
{
"name": "padding",
"type": {
"array": [
"u64",
9
]
}
}
]
}
},
{
"name": "UserMetadata",
"type": {
"kind": "struct",
"fields": [
{
"name": "version",
"type": "u8"
},
{
"name": "status",
"type": "u8"
},
{
"name": "userId",
"type": "u64"
},
{
"name": "metadataPk",
"type": "publicKey"
},
{
"name": "owner",
"type": "publicKey"
},
{
"name": "borrowingMarketState",
"type": "publicKey"
},
{
"name": "padding1",
"type": {
"array": [
"u64",
4
]
}
},
{
"name": "inactiveCollateral",
"type": {
"defined": "UserCollateralAmounts"
}
},
{
"name": "depositedCollateral",
"type": {
"defined": "UserCollateralAmounts"
}
},
{
"name": "borrowedStablecoin",
"type": "u64"
},
{
"name": "userStake",
"type": "u64"
},
{
"name": "userCollateralRewardPerToken",
"type": {
"defined": "TokenMap"
}
},
{
"name": "userStablecoinRewardPerToken",
"type": "u128"
},
{
"name": "marketType",
"type": "u64"
},
{
"name": "padding2",
"type": {
"array": [
"u64",
9
]
}
}
]
}
},
{
"name": "StakingPoolState",
"type": {
"kind": "struct",
"fields": [
{
"name": "placeholder0",
"type": "publicKey"
},
{
"name": "totalDistributedRewards",
"type": "u128"
},
{
"name": "rewardsNotYetClaimed",
"type": "u128"
},
{
"name": "version",
"type": "u8"
},
{
"name": "numUsers",
"type": "u64"
},
{
"name": "placeholder1",
"type": "u64"
},
{
"name": "totalStake",
"type": "u64"
},
{
"name": "rewardPerToken",
"type": "u128"
},
{
"name": "prevRewardLoss",
"type": "u128"
},
{
"name": "stakingVault",
"type": "publicKey"
},
{
"name": "stakingVaultAuthority",
"type": "publicKey"
},
{
"name": "stakingVaultSeed",
"type": "u8"
},
{
"name": "treasuryVault",
"type": "publicKey"
},
{
"name": "treasuryVaultAuthority",
"type": "publicKey"
},
{
"name": "treasuryVaultSeed",
"type": "u8"
},
{
"name": "padding",
"type": {
"array": [
"u64",
10
]
}
}
]
}
},
{
"name": "UserStakingState",
"type": {
"kind": "struct",
"fields": [
{
"name": "version",
"type": "u8"
},
{
"name": "userId",
"type": "u64"
},
{
"name": "stakingPoolState",
"type": "publicKey"
},
{
"name": "owner",
"type": "publicKey"
},
{
"name": "userStake",
"type": "u64"
},
{
"name": "rewardsTally",
"type": "u128"
},
{
"name": "padding",
"type": {
"array": [
"u64",
10
]
}
}
]
}
},
{
"name": "StabilityProviderState",
"type": {
"kind": "struct",
"fields": [
{
"name": "version",
"type": "u8"
},
{
"name": "stabilityPoolState",
"type": "publicKey"
},
{
"name": "owner",
"type": "publicKey"
},
{
"name": "userId",
"type": "u64"
},
{
"name": "depositedStablecoin",
"type": "u64"
},
{
"name": "userDepositSnapshot",
"type": {
"defined": "DepositSnapshot"
}
},
{
"name": "cumulativeGainsPerUser",
"type": {
"defined": "StabilityTokenMap"
}
},
{
"name": "pendingGainsPerUser",
"type": {
"defined": "StabilityCollateralAmounts"
}
},
{
"name": "padding",
"type": {
"array": [
"u64",
10
]
}
}
]
}
},
{
"name": "EpochToScaleToSumAccount",
"type": {
"kind": "struct",
"fields": [
{
"name": "data",
"type": {
"array": [
"u128",
15000
]
}
}
]
}
},
{
"name": "LiquidationsQueue",
"type": {
"kind": "struct",
"fields": [
{
"name": "len",
"type": "u64"
},
{
"name": "events",
"type": {
"array": [
{
"defined": "LiquidationEvent"
},
512
]
}
}
]
}
}
],
"types": [
{
"name": "MarketCollateralAmounts",
"type": {
"kind": "struct",
"fields": [
{
"name": "amounts",
"type": {
"array": [
"u64",
128
]
}
}
]
}
},
{
"name": "SupportedCollateral",
"type": {
"kind": "struct",
"fields": [
{
"name": "token",
"type": "u64"
},
{
"name": "tokenCap",
"type": "u64"
}
]
}
},
{
"name": "WithdrawalCaps",
"type": {
"kind": "struct",
"fields": [
{
"name": "configCapacity",
"type": "i64"
},
{
"name": "currentTotal",
"type": "i64"
},
{
"name": "lastIntervalStartSlot",
"type": "u64"
},
{
"name": "configIntervalLengthSlots",
"type": "u64"
}
]
}
},
{
"name": "DepositSnapshot",
"type": {
"kind": "struct",
"fields": [
{
"name": "sum",
"type": {
"defined": "StabilityTokenMap"
}
},
{
"name": "product",
"type": "u128"
},
{
"name": "scale",
"type": "u64"
},
{
"name": "epoch",
"type": "u64"
},
{
"name": "enabled",
"type": "bool"
}
]
}
},
{
"name": "LiquidationEvent",
"type": {
"kind": "struct",
"fields": [
{
"name": "status",
"type": "u64"
},
{
"name": "userPositions",
"type": "publicKey"
},
{
"name": "positionIndex",
"type": "u64"
},
{
"name": "liquidator",
"type": "publicKey"
},
{
"name": "eventTs",
"type": "u64"
},
{
"name": "collateralGainToLiquidator",
"type": {
"defined": "UserCollateralAmounts"
}
},
{
"name": "collateralGainToClearer",
"type": {
"defined": "UserCollateralAmounts"
}
},
{
"name": "collateralGainToStabilityPool",
"type": {
"defined": "UserCollateralAmounts"
}
}
]
}
},
{
"name": "TokenMap",
"type": {
"kind": "struct",
"fields": [
{
"name": "sol",
"type": "u128"
},
{
"name": "eth",
"type": "u128"
},
{
"name": "btc",
"type": "u128"
},
{
"name": "srm",
"type": "u128"
},
{
"name": "ray",
"type": "u128"
},
{
"name": "ftt",
"type": "u128"
},
{
"name": "msol",
"type": "u128"
},
{
"name": "reserved",
"type": {
"array": [
"u8",
256
]
}
}
]
}
},
{
"name": "StabilityTokenMap",
"type": {
"kind": "struct",
"fields": [
{
"name": "sol",
"type": "u128"
},
{
"name": "eth",
"type": "u128"
},
{
"name": "btc",
"type": "u128"
},
{
"name": "srm",
"type": "u128"
},
{
"name": "ray",
"type": "u128"
},
{
"name": "ftt",
"type": "u128"
},
{
"name": "hbb",
"type": "u128"
},
{
"name": "msol",
"type": "u128"
},
{
"name": "usdh",
"type": "u128"
},
{
"name": "reserved1",
"type": {
"array": [
"u128",
15
]
}
}
]
}
},
{
"name": "Price",
"type": {
"kind": "struct",
"fields": [
{
"name": "value",
"type": "u64"
},
{
"name": "exp",
"type": "u64"
}
]
}
},
{
"name": "TokenPrices",
"type": {
"kind": "struct",
"fields": [
{
"name": "prices",
"type": {
"array": [
{
"option": {
"defined": "Price"
}
},
128
]
}
}
]
}
},
{
"name": "ExtraCollateralAmount",
"type": {
"kind": "struct",
"fields": [
{
"name": "tokenId",
"type": "u64"
},
{
"name": "amount",
"type": "u64"
}
]
}
},
{
"name": "StabilityCollateralAmounts",
"type": {
"kind": "struct",
"fields": [
{
"name": "sol",
"type": "u64"
},
{
"name": "eth",
"type": "u64"
},
{
"name": "btc",
"type": "u64"
},
{
"name": "srm",
"type": "u64"
},
{
"name": "ray",
"type": "u64"
},
{
"name": "ftt",
"type": "u64"
},
{
"name": "msol",
"type": "u64"
},
{
"name": "hbb",
"type": "u64"
},
{
"name": "usdh",
"type": "u64"
},
{
"name": "reserved",
"type": {
"array": [
"u64",
15
]
}
}
]
}
},
{
"name": "UserCollateralAmounts",
"type": {
"kind": "struct",
"fields": [
{
"name": "sol",
"type": "u64"
},
{
"name": "eth",
"type": "u64"
},
{
"name": "btc",
"type": "u64"
},
{
"name": "srm",
"type": "u64"
},
{
"name": "ray",
"type": "u64"
},
{
"name": "ftt",
"type": "u64"
},
{
"name": "msol",
"type": "u64"
},
{
"name": "extraCollaterals",
"type": {
"array": [
{
"defined": "ExtraCollateralAmount"
},
8
]
}
}
]
}
},
{
"name": "LiquidationType",
"type": {
"kind": "enum",
"variants": [
{
"name": "PoolBased"
},
{
"name": "CashBased",
"fields": [
{
"name": "amount",
"type": "u64"
}
]
}
]
}
},
{
"name": "LiquidationDecision",
"type": {
"kind": "enum",
"variants": [
{
"name": "RedistributeAll"
},
{
"name": "StabilityPoolThenRedistribute"
}
]
}
},
{
"name": "CashBasedLiquidationDecision",
"type": {
"kind": "enum",
"variants": [
{
"name": "PayDebt"
},
{
"name": "PayThenRedistribute"
}
]
}
},
{
"name": "EventStatus",
"type": {
"kind": "enum",
"variants": [
{
"name": "Inactive"
},
{
"name": "PendingCollection"
}
]
}
},
{
"name": "PDA",
"type": {
"kind": "enum",
"variants": [
{
"name": "BorrowingFeesAccount",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
},
{
"name": "StablecoinMint",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
},
{
"name": "StabilityPool",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
},
{
"name": "BurningPotAccount",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
},
{
"name": "TreasuryAccount",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
},
{
"name": "StakingPool",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
},
{
"name": "HbbMint",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
},
{
"name": "CollateralVault",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
},
{
"name": "LiquidationsVault",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
},
{
"name": "PsmVault",
"fields": [
{
"name": "owner",
"type": "publicKey"
}
]
}
]
}
},
{
"name": "ScopePriceId",
"type": {
"kind": "enum",
"variants": [
{
"name": "SOL"
},
{
"name": "ETH"
},
{
"name": "BTC"
},
{
"name": "SRM"
},
{
"name": "RAY"
},
{
"name": "FTT"
},
{
"name": "MSOL"
},
{
"name": "scnSOL_SOL"
},
{
"name": "BNB"
},
{
"name": "AVAX"
},
{
"name": "DaoSOL_SOL"
},
{
"name": "SaberMSOL_SOL"
},
{
"name": "USDH"
},
{
"name": "StSOL"
},
{
"name": "CSOL_SOL"
},
{
"name": "CETH_ETH"
},
{
"name": "CBTC_BTC"
},
{
"name": "CMSOL_SOL"
},
{
"name": "wstETH"
},
{
"name": "LDO"
},
{
"name": "USDC"
}
]
}
},
{
"name": "GlobalConfigOption",
"type": {
"kind": "enum",
"variants": [
{
"name": "UserBorrowMin"
},
{
"name": "UserBorrowMax"
},
{
"name": "UserDebtMin"
},
{
"name": "UserDebtMax"
},
{
"name": "DelegateCollateralAllowActiveOnly"
},
{
"name": "TreasuryFeeRate"
},
{
"name": "ProtocolEpoch"
},
{
"name": "BlockWithdrawCollateral"
},
{
"name": "BlockTryLiquidate"
},
{
"name": "BlockBorrow"
},
{
"name": "BlockDepositAndBorrow"
},
{
"name": "BlockClearLiquidationGains"
},
{
"name": "BlockHarvestLiquidationGains"
},
{
"name": "BlockWithdrawStability"
},
{
"name": "BlockAirdropHbb"
},
{
"name": "EmergencyMode"
},
{
"name": "UserDepositMax"
},
{
"name": "TotalDepositMax"
},
{
"name": "IssuancePerSecond"
},
{
"name": "BlockPsmMint"
},
{
"name": "BlockPsmBurn"
},
{
"name": "BlockDepositCollateral"
},
{
"name": "OracleProgramId"
},
{
"name": "ScopeProgramId"
}
]
}
},
{
"name": "CollateralAmounts",
"type": {
"kind": "enum",
"variants": [
{
"name": "Market",
"fields": [
{
"name": "amounts",
"type": {
"defined": "&'aMarketCollateralAmounts"
}
}
]
},
{
"name": "User",
"fields": [
{
"name": "amounts",
"type": {
"defined": "&'aUserCollateralAmounts"
}
}
]
}
]
}
},
{
"name": "CollateralTokenActive",
"type": {
"kind": "enum",
"variants": [
{
"name": "SOL"
},
{
"name": "ETH"
},
{
"name": "BTC"
},
{
"name": "SRM"
},
{
"name": "RAY"
},
{
"name": "FTT"
},
{
"name": "MSOL"
}
]
}
},
{
"name": "CollateralToken",
"type": {
"kind": "enum",
"variants": [
{
"name": "SOL"
},
{
"name": "ETH"
},
{
"name": "BTC"
},
{
"name": "SRM"
},
{
"name": "RAY"
},
{
"name": "FTT"
},
{
"name": "MSOL"
},
{
"name": "DAOSOL"
},
{
"name": "STSOL"
},
{
"name": "SCNSOL"
},
{
"name": "WSTETH"
},
{
"name": "LDO"
},
{
"name": "CSOL"
},
{
"name": "OTHER"
}
]
}
},
{
"name": "CollateralAction",
"type": {
"kind": "enum",
"variants": [
{
"name": "Add"
},
{
"name": "Remove"
}
]
}
},
{
"name": "MarketType",
"type": {
"kind": "enum",
"variants": [
{
"name": "ORIGINAL"
},
{
"name": "BASE"
}
]
}
},
{
"name": "UserStatus",
"type": {
"kind": "enum",
"variants": [
{
"name": "Inactive"
},
{
"name": "Active"
},
{
"name": "Liquidated"
}
]
}
},
{
"name": "StabilityTokenActive",
"type": {
"kind": "enum",
"variants": [
{
"name": "SOL"
},
{
"name": "ETH"
},
{
"name": "BTC"
},
{
"name": "SRM"
},
{
"name": "RAY"
},
{
"name": "FTT"
},
{
"name": "HBB"
},
{
"name": "MSOL"
},
{
"name": "USDH"
}
]
}
},
{
"name": "StabilityToken",
"type": {
"kind": "enum",
"variants": [
{
"name": "SOL"
},
{
"name": "ETH"
},
{
"name": "BTC"
},
{
"name": "SRM"
},
{
"name": "RAY"
},
{
"name": "FTT"
},
{
"name": "HBB"
},
{
"name": "MSOL"
},
{
"name": "USDH"
},
{
"name": "OTHER"
}
]
}
},
{
"name": "StakingToken",
"type": {
"kind": "enum",
"variants": [
{
"name": "HBB"
},
{
"name": "USDH"
}
]
}
},
{
"name": "TryLiquidateResult",
"type": {
"kind": "enum",
"variants": [
{
"name": "Success"
},
{
"name": "Error",
"fields": [
"string"
]
}
]
}
},
{
"name": "Event",
"type": {
"kind": "enum",
"variants": [
{
"name": "AddBorrowers",
"fields": [
{
"vec": {
"defined": "Borrower"
}
}
]
},
{
"name": "AddStabilityProviders",
"fields": [
{
"vec": {
"defined": "StabilityProvider"
}
}
]
},
{
"name": "SetPrices",
"fields": [
{
"defined": "Tokens"
}
]
},
{
"name": "TryLiquidate",
"fields": [
{
"defined": "TryLiquidateEvent"
}
]
},
{
"name": "TryLiquidateCash",
"fields": [
{
"defined": "TryLiquidateEventCash"
}
]
},
{
"name": "UpdateMarketMinLTV",
"fields": [
{
"defined": "f64"
}
]
},
{
"name": "ClearLiquidationGains",
"fields": [
{
"defined": "ExpectedClearGains"
}
]
},
{
"name": "AssertUserBalance",
"fields": [
{
"defined": "AssertUserBalance"
}
]
},
{
"name": "SetLiquidationPenalty",
"fields": [
"u64"
]
}
]
}
},
{
"name": "UpdateBmsConfig",
"type": {
"kind": "enum",
"variants": [
{
"name": "UpdateSFValue"
},
{
"name": "UpdateStabilityPct"
},
{
"name": "UpdateStakingPct"
},
{
"name": "UpdateTreasuryPct"
},
{
"name": "UpdateLastEventTimestamp"
},
{
"name": "UpdateMarketType"
},
{
"name": "UpdateMarketMcr"
},
{
"name": "UpdateLiqPenaltyCashBased"
},
{
"name": "UpdateLiqPenaltyPoolBased"
},
{
"name": "UpdateDebtMax"
},
{
"name": "UpdateMinPartialDebtAccepted"
}
]
}
},
{
"name": "CollateralStatus",
"type": {
"kind": "enum",
"variants": [
{
"name": "Inactive"
},
{
"name": "Deposited"
}
]
}
}
],
"errors": [
{
"code": 6000,
"name": "NotEnoughCollateral",
"msg": "Insufficient collateral to cover debt"
},
{
"code": 6001,
"name": "CollateralNotEnabled",
"msg": "Collateral not yet enabled"
},
{
"code": 6002,
"name": "CannotDepositZeroAmount",
"msg": "Cannot deposit zero collateral amount"
},
{
"code": 6003,
"name": "CannotWithdrawZeroAmount",
"msg": "Cannot withdraw zero collateral amount"
},
{
"code": 6004,
"name": "NothingToRepay",
"msg": "No outstanding debt"
},
{
"code": 6005,
"name": "CannotUpdateStabilitySum",
"msg": "Could not update the sum for the provided epoch and scale"
},
{
"code": 6006,
"name": "NeedToClaimAllRewardsFirst",
"msg": "Need to claim all rewards first"
},
{
"code": 6007,
"name": "NeedToHarvestAllRewardsFirst",
"msg": "Need to harvest all rewards first"
},
{
"code": 6008,
"name": "StakingZero",
"msg": "Cannot stake or unstake 0 amount"
},
{
"code": 6009,
"name": "NothingToUnstake",
"msg": "Nothing to unstake"
},
{
"code": 6010,
"name": "NoRewardToWithdraw",
"msg": "No reward to withdraw"
},
{
"code": 6011,
"name": "CannotProvideZeroStability",
"msg": "Cannot provide zero stability"
},
{
"code": 6012,
"name": "CannotWithdrawZeroStability",
"msg": "Cannot withdraw zero stability"
},
{
"code": 6013,
"name": "NothingToWithdraw",
"msg": "Nothing to withdraw"
},
{
"code": 6014,
"name": "StabilityPoolIsEmpty",
"msg": "Stability Pool is empty"
},
{
"code": 6015,
"name": "NotEnoughStabilityInTheStabilityPool",
"msg": "Stability pool cannot offset this much debt"
},
{
"code": 6016,
"name": "MismatchedNextPdaRewardAddress",
"msg": "Mismatching next PDA reward address"
},
{
"code": 6017,
"name": "MismatchedNextPdaRewardSeed",
"msg": "Mismatching next PDA reward seed"
},
{
"code": 6018,
"name": "MismatchedNextPdaIndex",
"msg": "Wrong next reward pda index"
},
{
"code": 6019,
"name": "NextRewardNotReadyYet",
"msg": "Next reward not ready yet"
},
{
"code": 6020,
"name": "NothingStaked",
"msg": "Nothing staked, cannot collect any rewards"
},
{
"code": 6021,
"name": "NextRewardMismatchForUser",
"msg": "Reward candidate mismatch from user's next pending reward"
},
{
"code": 6022,
"name": "UserWellCollateralized",
"msg": "User is well collateralized, cannot liquidate"
},
{
"code": 6023,
"name": "LastUser",
"msg": "Cannot liquidate the last user"
},
{
"code": 6024,
"name": "IntegerOverflow",
"msg": "Integer overflow"
},
{
"code": 6025,
"name": "ConversionFailure",
"msg": "Conversion failure"
},
{
"code": 6026,
"name": "CannotHarvestUntilLiquidationGainsCleared",
"msg": "Cannot harvest until liquidation gains are cleared"
},
{
"code": 6027,
"name": "RedemptionsQueueIsFull",
"msg": "Redemptions queue is full, cannot add one more order"
},
{
"code": 6028,
"name": "RedemptionsQueueIsEmpty",
"msg": "Redemptions queue is empty, nothing to process"
},
{
"code": 6029,
"name": "RedemptionsAmountTooSmall",
"msg": "Redemptions amount too small"
},
{
"code": 6030,
"name": "CannotRedeemMoreThanMinted",
"msg": "Redemptions amount too much"
},
{
"code": 6031,
"name": "NeedToProcessFirstOrderBeforeOthers",
"msg": "The program needs to finish processing the first outstanding order before moving on to others"
},
{
"code": 6032,
"name": "RedemptionClearingOrderIsIncorrect",
"msg": "The bot submitted the clearing users in the wrong order"
},
{
"code": 6033,
"name": "CannotFillRedemptionOrderWhileInClearingMode",
"msg": "Current redemption order is in clearing mode, cannot fill it until it's fully cleared"
},
{
"code": 6034,
"name": "CannotClearRedemptionOrderWhileInFillingMode",
"msg": "Current redemption order is in filling mode, cannot clear it until it's filled"
},
{
"code": 6035,
"name": "InvalidRedemptionOrder",
"msg": "Redemption order is inactive"
},
{
"code": 6036,
"name": "OrderDoesNotHaveCandidates",
"msg": "Redemption order is empty of candidates"
},
{
"code": 6037,
"name": "WrongRedemptionUser",
"msg": "Redemption user is not among the candidates"
},
{
"code": 6038,
"name": "RedemptionFillerNotFound",
"msg": "Redemption user is not among the candidates"
},
{
"code": 6039,
"name": "InvalidRedeemer",
"msg": "Redeemer does not match with the order being redeemed"
},
{
"code": 6040,
"name": "DuplicateAccountInFillOrder",
"msg": "Duplicate account in fill order"
},
{
"code": 6041,
"name": "RedemptionUserNotFound",
"msg": "Redemption user is not among the candidates"
},
{
"code": 6042,
"name": "MathOverflow",
"msg": "Mathematical operation with overflow"
},
{
"code": 6043,
"name": "PriceNotValid",
"msg": "Price is not valid"
},
{
"code": 6044,
"name": "LiquidationsQueueFull",
"msg": "Liquidation queue is full"
},
{
"code": 6045,
"name": "CannotDeserializeEpochToScaleToSum",
"msg": "Epoch to scale to sum deserialization failed"
},
{
"code": 6046,
"name": "BorrowingDisabled",
"msg": "Borrowing is disabled"
},
{
"code": 6047,
"name": "CannotBorrowZeroAmount",
"msg": "Cannot borrow zero amount"
},
{
"code": 6048,
"name": "CannotRepayZeroAmount",
"msg": "Cannot repay zero amount"
},
{
"code": 6049,
"name": "CannotRedeemDuringBootstrapPeriod",
"msg": "Cannot redeem during bootstrap period"
},
{
"code": 6050,
"name": "CannotBorrowLessThanMinimum",
"msg": "Cannot borrow less than minimum"
},
{
"code": 6051,
"name": "CannotBorrowMoreThanMaximum",
"msg": "Cannot borrow more than maximum"
},
{
"code": 6052,
"name": "UserDebtTooLow",
"msg": "User debt is lower than the minimum"
},
{
"code": 6053,
"name": "UserDebtTooHigh",
"msg": "User debt is higher than the maximum"
},
{
"code": 6054,
"name": "TotalDebtTooHigh",
"msg": "Total debt is more than the maximum"
},
{
"code": 6055,
"name": "CannotRedeemWhenUndercollateralized",
"msg": "Cannot redeem while being undercollateralized"
},
{
"code": 6056,
"name": "ZeroAmountInvalid",
"msg": "Zero argument not allowed"
},
{
"code": 6057,
"name": "InvalidDexInputs",
"msg": "Serum DEX variables inputted wrongly"
},
{
"code": 6058,
"name": "NoSwapExecuted",
"msg": "Serum DEX transaction didn't execute the swap function"
},
{
"code": 6059,
"name": "GlobalConfigKeyError",
"msg": "Key is not present in global config"
},
{
"code": 6060,
"name": "MarinadeDepositError",
"msg": "Marinade deposit didn't go through"
},
{
"code": 6061,
"name": "CannotDelegateInactive",
"msg": "Cannot delegate inactive collateral"
},
{
"code": 6062,
"name": "StatusMismatch",
"msg": "User is either deposited or inactive, can't be both"
},
{
"code": 6063,
"name": "UnexpectedAccount",
"msg": "Unexpected account in instruction"
},
{
"code": 6064,
"name": "OperationBringsPositionBelowMCR",
"msg": "User is either deposited or inactive, can't be both"
},
{
"code": 6065,
"name": "OperationForbidden",
"msg": "Operation forbidden"
},
{
"code": 6066,
"name": "SystemInEmergencyMode",
"msg": "System is in emergency mode"
},
{
"code": 6067,
"name": "BorrowBlocked",
"msg": "Borrow is currently blocked"
},
{
"code": 6068,
"name": "ClearLiquidationGainsBlocked",
"msg": "Clear_liquidation_gains is currently blocked"
},
{
"code": 6069,
"name": "AirdropHBBBlocked",
"msg": "Airdrop_HBB is currently blocked"
},
{
"code": 6070,
"name": "WithdrawCollateralBlocked",
"msg": "Withdraw_collateral is currently blocked"
},
{
"code": 6071,
"name": "TryLiquidateBlocked",
"msg": "Try_liquidate is currently blocked"
},
{
"code": 6072,
"name": "DepositAndBorrowBlocked",
"msg": "deposit_and_borrow is currently blocked"
},
{
"code": 6073,
"name": "HarvestLiquidationGainsBlocked",
"msg": "harvest_liquidation_gains is currently blocked"
},
{
"code": 6074,
"name": "WithdrawStabilityBlocked",
"msg": "withdraw_stability is currently blocked"
},
{
"code": 6075,
"name": "ClearRedemptionOrderBlocked",
"msg": "clear_redemption_order is currently blocked"
},
{
"code": 6076,
"name": "UserDepositTooHigh",
"msg": "User deposit is too high"
},
{
"code": 6077,
"name": "TotalDepositTooHigh",
"msg": "Total deposit is too high"
},
{
"code": 6078,
"name": "OutOfRangeIntegralConversion",
"msg": "Out of range integral conversion attempted"
},
{
"code": 6079,
"name": "PSMModuleReachedCapacity",
"msg": "PSM Module reached capacity"
},
{
"code": 6080,
"name": "PSMModuleOutOfUSDH",
"msg": "PSM Module out of minted USDH"
},
{
"code": 6081,
"name": "TokenEnumConversionFailed",
"msg": "Conversion between tokens types failed"
},
{
"code": 6082,
"name": "ParseScopePriceAccountFailed",
"msg": "Failed to parse Scope price account"
},
{
"code": 6083,
"name": "SupportedCollateralsListFull",
"msg": "Supported Collaterals list is full"
},
{
"code": 6084,
"name": "CollateralShouldNotBeUsed",
"msg": "Collateral should not be used"
},
{
"code": 6085,
"name": "CollateralDepositExceedsCap",
"msg": "Deposited amount exceeds the global deposit cap for this token"
},
{
"code": 6086,
"name": "TokenMapExtraTokensNotEmpty",
"msg": "extra_tokens in TokenMap are still non-zero. Extra tokens have to converted to base tokens or USDH before proceeding"
},
{
"code": 6087,
"name": "UserExtraCollateralOutOfCapacity",
"msg": "User extra collaterals list is out of capacity"
},
{
"code": 6088,
"name": "CannotLiquidateNonzeroSecondary",
"msg": "Cannot liquidate via stability pool with non original collaterals"
},
{
"code": 6089,
"name": "UserStatusNotActive",
"msg": "User status must be active to liquidate"
},
{
"code": 6090,
"name": "UserIsLiquidated",
"msg": "User is in process of liquidation"
},
{
"code": 6091,
"name": "PsmMintBlocked",
"msg": "Psm_mint is currently blocked"
},
{
"code": 6092,
"name": "PsmBurnBlocked",
"msg": "Psm_burn is currently blocked"
},
{
"code": 6093,
"name": "DepositCollateralBlocked",
"msg": "deposit_collateral is currently blocked"
},
{
"code": 6094,
"name": "PSMCannotMintZeroAmount",
"msg": "PSM Cannot Mint Zero Amount"
},
{
"code": 6095,
"name": "PSMCannotBurnZeroAmount",
"msg": "PSM Cannot Burn Zero Amount"
},
{
"code": 6096,
"name": "CannotLiquidateCashBasedIfNoSecondary",
"msg": "Cannot liquidate cash based if the position has no secondary tokens"
},
{
"code": 6097,
"name": "PledgedLiquidationAmountLessThanMinimum",
"msg": "Cannot liquidate cash based partially if pledged amount less than minimum"
},
{
"code": 6098,
"name": "WithdrawalCapReached",
"msg": "Withdrawal Capacity exceeded"
}
]
}`;
    this._borrowingProgram = new Program(JSON.parse(newIdl) as Idl, this._config.borrowing.programId, this._provider);
  }

  /**
   * Get Hubble's staking pool state.
   * @return on-chain {@link StakingPoolState} from the borrowing program with numbers as lamports
   */
  async getStakingPoolState(): Promise<StakingPoolState> {
    const stakingPoolState = (await this._borrowingProgram.account.stakingPoolState.fetch(
      this._config.borrowing.accounts.stakingPoolState
    )) as StakingPoolState;
    return replaceBigNumberWithDecimal(stakingPoolState);
  }

  /**
   * Get Hubble's stability pool state.
   * @return on-chain {@link StabilityPoolState} from the borrowing program with numbers as lamports
   */
  async getStabilityPoolState(): Promise<StabilityPoolState> {
    let stability = (await this._borrowingProgram.account.stabilityPoolState.fetch(
      this._config.borrowing.accounts.stabilityPoolState
    )) as StabilityPoolState;
    stability = replaceBigNumberWithDecimal(stability);
    stability.cumulativeGainsTotal = replaceBigNumberWithDecimal(stability.cumulativeGainsTotal);
    stability.lastCollLossErrorOffset = replaceBigNumberWithDecimal(stability.lastCollLossErrorOffset);
    stability.pendingCollateralGains = replaceBigNumberWithDecimal(stability.pendingCollateralGains);
    return stability;
  }

  /**
   * Get Hubble's borrowing market state.
   * @return on-chain {@link BorrowingMarketState} from the borrowing program with numbers as lamports
   */
  async getBorrowingMarketState(): Promise<BorrowingMarketState> {
    let state = (await this._borrowingProgram.account.borrowingMarketState.fetch(
      this._config.borrowing.accounts.borrowingMarketState
    )) as BorrowingMarketState;
    state = replaceBigNumberWithDecimal(state);
    state.depositedCollateral.amounts = replaceBigNumberWithDecimal(state.depositedCollateral.amounts);
    state.inactiveCollateral.amounts = replaceBigNumberWithDecimal(state.inactiveCollateral.amounts);
    state.collateralRewardPerToken = replaceBigNumberWithDecimal(state.collateralRewardPerToken);
    return state;
  }

  /**
   * Get user's staking state (staking stats).
   * @param user Base58 encoded Public Key of the user
   * @return on-chain {@link UserStakingState} from the borrowing program for the specific user with numbers as lamports
   * or undefined if user has never used Hubble before or authorized HBB staking
   */
  async getUserStakingState(user: PublicKey | string): Promise<UserStakingState | undefined> {
    const userStakingStates = (
      await this._borrowingProgram.account.userStakingState.all([
        {
          memcmp: {
            bytes: user instanceof PublicKey ? user.toBase58() : user,
            offset: 49, // 8 (account discriminator for user staking state) + 1 (version u8) + 8 (user_id u64) + 32 (staking_pool_state pubkey [u8, 32])
          },
        },
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stakingPoolState.toBase58(),
            offset: 17, // 8 (account discriminator for user staking state) + 1 (version u8) + 8 (user_id u64)
          },
        },
      ])
    ).map((x) => replaceBigNumberWithDecimal(x.account as UserStakingState));
    return userStakingStates.find((x) => !x.userStake.isZero());
  }

  /**
   * Convert anchor's stability provider state with BN to stability provider state with decimals
   * @param stabilityProviderState
   */
  private static stabilityProviderStateToDecimals(stabilityProviderState: StabilityProviderState) {
    const converted = replaceBigNumberWithDecimal(stabilityProviderState);
    converted.userDepositSnapshot = replaceBigNumberWithDecimal(converted.userDepositSnapshot);
    converted.userDepositSnapshot.sum = replaceBigNumberWithDecimal(converted.userDepositSnapshot.sum);
    converted.pendingGainsPerUser = replaceBigNumberWithDecimal(converted.pendingGainsPerUser);
    converted.cumulativeGainsPerUser = replaceBigNumberWithDecimal(converted.cumulativeGainsPerUser);
    return converted;
  }

  /**
   * Get user's stability provider state (stability pool stats).
   * @param user Base58 encoded Public Key of the user
   * @return on-chain {@link StabilityProviderState} from the borrowing program for the specific user with numbers as lamports.
   * Returns undefined if this user has never used Hubble Stability pool before and does not exist in Hubble on-chain data
   */
  async getUserStabilityProviderState(user: PublicKey | string): Promise<StabilityProviderState | undefined> {
    const stabilityProviderStates = (
      await this._borrowingProgram.account.stabilityProviderState.all([
        {
          memcmp: {
            bytes: user instanceof PublicKey ? user.toBase58() : user,
            offset: 41, // 8 (account discriminator for stability provider state) + 1 (version u8) + 32 (stability pool state pubkey [u8, 32])
          },
        },
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stabilityPoolState.toBase58(),
            offset: 9, // 8 (account discriminator for stability provider state) + 1 (version u8)
          },
        },
      ])
    ).map((x) => Hubble.stabilityProviderStateToDecimals(x.account as StabilityProviderState));
    return stabilityProviderStates.find((x) => !x.depositedStablecoin.isZero());
  }

  /**
   * Get all Hubble stability providers (stability pool stats).
   * @return list of on-chain {@link StabilityProviderState} from the borrowing program
   */
  async getStabilityProviders(): Promise<StabilityProviderState[]> {
    return (
      await this._borrowingProgram.account.stabilityProviderState.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stabilityPoolState.toBase58(),
            offset: 9, // 8 (account discriminator for stability provider state) + 1 (version u8)
          },
        },
      ])
    ).map((x) => Hubble.stabilityProviderStateToDecimals(x.account as StabilityProviderState));
  }

  /**
   * Get all non-zero Hubble user staking states.
   * @return list of on-chain {@link UserStakingState} from the borrowing program
   */
  async getUserStakingStates(): Promise<UserStakingState[]> {
    const userStakingStates = (
      await this._borrowingProgram.account.userStakingState.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stakingPoolState.toBase58(),
            offset: 17, // 8 (account discriminator for user staking state) + 1 (version u8) + 8 (user_id u64)
          },
        },
      ])
    ).map((x) => replaceBigNumberWithDecimal(x.account as UserStakingState));
    return userStakingStates.filter((x) => !x.userStake.isZero());
  }

  /**
   * Get all Hubble stability providers (stability pool stats) and include raw JSON RPC responses in the return value.
   * @return list of on-chain {@link StabilityProviderStateWithJson} from the borrowing program
   */
  async getStabilityProvidersIncludeJsonResponse(): Promise<StabilityProviderStateWithJson[]> {
    return (
      await this._borrowingProgram.account.stabilityProviderState.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stabilityPoolState.toBase58(),
            offset: 9, // 8 (account discriminator for stability provider state) + 1 (version u8)
          },
        },
      ])
    ).map((x) => {
      const stabilityProvider = Hubble.stabilityProviderStateToDecimals(
        x.account as StabilityProviderState
      ) as StabilityProviderStateWithJson;
      stabilityProvider.jsonResponse = JSON.stringify(x.account);
      return stabilityProvider;
    });
  }

  /**
   * Convert user metadata BN fields to Decimal
   * @param user
   * @private
   */
  private static userMetadataToDecimals(user: UserMetadata) {
    const converted: UserMetadata = replaceBigNumberWithDecimal(user);
    converted.userCollateralRewardPerToken = replaceBigNumberWithDecimal(converted.userCollateralRewardPerToken);
    converted.depositedCollateral = replaceBigNumberWithDecimal(converted.depositedCollateral);
    converted.inactiveCollateral = replaceBigNumberWithDecimal(converted.inactiveCollateral);
    converted.depositedCollateral.extraCollaterals = converted.depositedCollateral.extraCollaterals.map((x) =>
      replaceBigNumberWithDecimal(x)
    );
    converted.inactiveCollateral.extraCollaterals = converted.inactiveCollateral.extraCollaterals.map((x) =>
      replaceBigNumberWithDecimal(x)
    );
    return replaceBigNumberWithDecimal(converted);
  }

  /**
   * Get all of user's metadatas (borrowing state, debt, collateral stats...), user can have multiple borrowing accounts.
   * @param user Base58 encoded Public Key of the user
   * @return on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getUserMetadatas(user: PublicKey | string): Promise<UserMetadata[]> {
    return (
      await this._borrowingProgram.account.userMetadata.all([
        {
          memcmp: {
            bytes: user instanceof PublicKey ? user.toBase58() : user,
            offset: 50, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32])
          },
        },
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.borrowingMarketState.toBase58(),
            offset: 82, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32]) + 32 (owner pubkey)
          },
        },
      ])
    ).map((x) => Hubble.userMetadataToDecimals(x.account as UserMetadata));
  }

  /**
   * Get specific user metadata (borrowing state, debt, collateral stats...).
   * @param metadata Base58 encoded Public Key of the user metadata
   * @return on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getUserMetadata(metadata: PublicKey | string): Promise<UserMetadata> {
    return Hubble.userMetadataToDecimals(
      (await this._borrowingProgram.account.userMetadata.fetch(metadata)) as UserMetadata
    );
  }

  /**
   * Get all Hubble user metadatas (borrowing state, debt, collateral stats...), one user can have multiple borrowing accounts.
   * @return list of on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getAllUserMetadatas(): Promise<UserMetadata[]> {
    return (
      await this._borrowingProgram.account.userMetadata.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.borrowingMarketState.toBase58(),
            offset: 82, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32]) + 32 (owner pubkey)
          },
        },
      ])
    ).map((x) => Hubble.userMetadataToDecimals(x.account as UserMetadata));
  }

  /**
   * Get all Hubble user metadatas (borrowing state, debt, collateral stats...) and include raw JSON RPC responses in the return value.
   * @return list of on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getAllUserMetadatasIncludeJsonResponse(): Promise<UserMetadataWithJson[]> {
    return (
      await this._borrowingProgram.account.userMetadata.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.borrowingMarketState.toBase58(),
            offset: 82, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32]) + 32 (owner pubkey)
          },
        },
      ])
    ).map((x) => {
      const userMetadata = Hubble.userMetadataToDecimals(x.account as UserMetadata) as UserMetadataWithJson;
      userMetadata.jsonResponse = JSON.stringify(x.account);
      return userMetadata;
    });
  }

  /**
   * Get user's loans. Fetches all {@link UserMetadata} of the specified user and converts it to a human-friendly list of {@link Loan}.
   * @param user Base58 encoded Public Key of the user
   * @return User's loans with already converted on-chain data (from lamports to decimal values)
   */
  async getUserLoans(user: PublicKey | string): Promise<Loan[]> {
    const loans: Loan[] = [];
    const userVaults = await this.getUserMetadatas(user);
    if (userVaults.length === 0) {
      return [];
    }
    const borrowingMarketState = await this.getBorrowingMarketState();
    for (const userVault of userVaults) {
      if (userVault.borrowedStablecoin.greaterThan(0)) {
        loans.push({
          usdhDebt: calculateTotalDebt(userVault, borrowingMarketState),
          collateral: calculateTotalCollateral(userVault, borrowingMarketState),
        });
      }
    }
    return loans;
  }

  /**
   * Get user's deposited stablecoin (USDH) in the stability pool.
   * @param user Base58 encoded Public Key of the user
   * @return Deposited stablecoin (USDH) in decimal format or
   * undefined if user has never used Hubble before or authorized stability pool deposits
   */
  async getUserUsdhInStabilityPool(user: PublicKey | string): Promise<Decimal | undefined> {
    const provider = await this.getUserStabilityProviderState(user);
    if (provider) {
      const pool = await this.getStabilityPoolState();
      return calculateStabilityProvided(pool, provider).dividedBy(STABLECOIN_DECIMALS);
    }
    return undefined;
  }

  /**
   * Get user's USDH vault (usdh staked + liquidation rewards + hbb rewards)
   * @param user Base58 encoded Public Key of the user
   * @return USDH vault with amount of USDH staked, liquidation rewards and HBB rewards or
   * undefined if user has never used Hubble before or authorized stability pool deposits
   */
  async getUserUsdhVault(user: PublicKey | string): Promise<UsdhVault | undefined> {
    const provider = await this.getUserStabilityProviderState(user);
    if (provider) {
      const pool = await this.getStabilityPoolState();
      const epoch = await this.getEpochToScaleToSum();
      const usdhStaked = calculateStabilityProvided(pool, provider).dividedBy(STABLECOIN_DECIMALS);
      const gains = calculatePendingGains(pool, provider, epoch);
      return {
        usdhStaked,
        hbbRewards: gains.hbb,
        liquidationRewards: {
          sol: gains.sol,
          eth: gains.eth,
          ftt: gains.ftt,
          btc: gains.btc,
          ray: gains.ray,
          srm: gains.srm,
          msol: gains.msol,
          extraCollaterals: [], //todo
        },
      };
    }
    return undefined;
  }

  /**
   * Get a list of epoch to scale to sum values for Hubble
   * @return Array of epoch to scale to sum in decimal format
   */
  async getEpochToScaleToSum() {
    const epoch = await this._borrowingProgram.account.epochToScaleToSumAccount.fetch(
      this._config.borrowing.accounts.epochToScaleToSum
    );
    if (epoch) {
      return replaceBigNumberWithDecimal(epoch.data) as Decimal[];
    }
    throw Error(`Could not get epoch to scale to sum values from ${this._config.borrowing.accounts.epochToScaleToSum}`);
  }

  /**
   * Get the amount of staked HBB of a specific user.
   * @param user Base58 encoded Public Key of the user
   * @return HBB staked in decimal format or
   * undefined if user has never used Hubble before or authorized HBB staking
   */
  async getUserStakedHbb(user: PublicKey | string): Promise<Decimal | undefined> {
    const stakingState = await this.getUserStakingState(user);
    if (stakingState) {
      return stakingState.userStake.dividedBy(HBB_DECIMALS);
    }
    return undefined;
  }

  /**
   * Get the user's HBB vault (HBB staked + USDH rewards)
   * @param user Base58 encoded Public Key of the user
   * @return HBB vault with number of HBB staked and USDH rewards or
   * undefined if user has never used Hubble before or authorized HBB staking
   */
  async getUserHbbVault(user: PublicKey | string): Promise<HbbVault | undefined> {
    const stakingState = await this.getUserStakingState(user);
    if (stakingState) {
      const stakingPoolState = await this.getStakingPoolState();
      const usdhRewards = new Decimal(
        stakingState.userStake.mul(stakingPoolState.rewardPerToken).minus(stakingState.rewardsTally)
      )
        .div(DECIMAL_FACTOR)
        .div(STABLECOIN_DECIMALS);
      return {
        hbbStaked: stakingState.userStake.dividedBy(HBB_DECIMALS),
        usdhRewards,
      };
    }
    return undefined;
  }

  /**
   * Get Hubble's treasury vault value
   * @return Value of Hubble's treasury vault in decimal representation
   */
  async getTreasuryVault() {
    const acccountBalance = await this._provider.connection.getTokenAccountBalance(
      this._config.borrowing.accounts.treasuryVault!
    );
    if (!acccountBalance.value.uiAmountString) {
      throw Error(
        `Could not get account balance of Hubble treasury vault: ${this._config.borrowing.accounts.treasuryVault}`
      );
    }
    return new Decimal(acccountBalance.value.uiAmountString);
  }

  /**
   * Get circulating supply number of the Hubble (HBB) token.
   * This also takes into account the locked HBB inside Streamflow vesting contracts and subtracts the locked HBB amount.
   * @return Number of HBB in circulation in decimal representation
   */
  async getHbbCirculatingSupply() {
    const tokenSupply = await this._provider.connection.getTokenSupply(this._config.borrowing.accounts.mint.HBB);
    if (!tokenSupply.value.uiAmountString) {
      throw Error(
        `Could not get HBB circulating supply from the HBB mint account: ${this._config.borrowing.accounts.mint.HBB}`
      );
    }
    let totalTokenSupply = new Decimal(tokenSupply.value.uiAmountString);

    if (this._cluster === 'mainnet-beta') {
      try {
        const streams = await Stream.get({
          connection: this._connection,
          wallet: new PublicKey(STREAMFLOW_HBB_CONTRACT),
          cluster: Cluster.Mainnet,
        });
        let notWithdrawnTokens = new Decimal(0);
        for (let [pubkey, stream] of streams) {
          const totalWithdrawn = new Decimal(stream.withdrawnAmount.toString()).add(
            stream.streamflowFeeWithdrawn.toString()
          );
          const deposited = new Decimal(stream.depositedAmount.toString());
          notWithdrawnTokens = notWithdrawnTokens.add(deposited.minus(totalWithdrawn).dividedBy(HBB_DECIMALS));
        }
        totalTokenSupply = totalTokenSupply.minus(notWithdrawnTokens);
      } catch (exception) {
        throw Error(`Could not get HBB Streamflow contract data: ${exception}`);
      }
    }

    return totalTokenSupply;
  }

  async getUsdhCirculatingSupply() {
    const tokenSupply = await this._provider.connection.getTokenSupply(this._config.borrowing.accounts.stablecoinMint);
    if (!tokenSupply.value.uiAmountString) {
      throw Error(
        `Could not get USDH circulating supply from the USDH mint account: ${this._config.borrowing.accounts.stablecoinMint}`
      );
    }
    return new Decimal(tokenSupply.value.uiAmountString);
  }

  /**
   * Get all token accounts that are holding HBB
   */
  getHbbTokenAccounts() {
    //how to get all token accounts for specific mint: https://spl.solana.com/token#finding-all-token-accounts-for-a-specific-mint
    //get it from the hardcoded token program and create a filter with the actual mint address
    //datasize:165 filter selects all token accounts, memcmp filter selects based on the mint address withing each token account
    const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    return this._provider.connection.getParsedProgramAccounts(tokenProgram, {
      filters: [
        { dataSize: 165 },
        { memcmp: { offset: 0, bytes: this._config.borrowing.accounts.mint.HBB.toBase58() } },
      ],
    });
  }

  /**
   * Get Hubble's global config values
   */
  async getGlobalConfig(): Promise<GlobalConfig> {
    let globalConfig = (await this._borrowingProgram.account.globalConfig.fetch(
      this._config.borrowing.accounts.globalConfig!
    )) as GlobalConfig;
    globalConfig = replaceBigNumberWithDecimal(globalConfig);
    return globalConfig;
  }

  /**
   * Get PSM reserve state
   */
  async getPsmReserve(): Promise<PsmReserve> {
    const psmPubkey = await this.getPsmPublicKey();
    const reserve = (await this._borrowingProgram.account.psmReserve.fetch(psmPubkey)) as PsmReserve;
    return replaceBigNumberWithDecimal(reserve);
  }

  /**
   * Get PSM public key
   */
  async getPsmPublicKey(): Promise<PublicKey> {
    const res = await PublicKey.findProgramAddress(
      [Buffer.from('PSM'), this._config.borrowing.accounts.USDC!.toBuffer()],
      this._config.borrowing.programId
    );
    return res[0];
  }

  /**
   * Get the USDC -> USDH swap information
   * @param usdcInAmount number of USDC tokens
   * @param slippage
   */
  async getUsdcToUsdhSwap(usdcInAmount: Decimal, slippage: Decimal = new Decimal(0)): Promise<SwapInfo> {
    const psmReserve = await this.getPsmReserve();

    // we would be minting USDH with this operation

    // remaining USDC = max capacity - deposited,
    // this is the amount of USDC that can be stored inside the PSM reserve
    // we can only mint max this much USDH
    const availableUsdc = psmReserve.maxCapacity
      .dividedBy(10 ** psmReserve.stablecoinMintDecimals)
      .minus(psmReserve.depositedStablecoin.dividedBy(10 ** psmReserve.stablecoinMintDecimals));
    let outAmount = usdcInAmount;
    if (usdcInAmount.greaterThan(availableUsdc)) {
      outAmount = new Decimal(0);
    }
    return {
      fees: new Decimal(0), // TODO after fees are implemented
      slippage: new Decimal(0), // TODO: there is no slippage (currently) with PSM
      inAmount: usdcInAmount,
      outAmount,
    };
  }

  /**
   * Get the USDH -> USDC swap information
   * @param usdhInAmount number of USDH tokens
   * @param slippage
   */
  async getUsdhToUsdcSwap(usdhInAmount: Decimal, slippage: Decimal = new Decimal(0)): Promise<SwapInfo> {
    const psmReserve = await this.getPsmReserve();
    let outAmount = new Decimal(0);

    // we are burning USDH with this operation and we can only burn as much as there is deposited_stablecoin inside psm reserve
    const usdcAvailable = psmReserve.depositedStablecoin.dividedBy(10 ** psmReserve.stablecoinMintDecimals);
    if (usdhInAmount.lessThanOrEqualTo(usdcAvailable)) {
      outAmount = usdhInAmount;
    }
    return {
      fees: new Decimal(0), // TODO: after fees are implemented
      slippage: new Decimal(0), // TODO: there is no slippage (currently) with PSM
      inAmount: usdhInAmount,
      outAmount,
    };
  }
}

export default Hubble;

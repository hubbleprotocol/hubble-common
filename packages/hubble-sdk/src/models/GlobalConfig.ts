import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

export type GlobalConfig = {
  version: number;
  userBorrowMin: Decimal;
  userBorrowMax: Decimal;
  userDebtMin: Decimal;
  userDebtMax: Decimal;
  treasuryFeeRate: Decimal;
  protocolEpoch: Decimal;
  oracleProgramId: PublicKey;
  delegateCollateralAllowActiveOnly: boolean;
  blockWithdrawCollateral: boolean;
  blockTryLiquidate: boolean;
  blockBorrow: boolean;
  blockDepositAndBorrow: boolean;
  blockClearLiquidationGains: boolean;
  blockHarvestLiquidationGains: boolean;
  blockWithdrawStability: boolean;
  blockAirdropHbb: boolean;
  emergencyMode: boolean;
  userDepositMax: Decimal;
  totalDepositMax: Decimal;
  issuancePerMinute: Decimal;
  useIssuancePerMinute: boolean;
  scopeProgramId: PublicKey;
};

export default GlobalConfig;

import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

export type GlobalConfig = {
  version: number;
  user_borrow_min: Decimal;
  user_borrow_max: Decimal;
  user_debt_min: Decimal;
  user_debt_max: Decimal;
  treasury_fee_rate: Decimal;
  protocol_epoch: Decimal;
  oracle_program_id: PublicKey;
  delegate_collateral_allow_active_only: boolean;
  block_withdraw_collateral: boolean;
  block_try_liquidate: boolean;
  block_borrow: boolean;
  block_deposit_and_borrow: boolean;
  block_clear_liquidation_gains: boolean;
  block_harvest_liquidation_gains: boolean;
  block_withdraw_stability: boolean;
  block_airdrop_hbb: boolean;
  emergency_mode: boolean;
  user_deposit_max: Decimal;
  total_deposit_max: Decimal;
  issuance_per_minute: Decimal;
  use_issuance_per_minute: boolean;
  scope_program_id: PublicKey;
};

export default GlobalConfig;

import { AccountInfo, PublicKey } from '@solana/web3.js';

type AccountIdentifier = {
  publicKey: PublicKey;
};

export type Account<T = any> = AccountInfo<T> & AccountIdentifier;

export type NativeAccount = Account<null>;

export type MarketAccount = Account<any>;

import { PublicKey } from '@solana/web3.js';

export type SerumMarketsConfig = {
  SOL: {
    marketAddress: PublicKey;
    requestQueue: PublicKey;
    eventQueue: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    vaultOwner: PublicKey;
    bidsAddress: PublicKey;
    asksAddress: PublicKey;
  };
  ETH: {
    marketAddress: PublicKey;
    requestQueue: PublicKey;
    eventQueue: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    vaultOwner: PublicKey;
    bidsAddress: PublicKey;
    asksAddress: PublicKey;
  };
  BTC: {
    marketAddress: PublicKey;
    requestQueue: PublicKey;
    eventQueue: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    vaultOwner: PublicKey;
    bidsAddress: PublicKey;
    asksAddress: PublicKey;
  };
  SRM: {
    marketAddress: PublicKey;
    requestQueue: PublicKey;
    eventQueue: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    vaultOwner: PublicKey;
    bidsAddress: PublicKey;
    asksAddress: PublicKey;
  };
  RAY: {
    marketAddress: PublicKey;
    requestQueue: PublicKey;
    eventQueue: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    vaultOwner: PublicKey;
    bidsAddress: PublicKey;
    asksAddress: PublicKey;
  };
  FTT: {
    marketAddress: PublicKey;
    requestQueue: PublicKey;
    eventQueue: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    vaultOwner: PublicKey;
    bidsAddress: PublicKey;
    asksAddress: PublicKey;
  };
  MSOL: {
    marketAddress: PublicKey;
    requestQueue: PublicKey;
    eventQueue: PublicKey;
    baseVault: PublicKey;
    quoteVault: PublicKey;
    vaultOwner: PublicKey;
    bidsAddress: PublicKey;
    asksAddress: PublicKey;
  };
};

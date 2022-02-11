import { PublicKey } from '@solana/web3.js';

export type PythConfig = {
  solProductInfo: PublicKey;
  solPriceInfo: PublicKey;
  ethProductInfo: PublicKey;
  ethPriceInfo: PublicKey;
  btcProductInfo: PublicKey;
  btcPriceInfo: PublicKey;
  srmProductInfo: PublicKey;
  srmPriceInfo: PublicKey;
  rayProductInfo: PublicKey;
  rayPriceInfo: PublicKey;
  fttProductInfo: PublicKey;
  fttPriceInfo: PublicKey;
  msolProductInfo: PublicKey | undefined;
  msolPriceInfo: PublicKey | undefined;
};

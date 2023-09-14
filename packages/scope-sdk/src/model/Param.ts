import { PublicKey } from '@solana/web3.js';

export type FeedParam = {
  /**
   * The feed configuration account PDA seed
   */
  feed?: string;

  /**
   * Scope feed configuration account pubkey
   */
  config?: PublicKey;
};

export function validateFeedParam(feedParam?: FeedParam) {
  if (feedParam) {
    const { feed, config } = feedParam;
    if (feed && config) {
      throw new Error('Only one of feed or config is allowed');
    }
  }
}

export type PricesParam = FeedParam & {
  /**
   * Scope prices account
   */
  prices?: PublicKey;
};

export function validatePricesParam(pricesParam?: PricesParam) {
  if (pricesParam) {
    validateFeedParam(pricesParam);
    const { feed, config, prices } = pricesParam;
    if ((feed || config) && prices) {
      throw new Error(`Only one of feed, config, or prices is allowed. Received ${JSON.stringify(pricesParam)}`);
    }
  }
}

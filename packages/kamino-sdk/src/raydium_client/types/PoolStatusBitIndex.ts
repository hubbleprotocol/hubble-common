import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface OpenPositionOrIncreaseLiquidityJSON {
  kind: 'OpenPositionOrIncreaseLiquidity';
}

export class OpenPositionOrIncreaseLiquidity {
  static readonly discriminator = 0;
  static readonly kind = 'OpenPositionOrIncreaseLiquidity';
  readonly discriminator = 0;
  readonly kind = 'OpenPositionOrIncreaseLiquidity';

  toJSON(): OpenPositionOrIncreaseLiquidityJSON {
    return {
      kind: 'OpenPositionOrIncreaseLiquidity',
    };
  }

  toEncodable() {
    return {
      OpenPositionOrIncreaseLiquidity: {},
    };
  }
}

export interface DecreaseLiquidityJSON {
  kind: 'DecreaseLiquidity';
}

export class DecreaseLiquidity {
  static readonly discriminator = 1;
  static readonly kind = 'DecreaseLiquidity';
  readonly discriminator = 1;
  readonly kind = 'DecreaseLiquidity';

  toJSON(): DecreaseLiquidityJSON {
    return {
      kind: 'DecreaseLiquidity',
    };
  }

  toEncodable() {
    return {
      DecreaseLiquidity: {},
    };
  }
}

export interface CollectFeeJSON {
  kind: 'CollectFee';
}

export class CollectFee {
  static readonly discriminator = 2;
  static readonly kind = 'CollectFee';
  readonly discriminator = 2;
  readonly kind = 'CollectFee';

  toJSON(): CollectFeeJSON {
    return {
      kind: 'CollectFee',
    };
  }

  toEncodable() {
    return {
      CollectFee: {},
    };
  }
}

export interface CollectRewardJSON {
  kind: 'CollectReward';
}

export class CollectReward {
  static readonly discriminator = 3;
  static readonly kind = 'CollectReward';
  readonly discriminator = 3;
  readonly kind = 'CollectReward';

  toJSON(): CollectRewardJSON {
    return {
      kind: 'CollectReward',
    };
  }

  toEncodable() {
    return {
      CollectReward: {},
    };
  }
}

export interface SwapJSON {
  kind: 'Swap';
}

export class Swap {
  static readonly discriminator = 4;
  static readonly kind = 'Swap';
  readonly discriminator = 4;
  readonly kind = 'Swap';

  toJSON(): SwapJSON {
    return {
      kind: 'Swap',
    };
  }

  toEncodable() {
    return {
      Swap: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.PoolStatusBitIndexKind {
  if (typeof obj !== 'object') {
    throw new Error('Invalid enum object');
  }

  if ('OpenPositionOrIncreaseLiquidity' in obj) {
    return new OpenPositionOrIncreaseLiquidity();
  }
  if ('DecreaseLiquidity' in obj) {
    return new DecreaseLiquidity();
  }
  if ('CollectFee' in obj) {
    return new CollectFee();
  }
  if ('CollectReward' in obj) {
    return new CollectReward();
  }
  if ('Swap' in obj) {
    return new Swap();
  }

  throw new Error('Invalid enum object');
}

export function fromJSON(obj: types.PoolStatusBitIndexJSON): types.PoolStatusBitIndexKind {
  switch (obj.kind) {
    case 'OpenPositionOrIncreaseLiquidity': {
      return new OpenPositionOrIncreaseLiquidity();
    }
    case 'DecreaseLiquidity': {
      return new DecreaseLiquidity();
    }
    case 'CollectFee': {
      return new CollectFee();
    }
    case 'CollectReward': {
      return new CollectReward();
    }
    case 'Swap': {
      return new Swap();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], 'OpenPositionOrIncreaseLiquidity'),
    borsh.struct([], 'DecreaseLiquidity'),
    borsh.struct([], 'CollectFee'),
    borsh.struct([], 'CollectReward'),
    borsh.struct([], 'Swap'),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}

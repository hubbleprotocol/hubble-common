import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh';

export interface UninitializedJSON {
  kind: 'Uninitialized';
}

export class Uninitialized {
  static readonly discriminator = 0;
  static readonly kind = 'Uninitialized';
  readonly discriminator = 0;
  readonly kind = 'Uninitialized';

  toJSON(): UninitializedJSON {
    return {
      kind: 'Uninitialized',
    };
  }

  toEncodable() {
    return {
      Uninitialized: {},
    };
  }
}

export interface InitializedJSON {
  kind: 'Initialized';
}

export class Initialized {
  static readonly discriminator = 1;
  static readonly kind = 'Initialized';
  readonly discriminator = 1;
  readonly kind = 'Initialized';

  toJSON(): InitializedJSON {
    return {
      kind: 'Initialized',
    };
  }

  toEncodable() {
    return {
      Initialized: {},
    };
  }
}

export interface OpeningJSON {
  kind: 'Opening';
}

export class Opening {
  static readonly discriminator = 2;
  static readonly kind = 'Opening';
  readonly discriminator = 2;
  readonly kind = 'Opening';

  toJSON(): OpeningJSON {
    return {
      kind: 'Opening',
    };
  }

  toEncodable() {
    return {
      Opening: {},
    };
  }
}

export interface EndedJSON {
  kind: 'Ended';
}

export class Ended {
  static readonly discriminator = 3;
  static readonly kind = 'Ended';
  readonly discriminator = 3;
  readonly kind = 'Ended';

  toJSON(): EndedJSON {
    return {
      kind: 'Ended',
    };
  }

  toEncodable() {
    return {
      Ended: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RewardStateKind {
  if (typeof obj !== 'object') {
    throw new Error('Invalid enum object');
  }

  if ('Uninitialized' in obj) {
    return new Uninitialized();
  }
  if ('Initialized' in obj) {
    return new Initialized();
  }
  if ('Opening' in obj) {
    return new Opening();
  }
  if ('Ended' in obj) {
    return new Ended();
  }

  throw new Error('Invalid enum object');
}

export function fromJSON(obj: types.RewardStateJSON): types.RewardStateKind {
  switch (obj.kind) {
    case 'Uninitialized': {
      return new Uninitialized();
    }
    case 'Initialized': {
      return new Initialized();
    }
    case 'Opening': {
      return new Opening();
    }
    case 'Ended': {
      return new Ended();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], 'Uninitialized'),
    borsh.struct([], 'Initialized'),
    borsh.struct([], 'Opening'),
    borsh.struct([], 'Ended'),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}

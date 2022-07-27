export interface Context {
  apiVersion: string;
  slot: number;
}

export interface TokenAmount {
  amount: string;
  decimals: number;
  uiAmount: number;
  uiAmountString: string;
}

export interface Info {
  isNative: boolean;
  mint: string;
  owner: string;
  state: string;
  tokenAmount: TokenAmount;
}

export interface Parsed {
  info: Info;
  type: string;
}

export interface Data {
  parsed: Parsed;
  program: string;
  space: number;
}

export interface Value {
  data: Data;
  executable: boolean;
  lamports: number;
  owner: string;
  rentEpoch: number;
}

export interface Result {
  context: Context;
  value: Value[];
}

export interface MultipleAccountsResponse {
  jsonrpc: string;
  result: Result;
  id: number;
}

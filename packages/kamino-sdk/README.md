# Kamino SDK

Kamino SDK is a TypeScript client SDK for easy access to the Kamino on-chain data.

## Install

[![npm](https://img.shields.io/npm/v/@hubbleprotocol/kamino-sdk)](https://www.npmjs.com/package/@hubbleprotocol/kamino-sdk)

```shell
npm install @solana/web3.js decimal.js @hubbleprotocol/kamino-sdk
```

## Usage

### Read on-chain data

To read kamino-specific on-chain data, you may use the following methods:

```javascript
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Kamino } from '@hubbleprotocol/kamino-sdk';

const connection = new Connection(clusterApiUrl('mainnet-beta'));
const kamino = new Kamino('mainnet-beta', connection); 

// get all strategies supported by Kamino 
const strategies = await kamino.getStrategies();

// get specific strategy 
const usdhUsdtStrategy = await kamino.getStrategyByName('USDH', 'USDT');
const customStrategy = await kamino.getStrategyByAddress(new PublicKey('my strategy address'));

// get token holders of a strategy
const holders = await kamino.getStrategyHolders(usdhUsdtStrategy);

// get strategy share price
const strategyPrice = await kamino.getStrategySharePrice(usdhUsdtStrategy);
```

### Withdraw shares

Withdraw x amount of strategy shares from a specific shareholder (wallet), example code:

```javascript
import { clusterApiUrl, Connection, PublicKey, sendAndConfirmTransaction, Keypair, Transaction } from '@solana/web3.js';
import { 
  Kamino,
  getAssociatedTokenAddressAndData,
  createTransactionWithExtraBudget,
  getCreateAssociatedTokenAccountInstructionsIfNotExist,
  assignBlockInfoToTransaction
} from '@hubbleprotocol/kamino-sdk';
import Decimal from 'decimal.js';

// setup Kamino SDK
const strategyPubkey = new PublicKey('2H4xebnp2M9JYgPPfUw58uUQahWF8f1YTNxwwtmdqVYV'); // you may also fetch strategies from hubble config
const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu'); // wallet with shares
const connection = new Connection(clusterApiUrl('mainnet-beta'));
const kamino = new Kamino('mainnet-beta', connection);
// setup fee payer (wallet) that will sign the transaction 
const signer = Keypair.generate();

// get on-chain data for a Kamino strategy 
const strategy = await kamino.getStrategyByAddress(strategyPubkey);
if (!strategy) {
  throw Error('Could not fetch strategy from the chain');
}
const strategyWithAddress = { strategy, address: strategyPubkey };

// check if associated token addresses exist for token A, B and shares
const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);

// create a transaction that has an instruction for extra compute budget (withdraw operation needs this),
let tx = createTransactionWithExtraBudget(owner);

// add creation of associated token addresses to the transaction instructions if they don't exist
const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
  owner,
  strategyWithAddress,
  tokenAData,
  tokenAAta,
  tokenBData,
  tokenBAta,
  sharesMintData,
  sharesAta
);
if (ataInstructions.length > 0) {
  tx.add(...ataInstructions);
}

// specify amount of shares to withdraw, e.g. to withdraw 5 shares:
const withdrawIx = await kamino.withdrawShares(strategyWithAddress, new Decimal(5), owner);
tx.add(withdrawIx);

// assign block hash, block height and fee payer to the transaction
tx = await assignBlockInfoToTransaction(connection, tx, signer.publicKey);

const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
  commitment: 'confirmed',
});

```

Withdraw all strategy shares from a specific shareholder (wallet), example code:

```javascript
import { clusterApiUrl, Connection, PublicKey, sendAndConfirmTransaction, Keypair, Transaction } from '@solana/web3.js';
import { 
  Kamino,
  getAssociatedTokenAddressAndData,
  createTransactionWithExtraBudget,
  getCreateAssociatedTokenAccountInstructionsIfNotExist,
  assignBlockInfoToTransaction
} from '@hubbleprotocol/kamino-sdk';
import Decimal from 'decimal.js';

// setup Kamino SDK
const strategyPubkey = new PublicKey('2H4xebnp2M9JYgPPfUw58uUQahWF8f1YTNxwwtmdqVYV'); // you may also fetch strategies from hubble config
const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu'); // wallet with shares
const connection = new Connection(clusterApiUrl('mainnet-beta'));
const kamino = new Kamino('mainnet-beta', connection);
// setup fee payer (wallet) that will sign the transaction 
const signer = Keypair.generate();

// get on-chain data for a Kamino strategy 
const strategy = await kamino.getStrategyByAddress(strategyPubkey);
if (!strategy) {
  throw Error('Could not fetch strategy from the chain');
}
const strategyWithAddress = { strategy, address: strategyPubkey };

// check if associated token addresses exist for token A, B and shares
const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);

// create a transaction that has an instruction for extra compute budget (withdraw operation needs this),
let tx = createTransactionWithExtraBudget(owner);

// add creation of associated token addresses to the transaction instructions if they don't exist
const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
  owner,
  strategyWithAddress,
  tokenAData,
  tokenAAta,
  tokenBData,
  tokenBAta,
  sharesMintData,
  sharesAta
);
if (ataInstructions.length > 0) {
  tx.add(...ataInstructions);
}

// withdraw all strategy shares from the wallet:
const withdrawIx = await kamino.withdrawAllShares(strategyWithAddress, owner);
if (withdrawIx) {
  tx.add(withdrawIx);
} else {
  console.log('Wallet balance is 0 shares, cant withdraw any');
  return;
}

// assign block hash, block height and fee payer to the transaction
tx = await assignBlockInfoToTransaction(connection, tx, signer.publicKey);

const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
  commitment: 'confirmed',
});
```

### Deposit shares

Deposit custom amount of token A and B for a specific strategy, example code:

```javascript
import { clusterApiUrl, Connection, PublicKey, sendAndConfirmTransaction, Keypair, Transaction } from '@solana/web3.js';
import { 
  Kamino,
  getAssociatedTokenAddressAndData,
  createTransactionWithExtraBudget,
  getCreateAssociatedTokenAccountInstructionsIfNotExist,
  assignBlockInfoToTransaction
} from '@hubbleprotocol/kamino-sdk';
import Decimal from 'decimal.js';

// setup Kamino SDK
const strategyPubkey = new PublicKey('2H4xebnp2M9JYgPPfUw58uUQahWF8f1YTNxwwtmdqVYV'); // you may also fetch strategies from hubble config
const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu'); // wallet with shares
const connection = new Connection(clusterApiUrl('mainnet-beta'));
const kamino = new Kamino('mainnet-beta', connection);
// setup fee payer (wallet) that will sign the transaction 
const signer = Keypair.generate();

// get on-chain data for a Kamino strategy 
const strategy = await kamino.getStrategyByAddress(strategyPubkey);
if (!strategy) {
  throw Error('Could not fetch strategy from the chain');
}
const strategyWithAddress = { strategy, address: strategyPubkey };

// check if associated token addresses exist for token A, B and shares
const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);

// create a transaction that has an instruction for extra compute budget (withdraw operation needs this),
let tx = createTransactionWithExtraBudget(owner);

// add creation of associated token addresses to the transaction instructions if they don't exist
const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
  owner,
  strategyWithAddress,
  tokenAData,
  tokenAAta,
  tokenBData,
  tokenBAta,
  sharesMintData,
  sharesAta
);
if (ataInstructions.length > 0) {
  tx.add(...ataInstructions);
}

// specify amount of token A and B to deposit, e.g. to deposit 5 USDH and 5 USDC:
const depositIx = await kamino.deposit(strategyWithAddress, new Decimal(5), new Decimal(5), owner);
tx.add(depositIx);

// assign block hash, block height and fee payer to the transaction
tx = await assignBlockInfoToTransaction(connection, tx, signer.publicKey);

const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
  commitment: 'confirmed',
});
```

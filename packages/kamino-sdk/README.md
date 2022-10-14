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

### Create a Kamino strategy

Create a new Kamino strategy for an existing Orca whirlpool.

Current limitations (planned to be fixed to allow anyone to use this in the near future):
  * Strategy can only be created by the owner (admin) of the global config, we will need to allow non-admins to bypass this check.
  * After the strategy is created, only the owner (admin) can update the treasury fee vault with token A/B, we need to allow non-admins to be able to do (and require) this as well.

```javascript
import { clusterApiUrl, Connection, PublicKey, sendAndConfirmTransaction, Keypair, Transaction } from '@solana/web3.js';
import { 
  Kamino,
  getAssociatedTokenAddressAndData,
  createTransactionWithExtraBudget,
  assignBlockInfoToTransaction
} from '@hubbleprotocol/kamino-sdk';
import Decimal from 'decimal.js';

// generate a new strategy public key
const newStrategy = Keypair.generate();
// setup fee payer (wallet) that will sign the transaction and own the strategy
const signer = Keypair.fromSecretKey('your secret key here');
const owner = signer.publicKey; // or use different public key for owner (admin)

// setup Kamino SDK
const connection = new Connection(clusterApiUrl('mainnet-beta'));
const kamino = new Kamino('mainnet-beta', connection);

// get on-chain data for an existing Orca Whirlpool
const whirlpool = new PublicKey('5vHht2PCHKsApekfPZXyn7XthAYQbsCNiwA1VEcQmL12');
const whirlpoolState = await kamino.getWhirlpoolByAddress(whirlpool);
if (!whirlpool) {
  throw Error('Could not fetch Orca whirlpool from the chain');
}

// create a transaction that has an instruction for extra compute budget
let tx = createTransactionWithExtraBudget(owner);

// check if associated token addresses exist for token A or B
const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, whirlpoolState.tokenAMint, owner);
const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, whirlpoolState.tokenBMint, owner);
if (!tokenAData) {
  tx.add(createAssociatedTokenAccountInstruction(owner, tokenAAta, owner, whirlpoolState.tokenMintA));
}
if (!tokenBData) {
  tx.add(createAssociatedTokenAccountInstruction(owner, tokenBAta, owner, whirlpoolState.tokenMintB));
}

// create a rent exempt strategy account that will contain the Kamino strategy
const createStrategyAccountIx = await kamino.createStrategyAccount(owner, newStrategy.publicKey);
tx.add(createStrategyAccountIx);

// create the actual strategy with USDH as token A and USDC as token B
const createStrategyIx = await kamino.createStrategy(newStrategy.publicKey, whirlpool, owner, 'USDH', 'USDC');
tx.add(createStrategyIx);

tx = await assignBlockInfoToTransaction(connection, tx, owner);

const txHash = await sendAndConfirmTransaction(connection, tx, [signer, newStrategy], {
  commitment: 'finalized',
});

console.log('transaction hash', txHash);
console.log('new strategy has been created', newStrategy.publicKey.toString());

// this will work with 'finalized' transaction commitment level, 
// it might fail if you use anything other than that as the on-chain data won't be updated as quickly
// and you have to wait a bit
const strategy = await kamino.getStrategyByAddress(newStrategy.publicKey);
console.log(strategy?.toJSON());

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
const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu'); // wallet to deposit shares into
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

// create a transaction that has an instruction for extra compute budget (deposit operation needs this),
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

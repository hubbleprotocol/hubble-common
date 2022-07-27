# Kamino SDK

Kamino SDK is a TypeScript client SDK for easy access to the Kamino on-chain data.

## Install

[![npm](https://img.shields.io/npm/v/@hubbleprotocol/kamino-sdk)](https://www.npmjs.com/package/@hubbleprotocol/kamino-sdk)

```shell
npm install @solana/web3.js decimal.js @hubbleprotocol/kamino-sdk
```

## Usage

```javascript
import { clusterApiUrl, Connection } from '@solana/web3.js';

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
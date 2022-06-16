# Scope SDK

The Scope SDK is a TypeScript client SDK for easy access to the [Scope price oracle aggregator](https://github.com/hubbleprotocol/scope/) for Solana.

## Install

[![npm](https://img.shields.io/npm/v/@hubbleprotocol/scope-sdk)](https://www.npmjs.com/package/@hubbleprotocol/scope-sdk)

```shell
npm install @solana/web3.js @hubbleprotocol/scope-sdk
```

## Usage

```javascript
import { Scope, ScopeToken } from '@hubbleprotocol/scope-sdk';
import { clusterApiUrl, Connection } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('mainnet-beta'));
const scope = new Scope('mainnet-beta', web3Client.connection); 

// get all prices supported by Scope Oracle 
const tokens = await scope.getAllPrices();

// get SOL token price 
const token = await scope.getPrice('SOL');
console.log(token.price);

// get multiple tokens prices 
const tokens = await scope.getPrices(['SOL', 'BTC', 'ETH']);
```

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
let token = await scope.getPrice('SOL');
// get SOL price by mint  
token = await scope.getPriceByMint('So11111111111111111111111111111111111111112');
console.log(token.price);

// get multiple tokens prices 
let tokens = await scope.getPrices(['SOL', 'BTC', 'ETH']);
// get multiple token prices by mint
tokens = await scope.getPricesByMints(
  ['So11111111111111111111111111111111111111112',
    '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs']);
```

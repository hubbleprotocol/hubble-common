# Hubble SDK

The Hubble SDK is a TypeScript client SDK for easy access to [Hubble Protocol](https://hubbleprotocol.io) on-chain data and operations.

## Install

[![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-sdk)](https://www.npmjs.com/package/@hubbleprotocol/hubble-sdk)

```shell
npm install @hubbleprotocol/hubble-sdk
```

## Usage

We use [decimal.js](https://github.com/MikeMcl/decimal.js) for everything that can be bigger than Javascript's `number`.

Importing the `Hubble` SDK class:

```js
// For ESM
import Hubble from "@hubbleprotocol/hubble-sdk";

// For CommonJS
const hubble = require("@hubbleprotocol/hubble-sdk");
```

Using the `Hubble` SDK class:

```js
import Hubble from "@hubbleprotocol/hubble-sdk";
import { clusterApiUrl, Connection } from '@solana/web3.js';

// Initialize solana web3 connection
const cluster = 'mainnet-beta';
const connection = new Connection(clusterApiUrl(cluster));
const pubKey = 'aK2dDzV4B5kyxNrF9C5mwNP3yZJMHKeSSUe8LbuZhJY';

// Initialize Hubble SDK class
const hubble = new Hubble(cluster, connection);

// Get user's amount of staked HBB (Hubble token)
const stakedHbb = await hubble.getUserStakedHbb(pubKey);

// Get all of user's loans (debt + collateral)
const loans = await hubble.getUserLoans(pubKey);

// Get the amount of stablecoin (USDH) user has deposited in the stability pool
const usdh = await hubble.getUserUsdhInStabilityPool('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');

// Get various on-chain data from the Hubble borrowing program
// This is the raw data that has not been converted yet (everything is in the lamports format)
const stakingPoolState = await hubble.getStakingPoolState();
const stabilityPoolState = await hubble.getStabilityPoolState();
const marketState = await hubble.getBorrowingMarketState();

// Get various user-specific on-chain data 
// This is the raw data that has not been converted yet (everything is in the lamports format)
const userStakingState = await hubble.getUserStakingState(pubKey);
const userStabilityProviderState = await hubble.getUserStabilityProviderState(pubKey);
const userMetadatas = await hubble.getUserMetadatas(pubKey);
```
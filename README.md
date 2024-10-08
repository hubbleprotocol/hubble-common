# Hubble Common 🛰

Hubble common NPM packages.

## Packages

![Release packages](https://github.com/hubbleprotocol/hubble-common/actions/workflows/release_packages.yml/badge.svg)

| Package                         | Description                        | Docs                                         | Version                                                                                                                           |
|---------------------------------|------------------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `@hubbleprotocol/hubble-config` | Hubble Solana config (public keys) | [README](./packages/hubble-config/README.md) | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-config)](https://www.npmjs.com/package/@hubbleprotocol/hubble-config) |
| `@hubbleprotocol/hubble-sdk`    | Hubble Protocol client SDK         | [README](./packages/hubble-sdk/README.md)    | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-sdk)](https://www.npmjs.com/package/@hubbleprotocol/hubble-sdk)       |
| `@hubbleprotocol/hubble-db`     | Hubble Protocol database schema    | [README](./packages/hubble-db/README.md)     | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-db)](https://www.npmjs.com/package/@hubbleprotocol/hubble-db)         |

### Deprecated Packages
| Package                      | Description | Comments                                                                                    | Version                                                                                                                     |
|------------------------------|-------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| `@hubbleprotocol/kamino-sdk` | Kamino SDK  | Moved to: `@kamino-finance/kliquidity-sdk` https://github.com/Kamino-Finance/kliquidity-sdk | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/kamino-sdk)](https://www.npmjs.com/package/@hubbleprotocol/kamino-sdk) |
| `@hubbleprotocol/scope-sdk`  | Scope SDK   | Moved to: `@kamino-finance/scope-sdk` https://github.com/Kamino-Finance/scope-sdk           | [![npm](https://img.shields.io/npm/v/@kamino-finance/scope-sdk)](https://www.npmjs.com/package/@kamino=finance/scope-sdk)   |


## Deployment

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

We use [lernajs](https://lerna.js.org/) for monorepo package management and publishing. 
Versioning and publishing is done automatically (detects changes if any) by Lerna.

Currently, deployment is done manually by using a GitHub Action called [Release NPM packages](./.github/workflows/release_packages.yml). You can only deploy from the `master` branch and can either specify a specific new version number or increase it by specifying `patch` (default), `minor` or `major` to the action input. You may run the action from [here](https://github.com/hubbleprotocol/hubble-common/actions/workflows/release_packages.yml)


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
- `git clone git@github.com:hubbleprotocol/hubble-common.git`
- `cd hubble-common/`
- `npm install`
- Put in your RPC (see below)

## Create a free mainnet RPC:
- go to `https://www.hellomoon.io/dashboard`
- get a mainnet rpc 
- paste it where it says `const clusterUrl: string = 'https://api.mainnet-beta.solana.com';`


## License

[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)


## Installing hubble common

```shell
npm install
npm run bootstrap
```

## Testing hubble common packages

```shell
npm run test
```

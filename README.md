# Hubble Common 🛰

Hubble common NPM packages.

## Packages

![Release packages](https://github.com/hubbleprotocol/hubble-common/actions/workflows/release_packages.yml/badge.svg)

| Package                         | Description                        | Docs                                         | Version                                                                                                                           |
|---------------------------------|------------------------------------|----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `@hubbleprotocol/hubble-config` | Hubble Solana config (public keys) | [README](./packages/hubble-config/README.md) | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-config)](https://www.npmjs.com/package/@hubbleprotocol/hubble-config) |
| `@hubbleprotocol/hubble-idl`    | Hubble IDL for Anchor              | [README](./packages/hubble-idl/README.md)    | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-idl)](https://www.npmjs.com/package/@hubbleprotocol/hubble-idl)       |
| `@hubbleprotocol/hubble-sdk`    | Hubble Protocol client SDK         | [README](./packages/hubble-sdk/README.md)    | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-sdk)](https://www.npmjs.com/package/@hubbleprotocol/hubble-sdk)       |
| `@hubbleprotocol/hubble-db`     | Hubble Protocol database schema    | [README](./packages/hubble-db/README.md)     | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/hubble-db)](https://www.npmjs.com/package/@hubbleprotocol/hubble-db)         |
| `@hubbleprotocol/scope-sdk`     | Scope Oracle SDK                   | [README](./packages/scope-sdk/README.md)     | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/scope-sdk)](https://www.npmjs.com/package/@hubbleprotocol/scope-sdk)         |
| `@hubbleprotocol/kamino-sdk`    | Kamino SDK                         | [README](./packages/kamino-sdk/README.md)    | [![npm](https://img.shields.io/npm/v/@hubbleprotocol/kamino-sdk)](https://www.npmjs.com/package/@hubbleprotocol/kamino-sdk)       |


## Deployment

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

We use [lernajs](https://lerna.js.org/) for monorepo package management and publishing. 
Versioning and publishing is done automatically (detects changes if any) by Lerna.

Currently, deployment is done manually by using a GitHub Action called [Release NPM packages](./.github/workflows/release_packages.yml). You can only deploy from the `master` branch and can either specify a specific new version number or increase it by specifying `patch` (default), `minor` or `major` to the action input. You may run the action from [here](https://github.com/hubbleprotocol/hubble-common/actions/workflows/release_packages.yml).


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

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

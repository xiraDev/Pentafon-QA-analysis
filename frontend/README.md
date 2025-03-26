# Xira Frontend Core

[![Code style][codestyle-img]][codestyle-url]
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/xiraDev/template-voicebot-business/blob/main/LICENSE)

# Get Started

This project was bootstrapped with [Create Vite](https://vitejs.dev/).

## 1. Install

### pnpm

```
pnpm i
```

### npm

```
npm i
or
npm i --legacy-peer-deps
```

### yarn

```
yarn install
```

## 2. Start

```sh
pnpm dev
or
npm dev
or
yarn dev
```

## 3. Build

```sh
pnpm build or npm run build or yarn build
```

Builds the app for production to the `dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your app is ready to be deployed.

## User Guide

You can find detailed instructions on using Create Vite App and many tips in [its documentation](https://vitejs.dev/guide/).

## Encrypt

To enable E2EE encryption just set the environment variable `VITE_ENABLE_CRYPTO_CHANNEL` to true.

By default the variable is empty which will disable this option.

# Commitlint

Get high commit message quality and short feedback cycles by linting commit messages right when they are authored.

See more about [commintlint](https://commitlint.js.org/#/guides-local-setup?id=guide-local-setup)

## Husky: Activate hooks

A handy git hook helper available.

```sh
npx husky install
or
yarn husky install
```

<!-- Front line badges -->

[codestyle-url]: https://github.com/airbnb/javascript
[codestyle-img]: https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb

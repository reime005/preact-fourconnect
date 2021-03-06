# fourconnect-dapp

[![Netlify Status](https://api.netlify.com/api/v1/badges/deb5f1fd-07e1-4a32-9206-af7d19df697b/deploy-status)](https://app.netlify.com/sites/fourconnect-dapp/deploys)

This repository demonstrates the usage of React, TypeScript and Solidity Smart Contracts on the Ethereum Blockchain to play the game Connect Four. The web app client is developed using the Preact library, which is basically a small subset of React that only includes basic functionality with the premium of having a small footprint. This includes that the code is being written in both JSX and TSX (language with XML). The smart contracts and game logic are covered by tests.

Tech stack:

* Preact with TypeScript (TSX)
* Truffle Framework for deploying and testing Solidity smart contracts
* Drizzle for using smart contracts in JavaScript
* Netlify for continuous integration/deployment

## Try it

[![Check it out on Netlify](https://www.netlify.com/img/deploy/button.svg)](https://fourconnect-dapp.netlify.com/)

## CLI Commands

``` bash
# install dependencies
npm i
# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# test the production build locally
npm run serve

# run tests with jest and preact-render-spy 
npm run test
```

For detailed explanation on how things work, checkout the [CLI Readme](https://github.com/developit/preact-cli/blob/master/README.md).

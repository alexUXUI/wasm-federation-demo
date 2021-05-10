# Federating Wasm Modules

Demo of how Module Federation can be used to federate Wasm modules.

#### Acknowledgements:

This demo is built upon many OSS projects including [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/),
and [Rust Webpack Template](https://github.com/rustwasm/rust-webpack-template).

## Project Dependencies

Please install these two dependencies before beginning:

[Rust](https://www.rust-lang.org/tools/install)

```shell
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

[wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

```shell
$ curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

## Up and Running

From the root of the project run: `yarn && yarn start`. This will start the `Host` and `Remote` applications in dev mode. The `Host` app is hosted on port `3000` and `Remote` is hosted on port `3001`.

Navigate to your browser and open the `Host` on http://localhost:3000.

Using Webpack Module Fededration, the `Host` application dynamically imports a Wasm module from the `Remote` application.

`packages/host/webpack.config.js`

```JavaScript
new ModuleFederationPlugin({
    name: "Host",
    remotes: {
        GameOfLifeModule: `WasmModule@http://localhost:3001/remoteEntry.js`,
    },
}),
```

The `Remote` app uses Webpack Module Federation to expose the Wasm module for consumption by the `Host` app.

```JavaScript
new ModuleFederationPlugin({
    name: "GameOfLifeModule",
    filename: "remoteEntry.js",
    exposes: {
        "./GameOfLifeLogic": "./pkg/",
    },
}),
```

This Wasm module contains the logic for [Conways Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

The usage of the Wasm module can be found in the `packages/host/app.jsx` file on lines 2 and 12. On line 2 we are importing the federated Wasm module:

```jsx
import * as GameOfLife from "GameOfLifeModule/WasmModule";
```

and on line 12 we are consuming the module:

```JavaScript
GameOfLife.then(({ Universe }) => {
  if (!cells) {
    setCells(Universe.new());
  }
});
```

As you can see the Wasm Module exports a class `Universe` which we use to initialize a new Game Of Life on line 14. We then set the instance of the Game in react state on the same line, and refernce the Universe as `cells` throughout the rest of the component.

---

## Packages/Host

Consumer of federated Wasm module. Uses React but could also be written in plain JavaScript like the `Remote`.

---

## Packages/Remote

This package was bootstrapped with the [Rust Webpack Template](https://github.com/rustwasm/rust-webpack-template) project. For more, visit their repo as well as the fabulous docs at the [Rust Wasm webiste](https://rustwasm.github.io/docs/book/).

Exposes Wasm module. Wasm module is built with Rust, compiled by webpack wasm-pack loader.

### How to install

```sh
yarn
```

### How to run in debug mode

```sh
# Builds the project and opens it in a new browser tab. Auto-reloads when the project changes.
yarn start
```

### How to build in release mode

```sh
# Builds the project and places it into the `dist` folder.
yarn run build
```

### How to run unit tests

```sh
# Runs tests in Firefox
yarn test -- --firefox

# Runs tests in Chrome
yarn test -- --chrome

# Runs tests in Safari
yarn test -- --safari
```

### What does each file do?

- `Cargo.toml` contains the standard Rust metadata. You put your Rust dependencies in here. You must change this file with your details (name, description, version, authors, categories)

- `package.json` contains the standard npm metadata. You put your JavaScript dependencies in here. You must change this file with your details (author, name, version)

- `webpack.config.js` contains the Webpack configuration. You shouldn't need to change this, unless you have very special needs.

- The `js` folder contains your JavaScript code (`index.js` is used to hook everything into Webpack, you don't need to change it).

- The `src` folder contains your Rust code.

- The `static` folder contains any files that you want copied as-is into the final build. It contains an `index.html` file which loads the `index.js` file.

- The `tests` folder contains your Rust unit tests.

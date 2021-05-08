# Federating Wasm Modules

Demo of how Module Federation can be used to federate Wasm modules.

#### Acknowledgements:

This demo is built upon many OSS projects including [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/),
and [Rust Webpack Template](https://github.com/rustwasm/rust-webpack-template).

## Up and Running

---

From the root of the project run: `yarn && yarn start`

This will start the `Host` and `Remote` applications in dev mode.

The `Host` app is hosted on port `3000` and `Remote` is hosted on port `3001`.

Navigate to your browser and open the `Host` http://localhost:3000.

Using Module Fededration, the `Host` application dynamically imports a Wasm module from the `Remote` application. The federated Wasm module exports a `greet` function which takes a string arg and passes it to the `window.alert` function.

The `Host` application consumes the Wasm based `greet` function by invoking it in the onClick callback of the "greet" button. Additionally, the Wasm module defined in the `Remote` uses the [web_sys](https://rustwasm.github.io/wasm-bindgen/api/web_sys/) crate, which exposes raw API bindings, for logging to the javascript console _from_ Rust.

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

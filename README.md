# Federating Wasm Modules

Demo of how Module Federation can be used to federate Wasm modules.

## Up and Running

---

From the root of the project run: `yarn && yarn start`

This will use Lerna to start the `Host` and `Remote` applications in dev mode.

Once yarn has installed the dependencies and webpack has bundled the `Host` and `Remote` applications, the `Host` app will be locally hosted on `3000` and `Remote` is hosted on port `3001`.

Navigate to your browser and open the `Host` http://localhost:3000.

Click the "greet" button and the onClick handler for the callback function will call a wasm module that export s a greet function.

---

## Host

Consumer of federated Wasm module. Uses React but could also be written in plain JavaScript like the `Remote`.

---

## Remote

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

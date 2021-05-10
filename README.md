# Federating Wasm Modules

Using Module Federation to dynamically federate Wasm modules between independent applications.

## Up and Running

From the root of the project run:

`yarn && yarn start`.

This will start the `Host` and `Remote` applications in dev mode. The `Host` app is hosted on port `8080` and `Remote` is hosted on port `8081`.

Navigate to your browser and open the `Host` on http://localhost:8080.

## Module Federation

Webpack Module Federation Plugin is what makes it possible to share the Wasm module between our two apps at runtime. Below is a rough, low-fidelity diagram illustrating how webpack is used to share code.

For more on Module federation, see the [docs](https://webpack.js.org/concepts/module-federation/)
and checkout this [write-up](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669).

![Diagram](https://raw.githubusercontent.com/alexUXUI/wasm-federation-demo/main/diagram.png)

As seen in the diagram above, the `Host` application dynamically imports a Wasm module from the `Remote` application. Let's see how this is implemented in our webpack configs.

Host configs: `packages/host/webpack.config.js`

```JavaScript
new ModuleFederationPlugin({
  name: "Host",
  remotes: {
    GameOfLifeModule: `GameOfLifeModule@http://localhost:8081/remoteEntry.js`,
  },
}),
```

Remote configs: `packages/remote/webpack.config.js`

```JavaScript
new ModuleFederationPlugin({
  name: "GameOfLifeModule",
  filename: "remoteEntry.js",
  exposes: {
    "./GameOfLifeModule": "./pkg/",
  },
}),
```

The `Remote` app uses Webpack Module Federation to expose the Wasm module for consumption by the `Host` app. As pictured above, the `./pkg` code will be made available through the `http://localhost:8081/remoteEntry.js` file.

## Wasm

The `GameOfLife` Wasm module, pictured above as `GameOfLifeModule`, contains the logic for [Conways Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). The source code for this particular implementation was borrowed from [The Offical Rust Wasm Docs.](https://rustwasm.github.io/docs/book/game-of-life/implementing.html)

The concumption and usage of our Wasm module can be found in the `packages/host/app.jsx` file on lines 2 and 12.

On line 2 we are importing the federated Wasm module:

```JavaScript
import * as GameOfLife from "GameOfLifeModule/GameOfLifeModule";
```

and on line 12 we are consuming the module:

```JavaScript
GameOfLife.then(({ Universe }) => {
  if (!cells) {
    setCells(Universe.new());
  }
});
```

In the example above, the Wasm Module exports a class `Universe` which we use to initialize a new Game Of Life. We then set the instance of the new Universe in a slice of react state on the same line, and refernce the Universe as `cells` throughout the rest of the component. This allows us to use react to control a Wasm module that is being federated into react from a completely stand-alonle remote app.

## Local Development

In order to run the Rust->Wasm toolchain, pleas make sure you have the project dependencies in the next section installed.
Once those are installed, you can start developing on the `Remote` app or the `Host` app with `yarn start`.

## Project Dependencies

Please install these two dependencies before beginning:

Install [Rust](https://www.rust-lang.org/tools/install)

```shell
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Source your bash profile after the step above.

Install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

```shell
$ curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

## `Packages/Host`

Consumer of federated Wasm module. Uses React to interact with the federated Wasm module but could also be written in plain JavaScript like the `Remote`.

## `Packages/Remote`

Exposes Wasm module. Wasm module is built with Rust, compiled by webpack wasm-pack loader.

> This package was bootstrapped with the [Rust Webpack Template](https://github.com/rustwasm/rust-webpack-template) project. For more, visit their repo as well as the fabulous docs at the [Rust Wasm webiste](https://rustwasm.github.io/docs/book/).

#### Acknowledgements:

This demo is built upon many OSS projects including [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/),
and [Rust Webpack Template](https://github.com/rustwasm/rust-webpack-template).

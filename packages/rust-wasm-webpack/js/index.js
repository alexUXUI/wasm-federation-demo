import("../pkg/index.js")
  .then((data) => {
    console.log(`loaded Wasm module`);
    console.log(data);
  })
  .catch(console.error);

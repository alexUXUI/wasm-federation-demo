import("../pkg/index.js")
  .then((data) => {
    console.log(`loaded Wasm module`);
    console.log(data);
    data.greet("from local app");
  })
  .catch(console.error);

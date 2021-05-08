import React, { useState } from "react";

import * as WasmModule from "WasmModule/WasmModule";

const App = () => {
  const handleClick = (e) => {
    e.preventDefault();
    WasmModule.then(({ greet }) => {
      greet("World!");
    }).catch(console.error);
  };

  return (
    <main>
      <h1>Host App</h1>
      <button onClick={handleClick}>Greet</button>
    </main>
  );
};

export default App;

import React, { useState } from "react";
import GameOfLife from "GameOfLife/GameOfLife";

import * as WasmModule from "WasmModule/WasmModule";

const App = () => {
  const handleClick = (e) => {
    e.preventDefault();
    import("WasmModule/WasmModule")
      .then(({ greet }) => {
        greet("World!");
      })
      .catch(console.error);
  };

  return (
    <div>
      <h1>Game Directory</h1>
      <h4>Games:</h4>
      <button onClick={handleClick}>Greet</button>
      <ul>
        <li>
          <GameOfLife />
        </li>
      </ul>
    </div>
  );
};

export default App;

import React from "react";
import GameOfLife from "GameOfLife/GameOfLife";

import("WasmModule/WasmModule")
  .then((data) => {
    console.log(`loaded Wasm module`);
    console.log(`YOOO`);

    if (data) {
      console.log(`have data`);
      if (data.Universe) {
        console.log(`have universe`);

        const pre = document.getElementById("game-of-life-canvas");
        const universe = data.Universe();

        const renderLoop = () => {
          pre.textContent = universe.render();
          universe.tick();
          console.log(`render`);
          requestAnimationFrame(renderLoop);
        };

        requestAnimationFrame(renderLoop);
      }
    }
  })
  .catch(console.error);

const App = () => {
  return (
    <div>
      <h1>Game Directory</h1>
      <h4>Games:</h4>
      <ul>
        <li>
          <GameOfLife />
        </li>
      </ul>
    </div>
  );
};

export default App;

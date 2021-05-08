import React, { useLayoutEffect, useRef, useState } from "react";
import * as WasmModule from "WasmModule/WasmModule";

const App = () => {
  const gameOfLifeBoard = useRef();

  useLayoutEffect(() => {
    WasmModule.then((data) => {
      const universe = data.Universe.new();

      const renderLoop = () => {
        if (gameOfLifeBoard?.current) {
          gameOfLifeBoard.current.textContent = universe.render();
          universe.tick();
          requestAnimationFrame(renderLoop);
        }
      };

      requestAnimationFrame(renderLoop);
    });
  });

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
      <div ref={gameOfLifeBoard}></div>
    </main>
  );
};

export default App;

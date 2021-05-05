import React from "react";
import GameOfLife from "GameOfLife/GameOfLife";

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

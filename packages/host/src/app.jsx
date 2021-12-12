import React, { useLayoutEffect, useRef, useState } from "react";
import Game from "./game-of-life.component";
import VizComponent from "./viz.comopnent";

const App = () => {
  return (
    <main>
      <VizComponent />
      {/* <Game /> */}
    </main>
  );
};

export default App;

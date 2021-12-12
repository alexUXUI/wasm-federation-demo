import React, { useLayoutEffect, useRef, useState } from "react";
import * as Viz from "Viz/Viz";

// functional component for viz
export default function VizComponent(props) {
  useLayoutEffect(() => {
    Viz.then((mod) => {
      mod.init_viz();
    });
  }, []);
  return (
    <div>
      <h1>Viz</h1>
    </div>
  );
}

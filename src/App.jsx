import React from "react";
import ExcelClone from "./ExcelClone";

function App() {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Excel Clone</h1>
      <ExcelClone rows={10} columns={10} />
    </div>
  );
}

export default App;

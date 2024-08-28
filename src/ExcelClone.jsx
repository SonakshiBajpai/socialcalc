import React, { useState, useEffect } from "react";
import "./ExcelClone.css";

const defaultProperties = {
  text: "",
  fontWeight: "",
  fontStyle: "",
  textDecoration: "",
  textAlign: "left",
  backgroundColor: "#ffffff",
  color: "#000000",
  fontFamily: "Noto Sans",
  fontSize: "14px",
};

const ExcelClone = () => {
  const [cellData, setCellData] = useState({ Sheet1: {} });
  const [selectedSheet, setSelectedSheet] = useState("Sheet1");
  const [totalSheets, setTotalSheets] = useState(1);
  const [lastlyAddedSheet, setLastlyAddedSheet] = useState(1);
  const [selectedCells, setSelectedCells] = useState([]);
  const [cut, setCut] = useState(false);
  const [columnWidths, setColumnWidths] = useState({});
  const [rowHeights, setRowHeights] = useState({});

  useEffect(() => {
    createGrid();
  }, []);

  const createGrid = () => {
    let cols = [];
    let rows = [];
    for (let i = 1; i <= 100; i++) {
      cols.push(getColumnName(i));
      rows.push(i);
    }
    return { cols, rows };
  };

  const getColumnName = (n) => {
    let ans = "";
    while (n > 0) {
      let rem = n % 26;
      if (rem === 0) {
        ans = "Z" + ans;
        n = Math.floor(n / 26) - 1;
      } else {
        ans = String.fromCharCode(rem - 1 + 65) + ans;
        n = Math.floor(n / 26);
      }
    }
    return ans;
  };

  const handleCellClick = (e, row, col) => {
    let updatedCells = [...selectedCells];
    if (e.ctrlKey) {
      // Handle cell selection with Ctrl key
    } else {
      updatedCells = [[row, col]];
      changeHeader(row, col);
    }
    setSelectedCells(updatedCells);
  };

  const changeHeader = (row, col) => {
    let cellInfo = defaultProperties;
    if (cellData[selectedSheet][row] && cellData[selectedSheet][row][col]) {
      cellInfo = cellData[selectedSheet][row][col];
    }
    // Update header UI with cellInfo
  };

  const handleCellBlur = (row, col, value) => {
    updateCell("text", value, row, col);
  };

  const updateCell = (property, value, row, col, defaultPossible = false) => {
    let newData = { ...cellData };
    if (!newData[selectedSheet][row]) {
      newData[selectedSheet][row] = {};
    }
    if (!newData[selectedSheet][row][col]) {
      newData[selectedSheet][row][col] = { ...defaultProperties };
    }
    newData[selectedSheet][row][col][property] = value;
    if (
      defaultPossible &&
      JSON.stringify(newData[selectedSheet][row][col]) ===
        JSON.stringify(defaultProperties)
    ) {
      delete newData[selectedSheet][row][col];
      if (Object.keys(newData[selectedSheet][row]).length === 0) {
        delete newData[selectedSheet][row];
      }
    }
    setCellData(newData);
  };

  const handleSheetChange = (newSheet) => {
    setSelectedSheet(newSheet);
    emptySheet();
    loadSheet(newSheet);
  };

  const emptySheet = () => {
    // Clear the sheet view
  };

  const loadSheet = (sheetName) => {
    // Load sheet data into the grid
  };

  const addNewSheet = () => {
    emptySheet();
    setLastlyAddedSheet(lastlyAddedSheet + 1);
    const newSheet = `Sheet${lastlyAddedSheet + 1}`;
    setCellData({ ...cellData, [newSheet]: {} });
    setSelectedSheet(newSheet);
    setTotalSheets(totalSheets + 1);
  };

  const handleColumnResizeMouseDown = (e, colIndex) => {
    const startX = e.clientX;
    const startWidth = columnWidths[colIndex] || 100;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      setColumnWidths((prev) => ({
        ...prev,
        [colIndex]: newWidth > 50 ? `${newWidth}px` : "50px",
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleRowResizeMouseDown = (e, rowIndex) => {
    const startY = e.clientY;
    const startHeight = rowHeights[rowIndex] || 30;

    const handleMouseMove = (e) => {
      const newHeight = startHeight + (startY - e.clientY);
      setRowHeights((prev) => ({
        ...prev,
        [rowIndex]: newHeight > 20 ? `${newHeight}px` : "20px",
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const { cols, rows } = createGrid();

  return (
    <div className="container">
      <div className="title-bar">Book-1 Excel</div>
      <div className="menu-bar">
        <div className="menu-item">File</div>
        <div className="menu-item selected">Home</div>
        <div className="menu-item">Insert</div>
        <div className="menu-item">Layout</div>
        <div className="menu-item">Help</div>
      </div>
      <div className="menu-icon-bar">
        {/* Add icons and other menu elements here */}
      </div>
      <div className="formula-bar">
        <div className="formula-editor selected-cell"></div>
        <div
          className="formula-editor formula-input"
          contentEditable="true"
        ></div>
      </div>
      <div className="data-container">
        <div className="select-all"></div>
        <div className="column-name-container">
          {cols.map((col, index) => (
            <div key={index} className="column-name-container-item">
              <div
                className={`column-name colId-${index + 1}`}
                style={{ width: columnWidths[index] || "100px" }}
              >
                {col}
              </div>
              <div
                className="resize-handle"
                onMouseDown={(e) => handleColumnResizeMouseDown(e, index)}
              />
            </div>
          ))}
        </div>
        <div className="row-name-container">
          {rows.map((row, index) => (
            <div key={index} className="row-name-container-item">
              <div
                className={`row-name rowId-${index + 1}`}
                style={{ height: rowHeights[index] || "30px" }}
              >
                {row}
              </div>
              <div
                className="resize-handle resize-handle-row"
                onMouseDown={(e) => handleRowResizeMouseDown(e, index)}
              />
            </div>
          ))}
        </div>
        <div className="input-cell-container">
          {rows.map((row) => (
            <div key={row} className="cell-row">
              {cols.map((col, index) => (
                <div
                  key={`${row}-${index}`}
                  className="input-cell"
                  contentEditable="true"
                  style={{
                    width: columnWidths[index] || "100px",
                    height: rowHeights[row - 1] || "30px",
                  }}
                  onClick={(e) => handleCellClick(e, row, index + 1)}
                  onBlur={(e) =>
                    handleCellBlur(row, index + 1, e.target.innerText)
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="sheet-bar">
        <div className="scroller">
          <div className="icon-left-scroll material-icons">arrow_left</div>
          <div className="icon-right-scroll material-icons">arrow_right</div>
        </div>
        <div className="icon-add material-icons" onClick={addNewSheet}>
          add_circle
        </div>
        <div className="sheet-tab-container">
          {Object.keys(cellData).map((sheet, index) => (
            <div
              key={index}
              className={`sheet-tab ${
                selectedSheet === sheet ? "selected" : ""
              }`}
              onClick={() => handleSheetChange(sheet)}
            >
              {sheet}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExcelClone;

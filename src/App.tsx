import React, { useEffect, useState } from "react";
import JSONRendererEditor from "./components/json-render-editor";
import data from "./assets/mock-data/data.json";
import { JsonItem } from "./types";

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<JsonItem[]>([]);

  useEffect(() => {
    setJsonData(data as JsonItem[]); // Type assertion for JSON import
  }, []);

  return (
    <div>
      <h1>JSON Renderer and Editor</h1>
      <JSONRendererEditor data={jsonData} setData={setJsonData} />
    </div>
  );
};

export default App;

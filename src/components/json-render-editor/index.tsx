import React, { useState, useMemo } from "react";
import { JsonItem } from "../../types";
import RenderIfVisible from "../render-if-visible";

interface JSONRendererEditorProps {
  data: JsonItem[];
  setData: React.Dispatch<React.SetStateAction<JsonItem[]>>;
}

const JSONRendererEditor: React.FC<JSONRendererEditorProps> = ({
  data,
  setData,
}) => {
  const [filterText, setFilterText] = useState("");
  const [sortKey, setSortKey] = useState<keyof JsonItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Handle input changes
  const handleInputChange = (id: string, key: keyof JsonItem, value: any) => {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );
    setData(updatedData);
  };

  // Render the appropriate input field
  const renderInputField = (key: string, value: any, itemId: string) => {
    if (key === "id") return value.toString();
    if (typeof value === "boolean") {
      return (
        <>
          <label>
            <input
              type="radio"
              checked={value === true}
              onChange={() =>
                handleInputChange(itemId, key as keyof JsonItem, true)
              }
            />{" "}
            True
          </label>
          <label>
            <input
              type="radio"
              checked={value === false}
              onChange={() =>
                handleInputChange(itemId, key as keyof JsonItem, false)
              }
            />{" "}
            False
          </label>
        </>
      );
    }
    if (typeof value === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) =>
            handleInputChange(
              itemId,
              key as keyof JsonItem,
              parseInt(e.target.value)
            )
          }
        />
      );
    }
    if (typeof value === "string") {
      if (/\S+@\S+\.\S+/.test(value)) {
        return (
          <input
            type="email"
            value={value}
            onChange={(e) =>
              handleInputChange(itemId, key as keyof JsonItem, e.target.value)
            }
          />
        );
      }
      if (value.length > 50) {
        return (
          <textarea
            value={value}
            onChange={(e) =>
              handleInputChange(itemId, key as keyof JsonItem, e.target.value)
            }
          />
        );
      }
      if (/\d{4}-\d{2}-\d{2}/.test(value)) {
        return (
          <input
            type="date"
            value={new Date(value).toISOString().split("T")[0]}
            onChange={(e) =>
              handleInputChange(itemId, key as keyof JsonItem, e.target.value)
            }
          />
        );
      }
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(e) =>
          handleInputChange(itemId, key as keyof JsonItem, e.target.value)
        }
      />
    );
  };

  // Filter data based on search text
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [data, filterText]);

  // Sort data based on selected key and order
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Row renderer for virtualized list
  const renderRows = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = sortedData[index];
    return (
      <RenderIfVisible key={item.id} defaultHeight={50}>
        {Object.entries(item).map(([key, value]) => (
          <td key={key} style={style}>
            {renderInputField(key, value, item.id)}
          </td>
        ))}
      </RenderIfVisible>
    );
  };

  // Handle sorting on column header click
  const handleSort = (key: keyof JsonItem) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filter..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <th key={key} onClick={() => handleSort(key as keyof JsonItem)}>
                  {key}{" "}
                  {sortKey === key ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((_, index) => renderRows({ index, style: {} }))}
        </tbody>
      </table>
    </div>
  );
};

export default JSONRendererEditor;

import React, { useCallback, useMemo, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList as List } from 'react-window'
import { JsonItem } from 'types'
import { useDebounce } from 'use-debounce'

import { Row } from './row'
import s from './styles.module.css'

interface JSONRendererEditorProps {
  data: JsonItem[]
  setData: React.Dispatch<React.SetStateAction<JsonItem[]>>
}

const JSONRendererEditor: React.FC<JSONRendererEditorProps> = ({
  data,
  setData,
}) => {
  const [filterText, setFilterText] = useState('')
  const [sortKey, setSortKey] = useState<keyof JsonItem | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [debouncedFilteredText] = useDebounce(filterText, 500)

  const handleInputChange = useCallback(
    (id: string, key: keyof JsonItem, value: any) => {
      setData(
        data.map((item) => (item.id === id ? { ...item, [key]: value } : item))
      )
    },
    [data, setData]
  )

  const filteredData = useMemo(
    () =>
      data.filter((item) =>
        Object.values(item).some((val) =>
          val
            ?.toString()
            .toLowerCase()
            .includes(debouncedFilteredText.toLowerCase())
        )
      ),
    [data, debouncedFilteredText]
  )

  const sortedData = useMemo(
    () =>
      sortKey
        ? [...filteredData].sort((a, b) => {
            const aValue = a[sortKey]
            const bValue = b[sortKey]
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
            return 0
          })
        : filteredData,
    [filteredData, sortKey, sortOrder]
  )

  const handleSort = useCallback(
    (key: keyof JsonItem) => {
      if (sortKey === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        setSortKey(key)
        setSortOrder('asc')
      }
    },
    [sortKey, sortOrder]
  )

  return (
    <div className={s.root}>
      <input
        type="text"
        placeholder="Filter..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <div style={{ height: '100%', width: '100%' }}>
        <AutoSizer>
          {({ height, width }) => (
            <div style={{ height, width }}>
              <table className={s.table}>
                <thead>
                  <tr>
                    {data.length > 0 &&
                      Object.keys(data[0]).map((key) => (
                        <th
                          key={key}
                          onClick={() => handleSort(key as keyof JsonItem)}
                        >
                          {key}{' '}
                          {sortKey === key
                            ? sortOrder === 'asc'
                              ? '↑'
                              : '↓'
                            : ''}
                        </th>
                      ))}
                  </tr>
                </thead>
              </table>
              <List
                height={300}
                itemCount={sortedData.length}
                itemSize={50}
                width={width}
                itemData={sortedData}
              >
                {({ index, data }) => (
                  <Row data={data[index]} onChange={handleInputChange} />
                )}
              </List>
            </div>
          )}
        </AutoSizer>
      </div>
    </div>
  )
}

export default JSONRendererEditor

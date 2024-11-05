import RenderIfVisible from 'components/render-if-visible'
import React, { useMemo, useState } from 'react'
import { JsonItem } from 'types'
import { useDebounce } from 'use-debounce'

import { InputField } from './input-field'
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

  const handleInputChange = (id: string, key: keyof JsonItem, value: any) => {
    setData(
      data.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    )
  }

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

  const renderRow = (item: JsonItem, style: React.CSSProperties) => (
    <RenderIfVisible key={item.id} defaultHeight={50}>
      {Object.entries(item).map(([key, value]) => (
        <td key={key} style={style}>
          <InputField
            keyCode={key}
            itemId={item.id}
            value={value}
            onChange={handleInputChange}
          />
        </td>
      ))}
    </RenderIfVisible>
  )

  const handleSort = (key: keyof JsonItem) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  return (
    <div className={s.root}>
      <input
        type="text"
        placeholder="Filter..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <table className={s.table}>
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <th key={key} onClick={() => handleSort(key as keyof JsonItem)}>
                  {key}{' '}
                  {sortKey === key ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {!!sortedData.length && sortedData.map((item) => renderRow(item, {}))}
        </tbody>
      </table>
      {!sortedData.length && <div className={s['no-data']}>Нет данных</div>}
    </div>
  )
}

export default JSONRendererEditor

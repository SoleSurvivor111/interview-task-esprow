import clsx from 'clsx'
import memoize from 'memoize-one'
import { FixedSizeList as List } from 'react-window'
import { JsonItem } from 'types'

import { InputField } from '../input-field'
import s from './styles.module.css'

interface ITableProps {
  titles: string[]
  height: number
  width: number
  sortKey: keyof JsonItem | null
  sortOrder: 'asc' | 'desc'
  data: JsonItem[]
  onSort: (key: keyof JsonItem) => void
  onInputChange: (itemId: string, key: keyof JsonItem, value: any) => void
}

const createItemData = memoize(
  (
    items: JsonItem[],
    onInputChange: (itemId: string, key: keyof JsonItem, value: any) => void
  ) => ({
    items,
    onInputChange,
  })
)

export const Table: React.FC<ITableProps> = ({
  titles = [],
  height,
  width,
  sortKey,
  sortOrder,
  data,
  onSort,
  onInputChange,
}) => {
  const itemData = createItemData(data, onInputChange)
  return (
    <div style={{ height, width }} className={s.root}>
      <div className={s['container']}>
        <div className={clsx(s['row'], s['heading'])}>
          {titles.map((key) => (
            <div
              key={key}
              onClick={() => onSort(key as keyof JsonItem)}
              className={s['cell']}
            >
              {key} {sortKey === key ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </div>
          ))}
        </div>
        <List
          height={height - 50}
          itemCount={data.length}
          itemSize={50}
          width={width}
          itemData={itemData}
        >
          {({ index, data, style }) => {
            const item = data.items[index]
            return (
              <div className={s.row} style={style}>
                {Object.entries(item).map(([key, value]) => (
                  <div className={s.cell} key={key}>
                    <InputField
                      keyCode={key}
                      itemId={item.id}
                      value={value}
                      onChange={data.onInputChange}
                    />
                  </div>
                ))}
              </div>
            )
          }}
        </List>
      </div>
    </div>
  )
}

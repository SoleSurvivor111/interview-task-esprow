import { JsonItem } from 'types'
import { InputField } from '../input-field'

import s from './styles.module.css'

interface RowProps {
  data: JsonItem

  onChange: Parameters<typeof InputField>[0]['onChange']
}

export const Row: React.FC<RowProps> = ({ data, onChange }) => {
  return (
    <div className={s.root}>
      {Object.entries(data).map(([key, value]) => (
        <div className={s.cell} key={key}>
          <InputField
            keyCode={key}
            itemId={data.id}
            value={value}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  )
}

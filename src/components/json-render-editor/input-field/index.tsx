import { JsonItem } from 'types'

interface InputFieldProps {
  keyCode: string
  value: any
  itemId: string
  onChange: (itemId: string, key: keyof JsonItem, value: any) => void
}

export const InputField = ({
  keyCode,
  value,
  itemId,
  onChange,
}: InputFieldProps) => {
  if (keyCode === 'id') return value.toString()
  if (typeof value === 'boolean') {
    return (
      <>
        <label>
          <input
            type="radio"
            checked={value === true}
            onChange={() => onChange(itemId, keyCode as keyof JsonItem, true)}
          />{' '}
          True
        </label>
        <label>
          <input
            type="radio"
            checked={value === false}
            onChange={() => onChange(itemId, keyCode as keyof JsonItem, false)}
          />{' '}
          False
        </label>
      </>
    )
  }
  if (typeof value === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) =>
          onChange(itemId, keyCode as keyof JsonItem, parseInt(e.target.value))
        }
      />
    )
  }
  if (typeof value === 'string') {
    if (/\S+@\S+\.\S+/.test(value)) {
      return (
        <input
          type="email"
          value={value}
          onChange={(e) =>
            onChange(itemId, keyCode as keyof JsonItem, e.target.value)
          }
        />
      )
    }
    if (value.length > 50) {
      return (
        <textarea
          value={value}
          onChange={(e) =>
            onChange(itemId, keyCode as keyof JsonItem, e.target.value)
          }
        />
      )
    }
    if (/\d{4}-\d{2}-\d{2}/.test(value)) {
      return (
        <input
          type="date"
          value={new Date(value).toISOString().split('T')[0]}
          onChange={(e) =>
            onChange(itemId, keyCode as keyof JsonItem, e.target.value)
          }
        />
      )
    }
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) =>
        onChange(itemId, keyCode as keyof JsonItem, e.target.value)
      }
    />
  )
}

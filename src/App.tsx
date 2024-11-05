import data from 'assets/mock-data/data.json'
import JSONRendererEditor from 'components/json-render-editor'
import React, { useEffect, useState } from 'react'
import { JsonItem } from 'types'

import s from './App.module.css'

const App: React.FC = () => {
  const [jsonData, setJsonData] = useState<JsonItem[]>([])

  useEffect(() => {
    setJsonData(data as JsonItem[])
  }, [])

  return (
    <div className={s.root}>
      <h1>JSON Editor</h1>
      <JSONRendererEditor data={jsonData} setData={setJsonData} />
    </div>
  )
}

export default App

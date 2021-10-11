import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import {Chat} from './Chat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Chat text="Helo Guys" />
    </div>
  )
}

export default App

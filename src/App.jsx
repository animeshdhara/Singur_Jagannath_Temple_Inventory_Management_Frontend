import { useState } from 'react'
import './App.css'
import MiniDrawer from './components/sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <MiniDrawer/>
      </div>
    </>
  )
}

export default App

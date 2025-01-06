import { useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Routes/Layout'
import Home from './Routes/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Use 'index' for the home page route */}
          <Route index element={<Home />} />  {/* Home route */}
          
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

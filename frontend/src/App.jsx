import { useState } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './Routes/Layout'
import MealManagementHome from './Components/Rashu/MealManagementHome'
import AdminDashboard from './Components/Rashu/AdminDashboard'
import StudentDashboard from './Components/Rashu/StudentDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Use 'index' for the home page route */}
          <Route index element={<MealManagementHome />} />  {/* Home route */}
          <Route path="/StudentDashboard" element={<StudentDashboard/>}/>
          <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
          <Route path="*" element={<MealManagementHome />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Layout from './components/Layout'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

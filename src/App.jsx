import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Simulator from './pages/Simulator'
import Report from './pages/Report'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

import CurrencyListing from './Components/CurrencyListing'
import CurrencyDetails from './Components/CurrencyDetails'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/currencies" />} />
        <Route path="/currencies" element={<CurrencyListing />} />
        <Route path="/currencies/:id" element={<CurrencyDetails />} />
      </Routes>
    </Router>
  )
}

export default App

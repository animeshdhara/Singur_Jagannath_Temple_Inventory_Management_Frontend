import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'
import MainLayout from './components/mainLayout';
import GenerateBarcode from './components/generateBarcode';
import HomePage from './components/homePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<HomePage/>} />
          <Route path="/generate-barcode" element={<GenerateBarcode />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

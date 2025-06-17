import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import MainLayout from './components/mainLayout';
import GenerateBarcode from './components/generateBarcode';
import HomePage from './components/homePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/generate-barcode" element={<GenerateBarcode />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position='top-center' autoClose={3000} theme='colored'/>
    </>
  )
}

export default App

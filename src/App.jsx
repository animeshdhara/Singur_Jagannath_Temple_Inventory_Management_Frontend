import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import MainLayout from './components/mainLayout';
import GenerateBarcode from './components/generateBarcode';
import HomePage from './components/homePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddItemForm from './components/addItemForm';
import UpdateItem from './components/updateItem';
import DeleteItem from './components/deleteItem';
import ShowStocks from './components/showStocks';
import ShowBill from './components/showBill';
import ShowReveneu from './components/showReveneu';
import AccountSettings from './components/accountSettings';
import Login from './components/login';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="/generate-barcode" element={<GenerateBarcode />} />
            <Route path="/addItem" element={<AddItemForm />} />
            <Route path="/updateItem/:id" element={<UpdateItem />} />
            <Route path="/deleteItem" element={<DeleteItem />} />
            <Route path="/showStocks" element={<ShowStocks />} />
            <Route path="/showBill" element={<ShowBill />} />
            <Route path="/showReveneu" element={<ShowReveneu />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer position='top-center' autoClose={3000} theme='colored'/>
    </UserProvider>
  )
}

export default App

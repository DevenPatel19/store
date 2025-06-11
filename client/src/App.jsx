import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import ShowOne from "./pages/ShowOneProduct.jsx";


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/Product/new" element={<AddProduct />} /> 
        <Route path="/Product/:id/edit" mode="edit" element={<EditProduct />} />
        <Route path="/Product/:id" element={<ShowOne />} />
        
        
        

      </Routes>
    </AuthProvider>
     
  );
}

export default App;

import NavbarCustom from "./components/NavbarCustom.jsx";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AddProduct from "./pages/AddProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";
import ShowAllProducts from "./pages/ShowAllProducts.jsx";


function App() {
  return (
    <AuthProvider>
      <NavbarCustom />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/products/new" element={<AddProduct />} /> 
        <Route path="/products/:id/edit" element={<EditProduct />} />
        <Route path="/products" element={<ShowAllProducts />} />
        
        
        

      </Routes>
    </AuthProvider>
     
  );
}

export default App;

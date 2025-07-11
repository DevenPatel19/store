import NavbarCustom from "./components/NavbarCustom.jsx";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import RequireAuth from "./utils/RequireAuth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AddProduct from "./pages/Products/AddProduct.jsx";
import EditProduct from "./pages/Products/EditProduct.jsx";
import ShowAllProducts from "./pages/Products/ShowAllProducts.jsx";
import ViewProduct from "./pages/Products/ViewProducts.jsx";
import CustomerManager from "./pages/Customers/CustomerManager.jsx";
import ViewCustomer from "./pages/Customers/ViewCustomer.jsx";
import AddCustomer from "./pages/Customers/AddCustomer.jsx";
import EditCustomer from "./pages/Customers/EditCustomer.jsx";
import Reports from "./pages/Reports/Reports.jsx";
import Kanban from "./pages/Todo/Kanban.jsx";


function App() {
  return (
    <AuthProvider>
       <div style={{  position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999 }}>
              <NavbarCustom />
      </div>
      <div style={{ marginTop: "56px" }}>

      <Routes>
        <Route path='/login' element={<Login />} />
        

        <Route path='/register' element={<Register />} />

        {/* Protect product routes */}
        <Route path='/' element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/products/new" element={<RequireAuth> <AddProduct /> </RequireAuth>}/>
        <Route path="/products/:id/edit" element={<RequireAuth> <EditProduct /> </RequireAuth> }/>
        <Route path="/products/:id" element={ <RequireAuth> <ViewProduct /> </RequireAuth> }/>
        <Route path="/products" element={ <RequireAuth> <ShowAllProducts /> </RequireAuth> } />

        {/* Protect customer routes */}
        <Route path="/customers/new" element={ <RequireAuth> <AddCustomer /> </RequireAuth> } />
        <Route path="/customers/:id/edit" element={ <RequireAuth> <EditCustomer /> </RequireAuth> } />
        <Route path="/customers/:id" element={ <RequireAuth> <ViewCustomer /> </RequireAuth> } />
        <Route path="/customers" element={ <RequireAuth> <CustomerManager /> </RequireAuth> } />

        {/* Protected todo routes */}
        <Route path="/tasks" element={<RequireAuth> <Kanban /> </RequireAuth>} />

         {/* Reports/Finance */}
  <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
  <Route path="/finance" element={<RequireAuth><Reports /></RequireAuth>} />
      </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

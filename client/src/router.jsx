import NavbarCustom from "@/components/NavbarCustom";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import RequireAuth from "@/utils/RequireAuth";
import {
  Dashboard,
  Login,
  Register,
  Reports,
  Kanban
} from "@/pages";
import {
  AddProduct,
  EditProduct,
  ShowAllProducts,
  ViewProduct
} from "@/pages/Products";
import {
  CustomerManager,
  ViewCustomer,
  AddCustomer,
  EditCustomer
} from "@/pages/Customers";
import {
  Invoices,
  AddInvoices,
  EditInvoices,
  ViewInvoices
} from "@/pages/Invoices";

// Protected route wrapper component
const ProtectedRoute = ({ children }) => (
  <RequireAuth>{children}</RequireAuth>
);

// Navbar positioning component
const NavbarWrapper = () => (
  <div className="navbar-fixed">
    <NavbarCustom />
  </div>
);

const AppRouter = () => {
  return (
    <AuthProvider>
      <NavbarWrapper />
      
      <div className="content-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Product Routes */}
          <Route path="/products">
            <Route index element={<ProtectedRoute><ShowAllProducts /></ProtectedRoute>} />
            <Route path="new" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
            <Route path=":id" element={<ProtectedRoute><ViewProduct /></ProtectedRoute>} />
            <Route path=":id/edit" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customers">
            <Route index element={<ProtectedRoute><CustomerManager /></ProtectedRoute>} />
            <Route path="new" element={<ProtectedRoute><AddCustomer /></ProtectedRoute>} />
            <Route path=":id" element={<ProtectedRoute><ViewCustomer /></ProtectedRoute>} />
            <Route path=":id/edit" element={<ProtectedRoute><EditCustomer /></ProtectedRoute>} />
          </Route>

          {/* Task Management */}
          <Route path="/tasks" element={<ProtectedRoute><Kanban /></ProtectedRoute>} />

          {/* Reports */}
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

          {/* Invoice Routes */}
          <Route path="/invoices">
            <Route index element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
            <Route path="create" element={<ProtectedRoute><AddInvoices /></ProtectedRoute>} />
            <Route path=":id" element={<ProtectedRoute><ViewInvoices /></ProtectedRoute>} />
            <Route path=":id/edit" element={<ProtectedRoute><EditInvoices /></ProtectedRoute>} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default AppRouter;
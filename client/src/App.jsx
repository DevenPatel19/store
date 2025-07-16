import { Routes, Route } from "react-router-dom";
import NavbarCustom from "./components/NavbarCustom"; // Fixed import
import { AuthProvider } from "./context/AuthProvider";
import RequireAuth from "./utils/RequireAuth";

// Main pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reports from "./pages/Reports/Reports";
import Kanban from "./pages/Todo/Kanban";

// Product pages
import {
  AddProduct,
  EditProduct,
  ShowAllProducts,
  ViewProduct,
} from "./pages/Products";

// Customer pages
import {
  CustomerManager,
  ViewCustomer,
  AddCustomer,
  EditCustomer,
} from "./pages/Customers";

// Invoice pages
import {
  InvoiceManager,
  ViewInvoice,
  AddInvoice,
  EditInvoice,
} from "./pages/Invoices";

// Protected route wrapper
const ProtectedRoute = ({ children }) => <RequireAuth>{children}</RequireAuth>;

// Navbar wrapper component
const NavbarWrapper = () => (
  <div className="navbar-fixed">
    <NavbarCustom />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <NavbarWrapper />

      <div className="content-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Product Routes */}
          <Route path="/products">
            <Route
              index
              element={
                <ProtectedRoute>
                  <ShowAllProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute>
                  <ViewProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id/edit"
              element={
                <ProtectedRoute>
                  <EditProduct />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Customer Routes */}
          <Route path="/customers">
            <Route
              index
              element={
                <ProtectedRoute>
                  <CustomerManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <AddCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id"
              element={
                <ProtectedRoute>
                  <ViewCustomer />
                </ProtectedRoute>
              }
            />
            <Route
              path=":id/edit"
              element={
                <ProtectedRoute>
                  <EditCustomer />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Task Management */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Kanban />
              </ProtectedRoute>
            }
          />

          {/* Reports */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* Invoice Routes */}
          <Route path="/invoices">
            <Route
              index
              element={
                <ProtectedRoute>
                  <InvoiceManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/new"
              element={
                <ProtectedRoute>
                  <AddInvoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id"
              element={
                <ProtectedRoute>
                  <ViewInvoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/:id/edit"
              element={
                <ProtectedRoute>
                  <EditInvoice />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

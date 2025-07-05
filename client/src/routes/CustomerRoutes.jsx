// src/routes/CustomerRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import AddCustomer from "../pages/Customers/AddCustomer";
import EditCustomer from "../pages/Customers/EditCustomer";
import CustomerManager from "../pages/Customers/CustomerManager";
import ViewCustomer from "../pages/Customers/ViewCustomer";
import RequireAuth from "../utils/RequireAuth";

const CustomerRoutes = () => (
  <>
    <Route
      path="/customers/new"
      element={
        <RequireAuth>
          <AddCustomer />
        </RequireAuth>
      }
    />
    <Route
      path="/customers/:id/edit"
      element={
        <RequireAuth>
          <EditCustomer />
        </RequireAuth>
      }
    />
    <Route
      path="/customers/:id"
      element={
        <RequireAuth>
          <ViewCustomer />
        </RequireAuth>
      }
    />
    <Route
      path="/customers"
      element={
        <RequireAuth>
          <CustomerManager />
        </RequireAuth>
      }
    />
  </>
);

export default CustomerRoutes;

// src/routes/ProductRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";

import AddProduct from "../pages/Products/AddProduct";
import EditProduct from "../pages/Products/EditProduct";
import ShowAllProducts from "../pages/Products/ShowAllProducts";
import ViewProduct from "../pages/Products/ViewProducts";
import RequireAuth from "../utils/RequireAuth";

const ProductRoutes = () => (
  <>
    <Route
      path="/products/new"
      element={
        <RequireAuth>
          <AddProduct />
        </RequireAuth>
      }
    />
    <Route
      path="/products/:id/edit"
      element={
        <RequireAuth>
          <EditProduct />
        </RequireAuth>
      }
    />
    <Route
      path="/products/:id"
      element={
        <RequireAuth>
          <ViewProduct />
        </RequireAuth>
      }
    />
    <Route
      path="/products"
      element={
        <RequireAuth>
          <ShowAllProducts />
        </RequireAuth>
      }
    />
  </>
);

export default ProductRoutes;

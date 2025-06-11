import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const ProductForm = ({ mode = "add", id = null }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcodes: "",
    quantity: 0,
    threshold: 5,
    price: "",
    category: "",
    photoUrl: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch product data when editing
  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchProduct = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }

          const { data } = await axios.get(`/api/products/${id}`);
          setFormData({
            name: data.name,
            sku: data.sku,
            barcodes: data.barcodes,
            quantity: data.quantity,
            threshold: data.threshold,
            price: data.price,
            category: data.category,
            photoUrl: data.photoUrl,
          });
        } catch (err) {
          console.error("Failed to load product:", err);
          setError("Unable to load product data.");
        }
      };
      fetchProduct();
    }
  }, [mode, id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const payload = {
        ...formData,
        sku: formData.sku.trim().toLowerCase(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        threshold: Number(formData.threshold),
      };

      if (mode === "edit") {
        await axios.put(`/api/products/${id}`, payload);
      } else {
        await axios.post("/api/products", payload);
      }

      navigate("/");
    } catch (err) {
      console.error("Submit failed:", err);
      setError(
        err.response?.data?.message || `Failed to ${mode} product. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-red-600 font-medium mt-10">
        You must be logged in to {mode} a product.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {mode === "edit" ? "Edit Product" : "Add Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Product Name", field: "name", type: "text", required: true },
          { label: "SKU", field: "sku", type: "text", required: true },
          { label: "Barcode", field: "barcodes", type: "text" },
          { label: "Quantity", field: "quantity", type: "number", required: true },
          { label: "Low Stock Threshold", field: "threshold", type: "number" },
          { label: "Price ($)", field: "price", type: "number", required: true },
          { label: "Category", field: "category", type: "text" },
          { label: "Photo URL", field: "photoUrl", type: "text" },
        ].map(({ label, field, type, required }) => (
          <div key={field}>
            <label className="block text-gray-700">{label}</label>
            <input
              type={type}
              value={formData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full p-2 border rounded"
              required={required}
              min={type === "number" ? 0 : undefined}
            />
          </div>
        ))}

        {error && <p className="text-red-600">{error}</p>}

        <button
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
          type="submit"
        >
          {loading ? (mode === "edit" ? "Saving..." : "Adding...") : mode === "edit" ? "Save Changes" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;

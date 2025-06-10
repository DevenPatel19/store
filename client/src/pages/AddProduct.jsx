import React, { useState, useContext } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const AddProduct = () => {
  const { user } = useContext(AuthContext); // Get user context to conditionally render if needed
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    sku: [""],
    barcodes: "",
    quantity: 0,
    threshold: 5,
    price: "",
    category: "",
    photoUrl: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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


      await axios.post("/api/products", payload);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-red-600 font-medium mt-10">
        You must be logged in to add a product.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* SKUs */}
        <div>
          <label className="block text-gray-700">SKU</label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => handleInputChange("sku", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Barcode */}
        <div>
          <label className="block text-gray-700">Barcode</label>
          <input
            type="text"
            value={formData.barcodes}
            onChange={(e) => handleInputChange("barcodes", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            className="w-full p-2 border rounded"
            min={0}
            required
          />
        </div>

        {/* Threshold */}
        <div>
          <label className="block text-gray-700">Low Stock Threshold</label>
          <input
            type="number"
            value={formData.threshold}
            onChange={(e) => handleInputChange("threshold", e.target.value)}
            className="w-full p-2 border rounded"
            min={0}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700">Price ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            className="w-full p-2 border rounded"
            min={0}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Photo URL */}
        <div>
          <label className="block text-gray-700">Photo URL</label>
          <input
            type="text"
            value={formData.photoUrl}
            onChange={(e) => handleInputChange("photoUrl", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600">{error}</p>}

        {/* Submit Button */}
        <button
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
          type="submit"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

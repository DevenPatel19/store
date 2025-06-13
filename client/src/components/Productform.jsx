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
  const [imagePreview, setImagePreview] = useState(""); // New state for image preview
  const [imageError, setImageError] = useState(false); // New state for image loading errors

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

          // Set initial image preview if photoUrl exists
          if (data.photoUrl) {
            setImagePreview(data.photoUrl);
          }
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

   // Update image preview when photo URL changes
    if (field === "photoUrl") {
      setImagePreview(value);
      setImageError(false); // Reset error state when URL changes
    }
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

// Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
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

            {/* Image Preview - only for photoUrl field */}
            {field === "photoUrl" && imagePreview && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                <div className="border rounded-md p-2 bg-gray-50 flex justify-center">
                  {imageError ? (
                    <div className="text-center py-8 text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Could not load image. Please check the URL.
                    </div>
                  ) : (
                    <img 
                      src={imagePreview} 
                      alt="Product preview" 
                      className="max-h-40 max-w-full object-contain"
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
            )}
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

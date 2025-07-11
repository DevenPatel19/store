import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

const ProductForm = ({ mode = "add" }) => {
  const { id } = useParams();
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
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);

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
    if (field === "photoUrl") {
      setImagePreview(value);
      setImageError(false);
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

      navigate("/products");
    } catch (err) {
      console.error("Submit failed:", err);
      setError(err.response?.data?.message || `Failed to ${mode} product. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => setImageError(true);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in to {mode} a product.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-6 text-white relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 -z-10 pointer-events-none"></div>

      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6">{mode === "edit" ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              <label htmlFor={field} className="block mb-1 font-medium">
                {label}
              </label>
              <input
                type={type}
                id={field}
                value={formData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                required={required}
                min={type === "number" ? 0 : undefined}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {field === "photoUrl" && imagePreview && (
                <div className="mt-4 bg-black/20 p-2 rounded-lg text-center border border-white/10">
                  {imageError ? (
                    <div className="text-red-400 text-sm">⚠️ Could not load image. Check the URL.</div>
                  ) : (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="max-h-48 mx-auto object-contain"
                      onError={handleImageError}
                    />
                  )}
                </div>
              )}
            </div>
          ))}

          {error && (
            <div className="text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            }`}
          >
            {loading
              ? mode === "edit"
                ? "Saving..."
                : "Adding..."
              : mode === "edit"
              ? "Save Changes"
              : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

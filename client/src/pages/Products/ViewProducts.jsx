import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { AlertCircle, DollarSign, Hash, Package, X } from "lucide-react";

const ViewProduct = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setError("");
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in to view this product.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center justify-between w-full max-w-lg">
          <div className="flex items-center text-red-300">
            <AlertCircle className="h-6 w-6 mr-2" />
            {error}
          </div>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-300 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-gray-400 text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-6 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 -z-10 pointer-events-none"></div>

      <div className="relative max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {product.photoUrl ? (
          <img
            src={product.photoUrl}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <div className="p-6 space-y-4">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <div className="flex items-center text-green-400">
            <DollarSign className="h-5 w-5 mr-2" />
            <span className="text-lg">${Number(product.price).toFixed(2)}</span>
          </div>
          <div className="flex items-center text-blue-400">
            <Hash className="h-5 w-5 mr-2" />
            Quantity: {product.quantity}
          </div>
          <div className="text-gray-300">
            <span className="font-semibold text-white">Description:</span> {product.description || "—"}
          </div>
          <button
            onClick={() => navigate("/products")}
            className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;

"use client";

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";
import { Package, ArrowLeft, AlertCircle } from "lucide-react";

const ViewCustomer = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await axios.get(`/api/customers/${id}`);
        setCustomer(data);
        setError("");
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load customer. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in to view this customer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-4 relative">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"
        aria-hidden="true"
      ></div>

      <div className="relative max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/customers")}
          className="mb-6 inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition duration-200"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Customer Manager
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="mb-6 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-400" />
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Dismiss
            </button>
          </div>
        ) : !customer ? (
          <div className="flex flex-col items-center justify-center py-20 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 text-center text-gray-300">
            <Package className="mb-6 h-20 w-20 text-gray-400" />
            <h2 className="text-2xl font-bold text-white mb-4">Customer Not Found</h2>
            <p>The requested customer does not exist.</p>
          </div>
        ) : (
          <div className="mt-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-6">{customer.name}</h1>

            <div className="space-y-4 text-gray-300">
              <p>
                <strong className="text-white">Email:</strong> {customer.contact?.email || "-"}
              </p>
              <p>
                <strong className="text-white">Phone:</strong> {customer.contact?.phone || "-"}
              </p>
              <p>
                <strong className="text-white">Status:</strong> {customer.status}
              </p>
              <p>
                <strong className="text-white">Tags:</strong>{" "}
                {customer.tags?.length ? customer.tags.join(", ") : "-"}
              </p>
              <p>
                <strong className="text-white">Notes:</strong> {customer.notes || "-"}
              </p>
              <p>
                <strong className="text-white">Last Interaction:</strong>{" "}
                {customer.lastInteraction
                  ? new Date(customer.lastInteraction).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCustomer;

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "../../api/axios.js";
import { AlertCircle } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 text-white p-6">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 text-center shadow-xl">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">You must be logged in to view this customer.</h2>
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-6 rounded-xl shadow-md">
          <p className="text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-gray-400">
        <p>Customer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-6 text-white relative">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8">
        <button
          onClick={() => navigate("/customers")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-sm text-white border border-white/30 rounded-lg hover:bg-white/20 transition"
        >
          &larr; Back to Customer Manager
        </button>

        <h2 className="text-3xl font-bold mb-6">Customer Details</h2>

        <div className="space-y-4">
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {customer.name}
          </div>

          <div>
            <span className="font-semibold">Email:</span>{" "}
            {customer.contact?.email || "-"}
          </div>

          <div>
            <span className="font-semibold">Phone:</span>{" "}
            {customer.contact?.phone || "-"}
          </div>

          <div>
            <span className="font-semibold">Status:</span>{" "}
            {customer.status}
          </div>

          <div>
            <span className="font-semibold">Tags:</span>{" "}
            {customer.tags?.length ? customer.tags.join(", ") : "-"}
          </div>

          <div>
            <span className="font-semibold">Notes:</span>{" "}
            {customer.notes || "-"}
          </div>

          <div>
            <span className="font-semibold">Last Interaction:</span>{" "}
            {customer.lastInteraction
              ? new Date(customer.lastInteraction).toLocaleDateString()
              : "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomer;

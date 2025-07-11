import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";

const CustomerForm = ({ mode = "add", id }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    contact: { email: "", phone: "" },
    status: "active",
    tags: [],
    notes: "",
    lastInteraction: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchCustomer = async () => {
        setFetching(true);
        try {
          const token = localStorage.getItem("token");
          if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }

          const { data } = await axios.get(`/api/customers/${id}`);
          setFormData({
            name: data.name || "",
            contact: {
              email: data.contact?.email || "",
              phone: data.contact?.phone || "",
            },
            status: data.status || "active",
            tags: data.tags || [],
            notes: data.notes || "",
            lastInteraction: data.lastInteraction
              ? new Date(data.lastInteraction).toISOString().split("T")[0]
              : "",
          });
        } catch (err) {
          console.error("Failed to load customer:", err);
          setError("Unable to load customer data.");
        } finally {
          setFetching(false);
        }
      };
      fetchCustomer();
    }
  }, [mode, id]);

  const handleInputChange = (field, value, isContact = false) => {
    if (isContact) {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleTagsChange = (value) => {
    const tagsArray = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
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
        lastInteraction: formData.lastInteraction || undefined,
      };

      if (mode === "edit") {
        await axios.put(`/api/customers/${id}`, payload);
      } else {
        await axios.post("/api/customers", payload);
      }

      navigate("/customers");
    } catch (err) {
      console.error("Submit failed:", err);
      setError(
        err.response?.data?.message ||
          `Failed to ${mode} customer. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in to {mode} a customer.</p>
        </div>
      </div>
    );
  }

  if (mode === "edit" && fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-6 text-white relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 -z-10 pointer-events-none"></div>

      <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6">{mode === "edit" ? "Edit Customer" : "Add Customer"}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Customer Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={formData.contact.email}
              onChange={(e) => handleInputChange("email", e.target.value, true)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              value={formData.contact.phone}
              onChange={(e) => handleInputChange("phone", e.target.value, true)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lead">Lead</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags.join(", ")}
              onChange={(e) => handleTagsChange(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
              placeholder="e.g. vip, newsletter"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Last Interaction</label>
            <input
              type="date"
              value={formData.lastInteraction}
              onChange={(e) => handleInputChange("lastInteraction", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
              placeholder="Additional notes about this customer"
            ></textarea>
          </div>

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
              : "Add Customer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;

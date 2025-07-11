import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Package, Plus, AlertCircle, X, Eye, Edit3, Trash2 } from "lucide-react";

const CustomerManager = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingIds, setDeletingIds] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalStatus, setModalStatus] = useState("active");
  const [modalTags, setModalTags] = useState("");
  const [modalNotes, setModalNotes] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const { data } = await axios.get("/api/customers");
      setCustomers(data);
      setError("");
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.response?.data?.message || "Failed to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (customer = null) => {
    setEditingCustomer(customer);
    setModalName(customer?.name || "");
    setModalEmail(customer?.contact?.email || "");
    setModalPhone(customer?.contact?.phone || "");
    setModalStatus(customer?.status || "active");
    setModalTags(customer?.tags?.join(", ") || "");
    setModalNotes(customer?.notes || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setModalName("");
    setModalEmail("");
    setModalPhone("");
    setModalStatus("active");
    setModalTags("");
    setModalNotes("");
  };

  const saveCustomer = async (e) => {
    e.preventDefault();

    const tagsArray = modalTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const customerData = {
      name: modalName,
      contact: { email: modalEmail, phone: modalPhone },
      status: modalStatus,
      tags: tagsArray,
      notes: modalNotes,
    };

    try {
      const token = localStorage.getItem("token");
      if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (editingCustomer) {
        await axios.put(`/api/customers/${editingCustomer._id}`, customerData);
      } else {
        await axios.post("/api/customers", customerData);
      }
      closeModal();
      fetchCustomers();
    } catch (err) {
      console.error("Failed to save customer:", err);
      alert(err.response?.data?.message || "Could not save customer. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      setDeletingIds((prev) => [...prev, id]);
      const token = localStorage.getItem("token");
      if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await axios.delete(`/api/customers/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete customer:", err);
      alert(err.response?.data?.message || "Could not delete customer. Please try again.");
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in to view customers.</p>
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

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Customer Manager</h1>
              <p className="text-gray-300">Manage your customer database</p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Customer
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-center">Loading customers...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-300">{error}</span>
            </div>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-300 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && customers.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 text-center">
              <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">No Customers Found</h2>
              <p className="text-gray-300 mb-8">Start by adding your first customer!</p>
              <button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Customer
              </button>
            </div>
          </div>
        )}

        {/* Customer Cards */}
        {!loading && !error && customers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {customers.map((customer) => {
              const isDeleting = deletingIds.includes(customer._id);
              return (
                <div
                  key={customer._id}
                  className="group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:bg-white/15 hover:border-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 truncate">{customer.name}</h3>
                    <p className="text-gray-300 mb-1">
                      <strong>Email:</strong> {customer.contact?.email || "-"}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <strong>Phone:</strong> {customer.contact?.phone || "-"}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <strong>Status:</strong> {customer.status}
                    </p>
                    <p className="text-gray-300 mb-1">
                      <strong>Tags:</strong> {customer.tags?.join(", ") || "-"}
                    </p>
                    <p className="text-gray-300 mb-4 truncate" title={customer.notes}>
                      <strong>Notes:</strong> {customer.notes || "-"}
                    </p>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => navigate(`/customers/${customer._id}`)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center text-sm"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => openModal(customer)}
                        className=" flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center text-sm"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id)}
                        disabled={isDeleting}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                      >
                        {isDeleting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-10 blur-xl pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">
                {editingCustomer ? "Edit Customer" : "Add Customer"}
              </h2>

              <form onSubmit={saveCustomer} className="space-y-4 text-gray-300">
                <div>
                  <label htmlFor="name" className="block mb-1 font-semibold">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    required
                    className="w-full rounded-md bg-slate-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Customer name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 font-semibold">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    className="w-full rounded-md bg-slate-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Customer email"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-1 font-semibold">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    className="w-full rounded-md bg-slate-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Customer phone"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block mb-1 font-semibold">
                    Status
                  </label>
                  <select
                    id="status"
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="w-full rounded-md bg-slate-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block mb-1 font-semibold">
                    Tags (comma separated)
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={modalTags}
                    onChange={(e) => setModalTags(e.target.value)}
                    className="w-full rounded-md bg-slate-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g. vip, important, newsletter"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block mb-1 font-semibold">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    rows="3"
                    value={modalNotes}
                    onChange={(e) => setModalNotes(e.target.value)}
                    className="w-full rounded-md bg-slate-800 border border-gray-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Additional notes about this customer"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
                  >
                    {editingCustomer ? "Save Changes" : "Add Customer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerManager;

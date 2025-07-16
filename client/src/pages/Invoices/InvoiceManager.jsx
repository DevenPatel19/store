import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Eye, Trash2, Plus, AlertCircle, X, DollarSign, User } from "lucide-react";

const InvoiceManager = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingIds, setDeletingIds] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await axios.get("/api/invoices");
        setInvoices(data);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
        setError(err.response?.data?.message || "Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      setDeletingIds((prev) => [...prev, id]);
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      await axios.delete(`/api/invoices/${id}`);
      setInvoices((prev) => prev.filter((invoice) => invoice._id !== id));
    } catch (err) {
      console.error("Failed to delete invoice:", err);
      alert(err.response?.data?.message || "Failed to delete invoice. Please try again.");
    } finally {
      setDeletingIds((prev) => prev.filter((deleteId) => deleteId !== id));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in to view invoices.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-4">
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Invoices</h1>
              <p className="text-gray-300">Manage your customer invoices</p>
            </div>
          </div>
          <Link
            to="/invoices/new"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Invoice
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-center">Loading invoices...</p>
            </div>
          </div>
        )}

        {/* Error State */}
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

        {/* Empty State */}
        {!loading && !error && invoices.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 text-center">
              <User className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">No Invoices Found</h2>
              <p className="text-gray-300 mb-8">Start by adding a new invoice.</p>
              <Link
                to="/invoices/new"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Invoice
              </Link>
            </div>
          </div>
        )}

        {/* Invoices List */}
        {!loading && !error && invoices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice) => {
              const isDeleting = deletingIds.includes(invoice._id);
              return (
                <div
                  key={invoice._id}
                  className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:bg-white/15 hover:border-white/30 transition-all duration-200 transform hover:scale-105 p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 truncate">
                      Invoice #{invoice.invoiceNumber}
                    </h3>
                    <p className="text-gray-300 mb-1">
                      Customer: {invoice.customer?.name || "N/A"}
                    </p>
                    <p className="text-gray-300 mb-3">
                      Amount: <span className="font-semibold">${invoice.amount.toFixed(2)}</span>
                    </p>
                    <p className={`mb-3 font-semibold ${
                      invoice.status === "Paid" ? "text-green-400" :
                      invoice.status === "Overdue" ? "text-red-400" : "text-yellow-400"
                    }`}>
                      Status: {invoice.status}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/invoices/${invoice._id}`)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center text-sm"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(invoice._id)}
                      disabled={isDeleting}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceManager;

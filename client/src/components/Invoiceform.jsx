import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { AlertCircle, Plus, Trash2 } from "lucide-react";

const InvoiceForm = ({ mode = "add", id }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "Pending",
    items: [
      {
        productId: "",
        description: "",
        quantity: 1,
        rate: 0,
      },
    ],
    tax: 0,
    notes: "",
  });

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.rate);
    }, 0);
    const total = subtotal + (formData.tax || 0);
    return { subtotal, total };
  };

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await axios.get("/api/customers");
        setCustomers(data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await axios.get("/api/products");
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  // Fetch invoice data if editing
  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchInvoice = async () => {
        setFetching(true);
        try {
          const token = localStorage.getItem("token");
          if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }
          const { data } = await axios.get(`/api/invoices/${id}`);

          setSelectedCustomerId(data.customer?._id || "");

          setFormData({
            invoiceNumber: data.invoiceNumber || "",
            customer: {
              name: data.customer?.name || "",
              email: data.customer?.email || "",
              phone: data.customer?.phone || "",
              address: data.customer?.address || "",
            },
            issueDate: data.date ? new Date(data.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split("T")[0] : "",
            status: data.status || "Pending",
            items: data.items.length > 0 ? data.items.map(item => ({
              productId: item.productId || "",
              description: item.description || "",
              quantity: item.quantity || 1,
              rate: item.rate || 0,
            })) : [{ productId: "", description: "", quantity: 1, rate: 0 }],
            tax: data.tax || 0,
            notes: data.notes || "",
          });
        } catch (err) {
          console.error("Failed to load invoice:", err);
          setError("Unable to load invoice data.");
        } finally {
          setFetching(false);
        }
      };
      fetchInvoice();
    }
  }, [mode, id]);

  // Handle generic input changes
  const handleInputChange = (field, value, isCustomer = false) => {
    if (isCustomer) {
      setFormData((prev) => ({
        ...prev,
        customer: { ...prev.customer, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Handle item changes (quantity, rate)
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "quantity" || field === "rate" ? Number(value) || 0 : value,
    };
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  // Handle product selection for an item
  const handleProductSelect = (index, productId) => {
    const selectedProduct = products.find((p) => p._id === productId);
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      productId,
      description: selectedProduct ? selectedProduct.name : "",
      rate: selectedProduct ? selectedProduct.price : 0,
      quantity: updatedItems[index].quantity || 1,
    };
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", description: "", quantity: 1, rate: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, items: updatedItems }));
    }
  };

  const handleCustomerSelect = (customerId) => {
    setSelectedCustomerId(customerId);
    const selectedCustomer = customers.find((c) => c._id === customerId);
    if (selectedCustomer) {
      setFormData((prev) => ({
        ...prev,
        customer: {
          name: selectedCustomer.name || "",
          email: selectedCustomer.contact?.email || "",
          phone: selectedCustomer.contact?.phone || "",
          address: selectedCustomer.address || "",
        },
      }));
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

      const { total, subtotal } = calculateTotals();

      // Prepare payload with backend-compatible field names
      const payload = {
        ...formData,
        amount: total,
        subtotal,
        customer: selectedCustomerId,
        date: formData.issueDate,
      };

      console.log("Submitting payload:", payload);

      if (mode === "edit") {
        await axios.patch(`/api/invoices/${id}`, payload);
      } else {
        await axios.post("/api/invoices", payload);
      }

      navigate("/invoices");
    } catch (err) {
      console.error("Submit failed:", err);
      setError(err.response?.data?.message || `Failed to ${mode} invoice. Please try again.`);
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
          <p className="text-gray-300">You must be logged in to {mode} an invoice.</p>
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

  const { subtotal, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-6 text-white relative">
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20 -z-10 pointer-events-none"
      ></div>

      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6">
          {mode === "edit" ? "Edit Invoice" : "Create Invoice"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Invoice Number *</label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter invoice number"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Issue Date *</label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange("issueDate", e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
              />
            </div>
          </div>

          {/* Customer Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Customer Information</h3>

            <div>
              <label className="block mb-1 font-medium">Select Existing Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
              >
                <option value="">Select a customer...</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Customer Name *</label>
                <input
                  type="text"
                  value={formData.customer.name}
                  onChange={(e) => handleInputChange("name", e.target.value, true)}
                  required
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                  placeholder="Customer name"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={formData.customer.email}
                  onChange={(e) => handleInputChange("email", e.target.value, true)}
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                  placeholder="Customer email"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <input
                  type="tel"
                  value={formData.customer.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value, true)}
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                  placeholder="Customer phone"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Address</label>
                <input
                  type="text"
                  value={formData.customer.address}
                  onChange={(e) => handleInputChange("address", e.target.value, true)}
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                  placeholder="Customer address"
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Product select */}
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium">Product</label>
                    <select
                      value={item.productId || ""}
                      onChange={(e) => handleProductSelect(index, e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 text-sm"
                    >
                      <option value="">Select a product...</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity ?? ""}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Rate ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate !== undefined && item.rate !== null ? item.rate : 0}
                      onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                      className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm text-gray-300">
                    Amount:{" "}
                    <span className="font-semibold text-white">
                      ${(item.quantity * item.rate).toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tax and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Tax ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.tax ?? 0}
                onChange={(e) => handleInputChange("tax", Number(e.target.value) || 0)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Notes</label>
              <textarea
                rows={3}
                value={formData.notes ?? ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400"
                placeholder="Additional notes"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-gray-300 text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300 text-sm">
                  <span>Tax:</span>
                  <span>${formData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-white">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 font-semibold text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors duration-200 text-white font-semibold"
          >
            {loading
              ? mode === "edit"
                ? "Updating..."
                : "Creating..."
              : mode === "edit"
              ? "Update Invoice"
              : "Create Invoice"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;

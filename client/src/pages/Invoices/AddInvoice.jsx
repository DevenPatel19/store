import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../api/axios";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Send,
  Calendar,
  Hash,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

const AddInvoice = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Customers list - fetched from backend
  const [customers, setCustomers] = useState([]);

  // Invoice state using customer ID string and default taxRate = 10
  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().substring(0, 10), // YYYY-MM-DD
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    customer: "",
    items: [
      {
        id: 1,
        description: "",
        quantity: 1,
        price: 0,
        amount: 0,
      },
    ],
    notes: "",
    terms: "Payment is due within 30 days of invoice date.",
    subtotal: 0,
    tax: 0,
    taxRate: 10,
    total: 0,
    status: "Unpaid",
    paidDate: null,
  });

  // Fetch customers on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    };
    fetchCustomers();
  }, []);

  // Calculate totals helper
  const calculateTotals = (items, taxRate) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = (subtotal * taxRate) / 100;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Update invoice totals and set state
  // Memoize updateTotals to avoid infinite loops
  const updateTotals = useCallback(
    (newItems = invoice.items, newTaxRate = invoice.taxRate) => {
      const { subtotal, tax, total } = calculateTotals(newItems, newTaxRate);
      setInvoice((prev) => ({
        ...prev,
        items: newItems,
        taxRate: newTaxRate,
        subtotal,
        tax,
        total,
      }));
    },
    [invoice.items, invoice.taxRate]
  );

  // Initialize totals once on mount
  useEffect(() => {
    updateTotals();
  }, [updateTotals]);

  // Handlers for fields and items
  const handleCustomerChange = (value) => {
    setInvoice((prev) => ({ ...prev, customer: value }));
  };

  const handleInvoiceChange = (field, value) => {
    if (field === "taxRate") {
      updateTotals(invoice.items, Number.parseFloat(value) || 0);
    } else {
      setInvoice((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleItemChange = (id, field, value) => {
    const newItems = invoice.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === "quantity" || field === "price") {
          updatedItem.amount = updatedItem.quantity * updatedItem.price;
        }
        return updatedItem;
      }
      return item;
    });
    updateTotals(newItems);
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      price: 0,
      amount: 0,
    };
    updateTotals([...invoice.items, newItem]);
  };

  const removeItem = (id) => {
    if (invoice.items.length > 1) {
      const newItems = invoice.items.filter((item) => item.id !== id);
      updateTotals(newItems);
    }
  };

  // Save invoice with full required fields and recalculation before sending
  // Save invoice with improved error logging
  const saveInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      if (!invoice.customer) {
        setError("Customer is required");
        setLoading(false);
        return;
      }

      const { subtotal, tax, total } = calculateTotals(invoice.items, invoice.taxRate);

      const payload = {
        invoiceNumber: invoice.invoiceNumber,
        customer: invoice.customer,
        date: new Date(invoice.date).toISOString(),
        dueDate: new Date(invoice.dueDate).toISOString(),
        items: invoice.items.map(({ description, quantity, price, amount }) => ({
          description,
          quantity,
          price,
          amount,
        })),
        subtotal,
        taxRate: invoice.taxRate,
        tax,
        amount: total,
        notes: invoice.notes,
        terms: invoice.terms,
        status: invoice.status || "Unpaid",
        paidDate: invoice.paidDate || null,
      };

      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      console.log("Saving invoice payload:", payload);
      await axios.post("/api/invoices", payload);
      setSuccess("Invoice saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to save invoice:", err);
      console.error("Backend error response:", err.response?.data);
      setError(err.response?.data?.message || err.message || "Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };


  // Send invoice also sends full data including totals
  const sendInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      if (!invoice.customer) {
        setError("Customer is required");
        setLoading(false);
        return;
      }

      const { subtotal, tax, total } = calculateTotals(invoice.items, invoice.taxRate);

      const payload = {
        invoiceNumber: invoice.invoiceNumber,
        customer: invoice.customer,
        date: new Date(invoice.date).toISOString(),
        dueDate: new Date(invoice.dueDate).toISOString(),
        items: invoice.items.map(({ description, quantity, price, amount }) => ({
          description,
          quantity,
          price,
          amount,
        })),
        subtotal,
        taxRate: invoice.taxRate,
        tax,
        amount: total,
        notes: invoice.notes,
        terms: invoice.terms,
        status: invoice.status || "Unpaid",
        paidDate: invoice.paidDate || null,
      };

      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      console.log("Sending invoice payload:", payload);
      await axios.post("/api/invoices/send", payload);
      setSuccess("Invoice sent successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to send invoice:", err);
      setError(err.response?.data?.message || "Failed to send invoice");
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
          <p className="text-gray-300">You must be logged in to create invoices.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"
      ></div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">Create Invoice</h1>
                <p className="text-gray-300">Generate professional invoices for your clients</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={saveInvoice}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                Save
              </button>
              <button
                onClick={sendInvoice}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="h-5 w-5 mr-2" />
                )}
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 backdrop-blur-xl bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-300">{success}</span>
            </div>
            <button onClick={() => setSuccess("")} className="text-green-400 hover:text-green-300 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

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

        {/* Invoice Form */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Invoice Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Invoice Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={invoice.invoiceNumber}
                      onChange={(e) => handleInvoiceChange("invoiceNumber", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={invoice.date}
                        onChange={(e) => handleInvoiceChange("date", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        value={invoice.dueDate}
                        onChange={(e) => handleInvoiceChange("dueDate", e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Customer</h2>
              <select
                value={invoice.customer}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-pink-500 font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              >
                <option value="" disabled>
                  Select Customer
                </option>
                {customers.map((customer) => (
                  <option className="font-bold text-pink-500"  key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-x-auto">
            <table className="w-full text-white border-collapse">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-3">Description</th>
                  <th className="text-center p-3 w-24">Quantity</th>
                  <th className="text-center p-3 w-24">Price</th>
                  <th className="text-right p-3 w-32">Amount</th>
                  <th className="text-center p-3 w-16">Remove</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-white/10">
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 focus:outline-none focus:border-purple-500"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                        className="w-full bg-transparent border-b border-white/20 text-center focus:outline-none focus:border-purple-500"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, "price", Number(e.target.value))}
                        className="w-full bg-transparent border-b border-white/20 text-center focus:outline-none focus:border-purple-500"
                      />
                    </td>
                    <td className="p-3 text-right">{item.amount.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                        disabled={invoice.items.length <= 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Item Button */}
          <div className="mb-8">
            <button
              onClick={addItem}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl shadow-lg transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              Add Item
            </button>
          </div>

          {/* Totals */}
          <div className="max-w-sm ml-auto mb-8 space-y-4 text-white">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="taxRate" className="font-semibold">
                Tax Rate (%):
              </label>
              <input
                id="taxRate"
                type="number"
                min="0"
                step="0.01"
                value={invoice.taxRate}
                onChange={(e) => handleInvoiceChange("taxRate", e.target.value)}
                className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Tax:</span>
              <span>${invoice.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-white/20 pt-2 flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            <div>
              <label className="block font-semibold mb-2">Notes</label>
              <textarea
                rows="5"
                value={invoice.notes}
                onChange={(e) => handleInvoiceChange("notes", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Additional notes for the invoice"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Terms</label>
              <textarea
                rows="5"
                value={invoice.terms}
                onChange={(e) => handleInvoiceChange("terms", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Payment terms and conditions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInvoice;

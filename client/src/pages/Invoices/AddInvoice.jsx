import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "../../api/axios"
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
} from "lucide-react"

const AddInvoice = () => {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  // Customers list - fetch from API in useEffect, here mocked
  const [customers, setCustomers] = useState([])

  // Invoice state updated to use customer ID string instead of client object
  const [invoice, setInvoice] = useState({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().substring(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // 30 days from now
    customer: "", // <-- store selected customer ID here
    items: [
      {
        id: 1,
        description: "",
        quantity: 1,
        price: 0, // renamed from rate
        amount: 0,
      },
    ],
    notes: "",
    terms: "Payment is due within 30 days of invoice date.",
    subtotal: 0,
    tax: 0,
    taxRate: 10, // 10%
    total: 0,
  })

  // Fetch customers from backend (replace '/api/customers' with your API route)
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/customers")
        console.log("Customers fetched:", res.data); // <-- Add this line
        console.log("🔍 First customer:", res.data[0]) // ADD THIS

        setCustomers(res.data)
        console.log("✅ Set customers:", res.data)
      } catch (err) {
        console.error("Failed to fetch customers", err)
      }
    }
    fetchCustomers()
  }, [])

  // Calculate totals
  const calculateTotals = (items, taxRate) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const tax = (subtotal * taxRate) / 100
    const total = subtotal + tax
    return { subtotal, tax, total }
  }

  // Update invoice totals
  const updateTotals = (newItems = invoice.items, newTaxRate = invoice.taxRate) => {
    const { subtotal, tax, total } = calculateTotals(newItems, newTaxRate)
    setInvoice((prev) => ({
      ...prev,
      items: newItems,
      taxRate: newTaxRate,
      subtotal,
      tax,
      total,
    }))
  }

  // Handle customer selection change
  const handleCustomerChange = (value) => {
    setInvoice((prev) => ({
      ...prev,
      customer: value,
    }))
  }

  // Handle invoice field change
  const handleInvoiceChange = (field, value) => {
    if (field === "taxRate") {
      updateTotals(invoice.items, Number.parseFloat(value) || 0)
    } else {
      setInvoice((prev) => ({ ...prev, [field]: value }))
    }
  }

  // Handle item change
  const handleItemChange = (id, field, value) => {
    const newItems = invoice.items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === "quantity" || field === "price") {
          updatedItem.amount = updatedItem.quantity * updatedItem.price
        }
        return updatedItem
      }
      return item
    })
    updateTotals(newItems)
  }

  // Add new item
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      price: 0,
      amount: 0,
    }
    updateTotals([...invoice.items, newItem])
  }

  // Remove item
  const removeItem = (id) => {
    if (invoice.items.length > 1) {
      const newItems = invoice.items.filter((item) => item.id !== id)
      updateTotals(newItems)
    }
  }

  // Save invoice
  const saveInvoice = async () => {
    try {
      setLoading(true)
      setError("")

      if (!invoice.customer) {
        setError("Customer is required")
        setLoading(false)
        return
      }

      const token = localStorage.getItem("token")
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      }

      // Prepare payload matching backend schema
      const payload = {
        invoiceNumber: invoice.invoiceNumber,
        customer: invoice.customer, // customer ID string
        items: invoice.items.map(({ description, quantity, price }) => ({
          description,
          quantity,
          price,
        })),
        amount: invoice.total,
        notes: invoice.notes,
        terms: invoice.terms,
        date: invoice.date,
        dueDate: invoice.dueDate,
      }

      await axios.post("/api/invoices", payload)
      setSuccess("Invoice saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Failed to save invoice:", err)
      setError(err.response?.data?.message || "Failed to save invoice")
    } finally {
      setLoading(false)
    }
  }

  // Send invoice (same adjustments as saveInvoice if needed)
  const sendInvoice = async () => {
    try {
      setLoading(true)
      setError("")

      if (!invoice.customer) {
        setError("Customer is required")
        setLoading(false)
        return
      }

      const token = localStorage.getItem("token")
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      }

      const payload = {
        invoiceNumber: invoice.invoiceNumber,
        customer: invoice.customer,
        items: invoice.items.map(({ description, quantity, price }) => ({
          description,
          quantity,
          price,
        })),
        amount: invoice.total,
        notes: invoice.notes,
        terms: invoice.terms,
        date: invoice.date,
        dueDate: invoice.dueDate,
      }

      await axios.post("/api/invoices/send", payload)
      setSuccess("Invoice sent successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Failed to send invoice:", err)
      setError(err.response?.data?.message || "Failed to send invoice")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in to create invoices.</p>
        </div>
      </div>
    )
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
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer selector */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Customer</label>
                <select
                  value={invoice.customer}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl"
                  //className= "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map((cust) => (
                    <option key={cust._id} value={cust._id}>
                      {cust.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Invoice Items</h2>
              <div className="space-y-4">
                {invoice.items.map((item) => (
                  <div key={item.id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-5">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                          placeholder="Item description"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Price ($)</label>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleItemChange(item.id, "price", Number.parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={item.amount.toFixed(2)}
                            readOnly
                            className="w-full px-3 py-2 bg-gray-600/20 border border-white/10 rounded-lg text-gray-300 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={invoice.items.length === 1}
                          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white p-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addItem}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Additional Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                  <textarea
                    value={invoice.notes}
                    onChange={(e) => handleInvoiceChange("notes", e.target.value)}
                    placeholder="Additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Terms & Conditions</label>
                  <textarea
                    value={invoice.terms}
                    onChange={(e) => handleInvoiceChange("terms", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-4">Invoice Summary</h2>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal:</span>
                    <span className="text-white font-semibold">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-gray-300 mr-2">Tax:</span>
                      <input
                        type="number"
                        value={invoice.taxRate}
                        onChange={(e) => handleInvoiceChange("taxRate", e.target.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-gray-300 ml-1">%</span>
                    </div>
                    <span className="text-white font-semibold">${invoice.tax.toFixed(2)}</span>
                  </div>
                  <hr className="border-white/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-white">Total:</span>
                    <span className="text-2xl font-bold text-green-400">${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddInvoice

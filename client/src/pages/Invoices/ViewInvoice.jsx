import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { jsPDF } from "jspdf";
import { 
  ArrowLeft, 
  Edit3, 
  Printer, 
  Download, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  FileText,
  Clock
} from "lucide-react";

const BUSINESS_NAME = import.meta.env.VITE_BUS_NAME || "My Business";
const BUSINESS_LOGO_URL = import.meta.env.VITE_BUS_LOGO_URL || "";

const ViewInvoice = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await axios.get(`/api/invoices/${id}`);
        setInvoice(data);
      } catch (err) {
        console.error("Failed to fetch invoice:", err);
        setError(err.response?.data?.message || "Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Overdue":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "Pending":
        return "text-pink-400 bg-pink-400/10 border border-pink-400";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!invoice) return;

    const doc = new jsPDF();

    // Add business logo if available
    if (BUSINESS_LOGO_URL) {
      const img = new Image();
      img.src = BUSINESS_LOGO_URL;
      img.onload = () => {
        // Draw logo top-left (max width 50, height proportional)
        const ratio = img.width / img.height;
        const height = 30;
        const width = height * ratio;
        doc.addImage(img, 'PNG', 14, 10, width, height);
        drawInvoiceDetails(doc, 50);
        doc.save(`Invoice-${invoice.invoiceNumber || "Unknown"}.pdf`);
      };
      img.onerror = () => {
        drawInvoiceDetails(doc, 14);
        doc.save(`Invoice-${invoice.invoiceNumber || "Unknown"}.pdf`);
      };
    } else {
      drawInvoiceDetails(doc, 14);
      doc.save(`Invoice-${invoice.invoiceNumber || "Unknown"}.pdf`);
    }
  };

  const drawInvoiceDetails = (doc, startX) => {
    // Business name
    doc.setFontSize(22);
    doc.text(BUSINESS_NAME, startX, 20);

    // Invoice number and dates
    doc.setFontSize(14);
    doc.text(`Invoice #${invoice.invoiceNumber}`, startX, 30);
    doc.text(`Issue Date: ${formatDate(invoice.createdAt)}`, startX, 38);
    doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, startX, 46);
    doc.text(`Status: ${invoice.status}`, startX, 54);

    // Customer info
    doc.setFontSize(16);
    doc.text("Customer Information:", startX, 70);

    doc.setFontSize(12);
    doc.text(`Name: ${invoice.customer?.name || "N/A"}`, startX, 80);
    doc.text(`Email: ${invoice.customer?.contact?.email || "N/A"}`, startX, 88);
    doc.text(`Phone: ${invoice.customer?.contact?.phone || "N/A"}`, startX, 96);
    doc.text(`Address: ${invoice.customer?.address || "N/A"}`, startX, 104);

    // Invoice Items table header
    let startY = 120;
    doc.setFontSize(14);
    doc.text("Invoice Items", startX, startY);
    startY += 6;

    doc.setFontSize(12);
    doc.text("Description", startX, startY);
    doc.text("Qty", 90, startY, { align: "right" });
    doc.text("Rate", 110, startY, { align: "right" });
    doc.text("Amount", 140, startY, { align: "right" });
    startY += 4;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(startX, startY, 196, startY);
    startY += 6;

    // Invoice items rows
    invoice.items?.forEach((item) => {
      const rateNum = Number(item.rate);
      const qtyNum = Number(item.quantity);

      doc.text(item.description, startX, startY);
      doc.text(`${!isNaN(qtyNum) ? qtyNum : 0}`, 90, startY, { align: "right" });
      doc.text(`$${!isNaN(rateNum) ? rateNum.toFixed(2) : "0.00"}`, 110, startY, { align: "right" });
      const amount = (!isNaN(qtyNum) && !isNaN(rateNum)) ? (qtyNum * rateNum).toFixed(2) : "0.00";
      doc.text(`$${amount}`, 140, startY, { align: "right" });
      startY += 8;
    });

    startY += 6;
    doc.line(startX, startY, 196, startY);
    startY += 8;

    doc.text(`Subtotal: $${invoice.subtotal?.toFixed(2) || invoice.amount?.toFixed(2) || "0.00"}`, 140, startY, { align: "right" });
    startY += 8;
    if (invoice.tax) {
      doc.text(`Tax: $${invoice.tax.toFixed(2)}`, 140, startY, { align: "right" });
      startY += 8;
    }
    doc.setFontSize(14);
    doc.text(`Total: $${invoice.amount?.toFixed(2) || "0.00"}`, 140, startY, { align: "right" });
  };

  const handlePayInvoice = () => {
    alert("Pay this invoice functionality coming soon!");
    // TODO: Implement actual payment integration here
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
      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/invoices"
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                Invoice {invoice?.invoiceNumber ? `#${invoice.invoiceNumber}` : "Details"}
              </h1>
              <p className="text-gray-300">View and manage invoice details</p>
            </div>
          </div>
          
          {!loading && !error && invoice && (
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center"
              >
                <Printer className="h-5 w-5 mr-2" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Download
              </button>
              <Link
                to={`/invoices/${id}/edit`}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
              >
                <Edit3 className="h-5 w-5 mr-2" />
                Edit
              </Link>
              <button
                onClick={handlePayInvoice}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 flex items-center"
              >
                Pay this invoice
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-center">Loading invoice...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Invoice Content */}
        {!loading && !error && invoice && (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Invoice #{invoice.invoiceNumber}</h2>
                    <p className="text-gray-300">Created on {formatDate(invoice.createdAt)}</p>
                  </div>
                </div>
                
                <div className={`px-4 py-2 rounded-full border ${getStatusColor(invoice.status)}`}>
                  <span className="font-semibold ">{invoice.status}</span>
                </div>
              </div>

              {/* Invoice Dates and Amount */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Issue Date</p>
                    <p className="text-white font-semibold">{formatDate(invoice.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Due Date</p>
                    <p className="text-white font-semibold">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-gray-400 text-sm">Total Amount</p>
                    <p className="text-white font-bold text-xl">
                      ${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-purple-400 mr-2" />
                <h3 className="text-xl font-bold text-white">Customer Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Name</p>
                  <p className="text-white font-semibold">{invoice.customer?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-white">{invoice.customer?.contact?.email || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Phone</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-white">{invoice.customer?.contact?.phone || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Address</p>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-white">{invoice.customer?.address || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            {invoice.items && invoice.items.length > 0 && (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Invoice Items</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-gray-400 font-semibold py-3">Description</th>
                        <th className="text-right text-gray-400 font-semibold py-3">Quantity</th>
                        <th className="text-right text-gray-400 font-semibold py-3">Rate</th>
                        <th className="text-right text-gray-400 font-semibold py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={index} className="border-b border-white/10">
                          <td className="text-white py-3">{item.description}</td>
                          <td className="text-white text-right py-3">{item.quantity || 0}</td>
                          <td className="text-white text-right py-3">
                            ${typeof item.rate === 'number' ? item.rate.toFixed(2) : '0.00'}
                          </td>
                          <td className="text-white text-right py-3 font-semibold">
                            ${typeof item.rate === 'number' && typeof item.quantity === 'number' 
                              ? (item.quantity * item.rate).toFixed(2) 
                              : '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <div className="bg-white/5 rounded-xl p-4 min-w-64">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white font-semibold">
                        ${typeof invoice.subtotal === 'number' 
                          ? invoice.subtotal.toFixed(2) 
                          : typeof invoice.amount === 'number' 
                            ? invoice.amount.toFixed(2) 
                            : '0.00'}
                      </span>
                    </div>
                    {invoice.tax && typeof invoice.tax === 'number' && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Tax:</span>
                        <span className="text-white font-semibold">${invoice.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-white/20">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-white font-bold text-lg">
                        ${typeof invoice.amount === 'number' ? invoice.amount.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {invoice.notes && (
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Notes</h3>
                <p className="text-gray-300 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewInvoice;

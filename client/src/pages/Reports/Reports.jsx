"use client"

import { useEffect, useState, useContext } from "react"
import axios from "../../api/axios"
import { AuthContext } from "../../context/AuthContext"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
import {
  AlertCircle,
  CheckCircle,
  Download,
  BarChart3,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  TrendingUp,
} from "lucide-react"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Reports = () => {
  const { user } = useContext(AuthContext)

  // Filter state (month/year/custom)
  const [filter, setFilter] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().substring(0, 10), // 1st of current month
    endDate: new Date().toISOString().substring(0, 10), // today
  })

  // Initialize with empty/default report shape to avoid errors
  const [report, setReport] = useState({
    dailyRevenue: [],
    totalRevenue: 0,
    unpaidInvoices: 0,
    pendingTasks: 0,
    tasks: { todo: 0, inProgress: 0, done: 0 },
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true)
        setError("")
        const token = localStorage.getItem("token")
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        // Pass filter dates as query params
        const { data } = await axios.get("/api/reports/summary", {
          params: { startDate: filter.startDate, endDate: filter.endDate },
        })
        console.log("Fetched report data:", data) // For debugging
        setReport(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load report data")
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [filter])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in to view reports.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-center">Loading reports...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Reports</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  // Chart data safe mapping with defaults
  const chartData = {
    labels: report.dailyRevenue.map((item) => item.date),
    datasets: [
      {
        label: "Revenue ($)",
        data: report.dailyRevenue.map((item) => item.amount),
        backgroundColor: "rgba(168, 85, 247, 0.8)", // purple to match theme
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(168, 85, 247, 0.5)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "#ffffff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  }

  // Handler for date filter change
  const handleDateChange = (e) => {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // CSV export helper
  const exportCSV = () => {
    if (!report) return
    const header = ["Date", "Revenue"]
    const rows = report.dailyRevenue.map(({ date, amount }) => [date, amount])
    let csvContent = "data:text/csv;charset=utf-8," + header.join(",") + "\n"
    rows.forEach((rowArray) => {
      csvContent += rowArray.join(",") + "\n"
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.href = encodedUri
    link.download = `revenue_report_${filter.startDate}_to_${filter.endDate}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // PDF export placeholder (can add pdf generation with jsPDF or similar)
  const exportPDF = () => {
    alert("PDF export feature coming soon!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Business Reports</h1>
              <p className="text-gray-300">Analytics and insights for your business</p>
            </div>
          </div>
        </div>

        {/* Date Filters & Export */}
        <div className="mb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-300 mr-2" />
                <label className="text-white font-medium mr-3">Start Date:</label>
                <input
                  type="date"
                  name="startDate"
                  value={filter.startDate}
                  max={filter.endDate}
                  onChange={handleDateChange}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-300 mr-2" />
                <label className="text-white font-medium mr-3">End Date:</label>
                <input
                  type="date"
                  name="endDate"
                  value={filter.endDate}
                  min={filter.startDate}
                  max={new Date().toISOString().substring(0, 10)}
                  onChange={handleDateChange}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex gap-3 ml-auto">
                <button
                  onClick={exportCSV}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
                <button
                  onClick={exportPDF}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Summary */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="backdrop-blur-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Total Revenue</h2>
              <div className="bg-green-500/20 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400">${report.totalRevenue.toFixed(2)}</p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-300 text-sm">Revenue tracking</span>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Pending Tasks</h2>
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{report.pendingTasks}</p>
            <div className="flex items-center mt-2">
              <Clock className="h-4 w-4 text-yellow-400 mr-1" />
              <span className="text-yellow-300 text-sm">Tasks remaining</span>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Unpaid Invoices</h2>
              <div className="bg-pink-500/20 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-pink-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-pink-400">${report.unpaidInvoices.toFixed(2)}</p>
            <div className="flex items-center mt-2">
              <FileText className="h-4 w-4 text-pink-400 mr-1" />
              <span className="text-pink-300 text-sm">Outstanding amount</span>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Revenue Chart</h2>
            <p className="text-gray-300">Daily revenue breakdown for the selected period</p>
          </div>
          <div className="h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4">
          <div className="flex items-center justify-center space-x-2 text-green-300">
            <CheckCircle className="w-5 h-5" />
            <span>Data synced in real-time with your backend</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports

import React, { useEffect, useState, useContext } from "react";
import axios from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2, AlertCircle, CheckCircle, Download } from "lucide-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Reports = () => {
  const { user } = useContext(AuthContext);

  // Filter state (month/year/custom)
  const [filter, setFilter] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().substring(0, 10), // 1st of current month
    endDate: new Date().toISOString().substring(0, 10), // today
  });

  // Initialize with empty/default report shape to avoid errors
  const [report, setReport] = useState({
    dailyRevenue: [],
    totalRevenue: 0,
    unpaidInvoices: 0,
    pendingTasks: 0,
    tasks: { todo: 0, inProgress: 0, done: 0},
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Pass filter dates as query params
        const { data } = await axios.get("/api/reports/summary", {
          params: { startDate: filter.startDate, endDate: filter.endDate },
        });

        console.log("Fetched report data:", data); // For debugging

        setReport(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [filter]);

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10">
        You must be logged in to view reports.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-10 text-red-500">
        <AlertCircle className="mr-2" /> {error}
      </div>
    );
  }

  // Chart data safe mapping with defaults
  const chartData = {
    labels: report.dailyRevenue.map((item) => item.date),
    datasets: [
      {
        label: "Revenue ($)",
        data: report.dailyRevenue.map((item) => item.amount),
        backgroundColor: "rgba(37, 99, 235, 0.7)", // blue
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  // Handler for date filter change
  const handleDateChange = (e) => {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // CSV export helper
  const exportCSV = () => {
    if (!report) return;

    const header = ["Date", "Revenue"];
    const rows = report.dailyRevenue.map(({ date, amount }) => [date, amount]);
    let csvContent = "data:text/csv;charset=utf-8," + header.join(",") + "\n";

    rows.forEach((rowArray) => {
      csvContent += rowArray.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `revenue_report_${filter.startDate}_to_${filter.endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF export placeholder (can add pdf generation with jsPDF or similar)
  const exportPDF = () => {
    alert("PDF export feature coming soon!");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">📊 Business Reports</h1>

      {/* Date filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center text-white">
        <label>
          Start Date:{" "}
          <input
            type="date"
            name="startDate"
            value={filter.startDate}
            max={filter.endDate}
            onChange={handleDateChange}
            className="rounded px-2 py-1 text-black"
          />
        </label>
        <label>
          End Date:{" "}
          <input
            type="date"
            name="endDate"
            value={filter.endDate}
            min={filter.startDate}
            max={new Date().toISOString().substring(0, 10)}
            onChange={handleDateChange}
            className="rounded px-2 py-1 text-black"
          />
        </label>

        {/* Export buttons */}
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
        <button
          onClick={exportPDF}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>

      {/* Metrics Summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl mt-2 font-bold">${report.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold">Pending Tasks</h2>
          <p className="text-3xl mt-2 font-bold">{report.pendingTasks}</p>
        </div>

        <div className="bg-gradient-to-r from-pink-400 to-red-500 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-lg font-semibold">Unpaid Invoices</h2>
          <p className="text-3xl mt-2 font-bold">${report.unpaidInvoices.toFixed(2)}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="mt-10 flex items-center space-x-2 text-green-300">
        <CheckCircle className="w-5 h-5" />
        <span>Data synced in real-time with your backend.</span>
      </div>
    </div>
  );
};

export default Reports;

"use client"

import { TrendingUp, ClipboardCheck, AlertTriangle } from "lucide-react"

const Snapshot = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Cash Flow */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:bg-white/15 hover:border-white/30 transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mr-4 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Cash Flow</h3>
            <p className="text-gray-400 text-sm">Last 30 days</p>
          </div>
        </div>
        <div>
          <p className="text-green-400 text-xl font-bold">$12,450.00</p>
          <p className="text-gray-300 text-sm mt-2">Keep the flow strong 💵</p>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:bg-white/15 hover:border-white/30 transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mr-4 shadow-lg">
            <ClipboardCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Pending Tasks</h3>
            <p className="text-gray-400 text-sm">Today</p>
          </div>
        </div>
        <div>
          <p className="text-yellow-300 text-xl font-bold">4 Tasks</p>
          <p className="text-gray-300 text-sm mt-2">Stay productive! 📋</p>
        </div>
      </div>

      {/* Outstanding Invoices */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:bg-white/15 hover:border-white/30 transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mr-4 shadow-lg">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Outstanding Invoices</h3>
            <p className="text-gray-400 text-sm">Awaiting payment</p>
          </div>
        </div>
        <div>
          <p className="text-red-300 text-xl font-bold">$5,320.00</p>
          <p className="text-gray-300 text-sm mt-2">Cash not in your hand 💸</p>
        </div>
      </div>
    </div>
  )
}

export default Snapshot

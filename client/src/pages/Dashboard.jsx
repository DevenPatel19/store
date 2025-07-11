import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { User, ArrowUpRight, BarChart3, CheckSquare, Users, Package } from "lucide-react"
import Snapshot from "../components/Snapshot"

const Dashboard = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto">
        {user ? (
          <>
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl mr-4 shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-1">Welcome back, {user.username}!</h1>
                      <p className="text-gray-300">Here's what's happening with your business today</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  to="/customers/new"
                  className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:border-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg mr-3">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Add Customer</h3>
                      <p className="text-gray-400 text-sm">Create new client</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/tasks"
                  className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:border-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg mr-3">
                      <CheckSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">View Tasks</h3>
                      <p className="text-gray-400 text-sm">Manage your todos</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/finance"
                  className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:border-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg mr-3">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Finance</h3>
                      <p className="text-gray-400 text-sm">View reports</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/payment/invoice/new"
                  className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:border-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg mr-3">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Billing</h3>
                      <p className="text-gray-400 text-sm">Create new invoice</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-2">Business Overview</h2>
                <p className="text-gray-300">Your key metrics and insights</p>
              </div>
              <Snapshot />

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10 blur-xl"></div>
            </div>
          </>
        ) : (
          /* Not Logged In State */
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 text-center max-w-md">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-blue-500 rounded-2xl mb-6 shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Welcome!</h1>
              <p className="text-gray-300 mb-8">Please log in to access your dashboard and manage your business.</p>

              <div className="space-y-4">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 transform hover:scale-105"
                >
                  Login to Continue
                  <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>

                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-purple-400 hover:underline hover:text-purple-300">
                    Sign up here
                  </Link>
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-10 blur-xl"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

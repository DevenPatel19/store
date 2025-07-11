import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "../../api/axios"
import { AuthContext } from "../../context/AuthContext"
import { Eye, Edit3, Trash2, Package, Plus, AlertCircle, X, DollarSign, Hash } from "lucide-react"

const ShowAllProducts = () => {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingIds, setDeletingIds] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
        }
        const { data } = await axios.get("/api/products")
        setProducts(data)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err.response?.data?.message || "Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?")
    if (!confirmed) return

    try {
      setDeletingIds((prev) => [...prev, id])
      const token = localStorage.getItem("token")
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      }
      await axios.delete(`/api/products/${id}`)
      setProducts((prev) => prev.filter((product) => product._id !== id))
    } catch (err) {
      console.error("Failed to delete product:", err)
      alert(err.response?.data?.message || "Failed to delete product. Please try again.")
    } finally {
      setDeletingIds((prev) => prev.filter((deleteId) => deleteId !== id))
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">You must be logged in to view products.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-800 to-slate-900 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4 shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1">All Products</h1>
                <p className="text-gray-300">Manage your product inventory</p>
              </div>
            </div>
            <Link
              to="/products/new"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white text-center">Loading products...</p>
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
        {!loading && !error && products.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 text-center">
              <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">No Products Found</h2>
              <p className="text-gray-300 mb-8">Get started by adding your first product!</p>
              <Link
                to="/products/new"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Product
              </Link>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const isDeleting = deletingIds.includes(product._id)
              return (
                <div
                  key={product._id}
                  className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:bg-white/15 hover:border-white/30 transition-all duration-200 transform hover:scale-105"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    {product.photoUrl ? (
                      <img
                        src={product.photoUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <Package className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 truncate">{product.name}</h3>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-300">
                        <DollarSign className="h-4 w-4 mr-2 text-green-400" />
                        <span className="text-lg font-semibold text-green-400">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Hash className="h-4 w-4 mr-2 text-blue-400" />
                        <span>Qty: {product.quantity}</span>
                      </div>
                       <div className="flex items-center text-gray-300">
                        <Hash className="h-4 w-4 mr-2 text-blue-400" />
                        <span>Category: {product.category}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="">
                      <button
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="w-full mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to={`/products/${product._id}/edit`}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center text-sm"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(product._id)}
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
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-10 blur-xl"></div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShowAllProducts

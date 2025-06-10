import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    sku: [""],
    barcodes: "",
    quantity: 0,
    threshold: 5,
    price: "",
    category: "",
    photoUrl: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkuChange = (index, value) => {
    const newSkus = [...formData.sku];
    newSkus[index] = value;
    handleInputChange("sku", newSkus);
  };

  const addSku = () => {
    const last = formData.sku[formData.sku.length - 1];
    if (last.trim() !== "") {
      setError("");
      handleInputChange("sku", [...formData.sku, ""]);
    } else {
      setError("Please fill in the last SKU before adding a new one");
    }
  };

  const removeSku = (index) => {
    if (formData.sku.length > 1) {
      const newSkus = formData.sku.filter((_, i) => i !== index);
      handleInputChange("sku", newSkus);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("/api/products", {
        ...formData,
        sku: formData.sku.filter((s) => s.trim() !== ""),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        threshold: Number(formData.threshold),
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Product Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">SKU(s)</label>
          {formData.sku.map((value, index) => (
            <div key={index}>
              <input
                type="text"
                value={value}
                onChange={(e) => handleSkuChange(index, e.target.value)}
                className="w-full p-2 border rounded"
                placeholder={`SKU ${index + 1}`}
                required
              />
              {formData.sku.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSku(index)}
                  className="text-red-600 border border-red-600 rounded px-3 py-1 mt-2"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSku}
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mt-2"
          >
            Add SKU
          </button>
        </div>

        <div>
          <label className="block text-gray-700">Barcode</label>
          <input
            type="text"
            value={formData.barcodes}
            onChange={(e) => handleInputChange("barcodes", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange("quantity", e.target.value)}
            className="w-full p-2 border rounded"
            min={0}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Low Stock Threshold</label>
          <input
            type="number"
            value={formData.threshold}
            onChange={(e) => handleInputChange("threshold", e.target.value)}
            className="w-full p-2 border rounded"
            min={0}
          />
        </div>

        <div>
          <label className="block text-gray-700">Price ($)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            className="w-full p-2 border rounded"
            min={0}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">Category</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700">Photo URL</label>
          <input
            type="text"
            value={formData.photoUrl}
            onChange={(e) => handleInputChange("photoUrl", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
          type="submit"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

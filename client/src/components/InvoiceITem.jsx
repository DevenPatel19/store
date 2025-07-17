// src/components/InvoiceItem.jsx
import React from "react";
import { Trash2 } from "lucide-react";

const InvoiceItem = ({ item, index, products, onChange, onRemove, canRemove }) => {
  return (
    <div className="bg-white/5 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Item {index + 1}</h4>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Remove Item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium">Product</label>
          <select
            value={item.product}
            onChange={(e) => onChange(index, "product", e.target.value)}
            required
            className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 text-sm"
          >
            <option value="">Select a product...</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name} - ${product.price.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Quantity</label>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => onChange(index, "quantity", e.target.value)}
            className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Rate ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.rate}
            onChange={(e) => onChange(index, "rate", e.target.value)}
            className="w-full p-2 rounded-lg bg-white/20 border border-white/30 text-white text-sm"
          />
        </div>
      </div>

      <div className="text-right">
        <span className="text-sm text-gray-300">
          Amount: <span className="font-semibold text-white">${item.amount.toFixed(2)}</span>
        </span>
      </div>
    </div>
  );
};

export default InvoiceItem;

import React from "react";

const InvoiceItemRow = ({ item, index, handleItemChange, handleRemoveItem }) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center mb-2">
      <input
        type="text"
        name="description"
        value={item.description}
        onChange={(e) => handleItemChange(index, e)}
        placeholder="Description"
        className="col-span-5 border p-2 rounded"
      />
      <input
        type="number"
        name="quantity"
        value={item.quantity}
        onChange={(e) => handleItemChange(index, e)}
        className="col-span-2 border p-2 rounded"
        min="1"
      />
      <input
        type="number"
        name="rate"
        value={item.rate}
        onChange={(e) => handleItemChange(index, e)}
        className="col-span-2 border p-2 rounded"
        min="0"
        step="0.01"
      />
      <span className="col-span-2 text-sm">${(item.quantity * item.rate).toFixed(2)}</span>
      <button
        type="button"
        className="col-span-1 text-red-500"
        onClick={() => handleRemoveItem(index)}
      >
        ✕
      </button>
    </div>
  );
};

export default InvoiceItemRow;

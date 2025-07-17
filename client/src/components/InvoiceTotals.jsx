// src/components/InvoiceTotals.jsx
import React from "react";

const InvoiceTotals = ({ subtotal, tax, total }) => {
  return (
    <div className="text-right mt-6 space-y-1">
      <p>
        <span className="font-semibold">Subtotal:</span> ${subtotal.toFixed(2)}
      </p>
      <p>
        <span className="font-semibold">Tax:</span> ${tax.toFixed(2)}
      </p>
      <p className="text-2xl font-bold">
        Total: ${total.toFixed(2)}
      </p>
    </div>
  );
};

export default InvoiceTotals;

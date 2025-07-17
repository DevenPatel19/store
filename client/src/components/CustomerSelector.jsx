// src/components/CustomerSelector.jsx
import React from "react";

const CustomerSelector = ({
  customers,
  selectedCustomerId,
  customerData,
  onSelect,
  onChange,
}) => {
  return (
    <>
      <div>
        <label className="block mb-1 font-medium">Select Customer *</label>
        <select
          value={selectedCustomerId}
          onChange={(e) => onSelect(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">-- Select Customer --</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="block mb-1 font-medium">Customer Name</label>
          <input
            type="text"
            value={customerData.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Customer Email</label>
          <input
            type="email"
            value={customerData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Customer Phone</label>
          <input
            type="tel"
            value={customerData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="+1-202-555-0123"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Customer Address</label>
          <textarea
            value={customerData.address}
            onChange={(e) => onChange("address", e.target.value)}
            rows={2}
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="123 Main St, City, State ZIP"
          />
        </div>
      </div>
    </>
  );
};

export default CustomerSelector;

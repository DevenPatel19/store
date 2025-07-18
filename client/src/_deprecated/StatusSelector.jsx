import React from "react";

const StatusSelector = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
    >
      <option value="Pending">Pending</option>
      <option value="Unpaid">Unpaid</option>
      <option value="Paid">Paid</option>
      <option value="Overdue">Overdue</option>
    </select>
  );
};

export default StatusSelector;

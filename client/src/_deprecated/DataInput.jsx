import React from "react";

const DateInput = ({ label, value, onChange, name }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-700 mb-1">{label}</label>
      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default DateInput;

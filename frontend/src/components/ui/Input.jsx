import React from 'react';

const Input = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  required = false,
  minLength,
  ...props 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...props}
      />
    </div>
  );
};

export default Input;
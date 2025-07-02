import React from 'react';

const FormField = ({ 
  label, 
  type = "text", 
  id, 
  value, 
  onChange, 
  required = false,
  placeholder,
  rows,
  className = ""
}) => {
  const baseInputClasses = "w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500";
  const textareaClasses = `${baseInputClasses} resize-y`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className={`${textareaClasses} ${className}`}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`${baseInputClasses} ${className}`}
        />
      )}
    </div>
  );
};

export default FormField;
import React from 'react';

const Button = ({ 
  children, 
  type = "button", 
  variant = "primary", 
  className = "",
  ...props 
}) => {
  const baseClasses = "w-full py-2 rounded-xl transition duration-200";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700"
  };
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${className}`;
  
  return (
    <button type={type} className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
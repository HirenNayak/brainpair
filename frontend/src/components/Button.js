import React from 'react';

const Button = ({ children, onClick, type = "button", className = "", disabled = false, ...rest }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

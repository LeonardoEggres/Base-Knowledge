import React from 'react';

const Container = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default Container;
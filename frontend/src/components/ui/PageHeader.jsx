import React from 'react';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="w-full max-w-4xl mb-8">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
import React from 'react';

const TopicFormContainer = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default TopicFormContainer;
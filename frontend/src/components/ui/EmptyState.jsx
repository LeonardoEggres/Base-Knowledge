import React from 'react';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20 space-y-4 text-center text-gray-500">
      <span className="text-6xl select-none">{icon}</span>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="max-w-md text-gray-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
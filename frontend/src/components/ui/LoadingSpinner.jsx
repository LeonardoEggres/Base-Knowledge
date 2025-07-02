import React from 'react';

const LoadingSpinner = ({ message = "Carregando..." }) => {
  return (
    <div className="text-gray-500 text-center mt-10">
      {message}
    </div>
  );
};

export default LoadingSpinner;
import React from 'react';

const ActionButtons = ({ children, position = "fixed top-right" }) => {
  const positionClasses = {
    "fixed top-right": "fixed top-6 right-6 flex space-x-4",
    "flex": "flex space-x-4"
  };

  return (
    <div className={positionClasses[position]}>
      {children}
    </div>
  );
};

export default ActionButtons;
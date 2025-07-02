import React from 'react';
import Button from '../ui/Button';

const FilterButton = ({ filterOption, onToggle, loggedInUserId }) => {
  if (!loggedInUserId) return null;

  const getFilterButtonText = () => {
    return filterOption === 'mine' ? 'Ver Tópicos de Outros' : 'Ver Meus Tópicos';
  };

  return (
    <Button
      onClick={onToggle}
      variant="primary"
      className="!w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
      title={getFilterButtonText()}
    >
      {getFilterButtonText()}
    </Button>
  );
};

export default FilterButton;
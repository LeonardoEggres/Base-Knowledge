import React from 'react';
import ActionButtons from '../ui/ActionButtons';
import FilterButton from './FilterButton';
import Button from '../ui/Button';

const DashboardActions = ({ 
  filterOption, 
  onToggleFilter, 
  loggedInUserId, 
  onLogout 
}) => {
  return (
    <ActionButtons position="fixed top-right">
      <FilterButton
        filterOption={filterOption}
        onToggle={onToggleFilter}
        loggedInUserId={loggedInUserId}
      />
      <Button
        onClick={onLogout}
        className="!w-auto bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded shadow"
        title="Sair"
      >
        Sair
      </Button>
    </ActionButtons>
  );
};

export default DashboardActions;
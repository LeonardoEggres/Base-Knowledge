import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "Buscar...",
  onSearchClick
}) => {
  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      document.getElementById("search-input").focus();
    }
  };

  return (
    <div className="w-full max-w-4xl mb-2 relative">
      <input
        id="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSearchClick}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
        aria-label="Buscar"
      >
        <FaSearch size={18} />
      </button>
    </div>
  );
};

export default SearchInput;
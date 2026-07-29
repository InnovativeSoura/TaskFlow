// src/components/SearchBar.jsx

import {
  FaSearch,
  FaTimes,
} from "react-icons/fa";

import "../styles/SearchBar.css";

const SearchBar = ({
  value = "",
  onChange,
  placeholder = "Search...",
  autoFocus = false,
  disabled = false,
  onClear,
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
      return;
    }

    if (onChange) {
      onChange({
        target: {
          value: "",
        },
      });
    }
  };

  return (
    <div className="search-container">

      <FaSearch className="search-icon" />

      <input
        className="search-bar"
        type="text"
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        onChange={onChange}
        aria-label={placeholder}
      />

      {value && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <FaTimes />
        </button>
      )}

    </div>
  );
};

export default SearchBar;
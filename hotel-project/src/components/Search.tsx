import React, { useState, useEffect } from 'react';
import "./styles/input.css";
import { CiSearch } from 'react-icons/ci';

interface SearchProps {
  isMobile: boolean;
  /** Полный список наименований для автодополнения */
  suggestionsList?: string[];
  /** Вызывается по нажатию Enter или по клику на подсказку */
  onSearch?: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({
  isMobile,
  suggestionsList = [],
  onSearch = () => {},
}) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem('searchQuery') || '';
  });
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    sessionStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);

  // --- handlers -----------------------------------------------------------
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const filtered = suggestionsList.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setSuggestions([]);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  // задержка, чтобы клик по варианту успел отработать
  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 100);
  };

  // --- styling ------------------------------------------------------------
  const borderClass = isFocused
    ? 'border-b-2 border-main_theme'
    : 'border-b border-gray-300';

  // ------------------------------------------------------------------------
  return (
    <form
      onSubmit={handleSearchSubmit}
      className="relative w-full lg:w-[500px]"
    >
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Поиск"
          className="w-full p-2 border-none"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button type="submit" className="p-2 text-gray-400 focus:outline-hidden">
          <CiSearch className="h-5 w-5" />
        </button>
      </div>
      <hr className={`${borderClass}`} />

      {/* список подсказок -------------------------------------------------- */}
      {isFocused && suggestions.length > 0 && (
        <ul className="absolute top-full mt-1 w-full bg-white border rounded z-10 max-h-60 overflow-auto">
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onMouseDown={() => {
                setSearchQuery(suggestion);
                onSearch(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default Search;

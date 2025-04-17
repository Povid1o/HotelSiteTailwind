import React, { useState } from 'react';
import "./styles/input.css";
import { CiSearch } from 'react-icons/ci';

interface SearchProps {
  isMobile: boolean;
  onSearch?: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ isMobile, onSearch = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    console.log('Focused');
  };

  const handleBlur = () => {
    setIsFocused(false);
    console.log('Blurred');
  };

  const borderClass = isFocused ? 'border-b-2 border-main_theme' : 'border-b border-gray-300';
//   console.log('Applied class:', borderClass);

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-[500px]">
      <div className={`flex items-center`}>
        
        <input
          type="text"
          placeholder="Поиск"
          className="w-full p-2 border-none"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          type="submit"
          className="p-2 text-gray-400 focus:outline-hidden"
        >
          <CiSearch className="h-5 w-5" />
        </button>
      </div>
      <hr className={`${borderClass}`} />
    </form>
  );
};

export default Search;
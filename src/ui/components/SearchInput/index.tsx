import React, { useEffect } from 'react'
import { FigmaSearchIcon } from '../FigmaIcons';
import style from './style.module.css'

interface SearchInputProps {
  searchInputRef: React.RefObject<HTMLInputElement>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const SearchInput = ({ searchInputRef, onChange }: SearchInputProps) => {
  useEffect(function enableKeyboardSelectAllShortcut(){
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
        event.preventDefault();
        searchInputRef?.current?.select();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={style.container}>
      <FigmaSearchIcon className={style.icon} fill="#333333"/>
      <input
        ref={searchInputRef}
        className={style.input}
        placeholder="Search"
        onChange={onChange}
      />
    </div>
  )
}

export default SearchInput;
import { useState } from 'react'
const customStyles = {
  option: (provided: any, state: any) => {
    if (state.value === 'divider') {
      return {
        ...provided,
        backgroundColor: '#000',
        padding: 0,
        ':hover': {
          ...provided[':hover'],
          backgroundColor: '#000',
        },
      }
    }
    return {
    ...provided,
    backgroundColor: '#000',
    color: '#ffffffb3',
    ':hover': {
      ...provided[':hover'],
      backgroundColor: '#0c8ce9',
    },
    padding: '0px 8px'
  }},
  menu: (provided: any, state: any) => ({
    ...provided,
    padding: "8px 0px",
    backgroundColor: '#000',
    width: 200,
    right: 0
  }),
  menuList: (provided: any, state: any) => ({
    ...provided,
    padding: 0,
    maxHeight: 336
  }),
  control : (provided: any, state: any) => ({
    ...provided,
    display: 'none'
  }),
};

export const useSearchFilterDropdown = () => {
  const [isSearchFilterMenuOpen, setIsSearchFilterMenuOpen] = useState<boolean>(false);
  const toggleSearchFilterMenuOpen = () => setIsSearchFilterMenuOpen(prev => !prev);
  const closeSearchFilterMenu = () => setIsSearchFilterMenuOpen(false);
  const openSearchFilterMenu = () => setIsSearchFilterMenuOpen(true);
  return {
    customStyles,
    isSearchFilterMenuOpen,
    closeSearchFilterMenu,
    openSearchFilterMenu,
    toggleSearchFilterMenuOpen
  }
}
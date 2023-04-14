import React from 'react';
import Select  from 'react-select';
import  { ActionMeta, MultiValue } from 'react-select';
import classNames from 'classnames';

import { FigmaAdjustIcon } from '../FigmaIcons';
import { SelectOption } from '../../types';
import CustomOptionRender from './CustomOptionRender';
import { useSearchFilterDropdown } from './useSearchFilterDropdown'
import style from './style.module.css'


interface SearchFilterDropdownProps {
  filterMenuOptions: SelectOption[]
  selectedOptionMap: {[key: string]: boolean}
  resultsByNodeType: {[key: string]: number}
  selectedFilterOptions: SelectOption[]
  setSelectedFilterOptions: (options: SelectOption[]) => void
  handleSelectFilterOption: (options: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void;
}

const SearchFilterDropdown = ({ 
  filterMenuOptions,
  selectedFilterOptions,
  handleSelectFilterOption
}: SearchFilterDropdownProps) => {
  const {
    customStyles,
    isSearchFilterMenuOpen,
    closeSearchFilterMenu,
    openSearchFilterMenu,
    toggleSearchFilterMenuOpen
  } = useSearchFilterDropdown()

  return (
    <>
      <div 
        className={classNames({
          [style.searchSettingsBtn]: true,
          [style.active]: isSearchFilterMenuOpen
        })}
      >
        <FigmaAdjustIcon  onClick={toggleSearchFilterMenuOpen}/>
      </div>
      <Select
        isMulti
        options={filterMenuOptions}
        value={selectedFilterOptions}
        onChange={handleSelectFilterOption}
        menuIsOpen={isSearchFilterMenuOpen}
        closeMenuOnSelect={false}
        onMenuOpen={openSearchFilterMenu}
        onMenuClose={closeSearchFilterMenu}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        formatOptionLabel={CustomOptionRender}
        hideSelectedOptions={false}
        styles={customStyles}
        // @ts-ignore
        formatSelectedOptionLabel={CustomOptionRender}
      />
    </>
    
  );
};

export default SearchFilterDropdown;
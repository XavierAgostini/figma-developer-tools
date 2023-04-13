import React, { useState } from 'react';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { FigmaComponentIcon, FigmaCheckIcon, FigmaFrameIcon, FigmaImageIcon, FigmaInstanceIcon, FigmaShapeIcon, FigmaTextIcon } from '../FigmaIcons';
import style from './style.module.css'
import { FigmaAdjustIcon } from '../FigmaIcons';
import { Select as FigmaSelect } from "react-figma-plugin-ds";
interface IconOption  {
  value: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  isSelected?: boolean;
}
const options: IconOption[] = [
  { value: 'all', label: 'All', icon: <FigmaFrameIcon/>, count: 100 },
  { value: 'frame_and_group', label: 'Frame / Group', icon: <FigmaFrameIcon/>, count: 1},
  { value: 'text', label: 'Text', icon: <FigmaTextIcon/>, count: 10 },
  { value: 'component', label: 'Component', icon: <FigmaComponentIcon/>, count: 1},
  { value: 'instance', label: 'Instance', icon: <FigmaInstanceIcon/>, count: 1 },
  { value: 'image', label: 'Image', icon: <FigmaImageIcon/>, count: 0},
  { value: 'shape', label: 'Shape', icon: <FigmaShapeIcon/> , count: 0},
  { value: 'other', label: 'Other', icon: <FigmaShapeIcon/>, count: 0 }
];

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: '#000',//state.isSelected ? '#f8f8f8' : 'black',
    color: '#ffffffb3',//state.isSelected ? 'black' : 'white',
    ':hover': {
      ...provided[':hover'],
      backgroundColor: '#0c8ce9',
    },
    padding: '0px 8px',
    // height: 24
    // ':active': {
    //   ...provided[':active'],
    //   backgroundColor: state.isSelected ? '#f8f8f8' : 'black'
    // }
  }),
 
  menu: (provided: any, state: any) => ({
    ...provided,
    padding: "8px 0px",
    // paddingRight: "8px",
    backgroundColor: '#000',
    width: 200,
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
const customOptionRenderer = (option: IconOption) => {
  return (
    <div className={style.option}>
      <div className={style.optionLabel}>
        <div className={style.selectedIconWrapper}>
          {option.isSelected && <FigmaCheckIcon className={style.checkIcon} /> }
        </div>
        <div className={style.optionText}>
          {option.icon}
          <span>{option.label}</span>
        </div>
      </div>
      <div className={style.optionCount}>{option.count}</div>
    </div>
  );
};

interface  Props {
  results: {
    [nodeType: string]: number;
  }
}

const SearchFilterDropdown = (props: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<IconOption[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const selectedOptionMap = selectedOptions.reduce((acc, option) => {
    acc[option.value] = true;
    return acc;
  }, {} as {[key: string]: boolean}); 

  const dropdownOptions = options.map((option) => {
    const isSelected = selectedOptionMap[option.value];
    return {
      ...option,
      isSelected,
    }
  });

  const toggleMenuOpen = () => setIsMenuOpen(prev => !prev);

  const handleSelect = (options: MultiValue<IconOption | null>, actionMeta: ActionMeta<IconOption>) => {
    console.log('selected option', options);
    
    const formatedOptions = options.map((option) => ({ ...option, isSelected: true }))
    // @ts-ignore
    setSelectedOptions(formatedOptions);
  };

  return (
    <>
      <FigmaAdjustIcon className={style.searchSettingsBtn} onClick={toggleMenuOpen}/>
      <Select
        isMulti
        options={dropdownOptions}
        value={selectedOptions}
        onChange={handleSelect}
        menuIsOpen={isMenuOpen}
        closeMenuOnSelect={false}
        onMenuOpen={() => setIsMenuOpen(true)}
        onMenuClose={() => setIsMenuOpen(false)}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        formatOptionLabel={customOptionRenderer}
        
        hideSelectedOptions={false}
        styles={customStyles}

        // @ts-ignore
        formatSelectedOptionLabel={customOptionRenderer}
      />
    </>
    
  );
};

export default SearchFilterDropdown;
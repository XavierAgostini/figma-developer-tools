import React from 'react'
import style from './style.module.css'
import { FigmaCheckIcon } from '../../FigmaIcons';
import { SelectOption } from '../../../types';

const CustomOptionRender = (option: SelectOption) => {
  // Hacky way to add divider between node and search options
  if (option.value === 'divider') {
    return <div className={style.divider}/>
  }

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
export default CustomOptionRender
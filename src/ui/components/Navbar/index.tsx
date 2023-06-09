import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import { Text, Icon } from 'react-figma-plugin-ds';
import style from './style.module.css'
import { SelectionIcon } from '../FigmaIcons'
import classnames  from 'classnames'

const Navbar = () => {
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const navigate = useNavigate()

  const toggleSwitch = () => {
    setIsSearch(!isSearch)
    navigate(isSearch ? '/' : '/search')
  }
  return (
    <nav className={style.navbar}>
      <div className={style.toggle} onClick={toggleSwitch}>
        <div 
          className={classnames({
            [style.toggleItem]: true, 
            [style.active]: !isSearch
          })}
        >
          <SelectionIcon width={14} height={14}  fill={!isSearch ? '#000' : '#aaa'} style={{ marginRight: 8}}/>
          <Text size='xlarge' weight={!isSearch ? 'bold' : 'medium'}>Select</Text>
        </div>
        <div 
          className={classnames({
            [style.toggleItem]: true, 
            [style.active]: isSearch
          })}
        >
          <Icon name='search' color={isSearch ? 'black' : 'black3'}/>
          <Text size='xlarge' weight={isSearch ? 'bold' : 'medium'}>Search</Text>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
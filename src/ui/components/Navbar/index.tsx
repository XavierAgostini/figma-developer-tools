import React, { useState } from 'react'
import {  useNavigate } from 'react-router-dom';
import { Text, Icon } from 'react-figma-plugin-ds';
import style from './style.module.css'
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
          {/* <span className='icon icon--list-detailed'/>
          {!isSearch && <span>Select</span>} */}
          <Icon name="list-detailed" color={!isSearch ? 'black' : 'black3'}/>
          <Text size='xlarge'>Select</Text>
        </div>
        <div 
          className={classnames({
            [style.toggleItem]: true, 
            [style.active]: isSearch
          })}
        >
          <Icon name='search' color={isSearch ? 'black' : 'black3'}/>
          <Text size='xlarge'>Search</Text>
          {/* <span className='icon icon--search'/> */}
          {/* {isSearch && <span>Search</span>} */}
        </div>
      </div>
      {/* <div className={style.switch} onClick={toggleSwitch}>
       
        <input className={style.switchInput} type="checkbox" checked={!isSearch} />
        <span className={style.slider}>
        </span>
      </div> */}
      {/* <div className="switch">
        <span className='icon--search'/>
        <input className="switch__toggle" type="checkbox" id="uniqueId" checked/>
        <label className="switch__label">Label</label>
    </div> */}
    </nav>
  )
}

export default Navbar;
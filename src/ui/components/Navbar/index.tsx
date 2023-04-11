import React from 'react'
import { NavLink } from 'react-router-dom';
import style from './style.module.css'

const Navbar = () => {
  return (
    <nav className={style.navbar}>
      <NavLink to="/" className={style.navItem}>Selection</NavLink>
      <NavLink to="search" className={style.navItem}>Search</NavLink>
      <NavLink to="settings" className={style.navItem}>Settings</NavLink>
    </nav>
  )
}

export default Navbar;
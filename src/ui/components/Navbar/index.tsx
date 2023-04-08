import React from 'react'
import {NavLink } from 'react-router-dom';
import style from './style.css'

const Navbar = () => {
  return (
    <div>
      <nav>
        <NavLink to="/">Selection</NavLink>
        <NavLink to="search">Search</NavLink>
        <NavLink to="settings">Settings</NavLink>
      </nav>
    </div>
  )
}

export default Navbar;
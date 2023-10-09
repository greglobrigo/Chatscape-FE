'use client'
import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';

export default function Navbar () {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <h1>glxd</h1>
        </div>
        <div className="gpt3__navbar-links_container">
          <p><a href="#home"></a></p>
          <p><a href="#about"></a></p>
          <p><a href="#possibility"></a></p>
          <p><a href="#features"></a></p>
          <p><a href="#blog"></a></p>
        </div>
      </div>
      <div className="gpt3__navbar-menu">
        {toggleMenu
          ? <RiCloseLine className="invisible" color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line className="invisible" color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
            <p><a href="#home"></a></p>
            <p><a href="#about"></a></p>
            <p><a href="#possibility"></a></p>
            <p><a href="#features"></a></p>
            <p><a href="#blog"></a></p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

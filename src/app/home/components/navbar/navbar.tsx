'use client'
import React from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';

export default function Navbar () {

  return (
    <div className="gpt3__navbar absolute top-0">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <h1>glxd</h1>
        </div>
      </div>
      <div className="gpt3__navbar-menu">
      </div>
    </div>
  );
};

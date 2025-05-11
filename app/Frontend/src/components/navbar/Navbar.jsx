import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/logo.svg';
import './navbar.css';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="bank__navbar">
      <div className="bank__navbar-links">
        <div className="bank__navbar-links_logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="bank__navbar-links_container">
          <p><a href="#home">Home</a></p>
          <p><a href="#about">About us</a></p>
          <p><a href="#features">Features</a></p>
          <p><a href="#solution">Solution</a></p>
          <button className='loginbtn'>Log in</button>
          <button className='signupbtn'>Sign up</button>
        </div>
      </div>
      <div className="bank__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="bank__navbar-menu_container ">
          <div className="bank__navbar-menu_container-links scale-up-element">
            <p><a href="#home">Home</a></p>
            <p><a href="#about">About us</a></p>
            <p><a href="#features">Features</a></p>
            <p><a href="#solution">Solution</a></p>
            <button className='loginbtn'>Log in</button>
            <button className='signupbtn'>Sign up</button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

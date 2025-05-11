import React from 'react';
import { useNavigate } from 'react-router-dom';
import './menu.css';

const Menu = ({ items, selectedItem, setSelectedItem }) => {
  const navigate = useNavigate();

  const handleMenuItemClick = (id) => {
    setSelectedItem(id);

    if (id === 'dashboard') {
      navigate('/dashboard');
    } else if (id === 'accounts') {
      navigate('/accounts');
    } else if (id === 'transaction') {
      navigate('/transactions');
    } else if (id === 'beneficiary') {
      navigate('/beneficiary');
    } else if (id === 'profile') {
      navigate('/profile');
    } else if (id === 'logout') {
      const confirmLogout = window.confirm('Are you sure you want to logout?');
      if (confirmLogout) {
        localStorage.removeItem('accessToken'); 
        navigate('/login'); 
      }
    }
  };

  return (
    <div className="menuitems">
      {items.map((item) => (
        <div 
          key={item.id} 
          className={`menuitem ${selectedItem === item.id ? 'selected' : ''}`}
          onClick={() => handleMenuItemClick(item.id)} 
        >
          <img src={item.logo} alt={item.id} className="menuitem__logo" width="30px" />
          <h4>{item.text}</h4>
        </div>
      ))}
    </div>
  );
};

export default Menu;

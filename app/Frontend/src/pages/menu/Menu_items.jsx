import React, { useState } from 'react';
import './menu_items.css';
import logo from '../../assets/logo.svg';
import Menu from '../../components/menu/Menu';
import dashboard from '../../assets/dashboard.png';
import accounting from '../../assets/accounting.png';
import transaction from '../../assets/transaction.png';
import follow from '../../assets/follow.png';
import logout from '../../assets/logout.png';
import user from '../../assets/user.png';

const menuitems = [
  { id: 'dashboard', text: 'Dashboard', logo: dashboard },
  { id: 'accounts', text: 'Accounts', logo: accounting },
  { id: 'transaction', text: 'Money Transfer', logo: transaction },
  { id: 'beneficiary', text: 'Beneficiaries', logo: follow },
  { id: 'profile', text: 'Profile', logo: user },
  { id: 'logout', text: 'Log out', logo: logout },
];

const Menu_items = ({ selectedItem, setSelectedItem }) => {
  return (
    <div className='dash__menubar'>
      <div className='img'>
        <img src={logo} alt="logo" width="140px" />
      </div>
      <div className="dash__menuitems">
        <Menu items={menuitems} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </div>
    </div>
  );
};

export default Menu_items;

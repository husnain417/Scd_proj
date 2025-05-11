import React from 'react';
import Menu from '../../src/components/menu/Menu';
import logo from '../../src/assets/logo.svg';

const menuitems = [
  { name: 'Dashboard', value: 'dashboard' },
  { name: 'Accounts', value: 'accounts' },
  { name: 'Transactions', value: 'transactions' },
  { name: 'Settings', value: 'settings' },
];

const Layout = ({ children, selectedItem, setSelectedItem }) => (
  <div className="bank__dash">
    <div className="dash__menubar">
      <div className='img'>
        <img src={logo} alt="logo" width="140px" />
      </div>
      <div className="dash__menuitems">
        <Menu items={menuitems} selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      </div>
    </div>
    <div className="dash__center">
      {children} 
    </div>
  </div>
);

export default Layout;

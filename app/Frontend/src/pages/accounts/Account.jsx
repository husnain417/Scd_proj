import React, { useState } from 'react';
import './account.css';
import Menu_items from '../menu/Menu_items';
import UserAcc from '../useraccounts/UserAcc';

const Account = () => {
  const [selectedItem, setSelectedItem] = useState('accounts');

  return (
      <div className='dash__accounts'>
        <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        <div className='all_accounts'>
          <div className='user_accs'>
            <UserAcc/>
          </div>
        </div>
     </div>
  );
};

export default Account;

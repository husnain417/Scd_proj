import React, { useState } from 'react';
import Menu_items from '../menu/Menu_items';
import Beneficiary from '../beneficiaries/Beneficiary';
import './ben_render.css'

const Ben_render = () => {
  const [selectedItem, setSelectedItem] = useState('beneficiary');

  return (
      <div className='dash__accounts'>
        <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        <div className='all_accounts'>
          <div className='user_accs'>
            <Beneficiary/>
          </div>
        </div>
     </div>
  );
};

export default Ben_render;

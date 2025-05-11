import React, { useState } from 'react';
import axios from 'axios';
import Menu_items from '../menu/Menu_items';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faWallet, faExchangeAlt, faHistory } from '@fortawesome/free-solid-svg-icons';
import './transactions.css';
import { useNavigate } from 'react-router-dom';


const Transactions = () => {
    const navigate = useNavigate(); 
    const [selectedItem, setSelectedItem] = useState('transaction');

    const handlechange = (path) => () => {
        navigate(path);
    };    

    return (
        <div className='transactions_options'>
            <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
            <div className='all_options'>
                <h2>Options</h2>
                <div className='options_container'>
                    <div className='option' onClick={handlechange('/deposit')}>
                        <FontAwesomeIcon icon={faMoneyBillWave} className="option-icon" />
                        <h4>Deposit</h4>
                    </div>
                    <div className='option' onClick={handlechange('/withdraw')}>
                        <FontAwesomeIcon icon={faWallet} className="option-icon" />
                        <h4>Withdraw</h4>
                    </div>
                    <div className='option' onClick={handlechange('/transfer')}>
                        <FontAwesomeIcon icon={faExchangeAlt} className="option-icon" />
                        <h4>Transfer</h4>
                    </div>
                    <div className='option' onClick={handlechange('/history')}>
                        <FontAwesomeIcon icon={faHistory} className="option-icon" />
                        <h4>Transactions History</h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transactions;

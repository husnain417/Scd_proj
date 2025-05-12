import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faWallet } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './deposit.css';
import Menu_items from '../menu/Menu_items';
import API_BASE_URL from '../../config';

const Deposit = () => {
  const [selectedItem, setSelectedItem] = useState('transaction');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

    const handleDeposit = async (e) => {
      e.preventDefault();
    
      try {
        const token = localStorage.getItem('accessToken');
        
        const depositData = { accountNumber, amount };
    
        const response = await axios.post(
          `${API_BASE_URL}/deposit`, 
          depositData,  
          {
            headers: {
              Authorization: `Bearer ${token}`,  
            },
          }
        );
        
        setMessage(response.data.message);
        setMessageType('success');
      } catch (error) {
        console.error(error);
        setMessage(error.response?.data?.message || 'Server error');
        setMessageType('error');
      }
    };
    

  return (
    <div className='deposit'>
      <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <div className='deposit__container'>
        <h2 className='h2_dep'>Deposit</h2>
        <form onSubmit={handleDeposit} className='deposit__form'>
          <div className='deposit__item'>
            <label htmlFor="accountNumber">Account Number:</label>
            <div className='input__container'>
              <FontAwesomeIcon icon={faWallet} className='icon' />
              <input
                type="text"
                id="accountNumber"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div className='deposit__item'>
            <label htmlFor="amount">Amount:</label>
            <div className='input__container'>
              <FontAwesomeIcon icon={faMoneyBillWave} className='icon' />
              <input
                type="number"
                id="amount"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>
          {message && (
            <p className={messageType === 'error' ? 'error_deposit' : 'success_deposit'}>
              {message}
            </p>
          )}   
          <button type="submit" className="deposit__button">Deposit</button>
        </form>
      </div>
    </div>
  );
};

export default Deposit;

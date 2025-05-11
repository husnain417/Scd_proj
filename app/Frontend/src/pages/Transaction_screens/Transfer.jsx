import React, { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faWallet, faUniversity } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './transfer.css';
import Menu_items from '../menu/Menu_items';
import { useLocation } from 'react-router-dom';

const Transfer = () => {
  const location = useLocation(); 
  const [selectedItem, setSelectedItem] = useState('transaction');
  const [senderAccountNumber, setSenderAccountNumber] = useState('');
  const [receiverBank, setReceiverBank] = useState('');
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (location.state?.beneficiary) {
      const beneficiary = location.state.beneficiary;
      setReceiverAccountNumber(beneficiary.beneficiaryAccountNumber);
      setReceiverBank(beneficiary.bank);
    }
  }, [location.state]);

  const handleTransfer = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('accessToken');
      
      const transferData = {
        senderAccountNum: senderAccountNumber,
        receiverbank: receiverBank,
        receiverAccountNum: receiverAccountNumber,
        amount,
      };
  
      const response = await axios.post(
        'http://localhost:5000/transfer', 
        transferData,  
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
    <div className='transfer'>
      <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <div className='transfer__container'>
        <h2 className='h2_transfer'>Money Transfer</h2>
        <form onSubmit={handleTransfer} className='transfer__form'>
          
          <div className='transfer__item'>
            <label htmlFor="senderAccountNumber">Sender Account Number:</label>
            <div className='input__container'>
              <FontAwesomeIcon icon={faWallet} className='icon' />
              <input
                type="text"
                id="senderAccountNumber"
                placeholder="Enter sender account number"
                value={senderAccountNumber}
                onChange={(e) => setSenderAccountNumber(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Receiver Bank */}
          <div className='transfer__item'>
            <label htmlFor="receiverBank">Receiver Bank:</label>
            <div className='input__container'>
              <FontAwesomeIcon icon={faUniversity} className='icon' />
              <input
                type="text"
                id="receiverBank"
                placeholder="Enter receiver bank"
                value={receiverBank}
                onChange={(e) => setReceiverBank(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Receiver Account Number */}
          <div className='transfer__item'>
            <label htmlFor="receiverAccountNumber">Receiver Account Number:</label>
            <div className='input__container'>
              <FontAwesomeIcon icon={faWallet} className='icon' />
              <input
                type="text"
                id="receiverAccountNumber"
                placeholder="Enter receiver account number"
                value={receiverAccountNumber}
                onChange={(e) => setReceiverAccountNumber(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Amount */}
          <div className='transfer__item'>
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
            <p className={messageType === 'error' ? 'error_transfer' : 'success_transfer'}>
              {message}
            </p>
          )}
          
          <button type="submit" className="transfer__button">Transfer</button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;

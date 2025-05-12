import React, { useState, useEffect } from 'react';
import './balance.css';
import axios from 'axios';
import Menu_items from '../menu/Menu_items';
import API_BASE_URL from '../../config';

const Balance = () => {
  const [selectedItem, setSelectedItem] = useState('accounts');
  const [accounts, setAccounts] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccountBalances = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/accounts`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.accounts && Array.isArray(response.data.accounts)) {
          setAccounts(response.data.accounts);
        } 
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load account balances.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBalances();
  }, []);

  return (
    <div className='balance__acc'>
      <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

      <div className="account-balance-section">
        <h2>Accounts Balance</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        <div className="account-list">
          {accounts.map((account) => {
            const formattedBalance = account.balance?.$numberDecimal
              ? account.balance.$numberDecimal
              : account.balance;

            return (
              <div key={account.accountNumber} className="account-item">
                <span className="account-number">Account Number: {account.accountNumber}</span>
                <span className="account-balance">Balance: {formattedBalance}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Balance;

import React, { useEffect, useState } from 'react';
import './useracc.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faWallet } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';

const Modal = ({ account, onClose }) => {
  if (!account) return null;

  const formattedBalance = account.balance?.$numberDecimal
    ? account.balance.$numberDecimal
    : account.balance;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Account Details</h2>
        <p><strong>Account Holder:</strong> {account.accountHolder}</p>
        <p><strong>Account Number:</strong> {account.accountNumber}</p>
        <p><strong>Account Type:</strong> {account.accountType}</p>
        <p><strong>Bank:</strong> {account.bank}</p>
        <p><strong>Balance:</strong> {formattedBalance}</p>

        <button className='btn' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const UserAcc = () => {
  const navigate = useNavigate(); 
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);

    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_BASE_URL}/accounts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAccounts(response.data.accounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleDelete = async (accountId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const accountToDelete = accounts.find((account) => account._id === accountId);

      if (!accountToDelete) {
        console.error('Account not found');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/closing`,
        { accountNumber: accountToDelete.accountNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAccounts((prevAccounts) =>
          prevAccounts.filter((account) => account._id !== accountId)
        );
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error closing account:', error);
      alert(
        error.response?.data?.message || 'Failed to close account. Please try again later.'
      );
    }
  };

  const handleViewDetails = (accountId) => {
    const accountToView = accounts.find((account) => account._id === accountId);
    setSelectedAccount(accountToView);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAccount(null);
    setIsModalOpen(false);
  };

  const handleCreateAccount = () => {
    navigate('/create-account');
  };

  const handlebalance = () => {
    navigate('/balance');
  };

  return (
    <>
      <div className={`user__acc ${isModalOpen ? 'blur-background' : ''}`}>
      <div className='account__opt'>
        <div className="option create-account" onClick={handleCreateAccount}>
            <FontAwesomeIcon icon={faPlus} className="icon" />
            <p>Create Account</p>
          </div>

          <div className="option view-balance" onClick={handlebalance}>
            <FontAwesomeIcon icon={faWallet} className="icon" />
            <p>View Balance</p>
          </div>
        </div>
        <div className='Accs'>
          <h2>Current Accounts</h2>
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <div key={account._id} className='account'>
                <p>Account Number: {account.accountNumber}</p>
                <p>Bank: {account.bank}</p>

                <FontAwesomeIcon
                  icon={faTrash}
                  className='delete-icon'
                  onClick={() => handleDelete(account._id)}
                />

                <button onClick={() => handleViewDetails(account._id)} className='view-details'>
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No accounts available</p>
          )}
        </div>
      </div>

      {isModalOpen && <Modal account={selectedAccount} onClose={handleCloseModal} />}
    </>
  );
};

export default UserAcc;

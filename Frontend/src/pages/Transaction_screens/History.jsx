import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './history.css';
import Menu_items from '../menu/Menu_items';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const History = () => {
  const [selectedItem, setSelectedItem] = useState('transaction');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:5000/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data.transactions);
      } catch (err) {
        setError('Failed to fetch transaction history.');
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:5000/transaction/id/download', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob' 
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_transactions.xlsx'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download the transactions file.', error);
    }
  };

  return (
    <div className="history">
      <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <div className="history__container">
        <h2>Transaction History</h2>
        <FontAwesomeIcon icon={faDownload} className="download-icon" onClick={handleDownload} />
        {error && <p className="error">{error}</p>}
        {transactions.length > 0 ? (
          <div className="transactions_his">
            {transactions.map((transaction, index) => (
              <div key={index} className="transaction-item-his">
                <p><strong>Transaction ID:</strong> {transaction._id}</p>
                <p><strong>Transaction Type:</strong> {transaction.transactionType}</p>
                <div className="transaction-details-his">
                  {transaction.transactionType === 'transfer' ? (
                    <>
                      <p><strong>Sender Account:</strong> {transaction.senderAccountNumber}</p>
                      <p><strong>Receiver Account:</strong> {transaction.receiverAccountNumber}</p>
                      <p><strong>Sender Bank:</strong> {transaction.senderBank}</p>
                      <p><strong>Receiver Bank:</strong> {transaction.receiverBank}</p>
                      <p><strong>Amount:</strong> {transaction.amount.$numberDecimal || transaction.amount}</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Account:</strong> {transaction.accountNumber}</p>
                      <p><strong>Bank:</strong> {transaction.bank}</p>
                      <p><strong>Amount:</strong> {transaction.amount.$numberDecimal || transaction.amount}</p>
                    </>
                  )}
                  <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {new Date(transaction.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default History;

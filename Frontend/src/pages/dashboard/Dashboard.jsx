import React, { useState, useEffect } from 'react';
import './dashboard.css';
import InputWithIcon from '../../components/InputWithIcon/InputWithIcon';
import vector1 from '../../assets/Vector30.png';
import vector2 from '../../assets/Vector31.png';
import vector3 from '../../assets/Vector32.png';
import Stats from '../../components/stats/Stats';
import bell from '../../assets2/bell.png';
import profile from '../../assets2/profile.jpg'
import card from '../../assets2/card.png'
import send from '../../assets2/send.png'
import bill from '../../assets2/credit-card.png'
import phone from '../../assets2/phone.png'
import more from '../../assets2/dots.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Menu_items from '../menu/Menu_items';

const stats_card = [
  { text: "Income", balance: "+ 944,280", icon: vector1 },
  { text: "Expenses", balance: "- 360,430", icon: vector2 },
  { text: "Saving", balance: "+ 100,000", icon: vector3 },
];

const Dashboard = () => {
  const [selectedItem, setSelectedItem] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [username, setUsername] = useState('');
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);

    const fetchProfilePic = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:5000/user/profile-pic`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfilePicUrl(response.data.url);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:5000/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchBeneficiaries = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:5000/beneficiary-get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBeneficiaries(response.data.beneficiaries);
      } catch (error) {
        console.error('Error fetching beneficiaries:', error);
      }
    };

    fetchProfilePic();
    fetchTransactions();
    fetchBeneficiaries();
  }, []);

  const recentTransactions = transactions.slice(0, 4);
  const benef = beneficiaries.slice(0,4);

  const handleBeneficiaryClick = (beneficiary) => {
    navigate('/transfer', { state: { beneficiary } });
  };

  return (
    <div className="bank__dash">
      <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <div className="dash__center">
        <div className="search">
          <InputWithIcon 
            iconClass="fas fa-search icon" 
            placeholder="Search" 
            value={null}
            onChange={null} 
            required
            inputClass="dashboard-search-input"
          />
        </div>
        <div className="stats">
          <h3>Stats</h3>
          <Stats item={stats_card} />
        </div>
        <div className="transactions">
          <div className='trans'>
            <h3>Transaction History</h3>
            <p>See All</p>
          </div>
          <div className="recent-transactions">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <p>Transaction Type: {transaction.transactionType}</p>
                <div className="transaction-details">
                  {transaction.transactionType === 'transfer' ? (
                    <>
                      <p><span className='head'></span> {transaction.senderAccountNumber}</p>
                      <p>Receiver Account: {transaction.receiverAccountNumber}</p>
                      <p>Sender Bank: {transaction.senderBank}</p>
                      <p>Receiver Bank: {transaction.receiverBank}</p>
                      <p>Amount: {transaction.amount.$numberDecimal || transaction.amount}</p>
                    </>
                  ) : (
                    <>
                      <p>Account: {transaction.accountNumber}</p>
                      <p>Bank: {transaction.bank}</p>
                      <p>Amount: {transaction.amount.$numberDecimal || transaction.amount}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="dash__side">
        <div className="side__header">
          <div className="not_img">
            <img src={bell} alt="Notifications" />
          </div>
          <div className="user__info">
            <div className="prof_img">
              <img src={profilePicUrl || profile} alt="Profile" />
            </div>
            <div>{username}</div>
          </div>
        </div>`
        <div className='card_img'><img src={card} alt="" /></div>`
        <div className="horizontal-container">
          <div className="item">
            <div className="img-container"><img src={send} alt="Transfer" /></div>
            <p>Transfer</p>
          </div>
          <div className="item">
            <div className="img-container"><img src={bill} alt="Bill" /></div>
            <p>Bill</p>
          </div>
          <div className="item">
            <div className="img-container"><img src={phone} alt="Buy Airtime" /></div>
            <p>Buy Airtime</p>
          </div>
          <div className="item">
            <div className="img-container"><img src={more} alt="More" /></div>
            <p>More</p>
          </div>
        </div>
        <div className='beneficiary__container'>
          <div>
            <h4>Quick Transfer</h4>
          </div>
          <div className='all_benef'>
            {benef.map((beneficiary, index) => (
              <div key={index} className="beneficiary-item" onClick={() => handleBeneficiaryClick(beneficiary)}> 
                <p>{beneficiary.name}</p>
                <p>{beneficiary.beneficiaryAccountNumber}</p>
                <p>{beneficiary.bank}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

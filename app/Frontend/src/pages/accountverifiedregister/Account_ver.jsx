import React from 'react';
import './account_ver.css';
import verified from '../../assets2/verified.png';
import { Link, useNavigate } from 'react-router-dom'; 


const Account_ver = () => {
    const navigate = useNavigate(); 

    function Todashboard()
    {
        navigate('/login'); 
    }

  return (
    <div className="account-verification-container">
      <img src={verified} alt="Account Verified" className="verified-image" />
      <h1>Account Verified</h1>
      <p>Your account has been verified successfully.</p>
      <button className="dashboard-btn" onClick={Todashboard}>Login</button>
    </div>
  );
};

export default Account_ver;

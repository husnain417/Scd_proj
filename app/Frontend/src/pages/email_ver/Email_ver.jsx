import React from 'react';
import OtpInput from '../../components/otpinput/Otp_input';
import './email_ver.css';
import logo from '../../assets/logo.svg';
import sidepic from '../../assets2/email_ver.png';
import { useLocation, useNavigate } from 'react-router-dom';

const Email_ver = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const maskEmail = (email) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username[0] + '****' + username.slice(-1);
    return `${maskedUsername}@${domain}`;
  };

  const handleVerifySuccess = () => {
    navigate('/accountverified');
  };

  return (
    <div className='bank__emailver'>
      <div className='bank__emailver-content'>
        <div className='header_email'>
          <img src={logo} alt='logo' width='140px' />
          <h2>Email Verification</h2>
          <p>We sent a code to ({maskEmail(email)}). Enter the code here to verify your identity</p>
        </div>
        <OtpInput email={email} onVerifySuccess={handleVerifySuccess} />
      </div>
      <div className='bank__login-images'>
        <div className="image-container">
          <img src={sidepic} alt="Sidepic" className="sidepic-image" />
        </div>
      </div>
    </div>
  );
};

export default Email_ver;

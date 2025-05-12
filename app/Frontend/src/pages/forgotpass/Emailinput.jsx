import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailpic from '../../assets2/email.png';
import InputWithIcon from '../../components/InputWithIcon/InputWithIcon';
import API_BASE_URL from '../../config';

const Emailinput = () => {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleContinue = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/password-forgot`, { email });

      if (response.status === 200) {
        console.log('Reset Token:', response.data.resetToken); // Debugging
        navigate('/newpass', { state: { email, resetToken: response.data.resetToken } });
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="account-verification-container">
      <img src={emailpic} alt="email" className="verified-image" />
      <h2>Enter email for OTP</h2>
      <InputWithIcon 
        iconClass="fas fa-envelope icon" 
        placeholder="Enter your email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)} 
        required 
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button className="continuebtn" onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default Emailinput;

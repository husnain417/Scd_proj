import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputWithIcon from '../../components/InputWithIcon/InputWithIcon';
import logo from '../../assets/logo.svg';
import './forgotpass.css';
import email_ver from '../../assets2/email_ver.png';

const Newpass = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, resetToken } = location.state || {};
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setResendAvailable(true);
    }
  }, [timer]);

  useEffect(() => {
    let errorTimer;
    if (errorMessage) {
      errorTimer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
    return () => clearTimeout(errorTimer);
  }, [errorMessage]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleResend = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/verification/reSendOtp', { email });
      setResendMessage(response.data.message);
      setTimer(60);
      setResendAvailable(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } catch (err) {
      setResendMessage(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
    const otpString = otp.join('');
    console.log('Using Reset Token:', resetToken);

    try {
      const response = await axios.post('http://localhost:5000/user/password-reset', {
        otp: otpString,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${resetToken}`
        }
      });

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
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
    <div className="newpass-container">
      <div className='newpass-content'>
        <div className='header'>
          <img src={logo} alt='logo' width='140px' />
          <h2>Reset Password</h2>
          <p>Enter OTP sent to your mail and new password</p>
        </div>

        <div className='otps'>
          <div className="otp-box">
            {otp.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={el => inputRefs.current[index] = el}
                className="otp-input"
              />
            ))}
          </div>
          <div className="resend-container">
            {resendAvailable ? (
              <button className="resend-btn" onClick={handleResend}>Resend</button>
            ) : (
              <p>Resend in 00:{timer < 10 ? `0${timer}` : timer}</p>
            )}
          </div>
        </div>

        <h4>New Password</h4>
        <InputWithIcon
          iconClass="fas fa-lock icon"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          required
        />
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        <button className="reset-btn" onClick={handlePasswordReset}>Reset Password</button>
      </div>
      <div className='bank__login-images'>
        <div className="image-container">
          <img src={email_ver} alt="Sidepic" className="sidepic-image" />
        </div>
      </div>
    </div>
  );
};

export default Newpass;

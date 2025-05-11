import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './otp_input.css';

const OtpInput = ({ email, onVerifySuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      inputRefs.current[0].focus(); // Focus on the first input box
    } catch (err) {
      setResendMessage(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    try {
      const response = await axios.post('http://localhost:5000/user/verification/otpCheck', { email, otp: otpString });
      if (response.data.message === 'OTP verified successfully') {
        onVerifySuccess(); 
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    }
  };

  return (
    <div className="otp-container">
      <div className='otp-box'>
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
      <div>
        <button onClick={handleVerifyOtp} className="verify-btn">Verify OTP</button>
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="resend-container">
        {resendAvailable ? (
          <button className="resend-btn" onClick={handleResend}>Resend</button>
        ) : (
          <p>Resend in 00:{timer < 10 ? `0${timer}` : timer}</p>
        )}
      </div>
    </div>
  );
};

export default OtpInput;

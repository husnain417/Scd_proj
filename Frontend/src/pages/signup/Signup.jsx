import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import InputWithIcon from '../../components/InputWithIcon/InputWithIcon';
import axios from 'axios'; // Import axios
import logo from '../../assets/logo.svg';
import google from '../../assets2/google.png';
import signup from '../../assets2/signup.png';


const Signup = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    console.log('Username:', username); 
    console.log('Email:', email);
    console.log('Password:', password); 

    if (!username || !email || !password) {
      console.error('All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        setMessage('User created successfully, and OTP sent to email');
        setMessageType('success'); 
  
        setTimeout(() => {
          navigate('/emailverification', { state: { email } });
        }, 1500); 
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error during sign up');
      setMessageType('error');
    }
  };

  return (
    <div className='bank__signup'>
      <div className='bank__signup-content'>
        <div className='header'>
          <img src={logo} alt='logo' width='140px' />
          <h2>Create an Account</h2>
          <p>Welcome! Please enter your details</p>
        </div>
        <form onSubmit={handleSubmit} className="signup-container">
          <h4>Username</h4>
          <InputWithIcon 
            iconClass="fas fa-person icon" 
            placeholder="Enter username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <h4>Email</h4>
          <InputWithIcon 
            iconClass="fas fa-envelope icon" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <h4>Password</h4>
          <InputWithIcon 
            iconClass="fas fa-lock icon" 
            placeholder="Enter password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            required 
          />
            {message && (
            <p className={messageType === 'error' ? 'error_register' : 'success_register'}>
              {message}
            </p>
          )}          
          <button type='submit' className='continuebtn'>Continue</button>
        </form>
        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text">or</span>
          <span className="divider-line"></span>
        </div>
        <button className="loginbtn_google" aria-label="Login with Google">
          <img src={google} alt="Google logo" className="google-logo" width='20px' />
          Login with Google
        </button>
        <p className='signup'>
          Already have an account?&nbsp;&nbsp;&nbsp;
          <Link to="/login">Sign in</Link> 
        </p>
      </div>
      <div className='bank__login-images'>
        <div className="image-container">
          <img src={signup} alt="Sidepic" className="sidepic-image" />
        </div>
      </div>
    </div>
  );
};

export default Signup;

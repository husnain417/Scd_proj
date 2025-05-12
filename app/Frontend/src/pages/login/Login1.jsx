import React, { useState } from 'react';
import './login.css';
import InputWithIcon from '../../components/InputWithIcon/InputWithIcon';
import logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom'; 
import google from '../../assets2/google.png';
import sidepic from '../../assets2/Secure login 1.png';
import axios from 'axios'; 
import API_BASE_URL from '../../config';

const Login1 = () => {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
    const handleLogin = async (event) => {
      event.preventDefault(); 
    
      try {
        const response = await axios.post(`${API_BASE_URL}/login`, {
          username,
          password,
        });
    
        if (response.status === 200) {
          setMessage('Login successful');
          setMessageType('success'); 
  
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('username', username);
    
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500); 
        }
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error during login');
        setMessageType('error');
      }
    };
  

  return (
    <div className='bank__login'>
      <div className='bank__login-content'>
        <div className='header'>
          <img src={logo} alt='logo' width='140px' />
          <h2>Login to your account</h2>
          <p>Welcome back! Please enter your details</p>
        </div>
        <form onSubmit={handleLogin} className="login-container"> 
          <h4>Username</h4>
          <InputWithIcon 
            iconClass="fas fa-user icon" 
            placeholder="Enter your email" 
            type="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          
          <h4>Password</h4>
          <InputWithIcon 
            iconClass="fas fa-lock icon" 
            placeholder="Enter your password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {message && (
            <p className={messageType === 'error' ? 'error' : 'success'}>
              {message}
            </p>
          )}          
          <p className='ForgotPass'>
          <Link to="/forgotpass">forgot password?</Link> </p>
          <button type='submit' className='loginbtn'>Login</button> 
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
          Don't have an account?&nbsp;&nbsp;&nbsp;
          <Link to="/signup">Sign up</Link> 
        </p>
      </div>
      <div className='bank__login-images'>
        <div className="image-container">
          <img src={sidepic} alt="Sidepic" className="sidepic-image" />
        </div>
      </div>
    </div>
  );
}

export default Login1;

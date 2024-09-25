import React, { useState } from 'react';
import axios from 'axios';
import './change.css'
import Menu_items from '../menu/Menu_items';

const Changepass = () => {
  const [selectedItem, setSelectedItem] = useState('profile');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:5000/user/password-update', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setMessage('Password updated successfully');
        setMessageType('success');
        setOldPassword('');
        setNewPassword('');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
        setMessageType('error');
      } else {
        setMessage('An error occurred. Please try again.');
        setMessageType('error');
      }
    }
  };

  return (
    <div className='deposit'>
      <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <div className='changepass__container'>
        <h2 className='h2_change'>Change Password</h2>
        <form className='changepass__form' onSubmit={handlePasswordChange}>
          <div className='changepass__item'>
            <label htmlFor="oldPassword">Old Password:</label>
            <input
              type="password"
              id="oldPassword"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className='changepass__item'>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          {message && (
            <p className={messageType === 'error' ? 'error_message' : 'success_message'}>
              {message}
            </p>
          )}
          <button type="submit" className="changepass__button">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default Changepass;

import React, { useState } from 'react';
import './create.css';
import axios from 'axios';
import Menu_items from '../menu/Menu_items';

const Create = () => {
  const [selectedItem, setSelectedItem] = useState('accounts');
  const [formData, setFormData] = useState({
    name: '',
    accountType: '',
    accountNumber: '',
    bankName: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:5000/accounts/create', 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
        if (response.status === 200) {
          setMessage('Account created successfully');
          setMessageType('success');
        setFormData({
          name: '',
          accountType: '',
          accountNumber: '',
          bankName: ''
        });
      }
    } catch (error) {
        setMessage(error.response?.data?.message || 'Error during login');
        setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='create__acc'>
      <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

      <div className="create-account-form">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Account Holder Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter account holder name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="accountType">Account Type:</label>
            <select
              id="accountType"
              name="accountType"
              value={formData.accountType}
              onChange={handleInputChange}
              required
            >
              <option value="current">Current</option>
              <option value="bussiness">Bussiness</option>
              <option value="saving">Saving</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="accountNumber">Account Number:</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bankName">Bank Name:</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              placeholder="Enter bank name (e.g HBL, UBL etc)"
              value={formData.bankName}
              onChange={handleInputChange}
              required
            />
          </div>
          {message && (
            <p className={messageType === 'error' ? 'error_ha' : 'success_ha'}>
              {message}
            </p>
          )}   
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Create;

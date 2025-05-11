import React, { useState } from 'react';
import axios from 'axios';
import Menu_items from '../menu/Menu_items';

const Update = () => {
  const [selectedItem, setSelectedItem] = useState('beneficiary');
  const [formData, setFormData] = useState({
    accountNumber: '',
    newName: ''
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

  const handleBeneficiarySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(
        'http://localhost:5000/beneficiary-update',
        { 
          accountNumber: formData.accountNumber, 
          newName: formData.newName 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage('Beneficiary updated successfully');
        setMessageType('success');
        setFormData({
          accountNumber: '',
          newName: ''
        });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error during beneficiary update');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='create__acc'>
      <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

      <div className="create-account-form">
        <h2>Update Beneficiary</h2>

        <form onSubmit={handleBeneficiarySubmit}>

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
            <label htmlFor="newName">New Name: </label>
            <input
              type="text"
              id="newName"
              name="newName"
              placeholder="Enter new name"
              value={formData.newName}
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
            {loading ? 'Updating Beneficiary...' : 'Update Beneficiary'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;

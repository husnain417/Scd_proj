import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate, useLocation } from 'react-router-dom';
import './ben.css'

const Modal = ({ beneficiary, onClose }) => {
  if (!beneficiary) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Beneficiary Details</h2>
        <p><strong>Name:</strong> {beneficiary.name}</p>
        <p><strong>Account Number:</strong> {beneficiary.beneficiaryAccountNumber}</p>
        <p><strong>Bank:</strong> {beneficiary.bank}</p>
        <p><strong>Email:</strong> {beneficiary.email}</p>

        <button className='btn' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Beneficiary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);

    const fetchBeneficiaries = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:5000/beneficiary-get', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBeneficiaries(response.data.beneficiaries);
      } catch (error) {
        console.error('Error fetching beneficiaries:', error);
      }
    };

    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const highlightName = query.get('highlight');
    
    if (highlightName) {
      const beneficiaryToHighlight = beneficiaries.find(
        (beneficiary) => beneficiary.name === decodeURIComponent(highlightName)
      );
      if (beneficiaryToHighlight) {
        setSelectedBeneficiary(beneficiaryToHighlight);
        setIsModalOpen(true);
      }
    }
  }, [location.search, beneficiaries]);

  const handleDelete = async (beneficiaryId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const beneficiaryToDelete = beneficiaries.find((beneficiary) => beneficiary._id === beneficiaryId);

      if (!beneficiaryToDelete) {
        console.error('Beneficiary not found');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/beneficiary-delete',
        { accountNumber: beneficiaryToDelete.beneficiaryAccountNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setBeneficiaries((prevBeneficiaries) =>
          prevBeneficiaries.filter((beneficiary) => beneficiary._id !== beneficiaryId)
        );
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
      alert(
        error.response?.data?.message || 'Failed to delete beneficiary. Please try again later.'
      );
    }
  };

  const handleViewDetails = (beneficiaryId) => {
    const beneficiaryToView = beneficiaries.find((beneficiary) => beneficiary._id === beneficiaryId);
    setSelectedBeneficiary(beneficiaryToView);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBeneficiary(null);
    setIsModalOpen(false);
  };

  const handleAddBeneficiary = () => {
    navigate('/beneficiary_add');
  };

  const handleUpdateBeneficiary = () => {
    navigate('/beneficiary_update');
  };

  const handleSearchBeneficiary = () => {
    navigate('/beneficiary_search');
  };

  return (
    <>
      <div className={`user__acc ${isModalOpen ? 'blur-background' : ''} ben`}>
        <div className='ben_account__opt'>
          <div className="option create-account" onClick={handleAddBeneficiary}>
            <FontAwesomeIcon icon={faPlus} className="icon" />
            <p>Add Beneficiary</p>
          </div>
          <div className="option view-balance" onClick={handleUpdateBeneficiary}>
            <FontAwesomeIcon icon={faEdit } className="icon" />
            <p>Update</p>
          </div>
          <div className="option view-balance" onClick={handleSearchBeneficiary}>
            <FontAwesomeIcon icon={faSearch } className="icon" />
            <p>Search</p>
          </div>
        </div>
        <div className='Accs'>
          <h2>Current Beneficiaries</h2>
          {beneficiaries.length > 0 ? (
            beneficiaries.map((beneficiary) => (
              <div
                key={beneficiary._id}
                className={`account_benef ${selectedBeneficiary?._id === beneficiary._id ? 'highlighted' : ''}`}
              >
                <p>Account Name: {beneficiary.name}</p>
                <p>Bank: {beneficiary.bank}</p>

                <FontAwesomeIcon
                  icon={faTrash}
                  className='delete-icon'
                  onClick={() => handleDelete(beneficiary._id)}
                />

                <button onClick={() => handleViewDetails(beneficiary._id)} className='view-details'>
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No beneficiaries available</p>
          )}
        </div>
      </div>

      {isModalOpen && <Modal beneficiary={selectedBeneficiary} onClose={handleCloseModal} />}
    </>
  );
};

export default Beneficiary;

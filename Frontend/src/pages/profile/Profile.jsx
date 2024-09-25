import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu_items from '../menu/Menu_items';
import { Link, useNavigate } from 'react-router-dom'; 
import './profile.css'

const Profile = () => {
    const navigate = useNavigate(); 
  const [selectedItem, setSelectedItem] = useState('profile');
  const [profilePic, setProfilePic] = useState('');
  const [name, setName] = useState('User Name');
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        setName(localStorage.getItem('username'));
        const response = await axios.get('http://localhost:5000/user/profile-pic', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setProfilePic(response.data.url);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const passchange = () =>  {
    navigate('/changepass')
  }

  const uploadProfilePic = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:5000/user/upload-pic', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setProfilePic(response.data.url); // Update profile picture with the new URL
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <div className='create__acc'>
      <Menu_items selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
      <div className='profile-container'>
        <div className='profile-details'>
          <div className='profile-picture'>
            <img src={profilePic} alt="Profile" />
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadProfilePic}>Upload Picture</button>
          </div>
          <div className='profile-name'>
            <h3>Username: {name}</h3>
          </div>
        </div>
        <div className='change-password' onClick={passchange}>
          <p>Change Password</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

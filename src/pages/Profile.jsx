import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';
import defaultProfileImage from '../assets/images/lawbg.jpg';
import api from '../utils/api';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profileImage: defaultProfileImage,
    name: '',
    email: '',
    phone: '',
    address: '',
    nation: '',
    gender: 'male',
    language: 'english',
    profession: '',
    experience: '',
    specialization: '',
    barCouncilId: '',
    universityName: '',
    yearOfStudy: '',
    studentId: '',
    dob: { day: '', month: '', year: '' },
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ...user,
        profileImage: user.profilePicture
          ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${user.profilePicture}`
          : defaultProfileImage,
        dob: user.dob || { day: '', month: '', year: '' },
        profession: user.profession || user.role || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dob') {
      const [year, month, day] = value.split('-');
      setFormData(prev => ({
        ...prev,
        dob: { day, month, year }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/api/auth/profile', { ...formData }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === 'success') {
        updateUser(response.data.data.user);
        alert('Profile updated successfully');
        setIsEditing(false);
      }
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const formatDOB = () => {
    const { year, month, day } = formData.dob || {};
    return year && month && day
      ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      : '';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  return (
    <div className="modern-profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <img
              src={formData.profileImage}
              alt="Profile"
              className="profile-avatar"
            />
            {isEditing && (
              <>
                <label htmlFor="profile-image-upload" className="edit-icon">📷</label>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/jpeg,image/png,image/jpg"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const formDataImage = new FormData();
                    formDataImage.append('profileImage', file);
                    try {
                      const token = localStorage.getItem('token');
                      const response = await api.post('/api/auth/upload-profile-image', formDataImage, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      if (response.data.status === 'success') {
                        const profilePicture = response.data.data.profilePicture;
                        const imageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${profilePicture}`;
                        setFormData(prev => ({ ...prev, profileImage: imageUrl }));
                        updateUser({ ...user, profilePicture });
                      }
                    } catch (err) {
                      alert('Failed to upload image');
                    }
                  }}
                />
              </>
            )}
          </div>

          <div className="profile-basic">
            <h2>{formData.name}</h2>
            <p>{formData.email}</p>
            <span className="role-badge">{formData.profession}</span>
          </div>

          <div className="profile-action-buttons">
            <button className="signout-btn" onClick={handleLogout}>Sign Out</button>
            <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
          </div>

          <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <form className={`profile-form ${isEditing ? 'editing' : ''}`} onSubmit={handleSubmit}>
          <h3>Personal Info</h3>
          <div className="form-grid">
            <div>
              <label>Phone</label>
              <input name="phone" value={formData.phone} readOnly />
            </div>
            <div>
              <label>Address</label>
              <input name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div>
              <label>Nation</label>
              <input name="nation" value={formData.nation} onChange={handleChange} disabled={!isEditing} />
            </div>
            <div>
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label>Language</label>
              <select name="language" value={formData.language} onChange={handleChange} disabled={!isEditing}>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="gujarati">Gujarati</option>
              </select>
            </div>
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formatDOB()}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          {formData.profession && (
            <>
              <h3>Professional Info</h3>
              <div className="form-grid">
                {formData.profession === 'lawyer' && (
                  <>
                    <div>
                      <label>Experience</label>
                      <input name="experience" value={formData.experience} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <label>Specialization</label>
                      <input name="specialization" value={formData.specialization} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <label>Bar Council ID</label>
                      <input name="barCouncilId" value={formData.barCouncilId} onChange={handleChange} disabled={!isEditing} />
                    </div>
                  </>
                )}
                {formData.profession === 'law_student' && (
                  <>
                    <div>
                      <label>University Name</label>
                      <input name="universityName" value={formData.universityName} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <label>Year of Study</label>
                      <input name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} disabled={!isEditing} />
                    </div>
                    <div>
                      <label>Student ID</label>
                      <input name="studentId" value={formData.studentId} onChange={handleChange} disabled={!isEditing} />
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="save-btn">Save</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;

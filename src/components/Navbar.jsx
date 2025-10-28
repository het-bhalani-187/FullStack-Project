import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo8.jpg';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const getNavClass = (path) => {
    return location.pathname === path ? 'navbar-item active' : 'navbar-item';
  };

  const renderAuthLinks = () => {
  if (!user) {
    return (
      <>
        <Link to="/login" className={getNavClass('/login')}>Login</Link>
        <Link to="/signup" className={getNavClass('/signup')}>Sign Up</Link>
      </>
    );
  }

  return (
    <Link to="/profile" className={getNavClass('/profile')}>Profile</Link>
  );
};


  const renderRoleBasedLinks = () => {
    if (!user) return null;

    const role = user.role?.toLowerCase() || '';
    const links = [];

    links.push(<Link key="promptbar" to="/promptbar" className={getNavClass('/promptbar')}>IPC Dictionary</Link>);
    // links.push(<Link key="Chatbot" to="/Chatbot" className={getNavClass('/Chatbot')}>Chatbot</Link>);

    if (role === 'civilian' || role === 'lawyer') {
      links.push(<Link key="courtroom" to="/courtroom" className={getNavClass('/courtroom')}>CourtRoom</Link>);
    }

    if (role === 'law_student' || role === 'lawyer') {
      links.push(<Link key="blog" to="/blog" className={getNavClass('/blog')}>Blog</Link>);
    }

    return <>{links}</>;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Logo" className="navbar-logo" />
        {user && (
          <span className="navbar-welcome">
            Welcome {user.name} 
          </span>
        )}
      </div>
      
      <div className={`navbar-menu ${isOpen ? 'is-open' : ''}`}>
        <Link to="/dashboard" className={getNavClass('/dashboard')}>Home</Link>
        {renderRoleBasedLinks()}
        {renderAuthLinks()}
      </div>
    </nav>
  );
};

export default Navbar;
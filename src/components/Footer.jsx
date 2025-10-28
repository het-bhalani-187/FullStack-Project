import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import '../styles/Footer.css'; // Ensure this CSS file is imported

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1 - About */}
        <div className="footer-section about">
          <h3>LAWYER.AI</h3>
          <p>Your trusted legal assistant, providing expert advice and guidance.</p>
          <p>🔹 AI-powered legal insights for professionals and civilians</p>
          <p>🔹 Secure & confidential consultations</p>
          <p>🔹 Access legal resources anytime, anywhere</p>
        </div>

        {/* Column 2 - Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <Link to="/dashboard" className="links">Home</Link>
          <Link to="/features" className="links">Features</Link>
          <Link to="/aboutus" className="links">About Us</Link>
          <Link to="/contactus" className="links">Contact Us</Link>
        </div>

        {/* Column 3 - Social Media */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Lawyer.AI</p>
      </div>
    </footer>
  );
};

export default Footer;

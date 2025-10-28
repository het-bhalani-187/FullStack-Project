import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import Features from './Features';
import Profile from '../pages/Profile';
import Footer from './Footer';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AboutUs1 from '../pages/AboutUs1';
import Blog from '../pages/Blog';
// import Courtroom from '../pages/Courtroom';
import ContactUs from '../pages/ContactUs';

// import VerifyOtp from '../pages/VerifyOtp';

const Layout = () => {
  return (
    <div>
      <Navbar2 />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<AboutUs1 />} />
        <Route path="/blog" element={<Blog />} />
        {/* <Route path="/courtroom" element={<Courtroom />} /> */}
        {/* <Route path="/Chatbot" element={<Chatbot />} /> */}
        
        {/* <Route path="/verifyotp" element={<VerifyOtp />} /> */} 
      </Routes>
      <Footer />
    </div>
  );
};

export default Layout;
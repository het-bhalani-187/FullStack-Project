import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Signup.css';
import logo from '../assets/images/logo8.jpg';
import { toast } from 'react-toastify';

const MIN_LAWYER_EXPERIENCE = 2;

const SIGNUP_STEPS = {
  FORM: 'FORM',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL'
};

const InputBox = ({ currentRef, previousRef, nextRef, index, otp, handleChange }) => {
  const handleKeyUp = (e) => {
    const currentValue = e.target.value;
    if (currentValue.length > 1) {
      e.target.value = currentValue[currentValue.length - 1];
    }
    if (currentValue && nextRef?.current) {
      nextRef.current.focus();
    } else if (e.key === "Backspace" && previousRef?.current) {
      previousRef.current.focus();
    }
    const newOtp = otp.split('');
    newOtp[index] = e.target.value;
    handleChange(newOtp.join(''));
  };

  return (
    <input
      type="text"
      maxLength={1}
      ref={currentRef}
      onKeyUp={handleKeyUp}
      style={{
        width: 40,
        height: 40,
        margin: 5,
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: 5,
      }}
    />
  );
};

const Signup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(SIGNUP_STEPS.FORM);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'civilian',
    specialization: '',
    experience: '',
    barCouncilId: '',
    universityName: '',
    studentId: '',
    yearOfStudy: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // OTP input refs
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);

  const boxes = [
    { currentRef: ref0, nextRef: ref1 },
    { currentRef: ref1, previousRef: ref0, nextRef: ref2 },
    { currentRef: ref2, previousRef: ref1, nextRef: ref3 },
    { currentRef: ref3, previousRef: ref2, nextRef: ref4 },
    { currentRef: ref4, previousRef: ref3, nextRef: ref5 },
    { currentRef: ref5, previousRef: ref4 },
  ];

  const specializations = [
    'Criminal Law',
    'Civil Law',
    'Family Law',
    'Corporate Law',
    'Property Law',
    'Immigration Law',
    'General Practice'
  ];

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.role === 'lawyer') {
      if (!formData.specialization) {
        setError('Please select your specialization');
        return false;
      }
      if (!formData.experience || formData.experience < 0) {
        setError('Please provide valid years of experience');
        return false;
      }
    }

    if (formData.role === 'law_student') {
      if (!formData.universityName || !formData.studentId || !formData.yearOfStudy) {
        setError('Please fill in all law student-specific fields');
        return false;
      }
    }

    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number with country code (e.g., +91XXXXXXXXXX)');
      return;
    }

    setCurrentStep(SIGNUP_STEPS.PHONE);
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/send-verification', {
        phone: formData.phone
      }, {
        baseURL: 'http://localhost:5000',
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setIsOtpVisible(true);
        toast.success('Verification code sent successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      toast.error(error.response?.data?.message || error.message || 'Error sending verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!formData.phone) return;
    await handleSendOTP();
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        phone: formData.phone,
        otp: otp
      });
      
      if (response.data.success) {
        toast.success('Phone number verified successfully!');
        handleSignup();
      } else {
        setMessage({ type: "error", text: "Could not verify OTP" });
        setTimeout(() => setMessage({ type: "", text: "" }), 2000);
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error(error.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        ...formData,
        phoneVerified: true
      });
      if (response.data.success) {
        localStorage.setItem('pendingVerificationEmail', formData.email);
        setCurrentStep(SIGNUP_STEPS.EMAIL);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderFormStep = () => (
    <div className="auth-box">
      <img src={logo} alt="LawAI Logo" className="auth-logo" />
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number (e.g., +91XXXXXXXXXX)"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d+]/g, '');
              const formattedValue = value.startsWith('+') ? value : '+' + value;
              setFormData(prev => ({
                ...prev,
                phone: formattedValue
              }));
            }}
            pattern="\+\d+"
            title="Please enter a valid phone number starting with + followed by country code and number"
            required
          />
        </div>

        <div className="form-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="civilian">Civilian</option>
            <option value="lawyer">Lawyer</option>
            <option value="law_student">Law Student</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="8"
          />
        </div>

        {formData.role === 'lawyer' && (
          <div className="lawyer-fields">
            <div className="form-group">
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
              >
                <option value="">Select Specialization</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <input
                type="text"
                name="barCouncilId"
                placeholder="Bar Council ID"
                title="Bar Council ID should be in format: XX12345 or XX123456 or XX12345/YYYY or XX123456/YYYY"
                value={formData.barCouncilId}
                onChange={handleChange}
                pattern="[A-Z]{2}\d{5,6}(\/\d{4})?"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                name="experience"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                step="0.5"
                required
              />
              {formData.experience < MIN_LAWYER_EXPERIENCE && (
                <div className="experience-warning">
                  Note: You need at least {MIN_LAWYER_EXPERIENCE} years of experience to answer questions in the courtroom
                </div>
              )}
            </div>
          </div>
        )}

        {formData.role === 'law_student' && (
          <div className="student-fields">
            <div className="form-group">
              <input
                type="text"
                name="universityName"
                placeholder="University Name"
                value={formData.universityName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                value={formData.studentId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                name="yearOfStudy"
                placeholder="Year of Study"
                value={formData.yearOfStudy}
                onChange={handleChange}
                min="1"
                max="5"
                required
              />
            </div>
          </div>
        )}

        <button type="submit" className="auth-button">
          Continue to Phone Verification
        </button>
      </form>

      <div className="auth-links">
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );

  const renderPhoneStep = () => (
    <div className="auth-box">
      <img src={logo} alt="LawAI Logo" className="auth-logo" />
      <h2>{!isOtpVisible ? "Verify Phone Number" : "Enter OTP"}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        {!isOtpVisible ? (
          <>
            <p>We'll send a verification code to: {formData.phone}</p>
            <button 
              type="button" 
              onClick={handleSendOTP}
              disabled={loading}
              className="auth-button"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </>
        ) : (
          <div className="otp-container">
            <p>Enter the 6-digit code sent to {formData.phone}</p>
            <div className="otp-inputs">
              {boxes.map((box, index) => (
                <InputBox
                  key={index}
                  {...box}
                  index={index}
                  otp={otp}
                  handleChange={setOtp}
                />
              ))}
            </div>
            <div className="otp-actions">
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="auth-button"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-button"
              >
                Resend Code
              </button>
            </div>
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderEmailStep = () => (
    <div className="auth-box">
      <img src={logo} alt="LawAI Logo" className="auth-logo" />
      <h2>Email Verification</h2>
      <div className="verification-message">
        <p>We've sent a verification link to your email address: <strong>{formData.email}</strong></p>
        <p>Please check your email and click the verification link to complete your registration.</p>
        <p>If you don't see the email, please check your spam folder.</p>
      </div>
      <div className="auth-links">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case SIGNUP_STEPS.FORM:
        return renderFormStep();
      case SIGNUP_STEPS.PHONE:
        return renderPhoneStep();
      case SIGNUP_STEPS.EMAIL:
        return renderEmailStep();
      default:
        return renderFormStep();
    }
  };

  return (
    <div className="auth-container">
      {renderCurrentStep()}
    </div>
  );
};

export default Signup;
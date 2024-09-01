import React, { useState } from 'react';
import './SignUp.css';
import { register, login } from '../services/userAuth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const navigate = useNavigate();
  
  // Sign Up States
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signUpErrors, setSignUpErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Log In States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validateSignUp = () => {
    const { name, email, password, confirmPassword } = userData;
    const newErrors = {
      name: name.trim() === '',
      email: !/^\S+@\S+\.\S+$/.test(email),
      password: password.length < 6,
      confirmPassword: password !== confirmPassword,
    };
    setSignUpErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (validateSignUp()) {
      try {
        await register(userData);
        toast.success('Registration successful! Please log in.');
        setUserData({ name: '', email: '', password: '', confirmPassword: '' });
        setErrorMessage('');
        switchToLoginTab();
      } catch (error) {
        const errorMsg = error.response?.data.message || error.message;
        setErrorMessage(
          errorMsg === 'User already exists'
            ? 'User already registered. Please login.'
            : 'An error occurred. Please try again.'
        );
        console.error('Error:', errorMsg);
      }
    }
  };

  const validateLogin = () => {
    const newErrors = {
      email: !/^\S+@\S+\.\S+$/.test(loginEmail),
      password: loginPassword.length < 4,
    };
    setLoginErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (validateLogin()) {
      try {
        await login({ email: loginEmail, password: loginPassword });
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (error) {
        const errorMsg = error.response?.data.message || error.message;
        toast.error(
          errorMsg.includes('User not registered')
            ? 'User not registered. Please register first.'
            : errorMsg.includes('Incorrect email or password')
            ? 'Incorrect email or password. Please try again.'
            : 'An error occurred. Please try again.'
        );
        console.error('Error:', errorMsg);
      }
    }
  };

  const switchToLoginTab = () => setActiveTab('login');

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="title">QUIZZIE</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
        </div>

        {activeTab === 'signup' && (
          <form onSubmit={handleSignUpSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className={signUpErrors.name ? 'error-input' : ''}
                />
                {signUpErrors.name && (
                  <p className="error-message">Please enter your name.</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className={signUpErrors.email ? 'error-input' : ''}
                />
                {signUpErrors.email && (
                  <p className="error-message">Please enter a valid email address.</p>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className={signUpErrors.password ? 'error-input' : ''}
                />
                {signUpErrors.password && (
                  <p className="error-message">Password must be at least 6 characters.</p>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  className={signUpErrors.confirmPassword ? 'error-input' : ''}
                />
                {signUpErrors.confirmPassword && (
                  <p className="error-message">Passwords do not match.</p>
                )}
              </div>
            </div>
            <div className="btn">
              <button type="submit" className="signup-button">Sign Up</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        )}

        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <div>
                <input
                  type="email"
                  id="login-email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={loginErrors.email ? 'error-input' : ''}
                />
                {loginErrors.email && (
                  <p className="error-message">Please enter a valid email address.</p>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div>
                <input
                  type="password"
                  id="login-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={loginErrors.password ? 'error-input' : ''}
                />
                {loginErrors.password && (
                  <p className="error-message">Password must be at least 4 characters.</p>
                )}
              </div>
            </div>
            <div className="btn">
              <button type="submit" className="signup-button">Log In</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;

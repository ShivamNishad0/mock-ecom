import React, { useState } from 'react';
import { api } from '../services/api';

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.signup(name, email, password);
      setSuccess('Signup successful! Please login.');
      setName('');
      setEmail('');
      setPassword('');
      onSignupSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Styles ---
  const containerStyle = {
    maxWidth: '500px',
    margin: '50px auto',
    marginTop: '150px',
    padding: '30px',
    borderRadius: '12px',
    background: 'linear-gradient(145deg, #f0f0f5, #d9d9f0)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: '0.3s',
  };

  const inputFocus = {
    borderColor: '#ffdd00',
    boxShadow: '0 0 5px rgba(255, 221, 0, 0.5)',
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    background: 'linear-gradient(90deg, #ffdd00, #ffd700)',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#000',
    fontSize: '16px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: '0.3s',
  };

  const buttonHover = {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 14px rgba(0,0,0,0.3)',
  };

  const linkButton = {
    background: 'none',
    border: 'none',
    color: '#1a73e8',
    textDecoration: 'underline',
    cursor: 'pointer',
    marginLeft: '5px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => Object.assign(e.target.style, inputFocus)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
        </div>

        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: '10px' }}>{success}</p>}

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
        Already have an account? 
        <button onClick={onSwitchToLogin} style={linkButton}>Login</button>
      </p>
    </div>
  );
};

export default Signup;

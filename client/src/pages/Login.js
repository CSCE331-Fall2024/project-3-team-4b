import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
require('dotenv').config({ path: '../../server/.env' });

function Login() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [authError, setAuthError] = useState(null);
  const clientID = process.env.CLIENT_ID;
  const navigate = useNavigate();

  const onSuccess = (res) => {
    const tokenId = res.credential;
    setToken(tokenId);

    axios.post('http://localhost:5001/api/verify-token', { idToken: tokenId }, { withCredentials: true })
      .then((res) => {
        console.log("Verification result:", res.data);
        setUser(res.data.user);
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  const onFailure = (res) => {
    console.log("Login Failed! res: ", res);
    setAuthError('Google login failed. Please try again.');
  };

  const handlePasswordSubmit = () => {
    axios.post('http://localhost:5001/api/verify-role', { user, password, role })
      .then((res) => {
        if (res.data.success) {
          console.log(`${role} authenticated successfully.`);
          if(res.data.role === 'manager'){
            navigate('/manager');
          }
          if(res.data.role === 'employee'){
            navigate('/cashier');
          }
          setAuthError(null);
        } else {
          setAuthError('Invalid password or role. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Password verification failed:', error);
        setAuthError('Error verifying password. Please try again.');
      });
  };

  return (
    <div>
      <GoogleOAuthProvider clientId={clientID}>
        <div>
          {token ? (
            <div>
              <h2>Welcome, {user.name}!</h2>
              <img src={user.picture} alt="User profile" />
              <p>Logged in as {user.email}</p>

              <div>
                <label>
                  Select Role:
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select Role</option>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                </label>
                <br />
                <label>
                  Password:
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <br />
                <button onClick={handlePasswordSubmit}>Submit</button>

                {authError && <p style={{ color: 'red' }}>{authError}</p>}
              </div>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onFailure}
              cookiePolicy={'single_host_origin'}
            />
          )}
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}

export default Login;

import React, { useState } from 'react';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import NavigateButton from '../LoginComponents/NavigateButton'
import SignIn from '../LoginComponents/SignIn'

function Login() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);
  const [authError, setAuthError] = useState(null);
  const clientID = '467685170366-60gbsrll7nor66ru5uaj5k3750kk0g6h.apps.googleusercontent.com';
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

  const goToMenu = () => {
    navigate('/menu');
  };

  const goToCustomer = () => {
    navigate('/customer');
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
    <div className="split-view">
      <div className="split-view-half">
        <div>
          <GoogleOAuthProvider clientId={clientID}>
            <div>
              {token ? (
                <div>
                  <SignIn user={user}/>
                  {/* <h2>Welcome, {user.name}!</h2>
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
                  </div> */}
                </div>
              ) : (
                <div>
                  <h1>Employee Side</h1>
                  <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                    cookiePolicy={'single_host_origin'}
                  />
                </div>
              )}
            </div>
          </GoogleOAuthProvider>
        </div>
      </div>
      <div className="separator"></div>
      <div className="split-view-half">
        <div className="customer-side">
          <h1>Customer Side</h1>
          <NavigateButton/>
        </div>
      </div>
    </div>
  );
}

export default Login;

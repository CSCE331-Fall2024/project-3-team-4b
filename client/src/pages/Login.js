import React, { useState } from 'react';
import '../styles/Login.css';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import NavigateButton from '../LoginComponents/NavigateButton'
import SignIn from '../LoginComponents/SignIn'

function Login() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const clientID = '467685170366-60gbsrll7nor66ru5uaj5k3750kk0g6h.apps.googleusercontent.com';

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
  };

  return (
    <div className="split-view">
      <div className="split-view-half">
        <div>
          <GoogleOAuthProvider clientId={clientID}>
            <div>
              {token ? (
                <SignIn user={user}/>
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

/**
 * @file Login.js
 * @description Login component handling authentication and navigation for employee and customer views.
 * @module Login
 */

import React, { useState } from 'react';
import '../styles/Login.css';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import NavigateButton from '../LoginComponents/NavigateButton';
import SignIn from '../LoginComponents/SignIn';

/**
 * @function Login
 * @description Renders the login view for employees and customers with Google authentication.
 * @param {Object} props - Component properties.
 * @param {string} props.role - The current role of the user (e.g., "employee", "customer").
 * @param {function} props.setRole - Function to update the role of the user.
 * @param {Object} props.user - The current user object.
 * @param {function} props.setUser - Function to update the user object.
 * @returns {JSX.Element} The rendered Login component.
 */
function Login({ role, setRole, user, setUser }) {
  /**
   * @state {string|null} token - Stores the Google authentication token.
   */
  const [token, setToken] = useState(null);

  /**
   * @constant {string} clientID - Google OAuth client ID.
   */
  const clientID = '467685170366-60gbsrll7nor66ru5uaj5k3750kk0g6h.apps.googleusercontent.com';

  /**
   * @function onSuccess
   * @description Handles the success response from Google Login.
   * @param {Object} res - The response object from Google Login.
   * @param {string} res.credential - The token ID returned by Google.
   */
  const onSuccess = (res) => {
    const tokenId = res.credential;
    setToken(tokenId);

    axios.post('https://project-3-team-4b-server.vercel.app/api/verify-token', { idToken: tokenId }, { withCredentials: true })
      .then((res) => {
        console.log("Verification result:", res.data);
        setUser(res.data.user);
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  /**
   * @function onFailure
   * @description Handles the failure response from Google Login.
   * @param {Object} res - The response object from Google Login.
   */
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
                <SignIn role={role} setRole={setRole} user={user} setUser={setUser}/>
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

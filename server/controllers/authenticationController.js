/**
 * @file userVerification.js
 * @description Handles user authentication and role verification using Google OAuth and password checks.
 * @module userVerification
 */

require('dotenv').config({ path: '../../.env' });
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

/**
 * @function verifyUserToken
 * @description Verifies the Google ID token provided by the user and sets a secure HTTP-only cookie.
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing the ID token.
 * @param {string} req.body.idToken - Google ID token to verify.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
exports.verifyUserToken = async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userId = payload['sub'];

    res.cookie('token', idToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).send({ message: 'Login successful', user: payload });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).send('Invalid token');
  }
};

/**
 * @function verifyRole
 * @description Verifies the user's role and checks the corresponding password.
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing role and password information.
 * @param {string} req.body.role - The role selected by the user ("cashier" or "manager").
 * @param {string} req.body.password - Password entered for the selected role.
 * @param {Object} req.body.user - Authenticated user information.
 * @param {string} req.body.user.aud - Audience field from the user's Google token.
 * @param {string} req.body.user.name - Name of the authenticated user.
 * @param {string} req.body.user.picture - Profile picture URL of the user.
 * @param {string} req.body.user.email - Email of the authenticated user.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
exports.verifyRole = async (req, res) => {
  const { password, role } = req.body;

  if (!['cashier', 'manager'].includes(role)) {
    console.log("Invalid role selected.");
    return res.status(400).json({ success: false, message: 'Invalid role selected.' });
  }

  try {
    const { aud, name, picture, email } = req.body.user;
    console.log(aud);
    console.log(process.env.CLIENT_ID);
    if (aud !== process.env.CLIENT_ID) {
      console.log("Invalid Google client ID.");
      return res.status(403).json({ success: false, message: 'Invalid Google client ID.', clientAud: aud, clientID: process.env.CLIENT_ID });
    }
    
    if (
      (role === 'cashier' && password === process.env.CASHIER_PASSWORD) ||
      (role === 'manager' && password === process.env.MANAGER_PASSWORD)
    ) {
      return res.json({
        success: true,
        user: { name, email, picture },
        role,
      });
    } else {
      console.log("Invalid password for the selected role.");
      return res.status(401).json({ success: false, message: 'Invalid password for the selected role.' });
    }
  } catch (error) {
    console.error('Error verifying auth code:', error.message);
    return res.status(500).json({ success: false, message: 'Error verifying auth code.' });
  }
};

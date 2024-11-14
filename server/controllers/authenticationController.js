const pool = require("../config/dbConfig");
require('dotenv').config({ path: '../../.env' });
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
      // return res.status(403).json({ success: false, message: 'Invalid Google client ID.' });
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
}
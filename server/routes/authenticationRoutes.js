/**
 * @file authenticationRoutes.js
 * @description Defines routes for user authentication, including token verification and role validation.
 * @module authenticationRoutes
 */

const express = require("express");
const router = express.Router();

const {
  verifyUserToken,
  verifyRole
} = require("../controllers/authenticationController");

/**
 * POST /verify-token
 * @description Verifies the validity of a user's authentication token.
 * @function
 * @memberof module:authenticationRoutes
 * @param {string} req.body.token - The authentication token to verify.
 * @returns {Object} Response indicating the validity of the token.
 */
router.post("/verify-token", verifyUserToken);

/**
 * POST /verify-role
 * @description Verifies the user's role for accessing specific resources.
 * @function
 * @memberof module:authenticationRoutes
 * @param {string} req.body.role - The role to validate.
 * @returns {Object} Response indicating the role's validity.
 */
router.post("/verify-role", verifyRole);

module.exports = router;

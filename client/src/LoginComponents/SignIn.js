/**
 * @file SignIn.js
 * @description SignIn component handling role selection and password authentication.
 * @module SignIn
 */

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';

/**
 * Custom styled Card component for consistent layout.
 * @constant {Object} Card
 */
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

/**
 * Custom styled Stack container for the SignIn view.
 * @constant {Object} SignInContainer
 */
const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

/**
 * @function SignIn
 * @description Renders the SignIn component, allowing role selection and password authentication.
 * @param {Object} props - Component properties.
 * @param {string} props.role - The current role of the user (e.g., "manager", "cashier").
 * @param {function} props.setRole - Function to update the role of the user.
 * @param {Object} props.user - The current user object.
 * @param {function} props.setUser - Function to update the user object.
 * @returns {JSX.Element} The rendered SignIn component.
 */
export default function SignIn({ role, setRole, user, setUser }) {
  /**
   * @state {string} password - Stores the password entered by the user.
   * @state {boolean} passwordError - Indicates whether there is an error with the password.
   * @state {string} passwordErrorMessage - Stores the error message for password validation.
   */
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const navigate = useNavigate();

  /**
   * @function handleRoleChange
   * @description Updates the selected user role.
   * @param {Object} event - Event triggered by role selection.
   */
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  /**
   * @function handlePasswordChange
   * @description Updates the password state with the user's input.
   * @param {Object} event - Event triggered by password input change.
   */
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  /**
   * @function handlePasswordSubmit
   * @description Verifies the user's role and password, navigating to the appropriate dashboard on success.
   * @param {Object} event - Form submission event.
   */
  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    axios.post('https://project-3-team-4b-server.vercel.app/api/verify-role', { user, password, role })
      .then((res) => {
        if (res.data.success) {
          console.log(`${role} authenticated successfully.`);
          if (res.data.role === 'manager') {
            navigate('/manager');
          }
          if (res.data.role === 'cashier') {
            navigate('/cashier');
          }
          setPasswordError(false);
          setPasswordErrorMessage(null);
        } else {
          setPasswordError(true);
          setPasswordErrorMessage('Invalid password or role. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Password verification failed:', error);
        setPasswordError(true);
        setPasswordErrorMessage('Error verifying password. Please try again.');
      });
  };

  return (
    <div>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <h2>
            Welcome, {user.name}
          </h2>
          <Box
            component="form"
            onSubmit={handlePasswordSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                onChange={handlePasswordChange}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="Manager"
                name="radio-buttons-group"
                onChange={handleRoleChange}
              >
                <FormControlLabel value="manager" control={<Radio />} label="Manager" />
                <FormControlLabel value="cashier" control={<Radio />} label="Cashier" />
              </RadioGroup>
            </FormControl>
            <Button type="submit" fullWidth variant="contained" onClick={handlePasswordSubmit}>
              Sign in
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </div>
  );
}
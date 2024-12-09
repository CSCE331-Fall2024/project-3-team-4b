/**
 * @file NavigateButton.js
 * @description A component providing navigation buttons to different pages within the application.
 * @module NavigateButton
 */

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

/**
 * @function NavigateButton
 * @description Renders two buttons for navigating to "Menu" and "Order" pages.
 * @returns {JSX.Element} The NavigateButton component.
 */
export default function NavigateButton() {
  const navigate = useNavigate();

  /**
   * @function goToMenu
   * @description Navigates to the "Menu" page.
   */
  const goToMenu = () => {
    navigate('/menu');
  };

  /**
   * @function goToCustomer
   * @description Navigates to the "Customer" page.
   */
  const goToCustomer = () => {
    navigate('/customer');
  };

  return (
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        style={{ backgroundColor: "red", width: 100 }}
        onClick={goToMenu}
      >
        Menu
      </Button>
      <Button
        variant="contained"
        style={{ backgroundColor: "red", width: 100 }}
        onClick={goToCustomer}
      >
        Order
      </Button>
    </Stack>
  );
}

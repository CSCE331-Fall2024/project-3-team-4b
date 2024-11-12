import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

export default function NavigateButton() {
  const navigate = useNavigate();

  const goToMenu = () => {
    navigate('/menu');
  };

  const goToCustomer = () => {
    navigate('/customer');
  };
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" style={{backgroundColor: "red", width: 100}} onClick={goToMenu}>
        Menu
      </Button>
      <Button variant="contained" style={{backgroundColor: "red", width: 100}} onClick={goToCustomer}>
        Order
      </Button>
    </Stack>
  );
}
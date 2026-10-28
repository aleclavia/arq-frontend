import { Link } from 'react-router-dom'
import { Button, Typography, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MetaData from '../Layout/MetaData'

const OrderSuccess = () => (
  <>
    <MetaData title="Order Success" />
    <div className="page-narrow">
      <div className="panel" style={{ textAlign: 'center' }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 72 }} />
        <Typography variant="h5" sx={{ my: 1 }}>Order placed!</Typography>
        <Typography className="muted">Payment received. We will email you when your order status changes, with a PDF receipt attached.</Typography>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', mt: 3 }}>
          <Button component={Link} to="/orders/me" variant="contained">View my orders</Button>
          <Button component={Link} to="/" variant="outlined">Keep shopping</Button>
        </Stack>
      </div>
    </div>
  </>
)

export default OrderSuccess

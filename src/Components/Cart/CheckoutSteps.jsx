import { Stepper, Step, StepLabel } from '@mui/material'

const CheckoutSteps = ({ active = 0 }) => (
  <Stepper activeStep={active} alternativeLabel sx={{ mb: 4 }}>
    {['Shipping', 'Confirm order', 'Payment'].map((l) => <Step key={l}><StepLabel>{l}</StepLabel></Step>)}
  </Stepper>
)

export default CheckoutSteps

import { useEffect, useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Alert, Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import FormField from '../Utils/FormField'
import { createOrder, clearErrors } from '../../actions/orderActions'
import { clearCart } from '../../actions/cartActions'
import { computeTotals, money } from '../../utils/pricing'

const schema = Yup.object({
  cardName: Yup.string().trim().min(2).required('Name on card is required'),
  cardNumber: Yup.string().transform((v) => v?.replace(/\s/g, '')).matches(/^\d{16}$/, 'Card number must be 16 digits').required('Card number is required'),
  expiry: Yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY').required('Expiry is required'),
  cvc: Yup.string().matches(/^\d{3,4}$/, 'CVC must be 3 or 4 digits').required('CVC is required'),
})

// NOTE: this is a TEST-MODE payment form. No card is charged or stored.
// To use a real gateway (Stripe / PayMongo / PayPal), create the payment there first and
// pass the real payment id + status into paymentInfo below.
const Payment = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartItems, shippingInfo } = useSelector((s) => s.cart)
  const { error, success, loading } = useSelector((s) => s.newOrder)
  const t = computeTotals(cartItems)
  const [submitted, setSubmitted] = useState(false) // ignore a stale `success` from a previous order

  useEffect(() => {
    if (error) { toast.error(error, { position: 'bottom-right' }); dispatch(clearErrors()) }
  }, [error, dispatch])

  useEffect(() => {
    if (success && submitted) {
      dispatch(clearCart())
      navigate('/success', { replace: true })
    }
  }, [success, submitted, dispatch, navigate])

  if (!cartItems.length && !(success && submitted)) return <Navigate to="/cart" replace />

  const pay = () => {
    setSubmitted(true)
    dispatch(createOrder({
      orderItems: cartItems.map((i) => ({ product: i.product, quantity: i.quantity })),
      shippingInfo,
      paymentInfo: { id: `test_${Date.now()}`, status: 'succeeded' },
    }))
  }

  return (
    <>
      <MetaData title="Payment" />
      <div className="page" style={{ maxWidth: 560 }}>
        <CheckoutSteps active={2} />
        <div className="panel">
          <Typography variant="h5">Card info</Typography>
          <Alert severity="info" sx={{ my: 1 }}>Test mode: use any details, e.g. 4242 4242 4242 4242, 12/30, 123.</Alert>
          <Formik initialValues={{ cardName: '', cardNumber: '', expiry: '', cvc: '' }} validationSchema={schema} onSubmit={pay}>
            <Form noValidate>
              <FormField name="cardName" label="Name on card" />
              <FormField name="cardNumber" label="Card number" slotProps={{ htmlInput: { inputMode: 'numeric' } }} />
              <div className="row">
                <div className="col-6"><FormField name="expiry" label="Expiry (MM/YY)" /></div>
                <div className="col-6"><FormField name="cvc" label="CVC" /></div>
              </div>
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }} disabled={loading}>
                {loading ? 'Processing...' : `Pay ${money(t.totalPrice)}`}
              </Button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  )
}

export default Payment

import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Typography, Stack, Alert, Divider } from '@mui/material'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { computeTotals, money, TAX_RATE, FREIGHT_SURCHARGE } from '../../utils/pricing'

const ConfirmOrder = () => {
  const navigate = useNavigate()
  const { cartItems, shippingInfo } = useSelector((s) => s.cart)
  const { user } = useSelector((s) => s.auth)
  if (!cartItems.length) return <Navigate to="/cart" replace />
  if (!shippingInfo?.address) return <Navigate to="/shipping" replace />
  const t = computeTotals(cartItems)
  const hasPreorder = cartItems.some((i) => i.availability !== 'in-stock')

  return (
    <>
      <MetaData title="Confirm Order" />
      <div className="page">
        <CheckoutSteps active={1} />
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="panel mb-3">
              <Typography variant="h6">Shipping to</Typography>
              <Typography variant="body2"><b>{user?.name}</b> &middot; {shippingInfo.phoneNo}</Typography>
              <Typography variant="body2" className="muted">{shippingInfo.address}, {shippingInfo.city} {shippingInfo.postalCode}, {shippingInfo.country}</Typography>
            </div>
            {hasPreorder && <Alert severity="info" sx={{ mb: 2 }}>Your order includes pre-order / backordered items. They may ship separately.</Alert>}
            <div className="panel">
              <Typography variant="h6" sx={{ mb: 1 }}>Items</Typography>
              {cartItems.map((i, idx) => (
                <div key={i.product}>
                  {idx > 0 && <Divider sx={{ my: 1.5 }} />}
                  <div className="d-flex align-items-center gap-3">
                    <img src={i.image} alt="" width="64" height="48" style={{ objectFit: 'cover', borderRadius: 6 }} />
                    <Typography component={Link} to={`/product/${i.product}`} sx={{ flex: 1, color: 'text.primary' }}>{i.name}</Typography>
                    <Typography variant="body2">{i.quantity} x {money(i.price)} = <b>{money(i.quantity * i.price)}</b></Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="panel">
              <Typography variant="h6" sx={{ mb: 2 }}>Order summary</Typography>
              <Stack spacing={1}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><span>Subtotal</span><b>{money(t.itemsPrice)}</b></Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><span>Tax ({TAX_RATE * 100}%)</span><b>{money(t.taxPrice)}</b></Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><span>Shipping</span><b>{money(t.shippingPrice)}</b></Stack>
                {t.freightUnits > 0 && <Typography variant="caption" className="muted">Includes {t.freightUnits} freight item(s) x {money(FREIGHT_SURCHARGE)}.</Typography>}
                <Divider />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><b>Total</b><b className="price">{money(t.totalPrice)}</b></Stack>
              </Stack>
              <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }} onClick={() => navigate('/payment')}>Proceed to payment</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmOrder

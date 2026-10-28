import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, IconButton, Typography, Stack, Chip, Divider } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import MetaData from '../Layout/MetaData'
import { addItemToCart, removeItemFromCart } from '../../actions/cartActions'
import { computeTotals, money } from '../../utils/pricing'

const Cart = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { cartItems } = useSelector((s) => s.cart)
  const { isAuthenticated } = useSelector((s) => s.auth)
  const totals = computeTotals(cartItems)

  const limit = (i) => (i.availability === 'in-stock' ? i.stock : 99)
  const setQty = (i, q) => { if (q >= 1 && q <= limit(i)) dispatch(addItemToCart(i.product, q)) }

  const checkout = () => navigate(isAuthenticated ? '/shipping' : '/login?redirect=/shipping')

  return (
    <>
      <MetaData title="Your Cart" />
      <div className="page">
        <Typography variant="h4" sx={{ mb: 3 }}>Your cart <span className="muted" style={{ fontSize: 16 }}>({cartItems.length} items)</span></Typography>
        {cartItems.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center' }}>
            <Typography>Your cart is empty.</Typography>
            <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>Browse products</Button>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="panel">
                {cartItems.map((i, idx) => (
                  <div key={i.product}>
                    {idx > 0 && <Divider sx={{ my: 2 }} />}
                    <div className="d-flex gap-3 align-items-center flex-wrap">
                      <img src={i.image} alt={i.name} width="90" height="68" style={{ objectFit: 'cover', borderRadius: 8 }} />
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <Typography component={Link} to={`/product/${i.product}`} sx={{ fontWeight: 600, color: 'text.primary' }}>{i.name}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          {i.availability !== 'in-stock' && <Chip size="small" color="secondary" label={i.availability} />}
                          {i.isFreight && <Chip size="small" color="warning" variant="outlined" label="Freight" />}
                        </Stack>
                      </div>
                      <Typography className="price">{money(i.price)}</Typography>
                      <Stack direction="row" sx={{ alignItems: 'center' }}>
                        <IconButton size="small" onClick={() => setQty(i, i.quantity - 1)} disabled={i.quantity <= 1}><RemoveIcon /></IconButton>
                        <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{i.quantity}</Typography>
                        <IconButton size="small" onClick={() => setQty(i, i.quantity + 1)} disabled={i.quantity >= limit(i)}><AddIcon /></IconButton>
                      </Stack>
                      <IconButton color="error" onClick={() => dispatch(removeItemFromCart(i.product))} aria-label="remove"><DeleteIcon /></IconButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="panel">
                <Typography variant="h6" sx={{ mb: 2 }}>Order summary</Typography>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><span>Items ({cartItems.reduce((a, i) => a + i.quantity, 0)})</span><b>{money(totals.itemsPrice)}</b></Stack>
                <Typography variant="caption" className="muted">Tax and shipping are calculated at checkout.</Typography>
                <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }} onClick={checkout}>Proceed to checkout</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Cart

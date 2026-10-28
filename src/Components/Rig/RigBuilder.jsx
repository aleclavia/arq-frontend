import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Checkbox, FormControlLabel, IconButton, Stack, Typography, Divider } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import MetaData from '../Layout/MetaData'
import { checkRig } from '../../utils/rig'
import { money } from '../../utils/pricing'
import { removeFromRig, clearRig, confirmPlaySpace, addItemToCart } from '../../actions/cartActions'
import { useNavigate } from 'react-router-dom'

const RigBuilder = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, spaceConfirmed } = useSelector((s) => s.rig)
  const issues = checkRig(items, spaceConfirmed)
  const warnings = issues.filter((i) => i.severity === 'warning')
  const total = items.reduce((a, i) => a + i.price, 0)
  const needsSpace = items.some((i) => ['Standing', 'Room-scale'].includes(i.playSpace))

  const addAll = async () => {
    for (const i of items) await dispatch(addItemToCart(i._id, 1))
    navigate('/cart')
  }

  return (
    <>
      <MetaData title="Rig List" />
      <div className="page" style={{ maxWidth: 900 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>Your rig list</Typography>
        <Typography className="muted" sx={{ mb: 3 }}>Build a headset setup or a full sim cockpit. We check compatibility before you check out.</Typography>

        {items.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center' }}>
            <Typography>Your rig list is empty. Use the wrench button on any product to add it.</Typography>
            <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>Browse products</Button>
          </div>
        ) : (
          <>
            <Stack spacing={1} sx={{ mb: 2 }}>
              {issues.map((i, idx) => <Alert key={idx} severity={i.severity}>{i.message}</Alert>)}
              {!issues.length && <Alert severity="success">No compatibility problems found.</Alert>}
            </Stack>

            <div className="panel">
              {items.map((i, idx) => (
                <div key={i._id}>
                  {idx > 0 && <Divider sx={{ my: 1.5 }} />}
                  <div className="d-flex align-items-center gap-3">
                    <img src={i.image} alt="" width="72" height="54" style={{ objectFit: 'cover', borderRadius: 6 }} />
                    <div style={{ flex: 1 }}>
                      <Typography component={Link} to={`/product/${i._id}`} sx={{ color: 'text.primary', fontWeight: 700, display: 'block', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>{i.name}</Typography>
                      <Typography variant="caption" className="muted" sx={{ display: 'block' }}>{i.category}{i.platforms?.length ? ` · ${i.platforms.join(', ')}` : ''}</Typography>
                    </div>
                    <Typography className="price">{money(i.price)}</Typography>
                    <IconButton color="error" onClick={() => dispatch(removeFromRig(i._id))} aria-label="remove"><DeleteIcon /></IconButton>
                  </div>
                </div>
              ))}
            </div>

            {needsSpace && (
              <FormControlLabel sx={{ mt: 2 }} control={<Checkbox checked={spaceConfirmed} onChange={(e) => dispatch(confirmPlaySpace(e.target.checked))} />}
                label="I have measured my play space and it fits the headset's standing / room-scale requirement" />
            )}

            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mt: 3, gap: 2 }}>
              <Typography variant="h6">Rig total: <span className="price">{money(total)}</span></Typography>
              <Stack direction="row" spacing={1}>
                <Button color="inherit" onClick={() => dispatch(clearRig())}>Clear</Button>
                <Button variant="contained" onClick={addAll} disabled={warnings.length > 0}>Add all to cart</Button>
              </Stack>
            </Stack>
            {warnings.length > 0 && <Typography variant="caption" className="muted">Resolve the warnings above to add this rig to your cart.</Typography>}
          </>
        )}
      </div>
    </>
  )
}

export default RigBuilder

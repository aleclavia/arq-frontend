import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Button, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import AdminLayout from './AdminLayout'
import StatusChip from '../Order/StatusChip'
import api, { errMessage } from '../../api'
import { ORDER_STATUSES } from '../../constants/catalog'
import { money } from '../../utils/pricing'
import { shortId } from '../../utils/helpers'

const ProcessOrder = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const { data } = await api.get(`/order/${id}`)
      setOrder(data.order)
      const next = ORDER_STATUSES[ORDER_STATUSES.indexOf(data.order.orderStatus) + 1]
      setStatus(next || data.order.orderStatus)
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
  }
  useEffect(() => { load() }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const update = async () => {
    setSaving(true)
    try {
      const { data } = await api.put(`/admin/order/${id}`, { status })
      toast.success('Order status updated', { position: 'bottom-right' })
      if (data.emailSent) toast.success('Customer emailed (with PDF receipt)', { position: 'bottom-right' })
      else toast.warn(`Status saved, but the email failed: ${data.emailError}`, { position: 'bottom-right', autoClose: 8000 })
      await load()
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
    setSaving(false)
  }

  if (!order) return <AdminLayout><Loader /></AdminLayout>
  const delivered = order.orderStatus === 'Delivered'
  const allowed = ORDER_STATUSES.filter((s) => ORDER_STATUSES.indexOf(s) > ORDER_STATUSES.indexOf(order.orderStatus))
  const sh = order.shippingInfo

  return (
    <>
      <MetaData title="Process Order" />
      <AdminLayout>
        <Typography variant="h4" sx={{ mb: 2 }}>Order #{shortId(order._id)} <StatusChip status={order.orderStatus} /></Typography>
        <div className="row g-4">
          <div className="col-12 col-xl-8">
            <div className="panel mb-3">
              <Typography variant="h6">Customer &amp; shipping</Typography>
              <Typography variant="body2"><b>{order.user?.name}</b> ({order.user?.email}) &middot; {sh.phoneNo}</Typography>
              <Typography variant="body2" className="muted">{sh.address}, {sh.city} {sh.postalCode}, {sh.country}</Typography>
            </div>
            <div className="panel">
              <Typography variant="h6" sx={{ mb: 1 }}>Items</Typography>
              {order.orderItems.map((i, idx) => (
                <div key={i._id || idx}>
                  {idx > 0 && <Divider sx={{ my: 1.5 }} />}
                  <div className="d-flex align-items-center gap-3">
                    <img src={i.image} alt="" width="56" height="42" style={{ objectFit: 'cover', borderRadius: 6 }} />
                    <Typography component={Link} to={`/product/${i.product}`} sx={{ flex: 1, color: 'text.primary' }}>{i.name}</Typography>
                    <Typography variant="body2">{i.quantity} x {money(i.price)} = <b>{money(i.quantity * i.price)}</b></Typography>
                  </div>
                </div>
              ))}
              <Divider sx={{ my: 2 }} />
              <Stack spacing={0.3} sx={{ alignItems: 'flex-end' }}>
                <span>Subtotal {money(order.itemsPrice)}</span><span>Tax {money(order.taxPrice)}</span><span>Shipping {money(order.shippingPrice)}</span>
                <b className="price">Total {money(order.totalPrice)}</b>
              </Stack>
            </div>
          </div>

          <div className="col-12 col-xl-4">
            <div className="panel">
              <Typography variant="h6" sx={{ mb: 1 }}>Update status</Typography>
              {delivered ? <Alert severity="success">Delivered. Stock was deducted for each item.</Alert> : (
                <>
                  <TextField select fullWidth label="New status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    {allowed.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </TextField>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    The customer is emailed the item list, subtotals and grand total with a PDF receipt attached.
                    {status === 'Delivered' && ' Marking Delivered also deducts stock.'}
                  </Alert>
                  <Button fullWidth variant="contained" size="large" sx={{ mt: 2 }} disabled={saving || !status} onClick={update}>
                    {saving ? 'Updating...' : 'Update status'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  )
}

export default ProcessOrder

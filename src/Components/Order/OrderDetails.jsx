import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Typography, Stack, Divider, Alert } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import StatusChip from './StatusChip'
import api, { errMessage } from '../../api'
import { getOrderDetails } from '../../actions/orderActions'
import { money } from '../../utils/pricing'
import { shortId } from '../../utils/helpers'

export const downloadReceipt = async (id) => {
  try {
    const { data } = await api.get(`/order/${id}/receipt`, { responseType: 'blob' })
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url; a.download = `receipt-${shortId(id)}.pdf`; a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    toast.error(errMessage(e), { position: 'bottom-right' })
  }
}

const OrderDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { loading, order, error } = useSelector((s) => s.orderDetails)
  const [busy, setBusy] = useState(false)
  useEffect(() => { dispatch(getOrderDetails(id)) }, [dispatch, id])

  if (loading || !order) return error ? <div className="page"><Alert severity="error">{error}</Alert></div> : <Loader />
  const s = order.shippingInfo

  return (
    <>
      <MetaData title={`Order #${shortId(order._id)}`} />
      <div className="page">
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 3, gap: 1 }}>
          <Typography variant="h4">Order #{shortId(order._id)} <StatusChip status={order.orderStatus} /></Typography>
          <Button startIcon={<DownloadIcon />} variant="outlined" disabled={busy} onClick={async () => { setBusy(true); await downloadReceipt(order._id); setBusy(false) }}>PDF receipt</Button>
        </Stack>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="panel">
              <Typography variant="h6" sx={{ mb: 1 }}>Items</Typography>
              {order.orderItems.map((i, idx) => (
                <div key={i._id || idx}>
                  {idx > 0 && <Divider sx={{ my: 1.5 }} />}
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <img src={i.image} alt="" width="64" height="48" style={{ objectFit: 'cover', borderRadius: 6 }} />
                    <Typography component={Link} to={`/product/${i.product}`} sx={{ flex: 1, color: 'text.primary' }}>{i.name}</Typography>
                    <Typography variant="body2">{i.quantity} x {money(i.price)} = <b>{money(i.quantity * i.price)}</b></Typography>
                    {order.orderStatus === 'Delivered' && <Button size="small" component={Link} to={`/product/${i.product}`}>Rate &amp; review</Button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="panel mb-3">
              <Typography variant="h6">Shipping</Typography>
              <Typography variant="body2" className="muted">{s.address}, {s.city} {s.postalCode}, {s.country}<br />Tel: {s.phoneNo}</Typography>
            </div>
            <div className="panel">
              <Typography variant="h6" sx={{ mb: 1 }}>Summary</Typography>
              <Stack spacing={0.5}>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><span>Subtotal</span><span>{money(order.itemsPrice)}</span></Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><span>Tax</span><span>{money(order.taxPrice)}</span></Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><span>Shipping</span><span>{money(order.shippingPrice)}</span></Stack>
                <Divider />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}><b>Total</b><b className="price">{money(order.totalPrice)}</b></Stack>
              </Stack>
              <Typography variant="caption" className="muted" sx={{ display: 'block', mt: 1 }}>Paid {new Date(order.paidAt).toLocaleString()}</Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetails

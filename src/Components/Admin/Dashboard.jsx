import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonGroup, Stack, TextField, Typography } from '@mui/material'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PaidIcon from '@mui/icons-material/Paid'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import AdminLayout from './AdminLayout'
import { SalesTrendChart, CustomerSalesChart, ProductSalesChart, GroupSalesChart } from './charts'
import api, { errMessage } from '../../api'
import { money } from '../../utils/pricing'
import { daysAgo, toISODate } from '../../utils/helpers'

const Stat = ({ icon, label, value, to, color }) => (
  <div className="panel" style={{ height: '100%', background: color }}>
    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
      <div style={{ color: '#111', fontSize: 34, display: 'flex' }}>{icon}</div>
      <div>
        <Typography variant="caption" sx={{ fontWeight: 700 }}>{label}</Typography>
        <Typography variant="h5" component="div">{value}</Typography>
        {to && <Link to={to} style={{ fontSize: 12 }}>View details</Link>}
      </div>
    </Stack>
  </div>
)

const PRESETS = [['7 days', 7], ['30 days', 30], ['90 days', 90], ['1 year', 365]]

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [range, setRange] = useState({ start: daysAgo(90), end: toISODate(new Date()) })

  useEffect(() => {
    api.get('/admin/analytics/summary').then((r) => setSummary(r.data))
      .catch((e) => toast.error(errMessage(e), { position: 'bottom-right' }))
  }, [])

  const invalid = range.start && range.end && range.start > range.end

  return (
    <>
      <MetaData title="Admin Dashboard" />
      <AdminLayout>
        <Typography variant="h4" sx={{ mb: 2 }}>Dashboard</Typography>
        {!summary ? <Loader /> : (
          <div className="row g-3 mb-4">
            <div className="col-6 col-xl"><Stat icon={<Inventory2Icon fontSize="inherit" />} label="Products" value={summary.totalProducts} to="/admin/products" color="#8ACFF8" /></div>
            <div className="col-6 col-xl"><Stat icon={<RemoveShoppingCartIcon fontSize="inherit" />} label="Out of stock" value={summary.outOfStock} color="#ffb3a7" /></div>
            <div className="col-6 col-xl"><Stat icon={<ScheduleIcon fontSize="inherit" />} label="Pre-order / backordered" value={summary.backordered} color="#FFD444" /></div>
            <div className="col-6 col-xl"><Stat icon={<ReceiptLongIcon fontSize="inherit" />} label="Orders" value={summary.totalOrders} to="/admin/orders" color="#F4EB6C" /></div>
            <div className="col-12 col-xl"><Stat icon={<PaidIcon fontSize="inherit" />} label="Total sales" value={money(summary.totalSales)} color="#b9f0cf" /></div>
          </div>
        )}

        {/* ----- date range filter (drives every chart below) ----- */}
        <div className="panel mb-3">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' } }}>
            <Typography variant="h6" sx={{ mr: 1 }}>Date range</Typography>
            <TextField type="date" size="small" label="From" slotProps={{ inputLabel: { shrink: true } }} value={range.start} onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))} error={invalid} />
            <TextField type="date" size="small" label="To" slotProps={{ inputLabel: { shrink: true } }} value={range.end} onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))} error={invalid} helperText={invalid ? '"From" must be before "To"' : ''} />
            <ButtonGroup size="small">
              {PRESETS.map(([label, d]) => <Button key={d} onClick={() => setRange({ start: daysAgo(d), end: toISODate(new Date()) })}>{label}</Button>)}
              <Button onClick={() => setRange({ start: '', end: '' })}>All time</Button>
            </ButtonGroup>
          </Stack>
        </div>

        {!invalid && (
          <div className="row g-3">
            <div className="col-12"><SalesTrendChart range={range} /></div>
            <div className="col-12 col-xl-6"><CustomerSalesChart range={range} /></div>
            <div className="col-12 col-xl-6"><GroupSalesChart range={range} /></div>
            <div className="col-12"><ProductSalesChart range={range} /></div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}

export default Dashboard

import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Typography, IconButton, Stack, Chip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import AdminLayout from './AdminLayout'
import StatusChip from '../Order/StatusChip'
import api, { errMessage } from '../../api'
import { money } from '../../utils/pricing'
import { shortId } from '../../utils/helpers'

const OrdersList = () => {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/orders')
      setOrders(data.orders); setTotal(data.totalAmount)
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const remove = async (id) => {
    const r = await Swal.fire({ title: 'Delete this order?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', background: '#0f1626', color: '#e6edf7' })
    if (!r.isConfirmed) return
    try { await api.delete(`/admin/order/${id}`); toast.success('Order deleted', { position: 'bottom-right' }); load() }
    catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
  }

  const columns = [
    { field: 'ref', headerName: 'Order #', width: 120 },
    { field: 'customer', headerName: 'Customer', flex: 1, minWidth: 160 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'items', headerName: 'Items', width: 80, type: 'number' },
    { field: 'total', headerName: 'Total', width: 120, type: 'number', valueFormatter: (v) => money(v) },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (p) => <StatusChip status={p.value} /> },
    {
      field: 'actions', headerName: 'Actions', width: 110, sortable: false,
      renderCell: (p) => (
        <>
          <IconButton size="small" color="primary" component={Link} to={`/admin/order/${p.id}`} aria-label="process"><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => remove(p.id)} aria-label="delete"><DeleteIcon fontSize="small" /></IconButton>
        </>
      ),
    },
  ]
  const rows = orders.map((o) => ({
    id: o._id, ref: `#${shortId(o._id)}`, customer: o.user?.name || 'Deleted user', date: new Date(o.createdAt).toLocaleDateString(),
    items: o.orderItems.reduce((a, i) => a + i.quantity, 0), total: o.totalPrice, status: o.orderStatus,
  }))

  return (
    <>
      <MetaData title="All Orders" />
      <AdminLayout>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
          <Typography variant="h4">Orders</Typography>
          <Chip color="primary" label={`Total sales: ${money(total)}`} />
        </Stack>
        <DataGrid rows={rows} columns={columns} loading={loading} autoHeight showToolbar disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} pageSizeOptions={[5, 10, 25]} />
      </AdminLayout>
    </>
  )
}

export default OrdersList

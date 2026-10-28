import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import StatusChip from './StatusChip'
import { myOrders } from '../../actions/orderActions'
import { money } from '../../utils/pricing'
import { shortId } from '../../utils/helpers'

const ListOrders = () => {
  const dispatch = useDispatch()
  const { loading, orders } = useSelector((s) => s.myOrders)
  useEffect(() => { dispatch(myOrders()) }, [dispatch])

  const columns = [
    { field: 'ref', headerName: 'Order #', width: 130 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'items', headerName: 'Items', width: 90, type: 'number' },
    { field: 'total', headerName: 'Total', width: 130 },
    { field: 'status', headerName: 'Status', width: 140, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'actions', headerName: '', width: 110, sortable: false, renderCell: (p) => <Button size="small" component={Link} to={`/order/${p.row.id}`}>Details</Button> },
  ]
  const rows = orders.map((o) => ({
    id: o._id, ref: `#${shortId(o._id)}`, date: new Date(o.createdAt).toLocaleDateString(),
    items: o.orderItems.reduce((a, i) => a + i.quantity, 0), total: money(o.totalPrice), status: o.orderStatus,
  }))

  return (
    <>
      <MetaData title="My Orders" />
      <div className="page">
        <Typography variant="h4" sx={{ mb: 3 }}>My orders</Typography>
        {loading ? <Loader /> : (
          <DataGrid rows={rows} columns={columns} autoHeight disableRowSelectionOnClick
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} pageSizeOptions={[5, 10, 25]} />
        )}
      </div>
    </>
  )
}

export default ListOrders

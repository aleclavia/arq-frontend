import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { IconButton, Rating, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import AdminLayout from './AdminLayout'
import api, { errMessage } from '../../api'

// MP3: admin can delete any review
const ProductReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try { const { data } = await api.get('/admin/reviews'); setReviews(data.reviews) }
    catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const remove = async (row) => {
    const r = await Swal.fire({ title: 'Delete this review?', text: row.comment, icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', background: '#0f1626', color: '#e6edf7' })
    if (!r.isConfirmed) return
    try {
      await api.delete('/admin/review', { params: { productId: row.productId, id: row.id } })
      toast.success('Review deleted', { position: 'bottom-right' }); load()
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
  }

  const columns = [
    { field: 'productName', headerName: 'Product', flex: 1, minWidth: 180, renderCell: (p) => <Link to={`/product/${p.row.productId}`}>{p.value}</Link> },
    { field: 'userName', headerName: 'User', width: 140 },
    { field: 'rating', headerName: 'Rating', width: 140, type: 'number', renderCell: (p) => <Rating readOnly size="small" value={p.value} /> },
    { field: 'comment', headerName: 'Comment', flex: 2, minWidth: 240 },
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'actions', headerName: '', width: 70, sortable: false, renderCell: (p) => <IconButton size="small" color="error" onClick={() => remove(p.row)} aria-label="delete"><DeleteIcon fontSize="small" /></IconButton> },
  ]
  const rows = reviews.map((r) => ({
    id: r._id, productId: r.productId, productName: r.productName, userName: r.userName,
    rating: r.rating, comment: r.comment, date: new Date(r.createdAt).toLocaleDateString(),
  }))

  return (
    <>
      <MetaData title="Moderate Reviews" />
      <AdminLayout>
        <Typography variant="h4" sx={{ mb: 2 }}>Reviews</Typography>
        <DataGrid rows={rows} columns={columns} loading={loading} autoHeight showToolbar disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} pageSizeOptions={[5, 10, 25]} />
      </AdminLayout>
    </>
  )
}

export default ProductReviews

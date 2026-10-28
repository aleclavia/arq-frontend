import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button, Stack, Typography, IconButton, Chip, Avatar, AvatarGroup } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import AdminLayout from './AdminLayout'
import api, { errMessage } from '../../api'
import { money } from '../../utils/pricing'

const EMPTY = { type: 'include', ids: new Set() }

// MP1: Product CRUD datatable + multiple photos + bulk delete with checkboxes
const ProductsList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selection, setSelection] = useState(EMPTY)

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/products')
      setProducts(data.products)
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  // the grid reports either "these ids are selected" or "everything EXCEPT these ids"
  const selectedIds = selection.type === 'include'
    ? [...selection.ids]
    : products.map((p) => p._id).filter((id) => !selection.ids.has(id))

  const confirm = (text) => Swal.fire({
    title: 'Are you sure?', text, icon: 'warning', showCancelButton: true,
    confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete', background: '#0f1626', color: '#e6edf7',
  })

  const deleteOne = async (id) => {
    if (!(await confirm('This product and its images will be deleted.')).isConfirmed) return
    try {
      await api.delete(`/admin/product/${id}`)
      toast.success('Product deleted', { position: 'bottom-right' })
      setSelection(EMPTY); load()
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
  }

  const bulkDelete = async () => {
    if (!(await confirm(`${selectedIds.length} product(s) and their images will be deleted.`)).isConfirmed) return
    try {
      const { data } = await api.delete('/admin/products', { data: { ids: selectedIds } })
      toast.success(`${data.deletedCount} product(s) deleted`, { position: 'bottom-right' })
      setSelection(EMPTY); load()
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
  }

  const columns = [
    {
      field: 'images', headerName: 'Photos', width: 110, sortable: false, filterable: false,
      renderCell: (p) => (
        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
          {p.value.map((img) => <Avatar key={img.public_id} src={img.url} variant="rounded" />)}
        </AvatarGroup>
      ),
    },
    { field: 'name', headerName: 'Name', flex: 1.4, minWidth: 200 },
    { field: 'brand', headerName: 'Brand', width: 110 },
    { field: 'category', headerName: 'Category', width: 190 },
    { field: 'price', headerName: 'Price', width: 110, type: 'number', valueFormatter: (v) => money(v) },
    { field: 'stock', headerName: 'Stock', width: 80, type: 'number' },
    {
      field: 'availability', headerName: 'Availability', width: 130,
      renderCell: (p) => <Chip size="small" label={p.value} color={p.value === 'in-stock' ? 'success' : p.value === 'pre-order' ? 'secondary' : 'warning'} variant="outlined" />,
    },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false, filterable: false,
      renderCell: (p) => (
        <>
          <IconButton size="small" color="primary" component={Link} to={`/admin/product/${p.id}`} aria-label="edit"><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => deleteOne(p.id)} aria-label="delete"><DeleteIcon fontSize="small" /></IconButton>
        </>
      ),
    },
  ]

  const rows = products.map((p) => ({
    id: p._id, images: p.images, name: p.name, brand: p.brand, category: p.category,
    price: p.price, stock: p.stock, availability: p.availability,
  }))

  return (
    <>
      <MetaData title="Manage Products" />
      <AdminLayout>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2, gap: 1 }}>
          <Typography variant="h4">Products</Typography>
          <Stack direction="row" spacing={1}>
            <Button color="error" variant="contained" startIcon={<DeleteIcon />} disabled={selectedIds.length === 0} onClick={bulkDelete}>
              Delete selected ({selectedIds.length})
            </Button>
            <Button component={Link} to="/admin/product" variant="contained" startIcon={<AddIcon />}>New product</Button>
          </Stack>
        </Stack>

        <DataGrid
          rows={rows} columns={columns} loading={loading} autoHeight showToolbar
          checkboxSelection disableRowSelectionOnClick
          rowSelectionModel={selection} onRowSelectionModelChange={setSelection}
          rowHeight={56}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} pageSizeOptions={[5, 10, 25, 50]}
        />
      </AdminLayout>
    </>
  )
}

export default ProductsList

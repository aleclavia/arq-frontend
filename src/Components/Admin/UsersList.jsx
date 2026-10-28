import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Chip, IconButton, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import AdminLayout from './AdminLayout'
import api, { errMessage } from '../../api'

const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try { const { data } = await api.get('/admin/users'); setUsers(data.users) }
    catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  const remove = async (id) => {
    const r = await Swal.fire({ title: 'Delete this user?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', background: '#0f1626', color: '#e6edf7' })
    if (!r.isConfirmed) return
    try { await api.delete(`/admin/user/${id}`); toast.success('User deleted', { position: 'bottom-right' }); load() }
    catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
  }

  const columns = [
    { field: 'avatar', headerName: '', width: 60, sortable: false, renderCell: (p) => <Avatar src={p.value} sx={{ width: 30, height: 30 }} /> },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1.3, minWidth: 200 },
    { field: 'role', headerName: 'Role', width: 100, renderCell: (p) => <Chip size="small" label={p.value} color={p.value === 'admin' ? 'secondary' : 'default'} /> },
    { field: 'joined', headerName: 'Joined', width: 120 },
    {
      field: 'actions', headerName: 'Actions', width: 110, sortable: false,
      renderCell: (p) => (
        <>
          <IconButton size="small" color="primary" component={Link} to={`/admin/user/${p.id}`} aria-label="edit"><EditIcon fontSize="small" /></IconButton>
          <IconButton size="small" color="error" onClick={() => remove(p.id)} aria-label="delete"><DeleteIcon fontSize="small" /></IconButton>
        </>
      ),
    },
  ]
  const rows = users.map((u) => ({ id: u._id, avatar: u.avatar?.url, name: u.name, email: u.email, role: u.role, joined: new Date(u.createdAt).toLocaleDateString() }))

  return (
    <>
      <MetaData title="All Users" />
      <AdminLayout>
        <Typography variant="h4" sx={{ mb: 2 }}>Users</Typography>
        <DataGrid rows={rows} columns={columns} loading={loading} autoHeight showToolbar disableRowSelectionOnClick
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} pageSizeOptions={[5, 10, 25]} />
      </AdminLayout>
    </>
  )
}

export default UsersList

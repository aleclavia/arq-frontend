import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import AdminLayout from './AdminLayout'
import ProductForm from './ProductForm'
import api, { errMessage } from '../../api'

const NewProduct = () => {
  const navigate = useNavigate()
  const create = async (formData) => {
    try {
      await api.post('/admin/product/new', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Product created', { position: 'bottom-right' })
      navigate('/admin/products')
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
  }
  return (
    <>
      <MetaData title="New Product" />
      <AdminLayout>
        <Typography variant="h4" sx={{ mb: 2 }}>New product</Typography>
        <div className="panel"><ProductForm onSubmit={create} submitLabel="Create product" /></div>
      </AdminLayout>
    </>
  )
}

export default NewProduct

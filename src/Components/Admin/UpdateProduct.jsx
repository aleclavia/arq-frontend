import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import AdminLayout from './AdminLayout'
import ProductForm from './ProductForm'
import api, { errMessage } from '../../api'

const UpdateProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    api.get(`/product/${id}`).then(({ data }) => setProduct(data.product))
      .catch((e) => { toast.error(errMessage(e), { position: 'bottom-right' }); navigate('/admin/products') })
  }, [id, navigate])

  const update = async (formData) => {
    try {
      await api.put(`/admin/product/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Product updated', { position: 'bottom-right' })
      navigate('/admin/products')
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
  }

  return (
    <>
      <MetaData title="Update Product" />
      <AdminLayout>
        <Typography variant="h4" sx={{ mb: 2 }}>Update product</Typography>
        <div className="panel">{product ? <ProductForm product={product} onSubmit={update} submitLabel="Save changes" /> : <Loader />}</div>
      </AdminLayout>
    </>
  )
}

export default UpdateProduct

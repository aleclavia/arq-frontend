import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Alert, Avatar, Button, Stack, TextField, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import AdminLayout from './AdminLayout'
import FormField from '../Utils/FormField'
import api, { errMessage } from '../../api'

const schema = Yup.object({ role: Yup.string().oneOf(['user', 'admin'], 'Select a role').required('Role is required') })

// Admins can only change a user's ROLE. Name and email are shown read-only because they belong to the account owner.
const UpdateUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: me } = useSelector((s) => s.auth)
  const [user, setUser] = useState(null)
  const isSelf = me?._id === id

  useEffect(() => {
    api.get(`/admin/user/${id}`).then(({ data }) => setUser(data.user))
      .catch((e) => { toast.error(errMessage(e), { position: 'bottom-right' }); navigate('/admin/users') })
  }, [id, navigate])

  const submit = async (v) => {
    try {
      await api.put(`/admin/user/${id}`, { role: v.role })
      toast.success('Role updated', { position: 'bottom-right' })
      navigate('/admin/users')
    } catch (e) { toast.error(errMessage(e), { position: 'bottom-right' }) }
  }

  return (
    <>
      <MetaData title="Update User Role" />
      <AdminLayout>
        <Typography variant="h4" sx={{ mb: 2 }}>User role</Typography>
        <div className="panel" style={{ maxWidth: 520 }}>
          {!user ? <Loader /> : (
            <Formik initialValues={{ role: user.role }} validationSchema={schema} onSubmit={submit}>
              {({ isSubmitting, values }) => (
                <Form noValidate>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 1 }}>
                    <Avatar src={user.avatar?.url} sx={{ width: 56, height: 56 }} />
                    <Typography variant="body2" className="muted">Joined {new Date(user.createdAt).toLocaleDateString()} &middot; {user.authProvider === 'google' ? 'Google sign-in' : 'Email sign-in'}</Typography>
                  </Stack>
                  <TextField label="Name" value={user.name} fullWidth margin="normal" disabled />
                  <TextField label="Email" value={user.email} fullWidth margin="normal" disabled
                    helperText="Name and email can only be changed by the account owner." />
                  <FormField name="role" label="Role" options={['user', 'admin']} disabled={isSelf}
                    helperText={isSelf ? 'You cannot change your own role.' : undefined} />
                  {values.role === 'admin' && !isSelf && user.role !== 'admin' && (
                    <Alert severity="warning" sx={{ mt: 1 }}>Admins can manage products, orders, users and reviews.</Alert>
                  )}
                  <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }} disabled={isSubmitting || isSelf || values.role === user.role}>Save role</Button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </AdminLayout>
    </>
  )
}

export default UpdateUser

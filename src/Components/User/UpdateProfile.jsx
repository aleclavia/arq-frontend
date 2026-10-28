import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import FormField from '../Utils/FormField'
import AvatarPicker, { avatarRule } from './AvatarPicker'
import { updateProfile, clearErrors } from '../../actions/userActions'
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'

const schema = Yup.object({
  name: Yup.string().trim().min(2, 'Name is too short').max(30, 'Name cannot exceed 30 characters').required('Name is required'),
  email: Yup.string().trim().email('Enter a valid email address').required('Email is required'),
  avatar: avatarRule(Yup),
})

const UpdateProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { error, isUpdated, loading } = useSelector((s) => s.user)

  useEffect(() => {
    if (error) { toast.error(error, { position: 'bottom-right' }); dispatch(clearErrors()) }
    if (isUpdated) {
      toast.success('Profile updated', { position: 'bottom-right' })
      dispatch({ type: UPDATE_PROFILE_RESET })
      navigate('/me')
    }
  }, [error, isUpdated, dispatch, navigate])

  if (!user) return <Loader />

  const submit = (v) => {
    const fd = new FormData()
    fd.set('name', v.name); fd.set('email', v.email)
    if (v.avatar) fd.set('avatar', v.avatar)
    dispatch(updateProfile(fd))
  }

  return (
    <>
      <MetaData title="Update Profile" />
      <div className="page-narrow">
        <div className="panel">
          <Typography variant="h5">Update profile</Typography>
          <Formik initialValues={{ name: user.name, email: user.email, avatar: null }} validationSchema={schema} onSubmit={submit}>
            <Form noValidate>
              <FormField name="name" label="Name" />
              <FormField name="email" label="Email" type="email" />
              <AvatarPicker currentUrl={user.avatar?.url} />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>Save changes</Button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  )
}

export default UpdateProfile

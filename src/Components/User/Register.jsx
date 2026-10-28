import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button, Typography, Divider } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import FormField from '../Utils/FormField'
import GoogleButton from './GoogleButton'
import AvatarPicker, { avatarRule } from './AvatarPicker'
import { register, clearErrors } from '../../actions/userActions'

const schema = Yup.object({
  name: Yup.string().trim().min(2, 'Name is too short').max(30, 'Name cannot exceed 30 characters').required('Name is required'),
  email: Yup.string().trim().email('Enter a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match').required('Please confirm your password'),
  avatar: avatarRule(Yup),
})

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, error, loading } = useSelector((s) => s.auth)

  useEffect(() => { if (isAuthenticated) navigate('/') }, [isAuthenticated, navigate])
  useEffect(() => {
    if (error) { toast.error(error, { position: 'bottom-right' }); dispatch(clearErrors()) }
  }, [error, dispatch])

  const submit = (v) => {
    const fd = new FormData()
    fd.set('name', v.name); fd.set('email', v.email); fd.set('password', v.password)
    if (v.avatar) fd.set('avatar', v.avatar)
    dispatch(register(fd))
  }

  return (
    <>
      <MetaData title="Register" />
      <div className="page-narrow">
        <div className="panel">
          <Typography variant="h5">Create account</Typography>
          <Formik initialValues={{ name: '', email: '', password: '', confirmPassword: '', avatar: null }} validationSchema={schema} onSubmit={submit}>
            <Form noValidate>
              <FormField name="name" label="Name" />
              <FormField name="email" label="Email" type="email" />
              <FormField name="password" label="Password" type="password" autoComplete="new-password" />
              <FormField name="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" />
              <AvatarPicker />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>Register</Button>
            </Form>
          </Formik>
          <Divider sx={{ my: 2 }}>or</Divider>
          <GoogleButton />
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>Already registered? <Link to="/login">Login</Link></Typography>
        </div>
      </div>
    </>
  )
}

export default Register

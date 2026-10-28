import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button, Typography, Divider } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import FormField from '../Utils/FormField'
import GoogleButton from './GoogleButton'
import { login, clearErrors } from '../../actions/userActions'

const schema = Yup.object({
  email: Yup.string().trim().email('Enter a valid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/'
  const { isAuthenticated, error, loading } = useSelector((s) => s.auth)

  useEffect(() => { if (isAuthenticated) navigate(redirect, { replace: true }) }, [isAuthenticated, navigate, redirect])
  useEffect(() => {
    if (error) { toast.error(error, { position: 'bottom-right' }); dispatch(clearErrors()) }
  }, [error, dispatch])

  return (
    <>
      <MetaData title="Login" />
      <div className="page-narrow">
        <div className="panel">
          <Typography variant="h5" sx={{ mb: 1 }}>Login</Typography>
          <Formik initialValues={{ email: '', password: '' }} validationSchema={schema} onSubmit={(v) => dispatch(login(v.email, v.password))}>
            <Form noValidate>
              <FormField name="email" label="Email" type="email" autoComplete="email" />
              <FormField name="password" label="Password" type="password" autoComplete="current-password" />
              <Typography variant="body2" sx={{ textAlign: 'right' }}><Link to="/password/forgot">Forgot password?</Link></Typography>
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }} disabled={loading}>Login</Button>
            </Form>
          </Formik>
          <Divider sx={{ my: 2 }}>or</Divider>
          <GoogleButton />
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>New here? <Link to="/register">Create an account</Link></Typography>
        </div>
      </div>
    </>
  )
}

export default Login

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import FormField from '../Utils/FormField'
import { forgotPassword, clearErrors } from '../../actions/userActions'

const schema = Yup.object({ email: Yup.string().trim().email('Enter a valid email address').required('Email is required') })

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const { error, message, loading } = useSelector((s) => s.forgotPassword)

  useEffect(() => {
    if (error) { toast.error(error, { position: 'bottom-right' }); dispatch(clearErrors()) }
    if (message) toast.success(message, { position: 'bottom-right' })
  }, [error, message, dispatch])

  return (
    <>
      <MetaData title="Forgot Password" />
      <div className="page-narrow">
        <div className="panel">
          <Typography variant="h5">Forgot password</Typography>
          <Typography variant="body2" className="muted">We will email you a reset link that is valid for 30 minutes.</Typography>
          <Formik initialValues={{ email: '' }} validationSchema={schema} onSubmit={(v) => dispatch(forgotPassword(v.email))}>
            <Form noValidate>
              <FormField name="email" label="Email" type="email" />
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1 }} disabled={loading}>Send reset link</Button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword

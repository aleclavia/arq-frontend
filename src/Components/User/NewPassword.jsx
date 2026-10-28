import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import FormField from '../Utils/FormField'
import { resetPassword, clearErrors, loadUser } from '../../actions/userActions'

const schema = Yup.object({
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match').required('Please confirm your password'),
})

const NewPassword = () => {
  const { token } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error, success, loading } = useSelector((s) => s.forgotPassword)

  useEffect(() => {
    if (error) { toast.error(error, { position: 'bottom-right' }); dispatch(clearErrors()) }
    if (success) {
      toast.success('Password updated', { position: 'bottom-right' })
      dispatch(loadUser())
      navigate('/')
    }
  }, [error, success, dispatch, navigate])

  return (
    <>
      <MetaData title="New Password" />
      <div className="page-narrow">
        <div className="panel">
          <Typography variant="h5">Set a new password</Typography>
          <Formik initialValues={{ password: '', confirmPassword: '' }} validationSchema={schema} onSubmit={(v) => dispatch(resetPassword(token, v))}>
            <Form noValidate>
              <FormField name="password" label="New password" type="password" />
              <FormField name="confirmPassword" label="Confirm password" type="password" />
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1 }} disabled={loading}>Set password</Button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  )
}

export default NewPassword

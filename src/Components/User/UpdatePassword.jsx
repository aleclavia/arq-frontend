import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Alert, Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import FormField from '../Utils/FormField'
import { updatePassword, clearErrors, loadUser } from '../../actions/userActions'
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'

// Google accounts have no password yet (needsPasswordSetup), so they skip the "current password" field.
const buildSchema = (setup) => Yup.object({
  oldPassword: setup ? Yup.string() : Yup.string().required('Enter your current password'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .notOneOf(setup ? [] : [Yup.ref('oldPassword')], 'New password must be different')
    .required('Enter a new password'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords do not match').required('Please confirm your new password'),
})

const UpdatePassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { error, isUpdated, loading } = useSelector((s) => s.user)
  const setup = Boolean(user?.needsPasswordSetup)

  useEffect(() => {
    if (error) { toast.error(error, { position: 'bottom-right' }); dispatch(clearErrors()) }
    if (isUpdated) {
      toast.success(setup ? 'Password set. You can now also log in with your email.' : 'Password updated', { position: 'bottom-right' })
      dispatch({ type: UPDATE_PROFILE_RESET })
      dispatch(loadUser()) // refresh the user so "needsPasswordSetup" flips to false
      navigate('/me')
    }
  }, [error, isUpdated, setup, dispatch, navigate])

  const submit = (v) => dispatch(updatePassword(setup ? { password: v.password } : { oldPassword: v.oldPassword, password: v.password }))

  return (
    <>
      <MetaData title={setup ? 'Set Password' : 'Change Password'} />
      <div className="page-narrow">
        <div className="panel">
          <Typography variant="h5">{setup ? 'Set a password' : 'Change password'}</Typography>
          {setup && (
            <Alert severity="info" sx={{ mt: 1 }}>
              You signed in with Google, so this account has no password yet. Set one to also log in with your email and password.
              Google sign-in keeps working.
            </Alert>
          )}
          <Formik initialValues={{ oldPassword: '', password: '', confirmPassword: '' }} validationSchema={buildSchema(setup)} onSubmit={submit}>
            <Form noValidate>
              {!setup && <FormField name="oldPassword" label="Current password" type="password" autoComplete="current-password" />}
              <FormField name="password" label={setup ? 'Password' : 'New password'} type="password" autoComplete="new-password" />
              <FormField name="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" />
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1 }} disabled={loading}>
                {setup ? 'Set password' : 'Update password'}
              </Button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  )
}

export default UpdatePassword

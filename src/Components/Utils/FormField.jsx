import { useField } from 'formik'
import { TextField, MenuItem } from '@mui/material'

// Formik + Yup aware MUI text field. Use inside <Formik>.
// <FormField name="email" label="Email" />   |   <FormField name="role" label="Role" options={['user','admin']} />
const FormField = ({ name, label, options, ...rest }) => {
  const [field, meta] = useField(name)
  const showError = Boolean(meta.touched && meta.error)
  return (
    <TextField
      {...field}
      {...rest}
      select={Boolean(options)}
      label={label}
      fullWidth
      margin="normal"
      error={showError}
      helperText={showError ? meta.error : rest.helperText}
    >
      {options && options.map((o) => (
        <MenuItem key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</MenuItem>
      ))}
    </TextField>
  )
}

export default FormField

import { useFormikContext } from 'formik'
import { Avatar, Button, Stack, FormHelperText } from '@mui/material'
import { useMemo } from 'react'

// Formik field "avatar" holds a File (or null). currentUrl = existing avatar to show when nothing is picked
const AvatarPicker = ({ currentUrl }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext()
  const preview = useMemo(() => (values.avatar ? URL.createObjectURL(values.avatar) : currentUrl), [values.avatar, currentUrl])
  return (
    <div style={{ margin: '12px 0' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Avatar src={preview} sx={{ width: 64, height: 64 }} />
        <Button component="label" variant="outlined" size="small">
          Choose avatar
          <input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setFieldValue('avatar', e.currentTarget.files[0] || null)} />
        </Button>
      </Stack>
      {touched.avatar && errors.avatar && <FormHelperText error>{errors.avatar}</FormHelperText>}
    </div>
  )
}

export const avatarRule = (Yup) =>
  Yup.mixed().nullable()
    .test('type', 'Avatar must be a JPG, PNG or WEBP image', (f) => !f || ['image/jpeg', 'image/png', 'image/webp'].includes(f.type))
    .test('size', 'Avatar must be 5MB or smaller', (f) => !f || f.size <= 5 * 1024 * 1024)

export default AvatarPicker

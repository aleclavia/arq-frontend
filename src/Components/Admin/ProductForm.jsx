import { useMemo } from 'react'
import { Formik, Form, FieldArray, useFormikContext } from 'formik'
import * as Yup from 'yup'
import {
  Button, Stack, Typography, TextField, Autocomplete, Chip, Switch, FormControlLabel, IconButton,
  Select, MenuItem, OutlinedInput, FormControl, InputLabel, FormHelperText, Box, Alert,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import FormField from '../Utils/FormField'
import {
  CATEGORIES, PLATFORMS, CONNECTION_TYPES, PLAY_SPACES, AVAILABILITY, SPEC_HINTS,
} from '../../constants/catalog'

const schema = Yup.object({
  name: Yup.string().trim().min(3, 'Name is too short').max(100, 'Name cannot exceed 100 characters').required('Product name is required'),
  brand: Yup.string().trim().max(50, 'Brand cannot exceed 50 characters').required('Brand is required'),
  price: Yup.number().typeError('Price must be a number').min(0, 'Price cannot be negative').max(1000000, 'Price is too large').required('Price is required'),
  stock: Yup.number().typeError('Stock must be a number').integer('Stock must be a whole number').min(0, 'Stock cannot be negative').required('Stock is required'),
  category: Yup.string().oneOf(CATEGORIES, 'Select a category').required('Category is required'),
  description: Yup.string().trim().min(10, 'Description must be at least 10 characters').required('Description is required'),
  availability: Yup.string().oneOf(AVAILABILITY).required(),
  expectedAvailability: Yup.string().when('availability', {
    is: (v) => v !== 'in-stock', then: (s) => s.required('Expected availability date is required'), otherwise: (s) => s.nullable(),
  }),
  platforms: Yup.array().of(Yup.string()),
  specs: Yup.array().of(Yup.object({ key: Yup.string().trim(), value: Yup.string().trim() })),
  // at least one image overall (kept existing + newly picked)
  newImages: Yup.array().test('images', 'Add at least one product image', function (v) {
    return (v?.length || 0) + (this.parent.keepImages?.length || 0) > 0
  }).test('type', 'Images must be JPG, PNG or WEBP', (v) => (v || []).every((f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)))
    .test('size', 'Each image must be 5MB or smaller', (v) => (v || []).every((f) => f.size <= 5 * 1024 * 1024))
    .test('count', 'Maximum 10 images', function (v) { return (v?.length || 0) + (this.parent.keepImages?.length || 0) <= 10 }),
})

const ImagesField = ({ existing }) => {
  const { values, setFieldValue, errors, submitCount } = useFormikContext()
  const previews = useMemo(() => values.newImages.map((f) => URL.createObjectURL(f)), [values.newImages])
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Photos</Typography>
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mb: 1 }}>
        {existing.map((img) => {
          const kept = values.keepImages.includes(img.public_id)
          return (
            <Box key={img.public_id} sx={{ position: 'relative', opacity: kept ? 1 : 0.3 }}>
              <img src={img.url} alt="" width="84" height="64" style={{ objectFit: 'cover', borderRadius: 8 }} />
              <IconButton size="small" color={kept ? 'error' : 'primary'} sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper' }}
                title={kept ? 'Remove this photo' : 'Keep this photo'}
                onClick={() => setFieldValue('keepImages', kept ? values.keepImages.filter((i) => i !== img.public_id) : [...values.keepImages, img.public_id])}>
                {kept ? <DeleteIcon fontSize="inherit" /> : <AddIcon fontSize="inherit" />}
              </IconButton>
            </Box>
          )
        })}
        {previews.map((src) => <img key={src} src={src} alt="" width="84" height="64" style={{ objectFit: 'cover', borderRadius: 8, outline: '2px solid var(--cyan)' }} />)}
      </Stack>
      <Button component="label" variant="outlined" size="small">
        Choose photos (multiple)
        <input hidden type="file" multiple accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setFieldValue('newImages', [...values.newImages, ...Array.from(e.currentTarget.files)])} />
      </Button>
      {values.newImages.length > 0 && <Button size="small" onClick={() => setFieldValue('newImages', [])}>Clear new photos</Button>}
      {errors.newImages && submitCount > 0 && <FormHelperText error>{String(errors.newImages)}</FormHelperText>}
    </Box>
  )
}

const TagsField = ({ name, label, helper }) => {
  const { values, setFieldValue } = useFormikContext()
  return (
    <Autocomplete multiple freeSolo options={[]} value={values[name]} onChange={(_, v) => setFieldValue(name, v)}
      renderTags={(v, getTagProps) => v.map((o, i) => <Chip size="small" label={o} {...getTagProps({ index: i })} key={o + i} />)}
      renderInput={(params) => <TextField {...params} margin="normal" label={label} helperText={helper} />} />
  )
}

// product = existing product (edit) or undefined (create). onSubmit(FormData)
const ProductForm = ({ product, onSubmit, submitLabel }) => {
  const editing = Boolean(product)
  const initial = {
    name: product?.name || '', brand: product?.brand || '', price: product?.price ?? '', stock: product?.stock ?? 0,
    category: product?.category || '', description: product?.description || '',
    availability: product?.availability || 'in-stock',
    expectedAvailability: product?.expectedAvailability ? product.expectedAvailability.slice(0, 10) : '',
    isFreight: product?.isFreight || false,
    platforms: product?.platforms || [], connectionType: product?.connectionType || '', playSpace: product?.playSpace || 'None',
    software: product?.software || [], mountPattern: product?.mountPattern || '', supportedMountPatterns: product?.supportedMountPatterns || [],
    specs: product?.specs?.length ? product.specs : [{ key: '', value: '' }],
    keepImages: product?.images?.map((i) => i.public_id) || [], newImages: [],
  }

  const submit = async (v, helpers) => {
    const fd = new FormData()
    ;['name', 'brand', 'price', 'stock', 'category', 'description', 'availability', 'connectionType', 'playSpace', 'mountPattern']
      .forEach((k) => fd.set(k, v[k]))
    fd.set('isFreight', v.isFreight)
    if (v.availability !== 'in-stock' && v.expectedAvailability) fd.set('expectedAvailability', v.expectedAvailability)
    fd.set('platforms', JSON.stringify(v.platforms))
    fd.set('software', JSON.stringify(v.software))
    fd.set('supportedMountPatterns', JSON.stringify(v.supportedMountPatterns))
    fd.set('specs', JSON.stringify(v.specs.filter((s) => s.key?.trim() && s.value?.trim())))
    if (editing) fd.set('keepImages', JSON.stringify(v.keepImages))
    v.newImages.forEach((f) => fd.append('images', f))
    await onSubmit(fd)
    helpers.setSubmitting(false)
  }

  return (
    <Formik initialValues={initial} validationSchema={schema} onSubmit={submit} validateOnMount={false}>
      {({ values, setFieldValue, errors, isSubmitting, submitCount }) => (
        <Form noValidate>
          <div className="row">
            <div className="col-md-8"><FormField name="name" label="Product name" /></div>
            <div className="col-md-4"><FormField name="brand" label="Brand" /></div>
            <div className="col-md-4"><FormField name="price" label="Price ($)" type="number" /></div>
            <div className="col-md-4"><FormField name="stock" label="Stock" type="number" /></div>
            <div className="col-md-4"><FormField name="category" label="Category" options={CATEGORIES} /></div>
          </div>
          <FormField name="description" label="Description" multiline minRows={4} />

          <div className="row">
            <div className="col-md-4"><FormField name="availability" label="Availability" options={AVAILABILITY} /></div>
            <div className="col-md-4">
              <FormField name="expectedAvailability" label="Expected availability" type="date" slotProps={{ inputLabel: { shrink: true } }}
                disabled={values.availability === 'in-stock'} />
            </div>
            <div className="col-md-4 d-flex align-items-center">
              <FormControlLabel control={<Switch checked={values.isFreight} onChange={(e) => setFieldValue('isFreight', e.target.checked)} />} label="Freight / oversized item" />
            </div>
          </div>

          <Typography variant="h6" sx={{ mt: 2 }}>Compatibility</Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="platforms-l">Supported platforms</InputLabel>
            <Select labelId="platforms-l" multiple value={values.platforms} onChange={(e) => setFieldValue('platforms', e.target.value)}
              input={<OutlinedInput label="Supported platforms" />}
              renderValue={(sel) => <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>{sel.map((s) => <Chip key={s} size="small" label={s} />)}</Stack>}>
              {PLATFORMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
          <TagsField name="software" label="Compatible software (type + Enter)" helper="e.g. iRacing, MSFS, DCS World, SteamVR" />
          <div className="row">
            <div className="col-md-6"><FormField name="connectionType" label="Connection type" options={['', ...CONNECTION_TYPES].map((c) => ({ value: c, label: c || 'Not applicable' }))} /></div>
            <div className="col-md-6"><FormField name="playSpace" label="Play space needed" options={PLAY_SPACES} /></div>
            <div className="col-md-6"><FormField name="mountPattern" label="Mount pattern (wheel / pedals / shifter)" helperText="e.g. 4xM6-100mm" /></div>
          </div>
          {values.category === 'Rig Frames & Mounts' && (
            <TagsField name="supportedMountPatterns" label="Supported mount patterns (rig frames)" helper="e.g. 4xM6-100mm, Universal-pedal-plate" />
          )}

          <Typography variant="h6" sx={{ mt: 2 }}>Specifications</Typography>
          {SPEC_HINTS[values.category] && <Alert severity="info" sx={{ my: 1 }}>Suggested for {values.category}: {SPEC_HINTS[values.category].join(', ')}</Alert>}
          <FieldArray name="specs">
            {({ push, remove }) => (
              <>
                {values.specs.map((_, i) => (
                  <Stack key={i} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <FormField name={`specs.${i}.key`} label="Spec" size="small" />
                    <FormField name={`specs.${i}.value`} label="Value" size="small" />
                    <IconButton onClick={() => remove(i)} aria-label="remove spec"><DeleteIcon /></IconButton>
                  </Stack>
                ))}
                <Button size="small" startIcon={<AddIcon />} onClick={() => push({ key: '', value: '' })}>Add spec</Button>
              </>
            )}
          </FieldArray>

          <ImagesField existing={product?.images || []} />

          {submitCount > 0 && Object.keys(errors).length > 0 && <Alert severity="error" sx={{ mb: 2 }}>Please fix the highlighted fields.</Alert>}
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default ProductForm

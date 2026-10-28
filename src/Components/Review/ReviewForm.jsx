import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Modal } from 'react-bootstrap'
import { Rating, Typography, Button, Stack, FormHelperText } from '@mui/material'
import FormField from '../Utils/FormField'

const schema = Yup.object({
  rating: Yup.number().min(1, 'Please choose a star rating').max(5).required('Please choose a star rating'),
  comment: Yup.string().trim().min(3, 'Comment must be at least 3 characters').max(500, 'Comment cannot exceed 500 characters').required('Please write a comment'),
})

// Used for both writing a new review and editing your own (initial = existing review)
const ReviewForm = ({ show, onHide, onSubmit, initial }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton><Modal.Title style={{ fontFamily: 'Orbitron', fontSize: 18 }}>{initial ? 'Edit your review' : 'Write a review'}</Modal.Title></Modal.Header>
    <Formik
      enableReinitialize
      initialValues={{ rating: initial?.rating || 0, comment: initial?.comment || '' }}
      validationSchema={schema}
      onSubmit={async (values, helpers) => { await onSubmit(values); helpers.setSubmitting(false) }}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Form noValidate>
          <Modal.Body>
            <Typography variant="subtitle2">Your rating</Typography>
            <Rating size="large" value={values.rating} onChange={(_, v) => setFieldValue('rating', v || 0)} />
            {touched.rating && errors.rating && <FormHelperText error>{errors.rating}</FormHelperText>}
            <FormField name="comment" label="Your review" multiline minRows={4} />
            <Typography variant="caption" className="muted">Inappropriate words are automatically masked.</Typography>
          </Modal.Body>
          <Modal.Footer>
            <Stack direction="row" spacing={1}>
              <Button onClick={onHide}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>{initial ? 'Update review' : 'Submit review'}</Button>
            </Stack>
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  </Modal>
)

export default ReviewForm

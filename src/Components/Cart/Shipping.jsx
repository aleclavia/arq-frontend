import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { countries } from 'countries-list'
import { Button, Typography } from '@mui/material'
import MetaData from '../Layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import FormField from '../Utils/FormField'
import { saveShippingInfo } from '../../actions/cartActions'

const countryList = Object.values(countries).map((c) => c.name).sort()

const schema = Yup.object({
  address: Yup.string().trim().min(5, 'Enter your full address').required('Address is required'),
  city: Yup.string().trim().required('City is required'),
  postalCode: Yup.string().trim().min(3, 'Postal code is too short').max(10, 'Postal code is too long').required('Postal code is required'),
  phoneNo: Yup.string().matches(/^[0-9+\-\s()]{7,15}$/, 'Enter a valid phone number').required('Phone number is required'),
  country: Yup.string().oneOf(countryList, 'Select a country').required('Country is required'),
})

const Shipping = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { shippingInfo, cartItems } = useSelector((s) => s.cart)
  const hasFreight = cartItems.some((i) => i.isFreight)

  return (
    <>
      <MetaData title="Shipping" />
      <div className="page" style={{ maxWidth: 640 }}>
        <CheckoutSteps active={0} />
        <div className="panel">
          <Typography variant="h5">Shipping info</Typography>
          {hasFreight && <Typography variant="body2" className="muted">Your cart has oversized items that ship by freight. A surcharge applies.</Typography>}
          <Formik
            initialValues={{ address: '', city: '', postalCode: '', phoneNo: '', country: '', ...shippingInfo }}
            validationSchema={schema}
            onSubmit={(v) => { dispatch(saveShippingInfo(v)); navigate('/confirm') }}
          >
            <Form noValidate>
              <FormField name="address" label="Address" />
              <FormField name="city" label="City" />
              <FormField name="phoneNo" label="Phone number" />
              <FormField name="postalCode" label="Postal code" />
              <FormField name="country" label="Country" options={countryList} />
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 2 }}>Continue</Button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  )
}

export default Shipping

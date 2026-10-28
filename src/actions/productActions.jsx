import api, { errMessage } from '../api'
import {
  ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, ALL_PRODUCTS_FAIL,
  MORE_PRODUCTS_REQUEST, MORE_PRODUCTS_SUCCESS,
  PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL, CLEAR_ERRORS,
} from '../constants/productConstants'

// filters: { keyword, minPrice, maxPrice, category, minRating, minReviews, platform, sort }
// append=true is used by infinite scroll (adds page N to the list instead of replacing it)
export const getProducts = (page = 1, filters = {}, append = false) => async (dispatch) => {
  try {
    dispatch({ type: append ? MORE_PRODUCTS_REQUEST : ALL_PRODUCTS_REQUEST })
    const params = { page, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== 0 && v != null)) }
    const { data } = await api.get('/products', { params })
    dispatch({ type: append ? MORE_PRODUCTS_SUCCESS : ALL_PRODUCTS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: ALL_PRODUCTS_FAIL, payload: errMessage(error) })
  }
}

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })
    const { data } = await api.get(`/product/${id}`)
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product })
  } catch (error) {
    dispatch({ type: PRODUCT_DETAILS_FAIL, payload: errMessage(error) })
  }
}

export const clearErrors = () => async (dispatch) => dispatch({ type: CLEAR_ERRORS })

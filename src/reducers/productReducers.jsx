import {
  ALL_PRODUCTS_REQUEST, ALL_PRODUCTS_SUCCESS, ALL_PRODUCTS_FAIL,
  MORE_PRODUCTS_REQUEST, MORE_PRODUCTS_SUCCESS,
  PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAIL, CLEAR_ERRORS,
} from '../constants/productConstants'

export const productsReducer = (state = { products: [], productsCount: 0, resPerPage: 8, totalPages: 0 }, action) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST:
      return { ...state, loading: true }
    case MORE_PRODUCTS_REQUEST:
      return { ...state, loadingMore: true }
    case ALL_PRODUCTS_SUCCESS:
      return {
        ...state, loading: false, loadingMore: false,
        products: action.payload.products, productsCount: action.payload.productsCount,
        resPerPage: action.payload.resPerPage, totalPages: action.payload.totalPages,
      }
    case MORE_PRODUCTS_SUCCESS: {
      const seen = new Set(state.products.map((p) => p._id))
      return {
        ...state, loading: false, loadingMore: false,
        products: [...state.products, ...action.payload.products.filter((p) => !seen.has(p._id))],
        productsCount: action.payload.productsCount, totalPages: action.payload.totalPages,
      }
    }
    case ALL_PRODUCTS_FAIL:
      return { ...state, loading: false, loadingMore: false, error: action.payload }
    case CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST: return { ...state, loading: true }
    case PRODUCT_DETAILS_SUCCESS: return { loading: false, product: action.payload }
    case PRODUCT_DETAILS_FAIL: return { ...state, loading: false, error: action.payload }
    case CLEAR_ERRORS: return { ...state, error: null }
    default: return state
  }
}

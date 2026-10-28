import * as T from '../constants/orderConstants'

export const newOrderReducer = (state = {}, action) => {
  switch (action.type) {
    case T.CREATE_ORDER_REQUEST: return { loading: true, error: null }
    case T.CREATE_ORDER_SUCCESS: return { loading: false, order: action.payload.order, success: true }
    case T.CREATE_ORDER_FAIL: return { loading: false, error: action.payload }
    case T.CLEAR_ERRORS: return { ...state, error: null }
    default: return state
  }
}

export const myOrdersReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case T.MY_ORDERS_REQUEST: return { ...state, loading: true }
    case T.MY_ORDERS_SUCCESS: return { loading: false, orders: action.payload }
    case T.MY_ORDERS_FAIL: return { ...state, loading: false, error: action.payload }
    case T.CLEAR_ERRORS: return { ...state, error: null }
    default: return state
  }
}

export const orderDetailsReducer = (state = { order: null }, action) => {
  switch (action.type) {
    case T.ORDER_DETAILS_REQUEST: return { ...state, loading: true }
    case T.ORDER_DETAILS_SUCCESS: return { loading: false, order: action.payload }
    case T.ORDER_DETAILS_FAIL: return { ...state, loading: false, error: action.payload }
    case T.CLEAR_ERRORS: return { ...state, error: null }
    default: return state
  }
}

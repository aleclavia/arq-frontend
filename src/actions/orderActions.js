import api, { errMessage } from '../api'
import * as T from '../constants/orderConstants'

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: T.CREATE_ORDER_REQUEST })
    const { data } = await api.post('/order/new', order)
    dispatch({ type: T.CREATE_ORDER_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: T.CREATE_ORDER_FAIL, payload: errMessage(error) })
  }
}

export const myOrders = () => async (dispatch) => {
  try {
    dispatch({ type: T.MY_ORDERS_REQUEST })
    const { data } = await api.get('/orders/me')
    dispatch({ type: T.MY_ORDERS_SUCCESS, payload: data.orders })
  } catch (error) {
    dispatch({ type: T.MY_ORDERS_FAIL, payload: errMessage(error) })
  }
}

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: T.ORDER_DETAILS_REQUEST })
    const { data } = await api.get(`/order/${id}`)
    dispatch({ type: T.ORDER_DETAILS_SUCCESS, payload: data.order })
  } catch (error) {
    dispatch({ type: T.ORDER_DETAILS_FAIL, payload: errMessage(error) })
  }
}

export const clearErrors = () => async (dispatch) => dispatch({ type: T.CLEAR_ERRORS })

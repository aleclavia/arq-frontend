import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'

import { productsReducer, productDetailsReducer } from './reducers/productReducers'
import { authReducer, userReducer, forgotPasswordReducer } from './reducers/userReducers'
import { cartReducer, rigReducer } from './reducers/cartReducers'
import { newOrderReducer, myOrdersReducer, orderDetailsReducer } from './reducers/orderReducers'

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

// cart + shipping + rig list survive page reloads / new sessions
const initialState = {
  cart: { cartItems: read('cartItems', []), shippingInfo: read('shippingInfo', {}) },
  rig: read('rigList', { items: [], spaceConfirmed: false }),
}

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  auth: authReducer,
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  rig: rigReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
})

const store = createStore(reducer, initialState, applyMiddleware(thunk))
export default store

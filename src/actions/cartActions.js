import api from '../api'
import {
  ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO, CLEAR_CART,
  RIG_ADD, RIG_REMOVE, RIG_CLEAR, RIG_CONFIRM_SPACE,
} from '../constants/cartConstants'

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await api.get(`/product/${id}`)
  const p = data.product
  const limit = p.availability === 'in-stock' ? p.stock : 99 // pre-order / backorder items can exceed stock
  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: p._id, name: p.name, price: p.price, image: p.images[0].url,
      stock: p.stock, availability: p.availability, isFreight: p.isFreight,
      quantity: Math.min(quantity, limit),
    },
  })
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeItemFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_ITEM_CART, payload: id })
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({ type: SAVE_SHIPPING_INFO, payload: data })
  localStorage.setItem('shippingInfo', JSON.stringify(data))
}

export const clearCart = () => async (dispatch) => {
  dispatch({ type: CLEAR_CART })
  localStorage.removeItem('cartItems')
}

/* ---- rig list ---- */
const saveRig = (getState) => localStorage.setItem('rigList', JSON.stringify(getState().rig))

export const addToRig = (product) => (dispatch, getState) => {
  dispatch({
    type: RIG_ADD,
    payload: {
      _id: product._id, name: product.name, price: product.price, image: product.images?.[0]?.url,
      category: product.category, group: product.group, platforms: product.platforms || [],
      playSpace: product.playSpace, mountPattern: product.mountPattern,
      supportedMountPatterns: product.supportedMountPatterns || [], isFreight: product.isFreight,
    },
  })
  saveRig(getState)
}
export const removeFromRig = (id) => (dispatch, getState) => { dispatch({ type: RIG_REMOVE, payload: id }); saveRig(getState) }
export const clearRig = () => (dispatch, getState) => { dispatch({ type: RIG_CLEAR }); saveRig(getState) }
export const confirmPlaySpace = (v) => (dispatch, getState) => { dispatch({ type: RIG_CONFIRM_SPACE, payload: v }); saveRig(getState) }

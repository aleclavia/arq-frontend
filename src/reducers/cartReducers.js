import {
  ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO, CLEAR_CART,
  RIG_ADD, RIG_REMOVE, RIG_CLEAR, RIG_CONFIRM_SPACE,
} from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const item = action.payload
      const exists = state.cartItems.find((i) => i.product === item.product)
      return {
        ...state,
        cartItems: exists
          ? state.cartItems.map((i) => (i.product === exists.product ? item : i))
          : [...state.cartItems, item],
      }
    }
    case REMOVE_ITEM_CART:
      return { ...state, cartItems: state.cartItems.filter((i) => i.product !== action.payload) }
    case SAVE_SHIPPING_INFO:
      return { ...state, shippingInfo: action.payload }
    case CLEAR_CART:
      return { ...state, cartItems: [] }
    default:
      return state
  }
}

export const rigReducer = (state = { items: [], spaceConfirmed: false }, action) => {
  switch (action.type) {
    case RIG_ADD:
      return state.items.some((i) => i._id === action.payload._id)
        ? state
        : { ...state, items: [...state.items, action.payload] }
    case RIG_REMOVE:
      return { ...state, items: state.items.filter((i) => i._id !== action.payload) }
    case RIG_CLEAR:
      return { items: [], spaceConfirmed: false }
    case RIG_CONFIRM_SPACE:
      return { ...state, spaceConfirmed: action.payload }
    default:
      return state
  }
}

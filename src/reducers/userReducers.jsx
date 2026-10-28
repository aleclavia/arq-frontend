import * as T from '../constants/userConstants'

export const authReducer = (state = { loading: true, isAuthenticated: false, user: null }, action) => {
  switch (action.type) {
    case T.LOGIN_REQUEST:
    case T.REGISTER_USER_REQUEST:
    case T.LOAD_USER_REQUEST:
      return { ...state, loading: true }
    case T.LOGIN_SUCCESS:
    case T.REGISTER_USER_SUCCESS:
    case T.LOAD_USER_SUCCESS:
      return { ...state, loading: false, isAuthenticated: true, user: action.payload }
    case T.LOGOUT_SUCCESS:
    case T.LOAD_USER_FAIL:
      return { loading: false, isAuthenticated: false, user: null }
    case T.LOGIN_FAIL:
    case T.REGISTER_USER_FAIL:
      return { loading: false, isAuthenticated: false, user: null, error: action.payload }
    case T.LOGOUT_FAIL:
      return { ...state, error: action.payload }
    case T.CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

// profile / password update flags
export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case T.UPDATE_PROFILE_REQUEST:
    case T.UPDATE_PASSWORD_REQUEST:
      return { ...state, loading: true }
    case T.UPDATE_PROFILE_SUCCESS:
    case T.UPDATE_PASSWORD_SUCCESS:
      return { ...state, loading: false, isUpdated: action.payload }
    case T.UPDATE_PROFILE_RESET:
      return { ...state, isUpdated: false }
    case T.UPDATE_PROFILE_FAIL:
    case T.UPDATE_PASSWORD_FAIL:
      return { ...state, loading: false, error: action.payload }
    case T.CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

export const forgotPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case T.FORGOT_PASSWORD_REQUEST:
    case T.NEW_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null }
    case T.FORGOT_PASSWORD_SUCCESS:
      return { ...state, loading: false, message: action.payload }
    case T.NEW_PASSWORD_SUCCESS:
      return { ...state, loading: false, success: action.payload }
    case T.FORGOT_PASSWORD_FAIL:
    case T.NEW_PASSWORD_FAIL:
      return { ...state, loading: false, error: action.payload }
    case T.CLEAR_ERRORS:
      return { ...state, error: null }
    default:
      return state
  }
}

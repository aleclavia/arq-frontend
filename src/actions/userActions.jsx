import api, { errMessage } from '../api'
import * as T from '../constants/userConstants'

export const register = (formData) => async (dispatch) => {
  try {
    dispatch({ type: T.REGISTER_USER_REQUEST })
    const { data } = await api.post('/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    dispatch({ type: T.REGISTER_USER_SUCCESS, payload: data.user })
  } catch (error) {
    dispatch({ type: T.REGISTER_USER_FAIL, payload: errMessage(error) })
  }
}

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: T.LOGIN_REQUEST })
    const { data } = await api.post('/login', { email, password })
    dispatch({ type: T.LOGIN_SUCCESS, payload: data.user })
  } catch (error) {
    dispatch({ type: T.LOGIN_FAIL, payload: errMessage(error) })
  }
}

// Google sign-in through Firebase: idToken comes from firebase.js
export const googleLogin = (idToken) => async (dispatch) => {
  try {
    dispatch({ type: T.LOGIN_REQUEST })
    const { data } = await api.post('/auth/google', { idToken })
    dispatch({ type: T.LOGIN_SUCCESS, payload: data.user })
  } catch (error) {
    dispatch({ type: T.LOGIN_FAIL, payload: errMessage(error) })
  }
}

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: T.LOAD_USER_REQUEST })
    const { data } = await api.get('/me')
    dispatch({ type: T.LOAD_USER_SUCCESS, payload: data.user })
  } catch {
    dispatch({ type: T.LOAD_USER_FAIL }) // not logged in is normal, no error shown
  }
}

export const logout = () => async (dispatch) => {
  try {
    await api.get('/logout')
    dispatch({ type: T.LOGOUT_SUCCESS })
  } catch (error) {
    dispatch({ type: T.LOGOUT_FAIL, payload: errMessage(error) })
  }
}

export const updateProfile = (formData) => async (dispatch) => {
  try {
    dispatch({ type: T.UPDATE_PROFILE_REQUEST })
    const { data } = await api.put('/me/update', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    dispatch({ type: T.UPDATE_PROFILE_SUCCESS, payload: data.success })
    dispatch(loadUser())
  } catch (error) {
    dispatch({ type: T.UPDATE_PROFILE_FAIL, payload: errMessage(error) })
  }
}

export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: T.UPDATE_PASSWORD_REQUEST })
    const { data } = await api.put('/password/update', passwords)
    dispatch({ type: T.UPDATE_PASSWORD_SUCCESS, payload: data.success })
  } catch (error) {
    dispatch({ type: T.UPDATE_PASSWORD_FAIL, payload: errMessage(error) })
  }
}

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: T.FORGOT_PASSWORD_REQUEST })
    const { data } = await api.post('/password/forgot', { email })
    dispatch({ type: T.FORGOT_PASSWORD_SUCCESS, payload: data.message })
  } catch (error) {
    dispatch({ type: T.FORGOT_PASSWORD_FAIL, payload: errMessage(error) })
  }
}

export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: T.NEW_PASSWORD_REQUEST })
    const { data } = await api.put(`/password/reset/${token}`, passwords)
    dispatch({ type: T.NEW_PASSWORD_SUCCESS, payload: data.success })
  } catch (error) {
    dispatch({ type: T.NEW_PASSWORD_FAIL, payload: errMessage(error) })
  }
}

export const clearErrors = () => async (dispatch) => dispatch({ type: T.CLEAR_ERRORS })

import axios from 'axios'

// One axios instance for the whole app. The JWT lives in an httpOnly cookie, so withCredentials is required.
const api = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:4001/api/v1',
  withCredentials: true,
})

// Safe error message (works for server errors AND network errors)
export const errMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong'

export default api

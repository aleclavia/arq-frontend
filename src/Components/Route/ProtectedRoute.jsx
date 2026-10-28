import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../Layout/Loader'

// <ProtectedRoute>  = must be logged in      <ProtectedRoute isAdmin> = must be admin
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { loading, isAuthenticated, user } = useSelector((s) => s.auth)
  const location = useLocation()

  if (loading) return <Loader />
  if (!isAuthenticated) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  if (isAdmin && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default ProtectedRoute

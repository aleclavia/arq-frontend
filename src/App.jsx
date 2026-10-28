import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'

import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import Home from './Components/Home'
import ProductDetails from './Components/Product/ProductDetails'
import Login from './Components/User/Login'
import Register from './Components/User/Register'
import ForgotPassword from './Components/User/ForgotPassword'
import NewPassword from './Components/User/NewPassword'
import Profile from './Components/User/Profile'
import UpdateProfile from './Components/User/UpdateProfile'
import UpdatePassword from './Components/User/UpdatePassword'
import Cart from './Components/Cart/Cart'
import Shipping from './Components/Cart/Shipping'
import ConfirmOrder from './Components/Cart/ConfirmOrder'
import Payment from './Components/Cart/Payment'
import OrderSuccess from './Components/Cart/OrderSuccess'
import ListOrders from './Components/Order/ListOrders'
import OrderDetails from './Components/Order/OrderDetails'
import RigBuilder from './Components/Rig/RigBuilder'

import Dashboard from './Components/Admin/Dashboard'
import ProductsList from './Components/Admin/ProductsList'
import NewProduct from './Components/Admin/NewProduct'
import UpdateProduct from './Components/Admin/UpdateProduct'
import OrdersList from './Components/Admin/OrdersList'
import ProcessOrder from './Components/Admin/ProcessOrder'
import UsersList from './Components/Admin/UsersList'
import UpdateUser from './Components/Admin/UpdateUser'
import ProductReviews from './Components/Admin/ProductReviews'
import ProtectedRoute from './Components/Route/ProtectedRoute'
import { loadUser } from './actions/userActions'

const user = (el) => <ProtectedRoute>{el}</ProtectedRoute>
const admin = (el) => <ProtectedRoute isAdmin={true}>{el}</ProtectedRoute>

function App() {
  const dispatch = useDispatch()
  useEffect(() => { dispatch(loadUser()) }, [dispatch]) // restore the session from the httpOnly cookie

  return (
    <Router>
      <Header />
      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/search/:keyword" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<NewPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/rig" element={<RigBuilder />} />

        {/* logged-in users */}
        <Route path="/me" element={user(<Profile />)} />
        <Route path="/me/update" element={user(<UpdateProfile />)} />
        <Route path="/password/update" element={user(<UpdatePassword />)} />
        <Route path="/shipping" element={user(<Shipping />)} />
        <Route path="/confirm" element={user(<ConfirmOrder />)} />
        <Route path="/payment" element={user(<Payment />)} />
        <Route path="/success" element={user(<OrderSuccess />)} />
        <Route path="/orders/me" element={user(<ListOrders />)} />
        <Route path="/order/:id" element={user(<OrderDetails />)} />

        {/* admin only */}
        <Route path="/dashboard" element={admin(<Dashboard />)} />
        <Route path="/admin/products" element={admin(<ProductsList />)} />
        <Route path="/admin/product" element={admin(<NewProduct />)} />
        <Route path="/admin/product/:id" element={admin(<UpdateProduct />)} />
        <Route path="/admin/orders" element={admin(<OrdersList />)} />
        <Route path="/admin/order/:id" element={admin(<ProcessOrder />)} />
        <Route path="/admin/users" element={admin(<UsersList />)} />
        <Route path="/admin/user/:id" element={admin(<UpdateUser />)} />
        <Route path="/admin/reviews" element={admin(<ProductReviews />)} />
      </Routes>
      <Footer />
      <ToastContainer theme="dark" />
    </Router>
  )
}

export default App

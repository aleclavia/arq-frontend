import { NavLink } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import AddBoxIcon from '@mui/icons-material/AddBox'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import PeopleIcon from '@mui/icons-material/People'
import RateReviewIcon from '@mui/icons-material/RateReview'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/admin/products', label: 'Products', icon: <Inventory2Icon /> },
  { to: '/admin/product', label: 'New product', icon: <AddBoxIcon />, end: true },
  { to: '/admin/orders', label: 'Orders', icon: <ReceiptLongIcon /> },
  { to: '/admin/users', label: 'Users', icon: <PeopleIcon /> },
  { to: '/admin/reviews', label: 'Reviews', icon: <RateReviewIcon /> },
]

// Wrap every admin page: <AdminLayout>...page...</AdminLayout>
// Navigation is a row of boxed tabs on top (gives tables the full page width).
const AdminLayout = ({ children }) => (
  <div className="admin-wrap">
    <nav className="admin-tabs" aria-label="admin sections">
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `nav-box${isActive ? ' active' : ''}`}>
          {l.icon}{l.label}
        </NavLink>
      ))}
    </nav>
    <main className="admin-main">{children}</main>
  </div>
)

export default AdminLayout

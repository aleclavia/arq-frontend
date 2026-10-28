import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, IconButton, Button, Avatar, Menu, MenuItem, Divider, Box } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import BuildIcon from '@mui/icons-material/Build'
import { toast } from 'react-toastify'
import Search from './Search'
import { logout } from '../../actions/userActions'
import { FREE_SHIPPING_OVER } from '../../utils/pricing'

const TICKER = [
  `Free shipping over $${FREE_SHIPPING_OVER.toLocaleString()}`, 'VR', 'Sim racing', 'Flight sim', 'Pre-orders open',
  'Check your rig before you buy', 'Know the tech. Live the game.',
]

// the text is repeated twice so the CSS animation (-50%) loops seamlessly
const Ticker = () => (
  <div className="ticker" aria-hidden="true">
    <div className="ticker-track">
      {[...TICKER, ...TICKER].map((t, i) => <span key={i}>{t}<b>&#10022;</b></span>)}
    </div>
  </div>
)

const NAV = [
  { label: 'All gear', to: '/', group: null },
  { label: 'VR', to: '/?group=VR', group: 'VR' },
  { label: 'Racing', to: '/?group=Racing', group: 'Racing' },
  { label: 'Flight', to: '/?group=Flight', group: 'Flight' },
  { label: 'Rig builder', to: '/rig', path: '/rig' },
]

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const { user } = useSelector((s) => s.auth)
  const { cartItems } = useSelector((s) => s.cart)
  const rig = useSelector((s) => s.rig.items)
  const [anchor, setAnchor] = useState(null)
  const activeGroup = new URLSearchParams(search).get('group')

  const isActive = (n) => (n.path ? pathname === n.path : pathname === '/' && (n.group || null) === (activeGroup || null))
  const go = (path) => { setAnchor(null); navigate(path) }
  const logoutHandler = async () => {
    setAnchor(null)
    await dispatch(logout())
    toast.success('Logged out', { position: 'bottom-right' })
    navigate('/')
  }

  return (
    <header className="site-header">
      <Ticker />
      <div className="header-main">
        <Link to="/" className="logo" aria-label="ARQANE ARQADE home">
          <span className="logo-a">ARQANE</span><span className="logo-b">ARQADE</span>
        </Link>

        <div className="header-search"><Search /></div>

        <div className="header-actions">
          <IconButton className="icon-box" component={Link} to="/rig" aria-label="rig list" title="Rig list">
            <Badge badgeContent={rig.length} color="secondary"><BuildIcon /></Badge>
          </IconButton>
          <IconButton className="icon-box" component={Link} to="/cart" aria-label="cart" title="Cart">
            <Badge badgeContent={cartItems.length} color="primary"><ShoppingCartIcon /></Badge>
          </IconButton>

          {user ? (
            <>
              <Button variant="outlined" onClick={(e) => setAnchor(e.currentTarget)} startIcon={<Avatar src={user.avatar?.url} sx={{ width: 26, height: 26 }} />}>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{user.name}</Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Me</Box>
              </Button>
              <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                {user.role === 'admin' && <MenuItem onClick={() => go('/dashboard')}>Dashboard</MenuItem>}
                <MenuItem onClick={() => go('/orders/me')}>My Orders</MenuItem>
                <MenuItem onClick={() => go('/me')}>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={logoutHandler} sx={{ color: 'error.main' }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button component={Link} to="/login" variant="contained" color="secondary">Login</Button>
          )}
        </div>
      </div>

      <nav className="header-nav" aria-label="shop categories">
        {NAV.map((n) => (
          <Link key={n.label} to={n.to} className={`nav-box${isActive(n) ? ' active' : ''}`}>{n.label}</Link>
        ))}
      </nav>
    </header>
  )
}

export default Header

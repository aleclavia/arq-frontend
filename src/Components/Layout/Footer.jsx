import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div>
        <Link to="/" className="logo" style={{ marginBottom: 14 }}>
          <span className="logo-a">ARQANE</span><span className="logo-b">ARQADE</span>
        </Link>
        <p style={{ fontWeight: 600, maxWidth: 380, margin: '14px 0 0' }}>
          VR headsets, sim racing and flight gear. Know the tech. Live the game.
        </p>
      </div>
      <div>
        <h6>SHOP</h6>
        <Link to="/?group=VR">VR</Link>
        <Link to="/?group=Racing">Racing</Link>
        <Link to="/?group=Flight">Flight</Link>
        <Link to="/rig">Rig builder</Link>
      </div>
      <div>
        <h6>ACCOUNT</h6>
        <Link to="/me">Profile</Link>
        <Link to="/orders/me">My orders</Link>
        <Link to="/cart">Cart</Link>
      </div>
    </div>
    <div className="footer-bottom">&copy; {new Date().getFullYear()} ARQANE ARQADE &#10022; Test-mode payments &#10022; No real charges</div>
  </footer>
)

export default Footer

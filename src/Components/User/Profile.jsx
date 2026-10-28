import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, Button, Stack, Typography, Chip } from '@mui/material'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'

const Profile = () => {
  const { user, loading } = useSelector((s) => s.auth)
  if (loading || !user) return <Loader />
  return (
    <>
      <MetaData title="My Profile" />
      <div className="page">
        <div className="panel" style={{ maxWidth: 640, margin: '0 auto' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'center' }}>
            <Avatar src={user.avatar?.url} sx={{ width: 120, height: 120, border: '2px solid var(--cyan)' }} />
            <div>
              <Typography variant="h5">{user.name} {user.role === 'admin' && <Chip size="small" color="secondary" label="Admin" />}</Typography>
              <Typography className="muted">{user.email}</Typography>
              <Typography variant="body2" className="muted">Joined {new Date(user.createdAt).toLocaleDateString()}</Typography>
            </div>
          </Stack>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 3 }} useFlexGap>
            <Button component={Link} to="/me/update" variant="contained">Edit profile</Button>
            <Button component={Link} to="/password/update" variant="outlined">{user.needsPasswordSetup ? 'Set a password' : 'Change password'}</Button>
            <Button component={Link} to="/orders/me" variant="outlined">My orders</Button>
          </Stack>
        </div>
      </div>
    </>
  )
}

export default Profile

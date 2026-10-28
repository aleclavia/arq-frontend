import { Button } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { googleSignInToken } from '../../firebase'
import { googleLogin } from '../../actions/userActions'

const GoogleButton = () => {
  const dispatch = useDispatch()
  const onClick = async () => {
    try {
      const idToken = await googleSignInToken()
      dispatch(googleLogin(idToken))
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') toast.error(e.message, { position: 'bottom-right' })
    }
  }
  return (
    <Button fullWidth variant="outlined" startIcon={<GoogleIcon />} onClick={onClick} sx={{ mt: 1 }}>
      Continue with Google
    </Button>
  )
}

export default GoogleButton

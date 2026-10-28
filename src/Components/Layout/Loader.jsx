import { CircularProgress, Box } from '@mui/material'

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
    <CircularProgress color="primary" />
  </Box>
)

export default Loader

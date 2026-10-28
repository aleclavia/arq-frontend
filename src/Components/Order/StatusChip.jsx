import { Chip } from '@mui/material'

const colors = { Processing: 'warning', Shipped: 'info', Delivered: 'success' }
const StatusChip = ({ status }) => <Chip size="small" color={colors[status] || 'default'} label={status} />

export default StatusChip

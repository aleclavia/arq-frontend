import { Link } from 'react-router-dom'
import { Card, CardContent, CardActions, Chip, Rating, Typography, Stack, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import BuildIcon from '@mui/icons-material/Build'
import { money } from '../../utils/pricing'
import { addToRig } from '../../actions/cartActions'

export const AvailabilityChip = ({ product, size = 'small' }) => {
  if (product.availability === 'pre-order') return <Chip size={size} color="secondary" label="Pre-order" />
  if (product.availability === 'backordered') return <Chip size={size} color="warning" label="Backordered" />
  if (product.stock === 0) return <Chip size={size} color="error" label="Out of stock" />
  return <Chip size={size} color="success" label="In stock" />
}

const Product = ({ product }) => {
  const dispatch = useDispatch()

  const rigHandler = () => {
    dispatch(addToRig(product))
    toast.success('Added to rig list', { position: 'bottom-right' })
  }

  return (
    <Card className="product-card">
      <div className="pc-strip" data-group={product.group}>
        <span>{product.group || 'Gear'}</span>
        <span>{product.brand}</span>
      </div>
      <div className="pc-media">
        <Link to={`/product/${product._id}`}>
          <img className="thumb" src={product.images?.[0]?.url} alt={product.name} loading="lazy" />
        </Link>
        <div className="pc-badge"><AvailabilityChip product={product} /></div>
        <div className="pc-price">{money(product.price)}</div>
      </div>
      <CardContent className="pc-body">
        <div className="pc-cat">{product.category}</div>
        <Link to={`/product/${product._id}`} className="pc-name">{product.name}</Link>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Rating value={product.ratings || 0} precision={0.5} readOnly size="small" />
          <Typography variant="caption" sx={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>({product.numOfReviews})</Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2.5, pt: 1.5, gap: 1.5 }}>
        <Button component={Link} to={`/product/${product._id}`} variant="contained" color="primary" size="small" fullWidth>View details</Button>
        <Button onClick={rigHandler} size="small" variant="outlined" title="Add to rig list" aria-label="add to rig list" sx={{ minWidth: 44, px: 1 }}><BuildIcon fontSize="small" /></Button>
      </CardActions>
    </Card>
  )
}

export default Product

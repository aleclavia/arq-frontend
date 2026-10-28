import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Carousel } from 'react-bootstrap'
import { Button, Chip, Rating, Stack, Typography, IconButton, Alert } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import BuildIcon from '@mui/icons-material/Build'
import { toast } from 'react-toastify'
import MetaData from '../Layout/MetaData'
import Loader from '../Layout/Loader'
import ListReviews from '../Review/ListReviews'
import ReviewForm from '../Review/ReviewForm'
import { AvailabilityChip } from './Product'
import api, { errMessage } from '../../api'
import { money } from '../../utils/pricing'
import { getProductDetails } from '../../actions/productActions'
import { addItemToCart, addToRig } from '../../actions/cartActions'

const Row = ({ label, children }) => <tr><th>{label}</th><td>{children}</td></tr>

const ProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { loading, error, product } = useSelector((s) => s.productDetails)
  const { user } = useSelector((s) => s.auth)

  const [quantity, setQuantity] = useState(1)
  const [eligibility, setEligibility] = useState({ canReview: false, myReview: null, reason: '' })
  const [showReview, setShowReview] = useState(false)

  useEffect(() => { dispatch(getProductDetails(id)); setQuantity(1) }, [dispatch, id])

  const loadEligibility = useCallback(async () => {
    if (!user) return setEligibility({ canReview: false, myReview: null, reason: '' })
    try {
      const { data } = await api.get('/review/eligibility', { params: { productId: id } })
      setEligibility(data)
    } catch { /* ignore */ }
  }, [id, user])
  useEffect(() => { loadEligibility() }, [loadEligibility])

  if (loading || !product?._id) return error ? <div className="page"><Alert severity="error">{error}</Alert></div> : <Loader />

  const preorder = product.availability !== 'in-stock'
  const maxQty = preorder ? 99 : product.stock
  const canBuy = preorder || product.stock > 0
  const specRows = [
    product.connectionType && ['Connection', product.connectionType],
    product.playSpace && product.playSpace !== 'None' && ['Play space', product.playSpace],
    product.mountPattern && ['Mount pattern', product.mountPattern],
    product.supportedMountPatterns?.length > 0 && ['Supports mounts', product.supportedMountPatterns.join(', ')],
    ...(product.specs || []).map((s) => [s.key, s.value]),
  ].filter(Boolean)

  const addToCart = async () => {
    await dispatch(addItemToCart(id, quantity))
    toast.success('Item added to cart', { position: 'bottom-right' })
  }

  const submitReview = async (values) => {
    try {
      const { data } = await api.put('/review', { productId: id, rating: values.rating, comment: values.comment })
      toast.success(data.updated ? 'Review updated' : 'Review posted', { position: 'bottom-right' })
      if (data.filtered) toast.info('Some words in your review were masked.', { position: 'bottom-right' })
      setShowReview(false)
      dispatch(getProductDetails(id))
      loadEligibility()
    } catch (e) {
      toast.error(errMessage(e), { position: 'bottom-right' })
    }
  }

  return (
    <>
      <MetaData title={product.name} />
      <div className="page">
        <div className="crumbs">
          <Link to="/">Home</Link> / {product.group && <><Link to={`/?group=${product.group}`}>{product.group}</Link> / </>}{product.category}
        </div>

        {/* ---------- top: photos + buy box ---------- */}
        <div className="row gx-4 gy-5">
          <div className="col-12 col-lg-6">
            <div className="media-frame">
              <Carousel pause="hover" interval={null}>
                {product.images?.map((img) => (
                  <Carousel.Item key={img.public_id}><img className="carousel-img" src={img.url} alt={product.name} /></Carousel.Item>
                ))}
              </Carousel>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <span className="sticker sky">{product.brand}</span>
            <h1 className="pd-title">{product.name}</h1>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3 }}>
              <Rating value={product.ratings || 0} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ fontFamily: 'var(--mono)', fontWeight: 700 }}>({product.numOfReviews} reviews)</Typography>
            </Stack>

            <div className="price-tag">{money(product.price)}</div>

            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', my: 3 }} useFlexGap>
              <AvailabilityChip product={product} size="medium" />
              {product.isFreight && <Chip label="Freight shipping" color="warning" size="medium" />}
              {!preorder && product.stock > 0 && <Chip label={`${product.stock} left`} size="medium" />}
            </Stack>

            {preorder && (
              <Alert severity="info" sx={{ mb: 3 }}>
                This item is {product.availability === 'pre-order' ? 'available for pre-order' : 'backordered'}
                {product.expectedAvailability && ` - expected ${new Date(product.expectedAvailability).toLocaleDateString()}`}.
              </Alert>
            )}

            <Stack direction="row" spacing={1.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Stack direction="row" sx={{ alignItems: 'center', border: '3px solid #111', background: '#fff' }}>
                <IconButton onClick={() => setQuantity((q) => Math.max(1, q - 1))} disabled={quantity <= 1} aria-label="less"><RemoveIcon /></IconButton>
                <Typography sx={{ minWidth: 36, textAlign: 'center', fontFamily: 'var(--mono)', fontWeight: 700, lineHeight: 1 }}>{quantity}</Typography>
                <IconButton onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))} disabled={quantity >= maxQty} aria-label="more"><AddIcon /></IconButton>
              </Stack>
              <Button variant="contained" color="primary" size="large" disabled={!canBuy} onClick={addToCart}>Add to cart</Button>
              <Button variant="contained" color="secondary" size="large" startIcon={<BuildIcon />} onClick={() => { dispatch(addToRig(product)); toast.success('Added to rig list', { position: 'bottom-right' }) }}>
                Add to rig
              </Button>
            </Stack>
          </div>
        </div>

        {/* ---------- middle: about + compatibility + specs ---------- */}
        <div className="row gx-4 gy-5" style={{ marginTop: 28 }}>
          <div className="col-12 col-lg-7">
            <div className="section-tab">About</div>
            <div className="panel"><Typography sx={{ fontWeight: 500, lineHeight: 1.7 }}>{product.description}</Typography></div>

            {specRows.length > 0 && (
              <div style={{ marginTop: 40 }}>
                <div className="section-tab">Spec sheet</div>
                <div className="panel panel-flush">
                  <table className="spec-table"><tbody>{specRows.map(([k, v]) => <Row key={k} label={k}>{v}</Row>)}</tbody></table>
                </div>
              </div>
            )}
          </div>

          <div className="col-12 col-lg-5">
            <div className="section-tab">Compatibility</div>
            <div className="panel panel-sky">
              <span className="field-label" style={{ marginTop: 0 }}>Supported platforms</span>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {product.platforms?.length
                  ? product.platforms.map((p) => <Chip key={p} label={p} size="medium" />)
                  : <Typography variant="body2" sx={{ fontWeight: 600 }}>Not specified</Typography>}
              </Stack>
              {product.software?.length > 0 && (
                <>
                  <span className="field-label">Compatible software</span>
                  <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                    {product.software.map((s) => <Chip key={s} label={s} color="warning" />)}
                  </Stack>
                </>
              )}
              <Typography variant="body2" sx={{ mt: 3, fontWeight: 600 }}>
                Unsure it fits your setup? Add it to your <Link to="/rig">rig list</Link> and we will check compatibility for you.
              </Typography>
            </div>
          </div>
        </div>

        {/* ---------- reviews ---------- */}
        <div style={{ marginTop: 56 }}>
          <div className="section-tab">Reviews &amp; ratings</div>
          <div className="panel">
            <div style={{ marginBottom: 24 }}>
              {!user ? (
                <Alert severity="info">Please <Link to={`/login?redirect=/product/${id}`}>login</Link> to review products you have received.</Alert>
              ) : eligibility.canReview ? (
                <Button variant="contained" color="primary" onClick={() => setShowReview(true)}>{eligibility.myReview ? 'Edit your review' : 'Write a review'}</Button>
              ) : (
                <Alert severity="info">{eligibility.reason || 'You can review this product after it is delivered.'}</Alert>
              )}
            </div>
            <ListReviews reviews={product.reviews} currentUserId={user?._id} />
          </div>
        </div>
      </div>

      <ReviewForm show={showReview} onHide={() => setShowReview(false)} onSubmit={submitReview} initial={eligibility.myReview} />
    </>
  )
}

export default ProductDetails

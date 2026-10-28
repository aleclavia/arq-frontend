import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Slider, Pagination, Stack, Typography, MenuItem, TextField, Button, ToggleButton, ToggleButtonGroup,
  Box, CircularProgress, Chip,
} from '@mui/material'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import Product from './Product/Product'
import MetaData from './Layout/MetaData'
import Loader from './Layout/Loader'
import { getProducts } from '../actions/productActions'
import { CATEGORIES, PLATFORMS, GROUPS } from '../constants/catalog'
import { FREE_SHIPPING_OVER } from '../utils/pricing'

const MAX_PRICE = 4000
const DEFAULTS = { price: [0, MAX_PRICE], category: '', minRating: 0, minReviews: 0, platform: '', sort: 'newest' }
const GROUP_COLOR = { VR: 'info', Racing: 'secondary', Flight: 'warning' }

const Home = () => {
  const { keyword } = useParams()
  const [params, setParams] = useSearchParams()
  const group = GROUPS.includes(params.get('group')) ? params.get('group') : ''
  const dispatch = useDispatch()
  const { loading, loadingMore, products, productsCount, totalPages, error } = useSelector((s) => s.products)

  const [filters, setFilters] = useState(DEFAULTS)
  const [priceDraft, setPriceDraft] = useState(DEFAULTS.price) // slider value while dragging
  const [mode, setMode] = useState('pagination')              // 'pagination' | 'infinite'
  const [page, setPage] = useState(1)
  const sentinel = useRef(null)

  const query = useCallback(() => ({
    keyword,
    group,
    minPrice: filters.price[0] > 0 ? filters.price[0] : '',
    maxPrice: filters.price[1] < MAX_PRICE ? filters.price[1] : '',
    category: filters.category,
    minRating: filters.minRating,
    minReviews: filters.minReviews,
    platform: filters.platform,
    sort: filters.sort,
  }), [keyword, group, filters])

  // any filter / search / group / mode change -> back to page 1
  useEffect(() => {
    setPage(1)
    dispatch(getProducts(1, query(), false))
  }, [dispatch, query, mode])

  const setFilter = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const reset = () => { setFilters(DEFAULTS); setPriceDraft(DEFAULTS.price); setParams({}) }

  const onPageChange = (_, value) => {
    setPage(value)
    dispatch(getProducts(value, query(), false))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---- infinite scroll: when the sentinel scrolls into view, append the next page ----
  const hasMore = page < totalPages
  useEffect(() => {
    if (mode !== 'infinite' || !sentinel.current) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
        const next = page + 1
        setPage(next)
        dispatch(getProducts(next, query(), true))
      }
    }, { rootMargin: '200px' })
    io.observe(sentinel.current)
    return () => io.disconnect()
  }, [mode, hasMore, loading, loadingMore, page, dispatch, query])

  const filtersActive = JSON.stringify(filters) !== JSON.stringify(DEFAULTS) || Boolean(group)
  const title = keyword ? `Results for "${keyword}"` : group ? `${group} gear` : 'Latest products'

  return (
    <>
      <MetaData title="Shop VR & Sim Gear" />
      <div className="page">
        {/* ---------- hero (hidden while searching so results come first) ---------- */}
        {!keyword && (
          <section className="hero">
            <div className="row g-4 align-items-center">
              <div className="col-12 col-lg-8">
                <span className="sticker">VR &#10022; Racing &#10022; Flight</span>
                <h1 className="hero-title">
                  <span className="hl hl-gold">Know the tech.</span><br />
                  <span className="hl hl-blue">Live the game.</span>
                </h1>
                <p className="hero-copy">Headsets, wheels, sticks and full motion rigs, with compatibility you can trust before you pay.</p>
                <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {GROUPS.map((g) => (
                    <Button key={g} component={Link} to={`/?group=${g}`} variant="contained" color={g === 'VR' ? 'primary' : g === 'Racing' ? 'secondary' : 'info'} size="large">Shop {g}</Button>
                  ))}
                </Stack>
              </div>
              <div className="col-12 col-lg-4">
                <div className="hero-cards">
                  <Link to="/rig" className="hero-card"><b>Rig builder</b><span>Check compatibility first &rarr;</span></Link>
                  <div className="hero-card"><b>Free shipping</b><span>on orders over ${FREE_SHIPPING_OVER.toLocaleString()}</span></div>
                  <div className="hero-card"><b>Pre-orders open</b><span>Reserve the next drop</span></div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="row g-4">
          {/* ---------- filters ---------- */}
          <div className="col-12 col-lg-3">
            <div style={{ position: 'sticky', top: 170 }}>
              <div className="section-tab">Filters</div>
              <div className="panel" style={{ padding: 20 }}>
                {filtersActive && (
                  <Button size="small" fullWidth startIcon={<FilterAltOffIcon />} onClick={reset} sx={{ mb: 1 }}>Clear all</Button>
                )}

                <span className="filter-label">Price: ${priceDraft[0]} - ${priceDraft[1] === MAX_PRICE ? `${MAX_PRICE}+` : priceDraft[1]}</span>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={priceDraft} min={0} max={MAX_PRICE} step={50}
                    onChange={(_, v) => setPriceDraft(v)}
                    onChangeCommitted={(_, v) => setFilter({ price: v })}
                    valueLabelDisplay="auto" disableSwap
                  />
                </Box>

                <span className="filter-label">Category</span>
                <TextField select fullWidth size="small" value={filters.category} onChange={(e) => setFilter({ category: e.target.value })} slotProps={{ select: { displayEmpty: true } }}>
                  <MenuItem value="">All categories</MenuItem>
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>

                <span className="filter-label">Ratings</span>
                <TextField select fullWidth size="small" value={filters.minRating} onChange={(e) => setFilter({ minRating: Number(e.target.value) })}>
                  <MenuItem value={0}>Any rating</MenuItem>
                  {[4, 3, 2, 1].map((r) => <MenuItem key={r} value={r}>{r} stars &amp; up</MenuItem>)}
                </TextField>

                <span className="filter-label">Reviews</span>
                <TextField select fullWidth size="small" value={filters.minReviews} onChange={(e) => setFilter({ minReviews: Number(e.target.value) })}>
                  <MenuItem value={0}>Any number of reviews</MenuItem>
                  <MenuItem value={1}>Has reviews (1+)</MenuItem>
                  <MenuItem value={3}>3+ reviews</MenuItem>
                  <MenuItem value={5}>5+ reviews</MenuItem>
                </TextField>

                <span className="filter-label">Platform</span>
                <TextField select fullWidth size="small" value={filters.platform} onChange={(e) => setFilter({ platform: e.target.value })} slotProps={{ select: { displayEmpty: true } }}>
                  <MenuItem value="">All platforms</MenuItem>
                  {PLATFORMS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                </TextField>

                <span className="filter-label">Sort by</span>
                <TextField select fullWidth size="small" value={filters.sort} onChange={(e) => setFilter({ sort: e.target.value })}>
                  <MenuItem value="newest">Newest</MenuItem>
                  <MenuItem value="price-asc">Price: low to high</MenuItem>
                  <MenuItem value="price-desc">Price: high to low</MenuItem>
                  <MenuItem value="rating">Top rated</MenuItem>
                </TextField>
              </div>
            </div>
          </div>

          {/* ---------- results ---------- */}
          <div className="col-12 col-lg-9">
            <Stack direction="row" useFlexGap sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 3, gap: 2 }}>
              <Stack direction="row" spacing={1.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <h2 className="page-title" style={{ margin: 0 }}>{title}</h2>
                <Chip label={`${productsCount} found`} color="primary" />
                {group && <Chip label={group} color={GROUP_COLOR[group]} onDelete={() => setParams({})} />}
              </Stack>
              <ToggleButtonGroup size="small" exclusive value={mode} onChange={(_, v) => v && setMode(v)} aria-label="list mode">
                <ToggleButton value="pagination">Pages</ToggleButton>
                <ToggleButton value="infinite">Infinite scroll</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            {loading ? <Loader /> : products.length === 0 ? (
              <div className="panel panel-cream" style={{ textAlign: 'center' }}>
                <Typography variant="h5">No products match your filters</Typography>
                <Button sx={{ mt: 2 }} variant="contained" onClick={reset}>Clear filters</Button>
              </div>
            ) : (
              <div className="row g-4">
                {products.map((p) => (
                  <div key={p._id} className="col-12 col-sm-6 col-xl-4"><Product product={p} /></div>
                ))}
              </div>
            )}

            {mode === 'pagination' && totalPages > 1 && !loading && (
              <Stack sx={{ alignItems: 'center', mt: 5 }}>
                <Pagination count={totalPages} page={page} onChange={onPageChange} shape="rounded" showFirstButton showLastButton />
              </Stack>
            )}

            {mode === 'infinite' && !loading && (
              <Box ref={sentinel} sx={{ py: 4, textAlign: 'center' }}>
                {loadingMore && <CircularProgress size={28} />}
                {!hasMore && products.length > 0 && <span className="sticker">You reached the end</span>}
              </Box>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

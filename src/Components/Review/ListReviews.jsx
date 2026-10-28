import { useState } from 'react'
import { Rating, Typography, ToggleButtonGroup, ToggleButton, Stack, Chip } from '@mui/material'

const ListReviews = ({ reviews = [], currentUserId }) => {
  const [star, setStar] = useState('all') // review filter: all | 5 | 4 | 3 | 2 | 1
  const shown = star === 'all' ? reviews : reviews.filter((r) => r.rating === Number(star))
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0
  const count = (n) => reviews.filter((r) => r.rating === n).length

  return (
    <div className="row g-4">
      {/* summary box */}
      <div className="col-12 col-md-4">
        <div className="rating-box">
          <div className="rating-big">{avg.toFixed(1)}</div>
          <Rating value={avg} precision={0.1} readOnly />
          <div className="mono" style={{ fontWeight: 700, fontSize: '0.8rem', margin: '4px 0 10px' }}>{reviews.length} REVIEW{reviews.length === 1 ? '' : 'S'}</div>
          {[5, 4, 3, 2, 1].map((n) => (
            <div key={n} className="dist-row">
              <span>{n}&#9733;</span>
              <div className="dist-track"><div className="dist-fill" style={{ width: reviews.length ? `${(count(n) / reviews.length) * 100}%` : 0 }} /></div>
              <span>{count(n)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* list */}
      <div className="col-12 col-md-8">
        <ToggleButtonGroup size="small" exclusive value={star} onChange={(_, v) => v && setStar(v)} aria-label="filter reviews by stars">
          <ToggleButton value="all">All</ToggleButton>
          {[5, 4, 3, 2, 1].map((n) => <ToggleButton key={n} value={String(n)}>{n}&#9733;</ToggleButton>)}
        </ToggleButtonGroup>

        {shown.length === 0 && <Typography className="muted" sx={{ py: 3, fontWeight: 600 }}>No reviews to show.</Typography>}
        {shown.map((r) => {
          const edited = r.updatedAt && r.createdAt && new Date(r.updatedAt) - new Date(r.createdAt) > 1000
          return (
            <div key={r._id} className="review-card">
              <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Rating value={r.rating} readOnly size="small" />
                <Typography variant="subtitle2">{r.name}</Typography>
                {String(r.user) === String(currentUserId) && <Chip size="small" color="primary" label="You" />}
                {edited && <Typography variant="caption" className="muted">(edited)</Typography>}
              </Stack>
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>{r.comment}</Typography>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ListReviews

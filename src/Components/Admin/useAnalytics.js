import { useEffect, useState } from 'react'
import api from '../../api'

// Fetches /admin/analytics/<endpoint> whenever the date range (or extra params) change
export default function useAnalytics(endpoint, range, extra = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const extraKey = JSON.stringify(extra)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api.get(`/admin/analytics/${endpoint}`, { params: { start: range.start || undefined, end: range.end || undefined, ...extra } })
      .then((r) => { if (alive) setData(r.data) })
      .catch(() => { if (alive) setData(null) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, range.start, range.end, extraKey])

  return { data, loading }
}

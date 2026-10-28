import { toast } from 'react-toastify'

export const errMsg = (message = '') => toast.error(message, { position: 'bottom-center' })
export const successMsg = (message = '') => toast.success(message, { position: 'bottom-center' })

// Local YYYY-MM-DD (not UTC, so "today" is correct for the user)
export const toISODate = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
export const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return toISODate(d) }
export const shortId = (id) => String(id).slice(-8).toUpperCase()

export const fileToPreview = (file) => URL.createObjectURL(file)

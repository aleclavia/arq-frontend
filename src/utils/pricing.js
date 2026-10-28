// KEEP IN SYNC with backend/utils/pricing.js (the server recomputes these anyway)
export const TAX_RATE = 0.12
export const STANDARD_SHIPPING = 20
export const FREE_SHIPPING_OVER = 1000
export const FREIGHT_SURCHARGE = 150

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

export const money = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const computeTotals = (items) => {
  const itemsPrice = round2(items.reduce((a, i) => a + i.price * i.quantity, 0))
  const freightUnits = items.reduce((a, i) => a + (i.isFreight ? i.quantity : 0), 0)
  const baseShipping = itemsPrice === 0 || itemsPrice >= FREE_SHIPPING_OVER ? 0 : STANDARD_SHIPPING
  const shippingPrice = round2(baseShipping + freightUnits * FREIGHT_SURCHARGE)
  const taxPrice = round2(itemsPrice * TAX_RATE)
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice)
  return { itemsPrice, taxPrice, shippingPrice, totalPrice, freightUnits }
}

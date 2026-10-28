import { useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from 'recharts'
import { ToggleButton, ToggleButtonGroup, Typography, Stack, CircularProgress, Box } from '@mui/material'
import useAnalytics from './useAnalytics'
import { money } from '../../utils/pricing'

const COLORS = ['#006199', '#FFD444', '#8ACFF8', '#F4EB6C', '#111111', '#e4572e', '#2e9e5b', '#7a8b99']
const INK = '#111111'
// slice labels are drawn in ink (not the slice colour) so light slices stay readable
const pieLabel = (withName) => ({ x, y, textAnchor, name, percent }) => (
  <text x={x} y={y} textAnchor={textAnchor} dominantBaseline="central" fill={INK} fontWeight={700} fontSize={12}>
    {withName ? `${name} ${percent}%` : `${percent}%`}
  </text>
)
const AXIS = { stroke: INK, fontSize: 12, fontWeight: 600 }
const tip = { contentStyle: { background: '#fff', border: '3px solid #111', borderRadius: 6, boxShadow: '4px 4px 0 #111', color: '#111' }, labelStyle: { color: '#111', fontWeight: 700 }, itemStyle: { color: '#111' } }

const ChartCard = ({ title, loading, empty, actions, children, height = 320 }) => (
  <div className="panel" style={{ height: '100%' }}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 1, gap: 1 }}>
      <Typography variant="h6">{title}</Typography>
      {actions}
    </Stack>
    <Box sx={{ height }}>
      {loading ? <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}><CircularProgress size={28} /></Box>
        : empty ? <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}><Typography className="muted">No sales in this date range.</Typography></Box>
          : children}
    </Box>
  </div>
)

// Quiz 2: sales chart (line or bar) driven by the dashboard date range
export const SalesTrendChart = ({ range }) => {
  const [type, setType] = useState('line')
  const [interval, setInterval] = useState('day')
  const { data, loading } = useAnalytics('sales', range, { interval })
  const rows = data?.sales || []
  const common = { data: rows, margin: { top: 8, right: 16, bottom: 0, left: 0 } }

  return (
    <ChartCard
      title="Sales over time" loading={loading} empty={!rows.some((r) => r.total > 0)} height={340}
      actions={
        <Stack direction="row" spacing={1}>
          <ToggleButtonGroup size="small" exclusive value={interval} onChange={(_, v) => v && setInterval(v)}>
            <ToggleButton value="day">Daily</ToggleButton><ToggleButton value="month">Monthly</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup size="small" exclusive value={type} onChange={(_, v) => v && setType(v)}>
            <ToggleButton value="line">Line</ToggleButton><ToggleButton value="bar">Bar</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart {...common}>
            <CartesianGrid stroke="rgba(17,17,17,.18)" strokeDasharray="4 4" />
            <XAxis dataKey="date" {...AXIS} minTickGap={24} /><YAxis {...AXIS} tickFormatter={(v) => `$${v}`} width={64} />
            <Tooltip {...tip} formatter={(v, n) => [n === 'total' ? money(v) : v, n === 'total' ? 'Sales' : 'Orders']} />
            <Line type="monotone" dataKey="total" stroke="#006199" strokeWidth={4} dot={rows.length < 40 ? { r: 5, fill: '#FFD444', stroke: INK, strokeWidth: 2 } : false} activeDot={{ r: 7, fill: '#FFD444', stroke: INK, strokeWidth: 3 }} />
          </LineChart>
        ) : (
          <BarChart {...common}>
            <CartesianGrid stroke="rgba(17,17,17,.18)" strokeDasharray="4 4" />
            <XAxis dataKey="date" {...AXIS} minTickGap={24} /><YAxis {...AXIS} tickFormatter={(v) => `$${v}`} width={64} />
            <Tooltip {...tip} formatter={(v) => [money(v), 'Sales']} />
            <Bar dataKey="total" fill="#006199" stroke={INK} strokeWidth={2} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </ChartCard>
  )
}

export const CustomerSalesChart = ({ range }) => {
  const { data, loading } = useAnalytics('customers', range)
  const rows = data?.customers || []
  return (
    <ChartCard title="Sales by customer" loading={loading} empty={!rows.length}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ left: 20, right: 16 }}>
          <CartesianGrid stroke="rgba(17,17,17,.18)" strokeDasharray="4 4" />
          <XAxis type="number" {...AXIS} tickFormatter={(v) => `$${v}`} /><YAxis type="category" dataKey="name" {...AXIS} width={100} />
          <Tooltip {...tip} formatter={(v) => [money(v), 'Total']} />
          <Bar dataKey="total" fill="#FFD444" stroke={INK} strokeWidth={2} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export const ProductSalesChart = ({ range }) => {
  const { data, loading } = useAnalytics('products', range)
  const rows = (data?.products || []).slice(0, 8)
  return (
    <ChartCard title="Sales % by product (top 8)" loading={loading} empty={!rows.length}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="percent" nameKey="name" outerRadius="75%" stroke={INK} strokeWidth={2} label={pieLabel(false)}>
            {rows.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip {...tip} formatter={(v, n) => [`${v}%`, n]} /><Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} formatter={(v) => <span style={{ color: INK }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

export const GroupSalesChart = ({ range }) => {
  const { data, loading } = useAnalytics('groups', range)
  const rows = data?.groups || []
  return (
    <ChartCard title="Sales % by platform category" loading={loading} empty={!rows.length}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="percent" nameKey="name" innerRadius="45%" outerRadius="75%" stroke={INK} strokeWidth={2} label={pieLabel(true)}>
            {rows.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip {...tip} formatter={(v, n) => [`${v}%`, n]} /><Legend wrapperStyle={{ fontSize: 13, fontWeight: 700 }} formatter={(v) => <span style={{ color: INK }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

import { createTheme } from '@mui/material/styles'

// Palette: #006199 deep blue, #8ACFF8 sky, #F4EB6C cream-yellow, #FFD444 gold. Ink = #111.
export const PALETTE = { blue: '#006199', sky: '#8ACFF8', cream: '#F4EB6C', gold: '#FFD444', ink: '#111111' }
const { blue, sky, cream, gold, ink } = PALETTE

const border = (w = 3) => `${w}px solid ${ink}`
const shadow = (n = 5) => `${n}px ${n}px 0 ${ink}`
const HEAD = '"Space Grotesk", "Inter", sans-serif'
const MONO = '"Space Mono", ui-monospace, monospace'

const GREEN = '#b9f0cf'
const RED = '#ffb3a7'

// IMPORTANT: colours that depend on variant + color live in `variants` (not in styleOverrides),
// because theme variants are applied last and always win over the base "root" override.
const chipVariants = [
  ['filled', 'primary', blue, '#fff'], ['filled', 'secondary', gold, ink], ['filled', 'success', GREEN, ink],
  ['filled', 'error', RED, ink], ['filled', 'warning', cream, ink], ['filled', 'info', sky, ink],
  ['outlined', 'primary', sky, ink], ['outlined', 'secondary', gold, ink], ['outlined', 'success', GREEN, ink],
  ['outlined', 'error', RED, ink], ['outlined', 'warning', cream, ink], ['outlined', 'info', sky, ink],
].map(([variant, color, bg, fg]) => ({
  props: { variant, color },
  style: { backgroundColor: bg, color: fg, '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: fg } },
}))

const buttonVariants = [
  { props: { variant: 'contained', color: 'primary' }, style: { backgroundColor: blue, color: '#fff', '&:hover': { backgroundColor: '#0a7bbd' } } },
  { props: { variant: 'contained', color: 'secondary' }, style: { backgroundColor: gold, color: ink, '&:hover': { backgroundColor: cream } } },
  { props: { variant: 'contained', color: 'error' }, style: { backgroundColor: '#e4572e', color: '#fff', '&:hover': { backgroundColor: '#f06a42' } } },
  { props: { variant: 'contained', color: 'success' }, style: { backgroundColor: '#2e9e5b', color: '#fff', '&:hover': { backgroundColor: '#38b56a' } } },
  { props: { variant: 'contained', color: 'info' }, style: { backgroundColor: sky, color: ink, '&:hover': { backgroundColor: '#a9dcfa' } } },
  { props: { variant: 'outlined' }, style: { backgroundColor: '#fff', color: ink, '&:hover': { backgroundColor: sky } } },
  {
    props: { variant: 'text' },
    style: { backgroundColor: 'transparent', color: ink, borderColor: 'transparent', boxShadow: 'none', '&:hover': { transform: 'none', boxShadow: 'none', backgroundColor: sky, borderColor: ink } },
  },
]

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: blue, contrastText: '#ffffff' },
    secondary: { main: gold, contrastText: ink },
    info: { main: sky, contrastText: ink },
    warning: { main: cream, contrastText: ink },
    success: { main: '#2e9e5b', contrastText: '#ffffff' },
    error: { main: '#e4572e', contrastText: '#ffffff' },
    background: { default: '#eaf6fe', paper: '#ffffff' },
    text: { primary: ink, secondary: '#3b4a57' },
    divider: ink,
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 },
    h2: { fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1.05 },
    h3: { fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em' },
    h4: { fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.05 },
    h5: { fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em' },
    h6: { fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontFamily: MONO, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.75rem' },
    overline: { fontFamily: MONO, fontWeight: 700, letterSpacing: '0.1em' },
    button: { fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: {
          border: border(3), borderRadius: 0, boxShadow: shadow(5), color: ink, backgroundColor: '#fff',
          transition: 'transform .08s, box-shadow .08s, background-color .08s',
          '&:hover': { transform: 'translate(-2px,-2px)', boxShadow: shadow(7) },
          '&:active': { transform: 'translate(5px,5px)', boxShadow: '0 0 0 ' + ink },
          '&.Mui-disabled': { borderColor: '#7d8a94', boxShadow: 'none', color: '#5b6872', backgroundColor: '#e6ebee' },
        },
        sizeSmall: { borderWidth: 2, boxShadow: shadow(3), fontSize: '0.75rem' },
        sizeLarge: { fontSize: '1rem', padding: '10px 26px' },
      },
      variants: buttonVariants,
    },
    MuiIconButton: { styleOverrides: { root: { color: ink, borderRadius: 0, '&:hover': { backgroundColor: sky } } } },
    MuiCard: { styleOverrides: { root: { backgroundImage: 'none', border: border(4), boxShadow: shadow(7), borderRadius: 0, backgroundColor: '#fff' } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', borderRadius: 0 } } },
    MuiPopover: { styleOverrides: { paper: { border: border(3), boxShadow: shadow(6), borderRadius: 0 } } },
    MuiAutocomplete: { styleOverrides: { paper: { border: border(3), boxShadow: shadow(6), borderRadius: 0 } } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff', borderRadius: 0, boxShadow: shadow(3),
          '& .MuiOutlinedInput-notchedOutline': { borderWidth: 3, borderColor: ink },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: ink },
          '&.Mui-focused': { boxShadow: shadow(5), backgroundColor: '#fffdf0' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 3, borderColor: blue },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: '#e4572e' },
          '&.Mui-disabled': { boxShadow: 'none', backgroundColor: '#eef1f3' },
        },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { color: '#3b4a57', fontWeight: 600, '&.Mui-focused': { color: blue } } } },
    MuiFormHelperText: { styleOverrides: { root: { fontWeight: 500, marginLeft: 2 } } },
    MuiChip: {
      styleOverrides: {
        root: { border: border(2), borderRadius: 0, fontFamily: MONO, fontWeight: 700, fontSize: '0.72rem', backgroundColor: '#fff', color: ink },
        sizeMedium: { fontSize: '0.8rem' },
      },
      variants: chipVariants,
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: border(3), color: ink, backgroundColor: '#fff', fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', borderRadius: 0,
          '&:hover': { backgroundColor: sky },
          '&.Mui-selected': { backgroundColor: gold, color: ink, '&:hover': { backgroundColor: cream } },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: { root: { boxShadow: shadow(4), borderRadius: 0, '& .MuiToggleButtonGroup-grouped': { borderRadius: 0 }, '& .MuiToggleButtonGroup-grouped:not(:first-of-type)': { marginLeft: -3, borderLeft: border(3) } } },
    },
    MuiAlert: {
      styleOverrides: { root: { border: border(3), boxShadow: shadow(4), borderRadius: 0, fontWeight: 600, color: ink }, icon: { color: ink } },
      variants: [
        { props: { variant: 'standard', severity: 'info' }, style: { backgroundColor: sky, '& .MuiAlert-icon': { color: ink } } },
        { props: { variant: 'standard', severity: 'warning' }, style: { backgroundColor: cream, '& .MuiAlert-icon': { color: ink } } },
        { props: { variant: 'standard', severity: 'success' }, style: { backgroundColor: GREEN, '& .MuiAlert-icon': { color: ink } } },
        { props: { variant: 'standard', severity: 'error' }, style: { backgroundColor: RED, '& .MuiAlert-icon': { color: ink } } },
      ],
    },
    MuiBadge: { styleOverrides: { badge: { border: border(2), fontFamily: MONO, fontWeight: 700 } } },
    MuiAvatar: { styleOverrides: { root: { border: border(2) } } },
    MuiDivider: { styleOverrides: { root: { borderColor: ink, borderBottomWidth: 3 } } },
    MuiTableCell: { styleOverrides: { root: { borderBottom: '2px solid ' + ink, color: ink } } },
    MuiSlider: {
      styleOverrides: {
        rail: { backgroundColor: ink, opacity: 1, height: 6, borderRadius: 0 },
        track: { backgroundColor: blue, border: border(2), height: 8, borderRadius: 0 },
        thumb: { backgroundColor: gold, border: border(3), borderRadius: 0, width: 20, height: 20, boxShadow: shadow(2), '&:hover, &.Mui-focusVisible': { boxShadow: shadow(4) } },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: { border: border(3), borderRadius: 0, fontFamily: MONO, fontWeight: 700, backgroundColor: '#fff', '&:hover': { backgroundColor: sky }, '&.Mui-selected': { backgroundColor: blue, color: '#fff', '&:hover': { backgroundColor: blue } } },
      },
    },
    MuiStepIcon: { styleOverrides: { root: { color: '#fff', border: '3px solid ' + ink, borderRadius: '50%', '& .MuiStepIcon-text': { fill: ink, fontWeight: 700 }, '&.Mui-active': { color: gold }, '&.Mui-completed': { color: blue } } } },
    MuiStepConnector: { styleOverrides: { line: { borderTopWidth: 4, borderColor: ink } } },
    MuiStepLabel: { styleOverrides: { label: { fontFamily: MONO, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', color: ink, '&.Mui-active': { fontWeight: 700, color: ink }, '&.Mui-completed': { fontWeight: 700, color: ink } } } },
    MuiMenuItem: { styleOverrides: { root: { fontWeight: 600, '&:hover': { backgroundColor: sky }, '&.Mui-selected': { backgroundColor: cream } } } },
    MuiCheckbox: { styleOverrides: { root: { color: ink, '&.Mui-checked': { color: blue } } } },
    MuiSwitch: { styleOverrides: { track: { backgroundColor: ink, opacity: 0.35 }, switchBase: { '&.Mui-checked': { color: blue } } } },
    MuiRating: { styleOverrides: { iconFilled: { color: '#f5a300' }, iconEmpty: { color: '#c9ced3' } } },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '--DataGrid-t-color-background-base': '#ffffff',
          '--DataGrid-t-header-background-base': gold,
          '--DataGrid-t-color-border-base': ink,
          '--DataGrid-rowBorderColor': 'rgba(17,17,17,.25)',
          border: border(4), borderRadius: 0, boxShadow: shadow(8), color: ink, fontWeight: 500,
          '& [class*="MuiDataGrid-columnHeader"], & [class*="MuiDataGrid-filler"], & [class*="MuiDataGrid-scrollbarFiller"]': { backgroundColor: gold },
          '& .MuiDataGrid-columnHeaders': { borderBottom: border(4) },
          '& .MuiDataGrid-columnHeaderTitle': { fontFamily: HEAD, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' },
          '& .MuiDataGrid-footerContainer': { borderTop: border(4), backgroundColor: cream },
          '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(138,207,248,.35)' },
          '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover': { backgroundColor: 'rgba(255,212,68,.45)' },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': { outline: 'none' },
        },
      },
    },
  },
})

export default theme

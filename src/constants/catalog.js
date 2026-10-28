// KEEP IN SYNC with backend/constants/catalog.js
export const CATEGORY_GROUP = {
  'VR Headsets': 'VR',
  'Motion Controllers': 'VR',
  'Base Stations & Trackers': 'VR',
  'Haptic Wearables': 'VR',
  'Racing Wheels': 'Racing',
  'Pedals': 'Racing',
  'Shifters & Handbrakes': 'Racing',
  'Motion Platforms': 'Racing',
  'Rig Frames & Mounts': 'Racing',
  'Flight Sticks & Throttles': 'Flight',
}
export const CATEGORIES = Object.keys(CATEGORY_GROUP)
export const GROUPS = ['VR', 'Racing', 'Flight']
export const PLATFORMS = ['PC / SteamVR', 'Standalone (Android)', 'PlayStation / PSVR2', 'Xbox']
export const CONNECTION_TYPES = ['USB', 'Bluetooth', 'Proprietary Wireless', 'DisplayPort / HDMI', 'Wi-Fi']
export const PLAY_SPACES = ['None', 'Seated', 'Standing', 'Room-scale']
export const AVAILABILITY = ['in-stock', 'pre-order', 'backordered']
export const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered']

// Suggested spec keys per category (shown as hints in the admin form)
export const SPEC_HINTS = {
  'VR Headsets': ['Resolution', 'Refresh rate', 'Tracking'],
  'Racing Wheels': ['Peak torque', 'Force feedback', 'Rim diameter'],
  'Flight Sticks & Throttles': ['Axes', 'Buttons', 'Gimbal'],
  'Motion Platforms': ['Degrees of freedom', 'Max payload'],
  'Pedals': ['Brake load', 'Pedal count'],
}

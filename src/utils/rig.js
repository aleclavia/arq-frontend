// Compatibility checks for the "rig list". Returns [{ severity: 'warning'|'info', message }]
export const checkRig = (items, spaceConfirmed) => {
  const out = []
  if (!items.length) return out

  // 1. Platform: every item that declares platforms must share at least one common platform
  const withPlatforms = items.filter((i) => i.platforms?.length)
  if (withPlatforms.length > 1) {
    const common = withPlatforms.reduce((acc, i) => acc.filter((p) => i.platforms.includes(p)), withPlatforms[0].platforms)
    if (!common.length) {
      out.push({
        severity: 'warning',
        message: `These items do not share a common platform: ${withPlatforms.map((i) => `${i.name} (${i.platforms.join(', ')})`).join(' | ')}`,
      })
    }
  }

  // 2. Mounting: wheel bases / pedals / shifters vs rig frame bolt patterns
  const frames = items.filter((i) => i.category === 'Rig Frames & Mounts' && i.supportedMountPatterns?.length)
  const mounted = items.filter((i) => i.mountPattern && i.category !== 'Rig Frames & Mounts')
  frames.forEach((f) =>
    mounted.forEach((m) => {
      if (!f.supportedMountPatterns.includes(m.mountPattern)) {
        out.push({ severity: 'warning', message: `${m.name} needs a "${m.mountPattern}" mount, which ${f.name} does not list as supported.` })
      }
    })
  )
  if (mounted.length && !items.some((i) => i.category === 'Rig Frames & Mounts')) {
    out.push({ severity: 'info', message: 'Tip: add a rig frame or mount so your wheel, pedals and shifter have something to bolt to.' })
  }

  // 3. Play space must be confirmed for standing / room-scale VR
  const needsSpace = items.filter((i) => ['Standing', 'Room-scale'].includes(i.playSpace))
  if (needsSpace.length && !spaceConfirmed) {
    out.push({
      severity: 'warning',
      message: `${needsSpace.map((i) => `${i.name} (${i.playSpace})`).join(', ')} needs a confirmed play space. Tick the confirmation below once you have measured yours.`,
    })
  }

  // 4. Trackers without a headset
  const hasHeadset = items.some((i) => i.category === 'VR Headsets')
  if (!hasHeadset && items.some((i) => ['Base Stations & Trackers', 'Motion Controllers'].includes(i.category))) {
    out.push({ severity: 'info', message: 'Base stations / controllers are in your list but no VR headset is.' })
  }

  // 5. Freight
  if (items.some((i) => i.isFreight)) {
    out.push({ severity: 'info', message: 'Your rig includes oversized items that ship by freight (surcharge applies at checkout).' })
  }
  return out
}

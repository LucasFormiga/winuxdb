import type { UserDevice } from '../types'

export function parseSteamSystemInfo(text: string): Partial<UserDevice> {
  const info: Partial<UserDevice> = {}

  // 1. Extract Distro and Version
  const osLineMatch = text.match(/Operating System Version:\s+([^\n]+)/)
  if (osLineMatch) {
    const rawLine = osLineMatch[1].split(' (')[0].replace(/"/g, '').trim()
    const parts = rawLine.split(' ')
    const versionIndex = parts.findIndex(p => /^[0-9]/.test(p))
    if (versionIndex !== -1) {
      info.distro = parts.slice(0, versionIndex).join(' ')
      info.distroVersion = parts[versionIndex]
    } else {
      info.distro = rawLine
    }
  }

  // 2. Extract Desktop Environment
  const deMatch = text.match(/Desktop Environment:\s+([^\n]+)/)
  if (deMatch) {
    info.de = deMatch[1].trim()
  }

  // 3. Extract Kernel Name and Version
  const kernelNameMatch = text.match(/Kernel Name:\s+([^\n]+)/)
  if (kernelNameMatch) {
    info.kernel = kernelNameMatch[1].trim()
  }
  const kernelVersionMatch = text.match(/Kernel Version:\s+([^\n]+)/)
  if (kernelVersionMatch) {
    info.kernelVersion = kernelVersionMatch[1].trim()
  }

  // 4. Extract CPU
  const cpuMatch = text.match(/CPU Brand:\s+([^\n]+)/)
  if (cpuMatch) {
    info.cpu = cpuMatch[1].trim()
  }

  // 5. Extract GPU and Driver
  const gpuMatch = text.match(/Driver:\s+([^\n/]+)/)
  if (gpuMatch) {
    info.gpu = gpuMatch[1].replace('NVIDIA Corporation ', '').trim()
  }

  const driverVersionMatch = text.match(/Driver Version:\s+([^\n]+)/)
  if (driverVersionMatch) {
    const rawVersion = driverVersionMatch[1].trim()
    // Extract all potential version strings
    const versions = rawVersion.match(/(\d+\.\d+\.\d+)/g)
    if (versions && versions.length > 0) {
      // Usually the last one is the actual driver version (e.g. 525.85.05 vs 4.6.0)
      info.gpuDriver = versions[versions.length - 1]
    } else {
      const parts = rawVersion.split(' ')
      info.gpuDriver = parts[parts.length - 1]
    }
  }

  // 6. Extract RAM
  const ramMatch = text.match(/RAM:\s+(\d+)\s+M[bB]/i)
  if (ramMatch) {
    const ramMb = Number.parseInt(ramMatch[1], 10)
    const ramGb = Math.round(ramMb / 1024)
    info.ram = `${ramGb}GB`
  }

  return info
}

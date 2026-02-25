import type { UserDevice } from '../types'

export function parseSteamSystemInfo(text: string): Partial<UserDevice> {
  const info: Partial<UserDevice> = {}

  // Extract Distro and Version
  // Pattern example: Operating System Version: CachyOS Linux (64 bit)
  const distroMatch = text.match(/Operating System Version:\s+([^\n(]+)/)
  if (distroMatch) {
    info.distro = distroMatch[1].trim()
  }

  // Extract Kernel Name and Version
  const kernelNameMatch = text.match(/Kernel Name:\s+([^\n]+)/)
  if (kernelNameMatch) {
    info.kernel = kernelNameMatch[1].trim()
  }
  const kernelVersionMatch = text.match(/Kernel Version:\s+([^\n]+)/)
  if (kernelVersionMatch) {
    info.kernelVersion = kernelVersionMatch[1].trim()
  }

  // Extract CPU
  const cpuMatch = text.match(/CPU Brand:\s+([^\n]+)/)
  if (cpuMatch) {
    info.cpu = cpuMatch[1].trim()
  }

  // Extract GPU and Driver
  // Pattern example: Driver: NVIDIA Corporation GeForce RTX 3060 Laptop GPU/PCIe/SSE2
  const gpuMatch = text.match(/Driver:\s+([^\n/]+)/)
  if (gpuMatch) {
    info.gpu = gpuMatch[1].trim()
  }

  const driverVersionMatch = text.match(/Driver Version:\s+([^\n]+)/)
  if (driverVersionMatch) {
    const versionMatch = driverVersionMatch[1].match(/(\d+\.\d+\.\d+)/)
    info.gpuDriver = versionMatch ? versionMatch[1] : driverVersionMatch[1].trim()
  }

  // Extract RAM
  // Pattern example: RAM: 15286 Mb
  const ramMatch = text.match(/RAM:\s+(\d+)\s+Mb/)
  if (ramMatch) {
    const ramMb = Number.parseInt(ramMatch[1], 10)
    const ramGb = Math.round(ramMb / 1024)
    info.ram = `${ramGb}GB`
  }

  return info
}

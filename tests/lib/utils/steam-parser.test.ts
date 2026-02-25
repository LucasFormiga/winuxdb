import { describe, it, expect } from 'vitest'
import { parseSteamSystemInfo } from '@/lib/utils/steam-parser'

describe('steam-parser', () => {
  it('parses basic system info correctly', () => {
    const input = `
      Operating System Version:
          "Pop!_OS 22.04 LTS" (64 bit)
          Kernel Name:  Linux
          Kernel Version:  6.2.6-76060206-generic
          Desktop Environment:  GNOME
      
      Processor Information:
          CPU Brand:  AMD Ryzen 9 5900HS with Radeon Graphics
      
      Video Card:
          Driver:  NVIDIA Corporation NVIDIA GeForce RTX 3060 Laptop GPU/PCIe/SSE2
          Driver Version:  4.6.0 NVIDIA 525.85.05
      
      Memory:
          RAM:  15842 MB
    `
    const result = parseSteamSystemInfo(input)
    
    expect(result.distro).toBe('Pop!_OS')
    expect(result.distroVersion).toBe('22.04')
    expect(result.kernel).toBe('Linux')
    expect(result.kernelVersion).toBe('6.2.6-76060206-generic')
    expect(result.cpu).toBe('AMD Ryzen 9 5900HS with Radeon Graphics')
    expect(result.gpu).toBe('NVIDIA GeForce RTX 3060 Laptop GPU')
    expect(result.gpuDriver).toBe('525.85.05')
    expect(result.ram).toBe('15GB')
    expect(result.de).toBe('GNOME')
  })

  it('handles empty input gracefully', () => {
    const result = parseSteamSystemInfo('')
    expect(result).toEqual({})
  })

  it('handles distro without version and non-semantic driver', () => {
    const input = `
      Operating System Version:
          "Arch Linux" (64 bit)
      Video Card:
          Driver Version:  NVIDIA Proprietary
    `
    const result = parseSteamSystemInfo(input)
    expect(result.distro).toBe('Arch Linux')
    expect(result.distroVersion).toBeUndefined()
    expect(result.gpuDriver).toBe('Proprietary')
  })
})

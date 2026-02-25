import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DevicesSection from '@/components/organisms/DevicesSection'

// Mocks are in setup.ts

vi.mock('@/lib/actions/devices', () => ({
  addDevice: vi.fn(),
  updateDevice: vi.fn(),
  deleteDevice: vi.fn()
}))

// Mock DeviceWizard because it's complex and tested elsewhere
vi.mock('./DeviceWizard', () => ({
  default: () => <div data-testid="device-wizard" />
}))

const mockDevices = [
  {
    id: 'dev-1',
    name: 'Main PC',
    distro: 'Fedora',
    distro_version: '39',
    cpu: 'Intel i7',
    ram: '32GB',
    is_primary: true
  },
  {
    id: 'dev-2',
    name: 'Laptop',
    distro: 'Ubuntu',
    distro_version: '22.04',
    cpu: 'AMD Ryzen 5',
    ram: '16GB',
    is_primary: false
  }
]

describe('DevicesSection', () => {
  it('renders list of devices correctly', () => {
    render(<DevicesSection initialDevices={mockDevices as any} />)
    
    expect(screen.getByText('Main PC')).toBeInTheDocument()
    expect(screen.getByText('Laptop')).toBeInTheDocument()
    expect(screen.getByText('AccountDevices.primary')).toBeInTheDocument()
  })

  it('shows empty state when no devices', () => {
    render(<DevicesSection initialDevices={[]} />)
    expect(screen.getByText('AccountDevices.noDevices')).toBeInTheDocument()
  })
})

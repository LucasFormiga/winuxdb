import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SmoothScroll from '@/components/atoms/SmoothScroll'

describe('SmoothScroll', () => {
  const addListenerSpy = vi.spyOn(document, 'addEventListener')
  const removeListenerSpy = vi.spyOn(document, 'removeEventListener')

  beforeEach(() => {
    addListenerSpy.mockClear()
    removeListenerSpy.mockClear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('registers and cleans up click handler', () => {
    const { unmount } = render(<SmoothScroll />)
    expect(addListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
    unmount()
    expect(removeListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
  })

  it('smooth scrolls matching anchor links', () => {
    render(
      <>
        <SmoothScroll />
        <a href="#target">Go</a>
        <div id="target" />
      </>
    )

    const anchor = document.querySelector('a') as HTMLAnchorElement
    const target = document.querySelector('#target') as HTMLElement
    if (!('scrollIntoView' in target)) {
      Object.defineProperty(target, 'scrollIntoView', {
        value: () => undefined,
        writable: true
      })
    }
    const scrollSpy = vi.spyOn(target, 'scrollIntoView')
    const pushStateSpy = vi.spyOn(window.history, 'pushState')

    anchor.click()

    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' })
    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '#target')
  })
})

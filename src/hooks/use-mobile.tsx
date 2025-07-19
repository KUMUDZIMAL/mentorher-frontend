import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const DESKTOP_BREAKPOINT = 1280

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useResponsive() {
  const [screenSize, setScreenSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      handleResize() // Set initial size
      
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isMobile = screenSize.width < MOBILE_BREAKPOINT
  const isTablet = screenSize.width >= MOBILE_BREAKPOINT && screenSize.width < TABLET_BREAKPOINT
  const isDesktop = screenSize.width >= TABLET_BREAKPOINT
  const isLargeDesktop = screenSize.width >= DESKTOP_BREAKPOINT

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isSmallScreen: isMobile || isTablet,
  }
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop' | 'large'>('desktop')

  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < MOBILE_BREAKPOINT) {
        setBreakpoint('mobile')
      } else if (width < TABLET_BREAKPOINT) {
        setBreakpoint('tablet')
      } else if (width < DESKTOP_BREAKPOINT) {
        setBreakpoint('desktop')
      } else {
        setBreakpoint('large')
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      handleResize() // Set initial breakpoint
      
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return breakpoint
}

export function useOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait')

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('orientationchange', handleOrientationChange)
      window.addEventListener('resize', handleOrientationChange)
      handleOrientationChange() // Set initial orientation
      
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange)
        window.removeEventListener('resize', handleOrientationChange)
      }
    }
  }, [])

  return orientation
}

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return scrollPosition
}

export function useViewport() {
  const [viewport, setViewport] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  React.useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      handleResize() // Set initial viewport
      
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return viewport
}

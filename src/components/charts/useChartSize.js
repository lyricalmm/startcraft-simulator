import { useEffect, useRef, useState } from 'react'

export function useChartSize(defaultWidth = 320, defaultHeight = 240) {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight })

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const updateSize = () => {
      const rect = element.getBoundingClientRect()
      setSize({
        width: Math.max(240, Math.floor(rect.width || defaultWidth)),
        height: Math.max(220, Math.floor(rect.height || defaultHeight)),
      })
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(element)

    return () => observer.disconnect()
  }, [defaultHeight, defaultWidth])

  return [ref, size]
}

"use client"

import { useEffect, useState } from 'react'

type ToastProps = {
  message: string
  duration?: number
  onClose: () => void
}

export default function Toast({ message, duration = 2500, onClose }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false)
  const EXIT_DURATION = 200 // ms - must match .animate-slide-up duration

  useEffect(() => {
    // Start the closing animation when duration elapses
    const startClose = setTimeout(() => setIsClosing(true), duration)
    // After the exit animation finishes, notify parent to unmount
    const finish = setTimeout(() => onClose(), duration + EXIT_DURATION)

    return () => {
      clearTimeout(startClose)
      clearTimeout(finish)
    }
  }, [duration, onClose])

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 ${isClosing ? 'animate-slide-up' : 'animate-slide-down'}`}
      aria-live="polite"
    >
      <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-sm font-medium">{message}</div>
        <div className="mt-2 w-full bg-white/20 rounded-full h-1 overflow-hidden">
          <div
            className="progress-fill"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  )
}

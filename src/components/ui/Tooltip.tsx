'use client'

import { useState, ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom'
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          role="tooltip"
          className={`absolute z-50 px-3 py-1.5 text-white pointer-events-none ${
            position === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
          style={{
            background: '#1a1a2e',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 500,
            lineHeight: 1.5,
            maxWidth: '160px',
            textAlign: 'center',
            whiteSpace: 'normal',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          }}
        >
          {content}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
            style={
              position === 'top'
                ? {
                    top: '100%',
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '5px solid #1a1a2e',
                  }
                : {
                    bottom: '100%',
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderBottom: '5px solid #1a1a2e',
                  }
            }
          />
        </div>
      )}
    </div>
  )
}

interface OpponentHandProps {
  name: string
  tileCount: number
  isActive: boolean
  position: 'left' | 'right' | 'top'
}

export default function OpponentHand({ name, tileCount, isActive, position }: OpponentHandProps) {
  const dotClass = [
    'w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300',
    isActive ? 'bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.5)]' : 'bg-white/20',
  ].join(' ')

  const nameClass = `text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/35'}`
  const countClass = 'text-white/20 text-[9px]'

  const tileColor = isActive ? '#6aaa7a' : '#4a7c59'
  const tileOpacity = isActive ? 1 : 0.4

  if (position === 'top') {
    // Horizontal row of tile backs, mirrored
    return (
      <div className="flex flex-col items-center gap-1.5 transition-opacity duration-300" style={{ transform: 'rotate(180deg)' }}>
        <div className="flex gap-[2px] items-end">
          {Array.from({ length: Math.min(tileCount, 13) }).map((_, i) => (
            <div
              key={i}
              className="w-[9px] h-[14px] rounded-[2px] flex-shrink-0 transition-all duration-300"
              style={{ backgroundColor: tileColor, opacity: tileOpacity }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={dotClass} />
          <span className={nameClass}>{name}</span>
          <span className={countClass}>{tileCount}</span>
        </div>
      </div>
    )
  }

  // Left or right: true vertical column — no rotation, just stacked rects
  return (
    <div className="flex flex-col items-center gap-2 transition-opacity duration-300">
      {/* Vertical tile backs */}
      <div className="flex flex-col gap-[2px]">
        {Array.from({ length: Math.min(tileCount, 13) }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2px] flex-shrink-0 transition-all duration-300"
            style={{
              width: 14,
              height: 10,
              backgroundColor: tileColor,
              opacity: tileOpacity,
            }}
          />
        ))}
      </div>

      {/* Name + indicator, rotated text */}
      <div className="flex flex-col items-center gap-1">
        <div className={dotClass} />
        <span
          className={nameClass}
          style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)', letterSpacing: '0.03em' }}
        >
          {name}
        </span>
        <span className={countClass}>{tileCount}</span>
      </div>
    </div>
  )
}

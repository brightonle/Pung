interface OpponentHandProps {
  name: string
  tileCount: number
  isActive: boolean
  position: 'left' | 'right' | 'top'
}

export default function OpponentHand({ name, tileCount, isActive, position }: OpponentHandProps) {
  const rotation =
    position === 'left' ? 'rotate(90deg)' :
    position === 'right' ? 'rotate(-90deg)' :
    'rotate(180deg)'

  return (
    <div
      className="flex flex-col items-center gap-1.5"
      style={{ transform: rotation }}
    >
      {/* Compact tile-back stack — purely decorative, shows count */}
      <div className="flex gap-[2px] items-end">
        {Array.from({ length: Math.min(tileCount, 13) }).map((_, i) => (
          <div
            key={i}
            className="w-[9px] h-[14px] rounded-[2px] flex-shrink-0"
            style={{ backgroundColor: '#4a7c59', opacity: isActive ? 0.9 : 0.45 }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-white' : 'bg-white/20'}`} />
        <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-white/40'}`}>{name}</span>
        <span className="text-white/20 text-[10px]">{tileCount}</span>
      </div>
    </div>
  )
}

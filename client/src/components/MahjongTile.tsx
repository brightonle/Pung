import { TILE_SVG_INNER, TILE_TEXT_CONTENT } from '../assets/tile-svgs'
import type { Suit } from '../types'

interface MahjongTileProps {
  suit: Suit
  value: number | string
  faceDown?: boolean
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
  scale?: number
  className?: string
}

export default function MahjongTile({
  suit,
  value,
  faceDown = false,
  selected = false,
  disabled = false,
  onClick,
  scale = 1,
  className = '',
}: MahjongTileProps) {
  const key = `${suit}-${value}`

  const tileStyle: React.CSSProperties = scale !== 1
    ? { transform: `scale(${scale})`, transformOrigin: 'center bottom' }
    : {}

  const baseClasses = [
    'relative w-[68px] h-[90px] rounded-[11px] overflow-hidden flex items-center justify-center flex-shrink-0',
    'transition-all duration-100 select-none',
    disabled ? 'opacity-40 cursor-not-allowed' : onClick ? 'cursor-pointer' : 'cursor-default',
    selected ? '-translate-y-2 ring-2 ring-white/50 shadow-[0_0_14px_rgba(255,255,255,0.35)]' : '',
    !disabled && !selected && onClick ? 'hover:-translate-y-1 active:translate-y-0' : '',
    className,
  ].filter(Boolean).join(' ')

  if (faceDown) {
    return (
      <div
        className={baseClasses}
        style={{ ...tileStyle, backgroundColor: '#4a7c59' }}
        onClick={!disabled ? onClick : undefined}
      >
        {/* subtle diamond grid pattern */}
        <svg width="68" height="90" viewBox="0 0 68 90" className="absolute inset-0 opacity-20">
          <defs>
            <pattern id="diamond" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M6 0 L12 6 L6 12 L0 6Z" fill="none" stroke="#5a9068" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="68" height="90" fill="url(#diamond)"/>
        </svg>
      </div>
    )
  }

  const svgInner = TILE_SVG_INNER[key]
  const textContent = TILE_TEXT_CONTENT[key]

  return (
    <div
      className={`${baseClasses} bg-white`}
      style={tileStyle}
      onClick={!disabled ? onClick : undefined}
    >
      {svgInner ? (
        <svg
          width="68"
          height="90"
          viewBox="0 0 68 90"
          dangerouslySetInnerHTML={{ __html: svgInner }}
        />
      ) : textContent ? (
        <div className="flex flex-col items-center justify-center gap-[3px]">
          <span
            style={{
              fontSize: textContent.primarySize,
              fontWeight: 700,
              color: textContent.primaryColor,
              lineHeight: 1,
            }}
          >
            {textContent.primary}
          </span>
          {textContent.secondary && (
            <span
              style={{
                fontSize: textContent.secondarySize ?? 14,
                fontWeight: 600,
                color: textContent.secondaryColor ?? textContent.primaryColor,
                lineHeight: 1,
              }}
            >
              {textContent.secondary}
            </span>
          )}
        </div>
      ) : (
        <div className="text-gray-400 text-xs">{key}</div>
      )}
    </div>
  )
}

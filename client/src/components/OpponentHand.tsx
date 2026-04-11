import MahjongTile from './MahjongTile'
import type { Tile, Meld } from '../types'

interface OpponentHandProps {
  name: string
  tileCount: number
  melds: Meld[]
  flowerTiles: Tile[]
  isActive: boolean
  position: 'left' | 'right' | 'top'
}

function TileCell({
  suit, value, scale = 0.26, faceDown = false,
}: {
  suit: Tile['suit']; value: Tile['value']; scale?: number; faceDown?: boolean
}) {
  const w = Math.round(68 * scale)
  const h = Math.round(90 * scale)
  return (
    <div style={{ width: w, height: h, overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 68, height: 90 }}>
        <MahjongTile suit={suit} value={value} faceDown={faceDown} />
      </div>
    </div>
  )
}

function StripContent({
  name, tileCount, melds, flowerTiles, isActive,
}: Omit<OpponentHandProps, 'position'>) {
  const tileColor   = isActive ? '#6aaa7a' : '#4a7c59'
  const tileOpacity = isActive ? 1 : 0.4

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>

      {/* Melds — toward board center after rotation */}
      {melds.length > 0 && (
        <div style={{ display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center' }}>
          {melds.map((meld, i) => (
            <div key={i} style={{ display: 'flex', gap: 1 }}>
              {meld.tiles.map((tile, j) => (
                <TileCell key={j} suit={tile.suit} value={tile.value} scale={0.26}
                  faceDown={meld.type === 'concealed-kong' && (j === 0 || j === 3)} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Hand strip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
        {/* Dot + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            backgroundColor: isActive ? '#fff' : 'rgba(255,255,255,0.22)',
            boxShadow: isActive ? '0 0 5px 2px rgba(255,255,255,0.45)' : 'none',
            transition: 'all 0.3s',
          }} />
          <span style={{
            fontSize: 9, fontWeight: 500, flexShrink: 0,
            color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
            transition: 'color 0.3s',
          }}>{name}</span>
        </div>

        {/* Portrait tile backs: 9 wide × 14 tall */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 0 }}>
          {Array.from({ length: Math.min(tileCount, 13) }).map((_, i) => (
            <div key={i} style={{
              width: 9, height: 14, borderRadius: 2, flexShrink: 0,
              backgroundColor: tileColor, opacity: tileOpacity,
              transition: 'background-color 0.3s, opacity 0.3s',
            }} />
          ))}
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', marginLeft: 1 }}>{tileCount}</span>
        </div>

        {/* Flower tiles */}
        {flowerTiles.length > 0 && (
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {flowerTiles.map((t) => <TileCell key={t.id} suit={t.suit} value={t.value} scale={0.24} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function OpponentHand({
  name, tileCount, melds, flowerTiles, isActive, position,
}: OpponentHandProps) {
  if (position === 'top') {
    return (
      <div style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
        <StripContent name={name} tileCount={tileCount} melds={melds} flowerTiles={flowerTiles} isActive={isActive} />
      </div>
    )
  }

  // left/right: same strip, rotated 90°/-90° for positioning
  const STRIP_H    = 14 + 8   // tile height (14) + buffer
  const MELD_ROW_H = 24
  const panelW     = STRIP_H + (melds.length > 0 ? MELD_ROW_H + 4 : 0)
  const PANEL_LEN  = 360

  const rotation = position === 'left' ? 'rotate(90deg)' : 'rotate(-90deg)'

  return (
    <div style={{ width: panelW, height: PANEL_LEN, position: 'relative', flexShrink: 0 }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) ${rotation}`,
        display: 'inline-flex',
      }}>
        <StripContent name={name} tileCount={tileCount} melds={melds} flowerTiles={flowerTiles} isActive={isActive} />
      </div>
    </div>
  )
}

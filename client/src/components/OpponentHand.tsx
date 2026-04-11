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

// Unified strip layout — same structure for all positions, rotation applied externally.
//
// Natural (pre-rotation) flex-col:
//   [melds row]   ← natural TOP  → becomes "toward center" after each position's rotation
//   [hand strip]  ← natural BOTTOM → becomes "toward edge"
//
// Rotation mapping:
//   top   rotate(180deg) : natural top → screen bottom (toward center) ✓  tiles upside-down ✓
//   left  rotate( 90deg) : natural top → screen right  (toward center) ✓  text reads top→bottom ✓
//   right rotate(-90deg) : natural top → screen left   (toward center) ✓  text reads bottom→top ✓
function StripContent({
  name, tileCount, melds, flowerTiles, isActive,
}: {
  name: string; tileCount: number; melds: Meld[]; flowerTiles: Tile[]; isActive: boolean
}) {
  const tileColor   = isActive ? '#6aaa7a' : '#4a7c59'
  const tileOpacity = isActive ? 1 : 0.4

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>

      {/* ── Melds (natural top = toward board center after rotation) ── */}
      {melds.length > 0 && (
        <div style={{ display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center' }}>
          {melds.map((meld, i) => (
            <div key={i} style={{ display: 'flex', gap: 1 }}>
              {meld.tiles.map((tile, j) => (
                <TileCell
                  key={j}
                  suit={tile.suit}
                  value={tile.value}
                  faceDown={meld.type === 'concealed-kong' && (j === 0 || j === 3)}
                  scale={0.26}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ── Hand strip: [dot · name] [hidden backs] [flowers] ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
        {/* Name + indicator dot */}
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

        {/* Hidden tile backs — landscape (14w × 9h) so they look portrait after 90° rotation */}
        <div style={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 0 }}>
          {Array.from({ length: Math.min(tileCount, 13) }).map((_, i) => (
            <div key={i} style={{
              width: 14, height: 9, borderRadius: 2, flexShrink: 0,
              backgroundColor: tileColor, opacity: tileOpacity,
              transition: 'background-color 0.3s, opacity 0.3s',
            }} />
          ))}
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', marginLeft: 1 }}>{tileCount}</span>
        </div>

        {/* Flower tiles */}
        {flowerTiles.length > 0 && (
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {flowerTiles.map((t) => (
              <TileCell key={t.id} suit={t.suit} value={t.value} scale={0.24} />
            ))}
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
    // rotate(180deg): flips the whole strip so tiles appear upside-down (realistic),
    // and melds end up below the hand strip = closer to board center.
    return (
      <div style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
        <StripContent
          name={name} tileCount={tileCount} melds={melds}
          flowerTiles={flowerTiles} isActive={isActive}
        />
      </div>
    )
  }

  // ── Left / Right ──────────────────────────────────────────────────────────
  //
  // After 90° rotation the strip's natural width becomes the screen height,
  // and the strip's natural height becomes the screen width.
  //
  // Container: width (screen) ≈ strip's natural height, height (screen) = max strip length.
  // The inner absolute div is centered via top/left 50% + translate(-50%,-50%),
  // then rotated. The center of the strip stays at the container center.
  //
  //   left  → rotate( 90deg): CW  — natural top becomes screen-RIGHT (toward center)
  //   right → rotate(-90deg): CCW — natural top becomes screen-LEFT  (toward center)

  // Estimate natural height of StripContent:
  //   hand strip ≈ 14px; meld row ≈ 23px (TileCell h at scale=0.26); gap = 4px
  const HAND_H     = 14
  const MELD_ROW_H = 24
  const panelW     = HAND_H + (melds.length > 0 ? MELD_ROW_H + 4 : 0) + 8  // buffer
  const PANEL_LEN  = 360  // generous max for strip length (screen height of panel)

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
        <StripContent
          name={name} tileCount={tileCount} melds={melds}
          flowerTiles={flowerTiles} isActive={isActive}
        />
      </div>
    </div>
  )
}

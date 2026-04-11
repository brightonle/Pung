import type { Meld } from '../types'
import MahjongTile from './MahjongTile'

interface MeldGroupProps {
  melds: Meld[]
  scale?: number
  direction?: 'row' | 'col'   // col = stack melds vertically (for side panels)
}

const TILE_W = 68
const TILE_H = 90

export default function MeldGroup({ melds, scale = 0.55, direction = 'row' }: MeldGroupProps) {
  if (melds.length === 0) return null

  const cellW = Math.round(TILE_W * scale)
  const cellH = Math.round(TILE_H * scale)

  return (
    <div className={`flex gap-1 flex-wrap ${direction === 'col' ? 'flex-col items-start' : 'justify-center'}`}>
      {melds.map((meld, i) => (
        <div key={i} className="flex gap-[1px]" style={{ flexShrink: 0 }}>
          {meld.tiles.map((tile, j) => (
            <div
              key={j}
              style={{ width: cellW, height: cellH, overflow: 'hidden', flexShrink: 0 }}
            >
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: TILE_W, height: TILE_H }}>
                <MahjongTile
                  suit={tile.suit}
                  value={tile.value}
                  faceDown={meld.type === 'concealed-kong' && (j === 0 || j === 3)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

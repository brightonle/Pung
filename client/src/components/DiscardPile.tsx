import type { Tile, Seat } from '../types'
import MahjongTile from './MahjongTile'

const SCALE = 0.52
const TILE_W = 68
const TILE_H = 90
const CELL_W = Math.round(TILE_W * SCALE)   // 35
const CELL_H = Math.round(TILE_H * SCALE)   // 47

interface DiscardPileProps {
  tiles: Tile[]
  lastDiscardId?: string | null
  lastDiscardBySeat?: Seat | null
  mySeat?: Seat | null
}

export default function DiscardPile({ tiles, lastDiscardId }: DiscardPileProps) {
  return (
    <div className="w-full h-full overflow-hidden p-1">
      <div className="flex flex-wrap gap-[3px] justify-center content-start">
        {tiles.map((tile, i) => {
          const isLast = tile.id === lastDiscardId
          return (
            <div
              key={tile.id}
              className={isLast ? 'last-discard' : 'tile-appear'}
              style={{
                width: isLast ? CELL_W + 2 : CELL_W,
                height: isLast ? CELL_H + 2 : CELL_H,
                overflow: 'hidden',
                flexShrink: 0,
                animationDelay: `${Math.min(i * 0, 0)}ms`,
              }}
            >
              <div
                style={{
                  transform: `scale(${SCALE})`,
                  transformOrigin: 'top left',
                  width: TILE_W,
                  height: TILE_H,
                }}
              >
                <MahjongTile suit={tile.suit} value={tile.value} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

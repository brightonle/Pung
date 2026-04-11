import { useRef } from 'react'
import type { Tile } from '../types'
import MahjongTile from './MahjongTile'

const SCALE = 0.52
const TILE_W = 68
const TILE_H = 90
const CELL_W = Math.round(TILE_W * SCALE)   // 35
const CELL_H = Math.round(TILE_H * SCALE)   // 47

interface DiscardPileProps {
  tiles: Tile[]
  lastDiscardId?: string | null
}

export default function DiscardPile({ tiles, lastDiscardId }: DiscardPileProps) {
  // Track IDs we've already rendered so only newly added tiles get the animation
  const seenIds = useRef<Set<string>>(new Set())

  return (
    <div className="w-full h-full overflow-hidden p-1">
      <div className="flex flex-wrap gap-[3px] justify-center content-start">
        {tiles.map((tile) => {
          const isLast = tile.id === lastDiscardId
          const isNew = !seenIds.current.has(tile.id)
          if (isNew) seenIds.current.add(tile.id)

          return (
            <div
              key={tile.id}
              className={isLast ? 'last-discard' : isNew ? 'tile-appear' : undefined}
              style={{
                width: isLast ? CELL_W + 3 : CELL_W,
                height: isLast ? CELL_H + 3 : CELL_H,
                overflow: 'hidden',
                flexShrink: 0,
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

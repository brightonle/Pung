import type { Tile } from '../types'
import MahjongTile from './MahjongTile'

interface DiscardPileProps {
  tiles: Tile[]
  lastDiscardId?: string | null
}

export default function DiscardPile({ tiles, lastDiscardId }: DiscardPileProps) {
  return (
    <div className="flex flex-wrap gap-[3px] justify-center content-start overflow-hidden p-2">
      {tiles.map((tile) => {
        const isLast = tile.id === lastDiscardId
        return (
          <div
            key={tile.id}
            className={isLast ? 'last-discard' : ''}
            style={isLast ? { transform: 'scale(0.65)', transformOrigin: 'center' } : { transform: 'scale(0.6)', transformOrigin: 'center' }}
          >
            <MahjongTile suit={tile.suit} value={tile.value} />
          </div>
        )
      })}
    </div>
  )
}

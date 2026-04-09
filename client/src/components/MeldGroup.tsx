import type { Meld } from '../types'
import MahjongTile from './MahjongTile'

interface MeldGroupProps {
  melds: Meld[]
  scale?: number
}

export default function MeldGroup({ melds, scale = 0.55 }: MeldGroupProps) {
  if (melds.length === 0) return null
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {melds.map((meld, i) => (
        <div key={i} className="flex gap-[2px]">
          {meld.tiles.map((tile, j) => (
            <MahjongTile
              key={j}
              suit={tile.suit}
              value={tile.value}
              faceDown={meld.type === 'concealed-kong' && (j === 0 || j === 3)}
              scale={scale}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

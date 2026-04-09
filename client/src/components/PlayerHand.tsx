import { useEffect, useRef, useState } from 'react'
import type { Tile } from '../types'
import MahjongTile from './MahjongTile'
import { useGameStore } from '../store/gameStore'
import { useGameActions } from '../hooks/useGameActions'

interface PlayerHandProps {
  hand: Tile[]      // 13 tiles (first 13 of myHand)
  drawnTile?: Tile | null  // 14th tile if drawn
}

const TILE_W = 68
const GAP = 4

export default function PlayerHand({ hand, drawnTile }: PlayerHandProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  // Local display order (ids only) — purely cosmetic, doesn't affect game logic
  const [orderedIds, setOrderedIds] = useState<string[]>([])
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  const selectedTileId = useGameStore((s) => s.selectedTileId)
  const selectTile = useGameStore((s) => s.selectTile)
  const gameState = useGameStore((s) => s.gameState)
  const socketId = useGameStore((s) => s.socketId)
  const { discardTile } = useGameActions()

  const isMyTurn = (() => {
    if (!gameState) return false
    const me = gameState.players.find((p) => p.id === socketId)
    return me?.seat === gameState.currentTurn && gameState.phase === 'playing'
  })()

  // ── Sync ordered IDs when hand tiles change (draw / discard) ──────────────
  const allTiles = [...hand, ...(drawnTile ? [drawnTile] : [])]
  const handKey = allTiles.map((t) => t.id).join(',')

  useEffect(() => {
    setOrderedIds((prev) => {
      const newIds = allTiles.map((t) => t.id)
      const newSet = new Set(newIds)
      // Keep existing order, drop removed tiles, append newly added ones at end
      const kept = prev.filter((id) => newSet.has(id))
      const existing = new Set(kept)
      const added = newIds.filter((id) => !existing.has(id))
      return [...kept, ...added]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handKey])

  // Map ordered IDs → tile objects
  const tileById = new Map(allTiles.map((t) => [t.id, t]))
  const orderedTiles = orderedIds.map((id) => tileById.get(id)).filter(Boolean) as Tile[]

  // ── Responsive scaling ────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const total = allTiles.length
    const naturalWidth = total * TILE_W + (total - 1) * GAP
    const obs = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width - 32
      setScale(Math.max(0.55, Math.min(1.0, available / naturalWidth)))
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [allTiles.length])

  // ── Drag handlers ─────────────────────────────────────────────────────────
  function handleDragStart(e: React.DragEvent, idx: number) {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
    // Transparent drag ghost
    const ghost = document.createElement('div')
    ghost.style.opacity = '0'
    document.body.appendChild(ghost)
    e.dataTransfer.setDragImage(ghost, 0, 0)
    setTimeout(() => document.body.removeChild(ghost), 0)
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverIdx(idx)
  }

  function handleDrop(idx: number) {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null); setOverIdx(null); return
    }
    const next = [...orderedIds]
    const [moved] = next.splice(dragIdx, 1)
    next.splice(idx, 0, moved)
    setOrderedIds(next)
    setDragIdx(null); setOverIdx(null)
  }

  function handleDragEnd() {
    setDragIdx(null); setOverIdx(null)
  }

  // ── Tile click: select → second click discards ────────────────────────────
  function handleTileClick(tile: Tile) {
    if (!isMyTurn) return
    if (selectedTileId === tile.id) {
      discardTile(tile.id)
      selectTile(null)
    } else {
      selectTile(tile.id)
    }
  }

  const stripH = Math.round(90 * scale) + 28

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-end bg-[#0a0a0a] border-t border-white/5"
      style={{ height: stripH }}
    >
      <div
        className="flex items-end pb-2"
        style={{
          gap: GAP,
          transform: `scale(${scale})`,
          transformOrigin: 'center bottom',
        }}
      >
        {orderedTiles.map((tile, idx) => {
          const isDrawn = tile.id === drawnTile?.id
          const isDragging = dragIdx === idx
          const isOver = overIdx === idx && dragIdx !== null && dragIdx !== idx

          return (
            <div
              key={tile.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className="relative flex-shrink-0 transition-transform duration-75"
              style={{
                opacity: isDragging ? 0.35 : 1,
                // Show a gap before drop target
                marginLeft: isOver ? 12 : isDrawn ? 8 : 0,
                cursor: 'grab',
              }}
            >
              {/* Drop indicator line */}
              {isOver && (
                <div className="absolute -left-[7px] top-0 bottom-0 w-[3px] rounded-full bg-white/50 z-10" />
              )}
              <MahjongTile
                suit={tile.suit}
                value={tile.value}
                selected={selectedTileId === tile.id}
                disabled={!isMyTurn}
                onClick={() => handleTileClick(tile)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

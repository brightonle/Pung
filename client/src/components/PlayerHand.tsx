import { useCallback, useEffect, useRef, useState } from 'react'
import type { Tile } from '../types'
import MahjongTile from './MahjongTile'
import { useGameStore } from '../store/gameStore'
import { useGameActions } from '../hooks/useGameActions'

interface PlayerHandProps {
  hand: Tile[]
  drawnTile?: Tile | null
}

const TILE_W = 68
const GAP = 4

export default function PlayerHand({ hand, drawnTile }: PlayerHandProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [orderedIds, setOrderedIds] = useState<string[]>([])
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const dragStartY = useRef<number>(0)
  const tileRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [flyingTile, setFlyingTile] = useState<{ tile: Tile; fromRect: DOMRect } | null>(null)

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

  // Sync ordered IDs when hand tiles change
  const allTiles = [...hand, ...(drawnTile ? [drawnTile] : [])]
  const handKey = allTiles.map((t) => t.id).join(',')

  useEffect(() => {
    setOrderedIds((prev) => {
      const newIds = allTiles.map((t) => t.id)
      const newSet = new Set(newIds)
      const kept = prev.filter((id) => newSet.has(id))
      const existing = new Set(kept)
      const added = newIds.filter((id) => !existing.has(id))
      return [...kept, ...added]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handKey])

  const tileById = new Map(allTiles.map((t) => [t.id, t]))
  const orderedTiles = orderedIds.map((id) => tileById.get(id)).filter(Boolean) as Tile[]

  // Responsive scaling
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

  // Discard is only allowed after drawing (allTiles.length % 3 === 2)
  const canDiscard = isMyTurn && allTiles.length % 3 === 2

  // Animate tile flying to discard pile center before actually removing it
  const doDiscard = useCallback((tile: Tile) => {
    const el = tileRefs.current.get(tile.id)
    if (el && canDiscard) {
      const rect = el.getBoundingClientRect()
      setFlyingTile({ tile, fromRect: rect })
      // Delay actual discard until animation finishes
      setTimeout(() => {
        setFlyingTile(null)
        discardTile(tile.id)
        selectTile(null)
      }, 260)
    } else if (canDiscard) {
      discardTile(tile.id)
      selectTile(null)
    }
  }, [canDiscard, discardTile, selectTile])

  // ── Drag handlers ──────────────────────────────────────────────────────────

  function handleDragStart(e: React.DragEvent, idx: number) {
    setDragIdx(idx)
    dragStartY.current = e.clientY
    e.dataTransfer.effectAllowed = 'move'
    const canvas = document.createElement('canvas')
    canvas.width = 1; canvas.height = 1
    e.dataTransfer.setDragImage(canvas, 0, 0)
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overIdx !== idx) setOverIdx(idx)
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

  function handleDragEnd(e: React.DragEvent, tile: Tile) {
    const deltaY = e.clientY - dragStartY.current
    const containerRect = containerRef.current?.getBoundingClientRect()
    // Dragged upward by 60px or dropped above the hand strip → discard
    if (canDiscard && (deltaY < -60 || (containerRect && e.clientY > 0 && e.clientY < containerRect.top - 10))) {
      doDiscard(tile)
      setDragIdx(null); setOverIdx(null)
      return
    }
    setDragIdx(null); setOverIdx(null)
  }

  // ── Click to select then discard ──────────────────────────────────────────

  function handleTileClick(tile: Tile) {
    if (!canDiscard) return
    if (selectedTileId === tile.id) {
      doDiscard(tile)
    } else {
      selectTile(tile.id)
    }
  }

  const stripH = Math.round(90 * scale) + 28

  // Compute flying tile target: center of the board (viewport center, above hand)
  const flyTarget = flyingTile ? (() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const tileScaled = 68 * scale
    const boardCenterX = vw / 2 - tileScaled / 2
    const boardCenterY = vh / 2 - stripH - 45 * scale
    return { x: boardCenterX, y: boardCenterY }
  })() : null

  return (
    <>
      {/* Flying tile overlay — plays discard animation */}
      {flyingTile && flyTarget && (
        <div
          className="pointer-events-none fixed z-50"
          style={{
            left: flyingTile.fromRect.left,
            top: flyingTile.fromRect.top,
            width: flyingTile.fromRect.width,
            height: flyingTile.fromRect.height,
            transition: 'left 260ms cubic-bezier(0.2,0,0.4,1), top 260ms cubic-bezier(0.2,0,0.4,1), opacity 260ms ease, transform 260ms ease',
            // Animate to board center; use a tiny rAF trick via inline style reflow
          }}
          ref={(el) => {
            if (!el) return
            // Force reflow then apply target position
            void el.offsetWidth
            el.style.left = `${flyTarget.x}px`
            el.style.top = `${flyTarget.y}px`
            el.style.opacity = '0'
            el.style.transform = `scale(${scale})`
          }}
        >
          <MahjongTile suit={flyingTile.tile.suit} value={flyingTile.tile.value} />
        </div>
      )}

      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-end bg-[#0a0a0a] border-t border-white/5"
        style={{ height: stripH }}
      >
        <div
          className="flex items-end pb-2"
          style={{ gap: GAP, transform: `scale(${scale})`, transformOrigin: 'center bottom' }}
        >
          {orderedTiles.map((tile, idx) => {
            const isDrawn = tile.id === drawnTile?.id
            const isDragging = dragIdx === idx
            const isOver = overIdx === idx && dragIdx !== null && dragIdx !== idx
            const isFlying = flyingTile?.tile.id === tile.id

            return (
              <div
                key={tile.id}
                ref={(el) => {
                  if (el) tileRefs.current.set(tile.id, el)
                  else tileRefs.current.delete(tile.id)
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={(e) => handleDragEnd(e, tile)}
                className="relative flex-shrink-0"
                style={{
                  opacity: isDragging || isFlying ? 0.15 : 1,
                  marginLeft: isOver ? 14 : 0,
                  transition: 'margin-left 80ms ease, opacity 80ms ease',
                  cursor: canDiscard ? 'grab' : 'default',
                }}
              >
                {isOver && (
                  <div className="absolute -left-[8px] top-0 bottom-0 w-[3px] rounded-full bg-white/50 z-10" />
                )}
                {isDrawn && (
                  <div className="drawn-tile-glow absolute inset-0 z-10 rounded-[11px]" />
                )}
                <MahjongTile
                  suit={tile.suit}
                  value={tile.value}
                  selected={selectedTileId === tile.id}
                  disabled={!canDiscard}
                  onClick={() => handleTileClick(tile)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

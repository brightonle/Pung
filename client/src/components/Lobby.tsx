import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { useGameActions } from '../hooks/useGameActions'
import type { Seat } from '../types'

const SEAT_LABEL: Record<Seat, string> = {
  east: 'East',
  south: 'South',
  west: 'West',
  north: 'North',
}

export default function Lobby() {
  const [nameInput, setNameInput] = useState('')
  const [roomInput, setRoomInput] = useState('')
  const [error, setError] = useState('')

  const roomInfo = useGameStore((s) => s.roomInfo)
  const socketId = useGameStore((s) => s.socketId)
  const connected = useGameStore((s) => s.connected)
  const serverError = useGameStore((s) => s.serverError)
  const { joinRoom, createRoom, startGame, addBot } = useGameActions()

  // Show server errors (e.g. room not found)
  const displayError = error || serverError || ''

  const isHost = roomInfo?.hostId === socketId
  const players = roomInfo?.players ?? []
  const canStart = players.length === 4

  async function handleCreate() {
    if (!nameInput.trim()) return
    setError('')
    createRoom(nameInput.trim())
  }

  async function handleJoin() {
    const code = roomInput.trim().toUpperCase()
    if (!nameInput.trim() || !code) return
    setError('')
    joinRoom(code, nameInput.trim())
  }

  // ── Waiting room ──────────────────────────────────────────────────────────
  if (roomInfo) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="text-center">
            <div className="text-white/30 text-xs uppercase tracking-widest mb-1">Room Code</div>
            <div className="text-white text-4xl font-bold tracking-[0.2em]">{roomInfo.roomCode}</div>
            <div className="text-white/20 text-xs mt-1">Share this with others to join</div>
          </div>

          <div className="flex flex-col gap-2">
            {(['east', 'south', 'west', 'north'] as Seat[]).map((seat) => {
              const p = players.find((pl) => pl.seat === seat)
              return (
                <div
                  key={seat}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08]"
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p ? 'bg-green-400' : 'bg-white/15'}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-white/80 text-sm font-medium truncate">
                      {p ? p.name : <span className="text-white/25 italic text-xs">empty</span>}
                    </span>
                    {p?.id === socketId && (
                      <span className="ml-2 text-white/30 text-xs">you</span>
                    )}
                    {p?.isBot && (
                      <span className="ml-2 text-white/25 text-xs">bot</span>
                    )}
                    {p?.id === roomInfo.hostId && !p?.isBot && (
                      <span className="ml-2 text-white/30 text-xs">host</span>
                    )}
                  </div>
                  <span className="text-white/25 text-xs flex-shrink-0">{SEAT_LABEL[seat]}</span>
                </div>
              )
            })}
          </div>

          {isHost && !canStart && (
            <button
              onClick={addBot}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-white/8 text-white/60
                border border-white/10 hover:bg-white/12 hover:text-white/80 transition-all duration-100 active:scale-[0.98]"
            >
              + Add Bot
            </button>
          )}

          {isHost ? (
            <button
              onClick={canStart ? startGame : undefined}
              disabled={!canStart}
              className={[
                'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-100',
                canStart
                  ? 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
                  : 'bg-white/8 text-white/30 cursor-not-allowed',
              ].join(' ')}
            >
              {canStart ? 'Start Game' : `Waiting for players… ${players.length}/4`}
            </button>
          ) : (
            <div className="text-center text-white/30 text-sm py-2">
              Waiting for host to start…
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Join / Create form ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-white text-5xl font-bold tracking-tight">Pung</h1>
          <p className="text-white/30 text-sm mt-2">Hong Kong Mahjong</p>
          {!connected && (
            <p className="text-yellow-400/60 text-xs mt-2">Connecting…</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Your name"
            value={nameInput}
            onChange={(e) => { setNameInput(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && roomInput ? handleJoin() : undefined}
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25
              text-sm outline-none focus:border-white/30 transition-colors"
          />
          <input
            type="text"
            placeholder="Room code (to join existing)"
            value={roomInput}
            onChange={(e) => { setRoomInput(e.target.value.toUpperCase()); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && nameInput && roomInput ? handleJoin() : undefined}
            maxLength={4}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25
              text-sm uppercase tracking-[0.25em] outline-none focus:border-white/30 transition-colors"
          />

          {displayError && (
            <p className="text-red-400/80 text-xs px-1">{displayError}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={!nameInput.trim() || !connected}
              className={[
                'flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-100',
                nameInput.trim() && connected
                  ? 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
                  : 'bg-white/10 text-white/30 cursor-not-allowed',
              ].join(' ')}
            >
              Create
            </button>
            <button
              onClick={handleJoin}
              disabled={!nameInput.trim() || !roomInput.trim() || !connected}
              className={[
                'flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-100',
                nameInput.trim() && roomInput.trim() && connected
                  ? 'bg-white/10 text-white border border-white/20 hover:bg-white/15 active:scale-[0.98]'
                  : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5',
              ].join(' ')}
            >
              Join
            </button>
          </div>

          <p className="text-white/20 text-xs text-center">
            Create a room, share the code, have 3 friends join
          </p>
        </div>
      </div>
    </div>
  )
}

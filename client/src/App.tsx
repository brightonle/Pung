import { useSocket } from './hooks/useSocket'
import { useGameStore } from './store/gameStore'
import Lobby from './components/Lobby'
import GameBoard from './components/GameBoard'

export default function App() {
  useSocket()

  const gameState = useGameStore((s) => s.gameState)
  const roomInfo = useGameStore((s) => s.roomInfo)

  // Show game board if game is in progress
  if (gameState && gameState.phase !== 'waiting') {
    return <GameBoard />
  }

  return <Lobby />
}

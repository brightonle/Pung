import { useEffect } from 'react'
import { useSocket } from './hooks/useSocket'
import { useGameStore } from './store/gameStore'
import AccountSetup from './components/AccountSetup'
import Lobby from './components/Lobby'
import GameBoard from './components/GameBoard'

export default function App() {
  useSocket()

  const gameState = useGameStore((s) => s.gameState)
  const userProfile = useGameStore((s) => s.userProfile)
  const setPlayerName = useGameStore((s) => s.setPlayerName)

  // Keep playerName in sync with the profile username
  useEffect(() => {
    if (userProfile) setPlayerName(userProfile.username)
  }, [userProfile, setPlayerName])

  if (!userProfile) {
    return <AccountSetup />
  }

  if (gameState && gameState.phase !== 'waiting') {
    return <GameBoard />
  }

  return <Lobby />
}

import { useEffect, useState } from 'react'
import './Header.css'

interface HeaderProps {
  userName?: string
  initialTime?: number // Initial time in seconds
}

const Header = ({ userName = 'User', initialTime = 3600 }: HeaderProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <header className="header">
      <div className="user-info">
        <span className="user-name">Hello {userName}</span>
      </div>
      <div className="timer">
        <span className="timer-label">Time left:</span>
        <span className={`timer-value ${timeLeft < 300 ? 'warning' : ''}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </header>
  )
}

export default Header

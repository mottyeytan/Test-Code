import { useState, useRef, useEffect } from 'react'
import './QuestionPanel.css'

interface QuestionPanelProps {
  isVisible: boolean
  onToggle: () => void
  question?: {
    title: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    description: string
    examples: Array<{
      input: string
      output: string
      explanation?: string
    }>
    constraints?: string[]
  }
}

const QuestionPanel = ({ isVisible, onToggle, question }: QuestionPanelProps) => {
  const [windowPosition, setWindowPosition] = useState({ x: 200, y: 100 })
  const [windowSize, setWindowSize] = useState({ width: 700, height: 600 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isTabDragging, setIsTabDragging] = useState(false)
  const [resizeDirection, setResizeDirection] = useState('')
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [tabDragStart, setTabDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, windowX: 0, windowY: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  // Reset window to safe position and size
  const resetWindow = () => {
    const width = 700
    const height = 600
    const centerX = Math.max(20, (window.innerWidth - width) / 2)
    const centerY = Math.max(20, (window.innerHeight - height) / 2)
    
    setWindowSize({ width, height })
    setWindowPosition({ x: centerX, y: centerY })
  }

  // Ensure window stays within safe bounds
  const ensureSafeBounds = (pos: { x: number, y: number }, size: { width: number, height: number }) => {
    const maxX = window.innerWidth - size.width - 10
    const maxY = window.innerHeight - size.height - 10
    
    return {
      x: Math.max(10, Math.min(pos.x, maxX)),
      y: Math.max(10, Math.min(pos.y, maxY))
    }
  }

  // Auto-correct window position when opened
  useEffect(() => {
    if (isVisible) {
      // If window would be mostly off-screen, center it instead
      const isOffScreen = windowPosition.x < -50 || windowPosition.y < -50 || 
                         windowPosition.x > window.innerWidth - 100 || 
                         windowPosition.y > window.innerHeight - 100
      
      if (isOffScreen) {
        resetWindow()
      } else {
        const safePosition = ensureSafeBounds(windowPosition, windowSize)
        if (safePosition.x !== windowPosition.x || safePosition.y !== windowPosition.y) {
          setWindowPosition(safePosition)
        }
      }
    }
  }, [isVisible])

  // Ensure window stays within bounds when window resizes
  useEffect(() => {
    const handleWindowResize = () => {
      if (isVisible) {
        const safePosition = ensureSafeBounds(windowPosition, windowSize)
        setWindowPosition(safePosition)
      }
    }

    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [windowPosition, windowSize, isVisible])

  // Default sample question if none provided
  const defaultQuestion = {
    title: "Two Sum",
    difficulty: "Easy" as const,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists."
    ]
  }

  const currentQuestion = question || defaultQuestion

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-easy'
      case 'medium': return 'difficulty-medium'
      case 'hard': return 'difficulty-hard'
      default: return 'difficulty-easy'
    }
  }

  const handleTabMouseDown = (e: React.MouseEvent) => {
    setIsTabDragging(true)
    setTabDragStart({ x: e.clientX, y: e.clientY })
    e.preventDefault()
  }

  const handleDragStart = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    // Allow dragging from header or its children, but not from close button
    if (target.closest('.question-header') && !target.closest('.close-button')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - windowPosition.x,
        y: e.clientY - windowPosition.y
      })
      e.preventDefault()
    }
  }

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    setIsResizing(true)
    setResizeDirection(direction)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowSize.width,
      height: windowSize.height,
      windowX: windowPosition.x,
      windowY: windowPosition.y
    })
    e.preventDefault()
    e.stopPropagation()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isTabDragging) {
        const deltaY = e.clientY - tabDragStart.y
        if (deltaY > 50 && !isVisible) {
          // Drag down to open
          onToggle()
          setIsTabDragging(false)
        } else if (deltaY < -50 && isVisible) {
          // Drag up to close
          onToggle()
          setIsTabDragging(false)
        }
      } else if (isDragging) {
        const proposedX = e.clientX - dragStart.x
        const proposedY = e.clientY - dragStart.y
        
        // Keep within bounds with margin
        const margin = 20
        const maxX = window.innerWidth - windowSize.width - margin
        const maxY = window.innerHeight - windowSize.height - margin
        
        const newX = Math.max(margin, Math.min(proposedX, maxX))
        const newY = Math.max(margin, Math.min(proposedY, maxY))
        
        setWindowPosition({ x: newX, y: newY })
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        
        let newWidth = resizeStart.width
        let newHeight = resizeStart.height
        let newX = resizeStart.windowX
        let newY = resizeStart.windowY

        // Responsive minimum sizes
        const minWidth = window.innerWidth < 768 ? 320 : window.innerWidth < 1024 ? 350 : 400
        const minHeight = window.innerHeight < 600 ? 220 : window.innerHeight < 800 ? 250 : 300
        const margin = 20

        // Handle width changes - simpler logic
        if (resizeDirection.includes('right')) {
          newWidth = Math.max(minWidth, resizeStart.width + deltaX)
          const maxAllowedWidth = window.innerWidth - resizeStart.windowX - margin
          newWidth = Math.min(newWidth, maxAllowedWidth)
        }
        
        if (resizeDirection.includes('left')) {
          const proposedWidth = resizeStart.width - deltaX
          newWidth = Math.max(minWidth, proposedWidth)
          
          // Calculate how much the left edge should move
          const widthDiff = newWidth - resizeStart.width
          newX = resizeStart.windowX - widthDiff
          
          // Don't go past left edge
          if (newX < margin) {
            newX = margin
            newWidth = resizeStart.windowX + resizeStart.width - margin
          }
        }

        // Handle height changes - simpler logic
        if (resizeDirection.includes('bottom')) {
          newHeight = Math.max(minHeight, resizeStart.height + deltaY)
          const maxAllowedHeight = window.innerHeight - resizeStart.windowY - margin
          newHeight = Math.min(newHeight, maxAllowedHeight)
        }
        
        if (resizeDirection.includes('top')) {
          const proposedHeight = resizeStart.height - deltaY
          newHeight = Math.max(minHeight, proposedHeight)
          
          // Calculate how much the top edge should move
          const heightDiff = newHeight - resizeStart.height
          newY = resizeStart.windowY - heightDiff
          
          // Don't go past top edge
          if (newY < margin) {
            newY = margin
            newHeight = resizeStart.windowY + resizeStart.height - margin
          }
        }

        setWindowSize({ width: newWidth, height: newHeight })
        setWindowPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setIsTabDragging(false)
      setResizeDirection('')
    }

    if (isDragging || isResizing || isTabDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, isTabDragging, dragStart, tabDragStart, resizeStart, resizeDirection, windowPosition, windowSize, isVisible, onToggle])

  return (
    <>
      {/* Tab that sticks out from top */}
      <div 
        className={`question-tab ${isVisible ? 'panel-open' : ''} ${isTabDragging ? 'tab-dragging' : ''}`}
        onMouseDown={handleTabMouseDown}
        onClick={onToggle}
      >
        <div className="tab-content">
          <span className="tab-arrow">{isVisible ? '⌃' : '⌄'}</span>
          <span className="tab-label">Question</span>
        </div>
      </div>

      {/* Main floating window - only visible when open */}
      {isVisible && (
        <div 
          ref={panelRef}
          className={`question-window ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
          style={{ 
            left: `${windowPosition.x}px`,
            top: `${windowPosition.y}px`,
            width: `${windowSize.width}px`,
            height: `${windowSize.height}px`
          }}
        >
          {/* Resize handles */}
          <div className="resize-handle top" onMouseDown={(e) => handleResizeStart(e, 'top')} />
          <div className="resize-handle right" onMouseDown={(e) => handleResizeStart(e, 'right')} />
          <div className="resize-handle bottom" onMouseDown={(e) => handleResizeStart(e, 'bottom')} />
          <div className="resize-handle left" onMouseDown={(e) => handleResizeStart(e, 'left')} />
          <div className="resize-handle top-left" onMouseDown={(e) => handleResizeStart(e, 'top-left')} />
          <div className="resize-handle top-right" onMouseDown={(e) => handleResizeStart(e, 'top-right')} />
          <div className="resize-handle bottom-left" onMouseDown={(e) => handleResizeStart(e, 'bottom-left')} />
          <div className="resize-handle bottom-right" onMouseDown={(e) => handleResizeStart(e, 'bottom-right')} />

          {/* Header - draggable area */}
          <div 
            className="question-header"
            onMouseDown={handleDragStart}
          >
            <div className="question-title-section">
              <h2 className="question-title">{currentQuestion.title}</h2>
              <span className={`difficulty-badge ${getDifficultyClass(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            <div className="header-buttons">
              <button 
                className="reset-button" 
                onClick={(e) => {
                  e.stopPropagation()
                  resetWindow()
                }}
                title="Reset window size and position"
              >
                ⟲
              </button>
              <button className="close-button" onClick={onToggle}>
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="question-content">
            <div className="question-description">
              <h3>Problem Description</h3>
              <p>{currentQuestion.description}</p>
            </div>

            {currentQuestion.examples && currentQuestion.examples.length > 0 && (
              <div className="question-examples">
                <h3>Examples</h3>
                {currentQuestion.examples.map((example, index) => (
                  <div key={index} className="example">
                    <h4>Example {index + 1}:</h4>
                    <div className="example-content">
                      <div className="example-io">
                        <div>
                          <strong>Input:</strong> {example.input}
                        </div>
                        <div>
                          <strong>Output:</strong> {example.output}
                        </div>
                      </div>
                      {example.explanation && (
                        <div className="example-explanation">
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.constraints && currentQuestion.constraints.length > 0 && (
              <div className="question-constraints">
                <h3>Constraints</h3>
                <ul>
                  {currentQuestion.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default QuestionPanel

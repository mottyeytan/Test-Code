import { useEffect, useRef } from 'react'
import './OutputDisplay.css'

interface OutputDisplayProps {
  output: string
  isLoading?: boolean
  error?: string | null
  onClear?: () => void
}

type OutputType = 'success' | 'error' | 'info' | 'warning'

interface OutputLine {
  content: string
  type: OutputType
  timestamp?: string
}

const OutputDisplay = ({ output, isLoading = false, error, onClear }: OutputDisplayProps) => {
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output, error])

  const parseOutput = (outputText: string): OutputLine[] => {
    if (!outputText) return []
    
    const lines = outputText.split('\n')
    return lines.map((line, index) => {
      let type: OutputType = 'info'
      
      if (line.toLowerCase().includes('error')) {
        type = 'error'
      } else if (line.toLowerCase().includes('warning')) {
        type = 'warning'
      } else if (line.toLowerCase().includes('success')) {
        type = 'success'
      }
      
      return {
        content: line,
        type,
        timestamp: new Date().toLocaleTimeString()
      }
    })
  }

  const outputLines = parseOutput(output)
  const errorLines = error ? parseOutput(error) : []
  const allLines = [...outputLines, ...errorLines]

  return (
    <div className="output-display">
      <div className="output-header">
        <div className="output-title">
          <h3>Output</h3>
          <div className="output-status">
            {isLoading && (
              <span className="status-indicator loading">
                <span className="loading-dot"></span>
                <span>Running...</span>
              </span>
            )}
            {error && (
              <span className="status-indicator error">
                <span>❌</span>
                <span>Error</span>
              </span>
            )}
            {!isLoading && !error && output && (
              <span className="status-indicator success">
                <span>✅</span>
                <span>Completed</span>
              </span>
            )}
          </div>
        </div>
        
        <div className="output-actions">
          <button 
            className="clear-button"
            onClick={onClear}
            disabled={!output && !error}
          >
            <span>🗑️</span>
            <span>Clear</span>
          </button>
        </div>
      </div>
      
      <div className="output-container" ref={outputRef}>
        {allLines.length === 0 && !isLoading ? (
          <div className="empty-output">
            <div className="empty-icon">📝</div>
            <div className="empty-text">
              <p>Output will appear here after running code</p>
            </div>
          </div>
        ) : (
          <div className="output-content">
            {allLines.map((line, index) => (
              <div key={index} className={`output-line ${line.type}`}>
                <span className="line-number">{index + 1}</span>
                <span className="line-content">{line.content}</span>
                {line.timestamp && (
                  <span className="line-timestamp">{line.timestamp}</span>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="output-line loading">
                <span className="line-number">...</span>
                <span className="line-content">
                  <span className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  Processing...
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="output-footer">
        <div className="output-info">
          <span>Lines: {allLines.length}</span>
          {output && <span>Characters: {output.length}</span>}
        </div>
      </div>
    </div>
  )
}

export default OutputDisplay

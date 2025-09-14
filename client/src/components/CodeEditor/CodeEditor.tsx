import { useState } from 'react'
import './CodeEditor.css'

interface CodeEditorProps {
  initialCode?: string
  onCodeChange?: (code: string) => void
  onRunCode?: (code: string) => void
  language?: string
}

const CodeEditor = ({ 
  initialCode = '// Enter your code here\nconsole.log("Hello World!");',
  onCodeChange,
  onRunCode,
  language = 'javascript'
}: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode)
  const [isRunning, setIsRunning] = useState(false)

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setCode(newCode)
    if (onCodeChange) {
      onCodeChange(newCode)
    }
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    if (onRunCode) {
      await onRunCode(code)
    }
    // Simulate execution time
    setTimeout(() => setIsRunning(false), 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.target as HTMLTextAreaElement
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newCode = code.substring(0, start) + '    ' + code.substring(end)
      setCode(newCode)
      if (onCodeChange) {
        onCodeChange(newCode)
      }
      // Set cursor position after the inserted tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }
  }

  return (
    <div className="code-editor">
      <div className="editor-header">
        <div className="editor-title">
          <h3>Code Editor</h3>
          <span className="language-badge">{language}</span>
        </div>
        <button 
          className={`run-button ${isRunning ? 'running' : ''}`}
          onClick={handleRunCode}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <span className="spinner"></span>
              <span>Running...</span>
            </>
          ) : (
            <>
              <span className="run-icon">▶️</span>
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>
      
      <div className="editor-container">
        <div className="line-numbers">
          {code.split('\n').map((_, index) => (
            <div key={index + 1} className="line-number">
              {index + 1}
            </div>
          ))}
        </div>
        
        <textarea
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          className="code-input"
          placeholder="Enter your code here"
          spellCheck={false}
        />
      </div>
      
      <div className="editor-footer">
        <div className="editor-stats">
          <span>Lines: {code.split('\n').length}</span>
          <span>Characters: {code.length}</span>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor

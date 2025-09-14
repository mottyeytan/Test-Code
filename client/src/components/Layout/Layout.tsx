import { useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import CodeEditor from '../CodeEditor/CodeEditor'
import OutputDisplay from '../OutputDisplay/OutputDisplay'
import './Layout.css'

interface LayoutProps {
  userName?: string
  initialTime?: number
}

const Layout = ({ userName = 'User', initialTime = 3600 }: LayoutProps) => {
  const [code, setCode] = useState('// Enter your code here\nconsole.log("Hello World!");')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeMenuItem, setActiveMenuItem] = useState('problems')

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    // Clear previous error when code changes
    if (error) {
      setError(null)
    }
  }

  const handleRunCode = async (codeToRun: string) => {
    setIsRunning(true)
    setError(null)
    setOutput('')

    try {
      // Simulate code execution with a delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Basic simulation of code execution
      if (codeToRun.includes('console.log')) {
        const matches = codeToRun.match(/console\.log\(['"`]([^'"`]+)['"`]\)/g)
        if (matches) {
          const outputs = matches.map(match => {
            const content = match.match(/['"`]([^'"`]+)['"`]/)?.[1] || ''
            return content
          })
          setOutput(outputs.join('\n') + '\n\nCode executed successfully!')
        } else {
          setOutput('Code executed successfully!')
        }
      } else if (codeToRun.includes('error') || codeToRun.includes('Error')) {
        throw new Error('Example error')
      } else {
        setOutput('Code executed successfully!')
      }
    } catch (err) {
      setError(`Code execution error: ${err}`)
    } finally {
      setIsRunning(false)
    }
  }

  const handleClearOutput = () => {
    setOutput('')
    setError(null)
  }

  const handleMenuItemClick = (itemId: string) => {
    setActiveMenuItem(itemId)
    // Here you could implement navigation logic for different menu items
    console.log(`Navigating to: ${itemId}`)
  }

  return (
    <div className="layout">
      <Header userName={userName} initialTime={initialTime} />
      
      <div className="layout-content">
        <Sidebar 
          activeItem={activeMenuItem}
          onItemClick={handleMenuItemClick}
        />
        
        <main className="main-content">
          <div className="content-container">
            <div className="editor-panel">
              <CodeEditor
                initialCode={code}
                onCodeChange={handleCodeChange}
                onRunCode={handleRunCode}
                language="javascript"
              />
            </div>
            
            <div className="output-panel">
              <OutputDisplay
                output={output}
                isLoading={isRunning}
                error={error}
                onClear={handleClearOutput}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

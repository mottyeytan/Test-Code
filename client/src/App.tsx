import Layout from './components/Layout/Layout'
import './App.css'

function App() {
  return (
    <Layout 
      userName="Developer"
      initialTime={3600} // 60 minutes
    />
  )
}

export default App

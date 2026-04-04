import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'
import { CemeteryScene } from './cemetery'
import { GraveSelectionProvider, useGraveSelection } from './context/GraveSelectionContext'
import { GRAVEYARD_SERVICES } from './data/graveyardServices'
import './App.css'

function AppCanvas() {
  return (
    <Canvas
      className="app-canvas"
      shadows
      camera={{ position: [5.5, 3.8, 9.2], fov: 48, near: 0.1, far: 260 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <CemeteryScene services={GRAVEYARD_SERVICES} />
    </Canvas>
  )
}

function AppShell() {
  const { setSelectedService } = useGraveSelection()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedService(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSelectedService])

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Digital Dust</h1>
        <p>
          Kliknij nagrobek, by przywołać ducha. Ponowny klik lub × zamyka.
        </p>
      </header>
      <AppCanvas />
    </div>
  )
}

function App() {
  return (
    <GraveSelectionProvider>
      <AppShell />
    </GraveSelectionProvider>
  )
}

export default App

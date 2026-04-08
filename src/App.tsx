import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'
import { CemeteryScene } from './cemetery'
import {
  GraveSelectionProvider,
  GraveSelectionContext,
  useGraveSelection,
} from './context/GraveSelectionContext'
import { LanguageProvider, LanguageContext, useTranslation } from './context/LanguageContext'
import LanguageSelector from './components/ui/LanguageSelector'
import { GRAVEYARD_SERVICES } from './data/graveyardServices'
import { useContextBridge } from '@react-three/drei'
import CemeteryErrorBoundary from './components/CemeteryErrorBoundary'
import './App.css'

function AppCanvas() {
  // Bridge selected contexts into the separate React root created by <Canvas>
  const ContextBridge = useContextBridge(GraveSelectionContext, LanguageContext)

  return (
    <Canvas
      className="app-canvas"
      shadows
      camera={{ position: [5.5, 3.8, 9.2], fov: 48, near: 0.1, far: 260 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <ContextBridge>
        <CemeteryErrorBoundary>
          <CemeteryScene services={GRAVEYARD_SERVICES} />
        </CemeteryErrorBoundary>
      </ContextBridge>
    </Canvas>
  )
}

function AppShell() {
  const { setSelectedService } = useGraveSelection()
  const { t } = useTranslation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedService(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSelectedService])

  return (
    <div className="app-root">
      <LanguageSelector />
      <header className="app-header">
        <h1>Digital Dust</h1>
        <p>{t('ui.clickHint')}</p>
      </header>
      <AppCanvas />
    </div>
  )
}

function App() {
  return (
    <GraveSelectionProvider>
      <LanguageProvider>
        <AppShell />
      </LanguageProvider>
    </GraveSelectionProvider>
  )
}

export default App

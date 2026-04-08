import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean }

export class CemeteryErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Log clearly but don't crash the entire app
    // eslint-disable-next-line no-console
    console.error('[CemeteryErrorBoundary] caught error in Canvas subtree:', error, info)
  }

  render() {
    if (this.state.hasError) {
      // Return null inside Canvas to avoid full-app crash; Canvas will keep rendering.
      return null
    }
    return this.props.children
  }
}

export default CemeteryErrorBoundary

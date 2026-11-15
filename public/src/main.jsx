import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class WorkbenchErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[WorkbenchErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minBlockSize: '100svh',
            display: 'grid',
            placeItems: 'center',
            padding: '2rem 1.25rem',
            background: '#07090e',
            color: '#f3f5fb',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          <section
            style={{
              maxInlineSize: '34rem',
              padding: '2rem',
              borderRadius: '1.25rem',
              background: '#131722',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#93c5fd', margin: '0 0 0.5rem' }}>
              WORKBENCH RECOVERY GUARD
            </p>
            <h1 style={{ fontSize: '1.4rem', margin: '0 0 0.75rem' }}>
              Something interrupted the Developer Workbench view.
            </h1>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#9da4b8', margin: '0 0 1.25rem' }}>
              Try clearing cached local state or return to the 3D Constellation homepage while we check the log.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('geminipulse_showcase_v4')
                  } catch {
                    // ignore storage errors
                  }
                  window.location.reload()
                }}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '999px',
                  border: 0,
                  background: '#4285f4',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reset Cached State &amp; Reload
              </button>
              <a
                href="/"
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#f3f5fb',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                ← Back to 3D Star Chart
              </a>
              <a
                href="/changelog.html"
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#93c5fd',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}
              >
                View Changelog
              </a>
            </div>
          </section>
        </main>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkbenchErrorBoundary>
      <App />
    </WorkbenchErrorBoundary>
  </StrictMode>,
)

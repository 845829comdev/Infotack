import { useMemo, useState } from 'react'
import React from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import Browser from './components/Browser'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import OsintPanel from './components/OsintPanel'
import PentestPanel from './components/PentestPanel'
import SecurityPanel from './components/SecurityPanel'
import RequestsPanel from './components/RequestsPanel'
import Settings from './components/Settings'

const TAB_TITLES = {
  browser: 'Основной браузер',
  osint: 'OSINT инструменты',
  pentest: 'Пентест панель',
  requests: 'HTTP запросы',
  database: 'База данных',
  security: 'Безопасность',
  settings: 'Настройки',
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('browser')
  const [url, setUrl] = useState('https://example.com')
  const [history, setHistory] = useState(['https://example.com'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [reloadKey, setReloadKey] = useState(0)

  const navigateTo = (newUrl) => {
    if (!newUrl) return
    // normalize
    let v = newUrl.trim()
    if (!v.startsWith('http://') && !v.startsWith('https://')) {
      if (v.includes(' ')) {
        v = `https://www.google.com/search?q=${encodeURIComponent(v)}`
      } else if (v.includes('.')) {
        v = `https://${v}`
      } else {
        v = `https://www.google.com/search?q=${encodeURIComponent(v)}`
      }
    }

    setUrl(v)
    const next = history.slice(0, historyIndex + 1)
    next.push(v)
    setHistory(next)
    setHistoryIndex(next.length - 1)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1
      setHistoryIndex(idx)
      setUrl(history[idx])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1
      setHistoryIndex(idx)
      setUrl(history[idx])
    }
  }

  const refresh = () => {
    setReloadKey((k) => k + 1)
  }

  const goHome = () => {
    navigateTo('https://example.com')
  }

  const activeTabTitle = useMemo(() => TAB_TITLES[activeTab] || 'Рабочая область', [activeTab])

  return (
    <div className="h-screen bg-transparent text-white flex overflow-hidden">
      {sidebarOpen && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <main className="flex-1 flex flex-col overflow-hidden px-6 py-6 gap-5">
        <header className="surface-panel w-full px-6 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors focus-ring"
              aria-label="Toggle sidebar"
          >
              {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
            <div>
              <div className="badge mb-2">Security workspace</div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">Infotack</h1>
                <span className="text-sm text-muted px-3 py-1 rounded-full border border-white/10">
                  v1.0.0 Alpha
                </span>
              </div>
              <p className="text-muted mt-1">
                Инструменты разведки, пентеста и защиты в одном рабочем пространстве.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted">
            <div>
              <p className="uppercase tracking-wide text-xs text-muted-dark mb-1">Активная область</p>
              <p className="text-base text-white">{activeTabTitle}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-xs text-muted-dark mb-1">Глубина истории</p>
              <p className="text-base text-white">{history.length} URL</p>
          </div>
        </div>
      </header>

        <Navbar
          url={url}
          setUrl={navigateTo}
          onBack={goBack}
          onForward={goForward}
          onRefresh={refresh}
          onHome={goHome}
          onOpenExternal={() => window.electronAPI && window.electronAPI.openExternal && window.electronAPI.openExternal(url)}
        />

        <div className="flex-1 overflow-hidden">
          {activeTab === 'browser' && (
            <div className="surface-panel h-full flex flex-col overflow-hidden">
              <Browser url={url} reloadKey={reloadKey} onNavigate={navigateTo} />
            </div>
          )}
          {activeTab === 'osint' && (
            <div className="surface-panel h-full overflow-hidden">
              <OsintPanel onNavigate={navigateTo} />
            </div>
          )}
          {activeTab === 'pentest' && (
            <div className="surface-panel h-full overflow-hidden">
            <React.Suspense fallback={<div className="p-6 text-gray-300">Загрузка...</div>}>
              <PentestPanel />
            </React.Suspense>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="surface-panel h-full overflow-hidden">
            <React.Suspense fallback={<div className="p-6 text-gray-300">Загрузка...</div>}>
              <SecurityPanel />
            </React.Suspense>
            </div>
          )}
          {activeTab === 'requests' && (
            <div className="surface-panel h-full overflow-hidden">
              <RequestsPanel />
            </div>
          )}
          {activeTab === 'database' && (
            <div className="surface-panel h-full flex items-center justify-center text-center px-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-dark mb-3">Скоро</p>
                <p className="text-2xl font-semibold mb-2">База артефактов готовится</p>
                <p className="text-muted max-w-md">
                  Централизованное хранение результатов OSINT/пентеста появится здесь. Мы уже работаем над схемами.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="surface-panel h-full overflow-auto">
              <Settings />
            </div>
          )}
        </div>
        </main>
    </div>
  )
}

export default App

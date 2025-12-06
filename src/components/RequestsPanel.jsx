import { useState, useEffect, useRef } from 'react'
import { FiFilter, FiSearch, FiX, FiDownload, FiRefreshCw, FiTrash2, FiCopy } from 'react-icons/fi'

export default function RequestsPanel() {
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [filter, setFilter] = useState({
    method: 'all',
    status: 'all',
    search: '',
  })
  const [isCapturing, setIsCapturing] = useState(false)
  const [viewMode, setViewMode] = useState('list') // list, details
  const requestsRef = useRef([])

  // Инициализация перехвата запросов через Electron IPC
  useEffect(() => {
    if (!window.electronAPI) return

    if (isCapturing) {
      // Запускаем перехват через IPC
      window.electronAPI.startRequestCapture().then((res) => {
        if (!res.ok) {
          console.error('Failed to start request capture:', res.error)
          setIsCapturing(false)
        }
      })

      // Слушаем события запросов
      const handleRequestStarted = (data) => {
        setRequests(prev => {
          const existing = prev.find(r => r.id === data.id)
          if (existing) {
            return prev.map(r => r.id === data.id ? { ...r, ...data } : r)
          }
          return [...prev, data].slice(-500) // Храним последние 500 запросов
        })
      }

      const handleRequestCompleted = (data) => {
        setRequests(prev => {
          const existing = prev.find(r => r.id === data.id)
          if (existing) {
            return prev.map(r => r.id === data.id ? { ...r, ...data } : r)
          }
          return [...prev, data].slice(-500)
        })
      }

      const handleRequestError = (data) => {
        setRequests(prev => {
          const existing = prev.find(r => r.id === data.id)
          if (existing) {
            return prev.map(r => r.id === data.id ? { ...r, ...data } : r)
          }
          return [...prev, data].slice(-500)
        })
      }

      window.electronAPI.onRequestStarted(handleRequestStarted)
      window.electronAPI.onRequestCompleted(handleRequestCompleted)
      window.electronAPI.onRequestError(handleRequestError)

      return () => {
        window.electronAPI.stopRequestCapture()
        window.electronAPI.removeRequestListeners()
      }
    } else {
      // Останавливаем перехват
      window.electronAPI.stopRequestCapture()
      window.electronAPI.removeRequestListeners()
    }
  }, [isCapturing])

  // Фильтрация запросов
  const filteredRequests = requests.filter(req => {
    if (filter.method !== 'all' && req.method !== filter.method) return false
    if (filter.status !== 'all') {
      if (filter.status === 'success' && (!req.status || req.status >= 400)) return false
      if (filter.status === 'error' && req.status && req.status < 400) return false
      if (filter.status === 'pending' && req.status !== 'pending') return false
    }
    if (filter.search && !req.url.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const getStatusColor = (status) => {
    if (!status || status === 'pending') return 'text-yellow-400'
    if (status >= 200 && status < 300) return 'text-green-400'
    if (status >= 300 && status < 400) return 'text-blue-400'
    if (status >= 400) return 'text-red-400'
    return 'text-muted'
  }

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      POST: 'bg-green-500/20 text-green-300 border-green-500/50',
      PUT: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      DELETE: 'bg-red-500/20 text-red-300 border-red-500/50',
      PATCH: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    }
    return colors[method] || 'bg-white/10 text-white border-white/20'
  }

  const clearRequests = () => {
    setRequests([])
    setSelectedRequest(null)
  }

  const exportRequests = () => {
    const data = JSON.stringify(filteredRequests, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `requests-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">HTTP Запросы</h2>
            <p className="text-sm text-muted">Перехват и анализ сетевых запросов</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCapturing(!isCapturing)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                isCapturing
                  ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200'
                  : 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-200'
              }`}
            >
              {isCapturing ? '⏸ Остановить' : '▶ Начать перехват'}
            </button>
            <button
              onClick={clearRequests}
              disabled={requests.length === 0}
              className="px-4 py-2 rounded-xl font-medium text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiTrash2 size={16} />
              Очистить
            </button>
            <button
              onClick={exportRequests}
              disabled={filteredRequests.length === 0}
              className="px-4 py-2 rounded-xl font-medium text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiDownload size={16} />
              Экспорт
            </button>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="flex-1 min-w-[200px] relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              placeholder="Поиск по URL..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <select
            value={filter.method}
            onChange={(e) => setFilter({ ...filter, method: e.target.value })}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="all">Все методы</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="all">Все статусы</option>
            <option value="success">Успешные (2xx)</option>
            <option value="error">Ошибки (4xx, 5xx)</option>
            <option value="pending">В процессе</option>
          </select>
          {filter.search || filter.method !== 'all' || filter.status !== 'all' ? (
            <button
              onClick={() => setFilter({ method: 'all', status: 'all', search: '' })}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-text-bright transition-all"
            >
              <FiX size={18} />
            </button>
          ) : null}
        </div>

        <div className="mt-3 text-sm text-muted">
          Запросов: <span className="text-text-bright font-medium">{filteredRequests.length}</span> / {requests.length}
          {isCapturing && (
            <span className="ml-4 inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Перехват активен
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Список запросов */}
        <div className={`${selectedRequest ? 'w-1/2' : 'w-full'} border-r border-white/10 overflow-auto`}>
          {filteredRequests.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center px-8">
              <div>
                <p className="text-muted mb-2">
                  {requests.length === 0
                    ? isCapturing
                      ? 'Ожидание запросов...'
                      : 'Нажмите "Начать перехват" для мониторинга запросов'
                    : 'Нет запросов, соответствующих фильтрам'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-4 cursor-pointer transition-all hover:bg-white/5 ${
                    selectedRequest?.id === req.id ? 'bg-white/10 border-l-2 border-accent' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getMethodColor(
                            req.method
                          )}`}
                        >
                          {req.method || 'GET'}
                        </span>
                        {req.status && (
                          <span className={`text-sm font-medium ${getStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                        )}
                        {req.status === 'pending' && (
                          <span className="text-xs text-yellow-400 flex items-center gap-1">
                            <span className="loading-spinner" style={{ width: '12px', height: '12px', borderWidth: '1.5px' }}></span>
                            Загрузка...
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-text-bright truncate font-mono mb-1">{req.url}</div>
                      <div className="text-xs text-muted">
                        {new Date(req.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Детали запроса */}
        {selectedRequest && (
          <div className="w-1/2 overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Детали запроса</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Общая информация */}
                <div className="surface-card p-4">
                  <h4 className="font-medium mb-3 text-text-bright">Общая информация</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Метод:</span>
                      <span className="text-text-bright font-mono">{selectedRequest.method || 'GET'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">URL:</span>
                      <span className="text-text-bright font-mono break-all text-right">{selectedRequest.url}</span>
                    </div>
                    {selectedRequest.status && (
                      <div className="flex justify-between">
                        <span className="text-muted">Статус:</span>
                        <span className={`font-medium ${getStatusColor(selectedRequest.status)}`}>
                          {selectedRequest.status} {selectedRequest.statusText || ''}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted">Время:</span>
                      <span className="text-text-bright">
                        {new Date(selectedRequest.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Заголовки запроса */}
                {selectedRequest.headers && Object.keys(selectedRequest.headers).length > 0 && (
                  <div className="surface-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-text-bright">Заголовки запроса</h4>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(selectedRequest.headers, null, 2))}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        title="Копировать"
                      >
                        <FiCopy size={16} />
                      </button>
                    </div>
                    <pre className="text-xs bg-black/40 p-3 rounded-lg overflow-auto max-h-48 font-mono text-white">
                      {JSON.stringify(selectedRequest.headers, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Тело запроса */}
                {selectedRequest.body && (
                  <div className="surface-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-text-bright">Тело запроса</h4>
                      <button
                        onClick={() => copyToClipboard(selectedRequest.body)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        title="Копировать"
                      >
                        <FiCopy size={16} />
                      </button>
                    </div>
                    <pre className="text-xs bg-black/40 p-3 rounded-lg overflow-auto max-h-64 font-mono text-white">
                      {typeof selectedRequest.body === 'string'
                        ? selectedRequest.body
                        : JSON.stringify(selectedRequest.body, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Заголовки ответа */}
                {selectedRequest.status && selectedRequest.headers && (
                  <div className="surface-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-text-bright">Заголовки ответа</h4>
                      {selectedRequest.headers && Object.keys(selectedRequest.headers).length > 0 && (
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(selectedRequest.headers, null, 2))}
                          className="p-1.5 hover:bg-white/10 rounded transition-colors"
                          title="Копировать"
                        >
                          <FiCopy size={16} />
                        </button>
                      )}
                    </div>
                    {selectedRequest.headers && Object.keys(selectedRequest.headers).length > 0 ? (
                      <pre className="text-xs bg-black/40 p-3 rounded-lg overflow-auto max-h-48 font-mono text-text-bright">
                        {JSON.stringify(selectedRequest.headers, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-sm text-muted">Нет заголовков</p>
                    )}
                  </div>
                )}

                {/* Тело ответа */}
                {selectedRequest.responseBody && (
                  <div className="surface-card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-text-bright">Тело ответа</h4>
                      <button
                        onClick={() => copyToClipboard(selectedRequest.responseBody)}
                        className="p-1.5 hover:bg-white/10 rounded transition-colors"
                        title="Копировать"
                      >
                        <FiCopy size={16} />
                      </button>
                    </div>
                    <pre className="text-xs bg-black/40 p-3 rounded-lg overflow-auto max-h-96 font-mono text-text-bright">
                      {selectedRequest.responseBody}
                    </pre>
                  </div>
                )}

                {/* Ошибка */}
                {selectedRequest.error && (
                  <div className="surface-card p-4 border border-red-500/50 bg-red-500/10">
                    <h4 className="font-medium mb-2 text-red-200">Ошибка</h4>
                    <p className="text-sm text-red-300">{selectedRequest.error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


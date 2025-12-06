import { useState, useEffect, useRef, useMemo } from 'react'

export default function Browser({ url, reloadKey = 0, onNavigate }) {
  const src = url || 'about:blank'

  const [status, setStatus] = useState('idle')
  const hostname = useMemo(() => {
    try {
      return new URL(src).hostname || '—'
    } catch {
      return '—'
    }
  }, [src])

  useEffect(() => {
    setStatus('loading')
  }, [src, reloadKey])

  const webviewRef = useRef(null)
  const currentUrlRef = useRef(url)

  // Обновляем ref при изменении url извне
  useEffect(() => {
    currentUrlRef.current = url
  }, [url])

  useEffect(() => {
    const node = webviewRef.current
    if (!node) return

    const onDidFinish = () => setStatus('loaded')
    const onDidFail = (e) => {
      console.warn('Webview failed to load', e)
      setStatus('error')
    }

    // Отслеживание навигации для обновления URL в адресной строке
    const onDidNavigate = (e) => {
      if (e.url && onNavigate && e.url !== 'about:blank') {
        // Обновляем URL только если он изменился
        const normalizedUrl = e.url.split('#')[0] // Убираем hash для сравнения
        const currentNormalized = currentUrlRef.current?.split('#')[0]
        if (normalizedUrl !== currentNormalized) {
          onNavigate(e.url)
        }
      }
    }

    // Отслеживание навигации внутри страницы (якоря, hash изменения)
    const onDidNavigateInPage = (e) => {
      if (e.url && onNavigate && e.isMainFrame && e.url !== 'about:blank') {
        // Обновляем URL только если он изменился
        if (e.url !== currentUrlRef.current) {
          onNavigate(e.url)
        }
      }
    }

    node.addEventListener('did-finish-load', onDidFinish)
    node.addEventListener('did-fail-load', onDidFail)
    node.addEventListener('did-navigate', onDidNavigate)
    node.addEventListener('did-navigate-in-page', onDidNavigateInPage)

    return () => {
      try {
        node.removeEventListener('did-finish-load', onDidFinish)
        node.removeEventListener('did-fail-load', onDidFail)
        node.removeEventListener('did-navigate', onDidNavigate)
        node.removeEventListener('did-navigate-in-page', onDidNavigateInPage)
      } catch (err) {
        // node may have been removed
      }
    }
  }, [src, reloadKey, onNavigate])

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 transition-colors duration-300">
      {/* Browser window using Electron webview */}
      <div className="flex-1 border border-white/5 bg-black/40 rounded-2xl overflow-hidden transition-colors duration-300">
        <webview
          key={`${reloadKey}-${src}`}
          ref={webviewRef}
          src={src}
          className="w-full h-full"
        />
      </div>

      <div className="px-4 py-3 surface-muted text-sm text-muted flex items-center justify-between rounded-xl transition-colors duration-300">
        <span>
          {status === 'loading' && 'Идёт загрузка ресурса...'}
          {status === 'loaded' && 'Сессия активна. Включено отслеживание заголовков и ответов.'}
          {status === 'error' && 'Не удалось загрузить ресурс. Попробуйте открыть во внешнем окне.'}
        </span>
        <span className="text-xs uppercase tracking-[0.3em] text-muted-dark">
          {hostname}
        </span>
      </div>
    </div>
  )
}

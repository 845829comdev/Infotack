import { useState } from 'react'
import OsintLibrary from './OsintLibrary'
import OsintMap from './OsintMap'

export default function OsintPanel({ onNavigate }) {
  const [tab, setTab] = useState('tools')
  const [host, setHost] = useState('')
  const [dnsResult, setDnsResult] = useState(null)
  const [headersResult, setHeadersResult] = useState(null)
  const [whoisResult, setWhoisResult] = useState(null)
  const [httpResult, setHttpResult] = useState(null)

  const doDns = async () => {
    setDnsResult({ loading: true })
    try {
      const res = await window.electronAPI.dnsLookup(host)
      setDnsResult(res)
    } catch (err) {
      setDnsResult({ ok: false, error: String(err) })
    }
  }

  const doHeaders = async () => {
    setHeadersResult({ loading: true })
    try {
      const res = await window.electronAPI.fetchHeaders(host.startsWith('http') ? host : `https://${host}`)
      setHeadersResult(res)
    } catch (err) {
      setHeadersResult({ ok: false, error: String(err) })
    }
  }

  const doWhois = async () => {
    setWhoisResult({ loading: true })
    try {
      const res = await window.electronAPI.whois(host)
      setWhoisResult(res)
    } catch (err) {
      setWhoisResult({ ok: false, error: String(err) })
    }
  }

  const doHttpGet = async () => {
    setHttpResult({ loading: true })
    try {
      const res = await window.electronAPI.httpGet(host.startsWith('http') ? host : `https://${host}`)
      setHttpResult(res)
    } catch (err) {
      setHttpResult({ ok: false, error: String(err) })
    }
  }

  return (
    <div className="flex flex-col h-full text-text-bright">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-dark mb-1">OSINT модуль</p>
          <h2 className="text-xl font-semibold">Инструменты разведки</h2>
        </div>
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
          <button onClick={() => setTab('tools')} className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${tab==='tools' ? 'bg-white/20 text-text-bright' : 'text-muted hover:text-text-bright'}`}>Инструменты</button>
          <button onClick={() => setTab('library')} className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${tab==='library' ? 'bg-white/20 text-text-bright' : 'text-muted hover:text-text-bright'}`}>Библиотека</button>
          <button onClick={() => setTab('map')} className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${tab==='map' ? 'bg-white/20 text-text-bright' : 'text-muted hover:text-text-bright'}`}>Карта</button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
      {tab === 'map' ? (
          <div className="h-full">
        <OsintMap />
          </div>
      ) : tab === 'library' ? (
          <div className="h-full min-h-0">
        <OsintLibrary onOpen={onNavigate} />
          </div>
      ) : (
          <div className="h-full overflow-auto pr-1 space-y-6">
            <div>
              <label className="block text-sm text-muted mb-2">Домен / URL</label>
              <div className="flex gap-2 flex-wrap">
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
                  className="flex-1 min-w-[220px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-text-bright transition-all"
            placeholder="example.com или https://example.com"
          />
                <div className="flex gap-2 flex-wrap">
                  <button onClick={doDns} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">DNS</button>
                  <button onClick={doHeaders} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Headers</button>
                  <button onClick={doWhois} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">WHOIS</button>
                  <button onClick={doHttpGet} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">HTTP GET</button>
                </div>
        </div>
      </div>

            <div>
              <h3 className="text-sm font-medium text-text-bright mb-2">DNS Result</h3>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs max-h-60 overflow-auto">
          {dnsResult ? (dnsResult.ok ? JSON.stringify(dnsResult.records, null, 2) : dnsResult.error) : '—'}
        </pre>
      </div>

      <div>
              <h3 className="text-sm font-medium text-text-bright mb-2">Headers Result</h3>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs max-h-60 overflow-auto">
          {headersResult ? (headersResult.ok ? JSON.stringify(headersResult.headers, null, 2) : headersResult.error) : '—'}
        </pre>
      </div>

            <div>
              <h3 className="text-sm font-medium text-text-bright mb-2">WHOIS Result</h3>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs max-h-60 overflow-auto">
          {whoisResult ? (whoisResult.ok ? whoisResult.text : whoisResult.error) : '—'}
        </pre>
      </div>

            <div>
              <h3 className="text-sm font-medium text-text-bright mb-2">HTTP GET Result (truncated)</h3>
              <pre className="bg-black/40 border border-white/10 rounded-xl p-4 text-xs max-h-60 overflow-auto">
          {httpResult ? (httpResult.ok ? `Status: ${httpResult.status}\nContent-Type: ${httpResult.contentType}\n\n${httpResult.body}` : httpResult.error) : '—'}
        </pre>
      </div>
          </div>
      )}
      </div>
    </div>
  )
}

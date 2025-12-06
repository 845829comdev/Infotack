import { useState } from 'react'

export default function SecurityPanel() {
  const [tab, setTab] = useState('proxy')
  const [proxyUrl, setProxyUrl] = useState('http://127.0.0.1:8080')
  const [proxyEnabled, setProxyEnabled] = useState(false)
  const [proxyStatus, setProxyStatus] = useState('disconnected')
  const [vpnCountry, setVpnCountry] = useState('us')
  const [vpnEnabled, setVpnEnabled] = useState(false)
  const [vpnStatus, setVpnStatus] = useState('disconnected')
  const [dnsServer, setDnsServer] = useState('8.8.8.8')
  const [dnsEnabled, setDnsEnabled] = useState(false)
  const [torStatus, setTorStatus] = useState('disconnected')
  const [torEnabled, setTorEnabled] = useState(false)
  const [certPin, setCertPin] = useState('')
  const [sslVerify, setSslVerify] = useState(true)
  const [cookies, setCookies] = useState(true)
  const [javascript, setJavascript] = useState(true)
  const [userAgent, setUserAgent] = useState('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')

  const toggleProxy = () => {
    if (proxyEnabled) {
      setProxyStatus('disconnected')
      setProxyEnabled(false)
    } else {
      setProxyStatus('connecting...')
      setTimeout(() => {
        setProxyStatus('connected')
        setProxyEnabled(true)
      }, 1000)
    }
  }

  const toggleVPN = () => {
    if (vpnEnabled) {
      setVpnStatus('disconnected')
      setVpnEnabled(false)
    } else {
      setVpnStatus('connecting to ' + vpnCountry.toUpperCase() + '...')
      setTimeout(() => {
        setVpnStatus('connected (' + vpnCountry.toUpperCase() + ')')
        setVpnEnabled(true)
      }, 1500)
    }
  }

  const toggleTor = () => {
    if (torEnabled) {
      setTorStatus('disconnected')
      setTorEnabled(false)
    } else {
      setTorStatus('connecting...')
      setTimeout(() => {
        setTorStatus('connected (Tor enabled)')
        setTorEnabled(true)
      }, 2000)
    }
  }

  const toggleDNS = () => {
    if (dnsEnabled) {
      setDnsEnabled(false)
    } else {
      setDnsEnabled(true)
    }
  }

  const getStatusColor = (status) => {
    if (status.includes('connected')) {
      return 'bg-green-500/20 border-green-500/50 text-green-200'
    } else if (status.includes('connecting')) {
      return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200'
    }
    return 'bg-white/5 border-white/10 text-muted'
  }

  const ProxySection = () => (
    <div className="tab-content-enter space-y-4">
      <div className="surface-card p-5">
        <h3 className="font-semibold mb-2 text-text-bright text-lg">Прокси сервер</h3>
        <p className="text-sm text-muted mb-4">Маршрутизируйте трафик через прокси для анонимности и смены IP.</p>
        
        <label className="block text-sm text-muted mb-2 font-medium">Адрес прокси (host:port)</label>
        <input
          value={proxyUrl}
          onChange={(e) => setProxyUrl(e.target.value)}
          disabled={proxyEnabled}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-text-bright placeholder:text-muted mb-4 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 transition-all"
          placeholder="127.0.0.1:8080"
        />

        <button
          onClick={toggleProxy}
          className={`w-full py-3 rounded-xl font-medium transition-all ${
            proxyEnabled
              ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200'
              : 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-200'
          }`}
        >
          {proxyEnabled ? '❌ Отключить прокси' : '✓ Подключить прокси'}
        </button>

        <div className={`mt-4 p-4 rounded-xl border text-sm ${getStatusColor(proxyStatus)}`}>
          Статус: <span className="font-bold">{proxyStatus}</span>
        </div>
      </div>

      <div className="surface-card p-5">
        <h4 className="font-medium text-sm mb-3 text-text-bright">Предустановленные прокси</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Localhost:8080', url: 'http://127.0.0.1:8080' },
            { label: 'Squid', url: 'http://127.0.0.1:3128' },
            { label: 'SOCKS5', url: 'socks5://127.0.0.1:1080' },
            { label: 'HTTP', url: 'http://proxy.example.com:3128' },
          ].map((p) => (
            <button
              key={p.url}
              onClick={() => setProxyUrl(p.url)}
              disabled={proxyEnabled}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-text-bright transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const VPNSection = () => (
    <div className="tab-content-enter space-y-4">
      <div className="surface-card p-5">
        <h3 className="font-semibold mb-2 text-text-bright text-lg">VPN подключение</h3>
        <p className="text-sm text-muted mb-4">Подключитесь к VPN для шифрования трафика и смены геолокации.</p>
        
        <label className="block text-sm text-muted mb-2 font-medium">Страна</label>
        <select
          value={vpnCountry}
          onChange={(e) => setVpnCountry(e.target.value)}
          disabled={vpnEnabled}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-text-bright mb-4 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 transition-all"
        >
          <option value="us">🇺🇸 United States</option>
          <option value="gb">🇬🇧 United Kingdom</option>
          <option value="de">🇩🇪 Germany</option>
          <option value="fr">🇫🇷 France</option>
          <option value="nl">🇳🇱 Netherlands</option>
          <option value="jp">🇯🇵 Japan</option>
          <option value="ru">🇷🇺 Russia</option>
          <option value="cn">🇨🇳 Singapore</option>
          <option value="au">🇦🇺 Australia</option>
          <option value="ca">🇨🇦 Canada</option>
        </select>

        <button
          onClick={toggleVPN}
          className={`w-full py-3 rounded-xl font-medium transition-all ${
            vpnEnabled
              ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200'
              : 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-200'
          }`}
        >
          {vpnEnabled ? '❌ Отключить VPN' : '✓ Подключить VPN'}
        </button>

        <div className={`mt-4 p-4 rounded-xl border text-sm ${getStatusColor(vpnStatus)}`}>
          Статус: <span className="font-bold">{vpnStatus}</span>
        </div>
      </div>
    </div>
  )

  const TorSection = () => (
    <div className="tab-content-enter space-y-4">
      <div className="surface-card p-5">
        <h3 className="font-semibold mb-2 text-text-bright text-lg">Tor браузер</h3>
        <p className="text-sm text-muted mb-4">Подключитесь к сети Tor для максимальной анонимности.</p>
        
        <button
          onClick={toggleTor}
          className={`w-full py-3 rounded-xl font-medium transition-all ${
            torEnabled
              ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200'
              : 'bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-200'
          }`}
        >
          {torEnabled ? '❌ Отключить Tor' : '✓ Подключить Tor'}
        </button>

        <div className={`mt-4 p-4 rounded-xl border text-sm ${getStatusColor(torStatus)}`}>
          Статус: <span className="font-bold">{torStatus}</span>
        </div>

        <div className="mt-4 p-4 bg-white/3 border border-white/10 rounded-xl text-xs text-muted">
          <strong>Примечание:</strong> Tor замедляет скорость подключения. Используйте для чувствительных операций.
        </div>
      </div>
    </div>
  )

  const DNSSection = () => (
    <div className="tab-content-enter space-y-4">
      <div className="surface-card p-5">
        <h3 className="font-semibold mb-2 text-text-bright text-lg">DNS и DoH</h3>
        <p className="text-sm text-muted mb-4">Установите пользовательский DNS сервер для конфиденциальности.</p>
        
        <label className="block text-sm text-muted mb-2 font-medium">DNS сервер</label>
        <input
          value={dnsServer}
          onChange={(e) => setDnsServer(e.target.value)}
          disabled={dnsEnabled}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-text-bright placeholder:text-muted mb-4 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 transition-all"
          placeholder="8.8.8.8"
        />

        <button
          onClick={toggleDNS}
          className={`w-full py-3 rounded-xl font-medium transition-all ${
            dnsEnabled
              ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200'
              : 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-200'
          }`}
        >
          {dnsEnabled ? '❌ Отключить DNS' : '✓ Использовать DNS'}
        </button>

        <div className="mt-4 p-4 bg-white/3 border border-white/10 rounded-xl text-xs text-text-bright space-y-2">
          <div className="font-medium mb-2">Популярные DNS:</div>
          <div className="text-muted">Google: 8.8.8.8 / 8.8.4.4</div>
          <div className="text-muted">Cloudflare: 1.1.1.1 / 1.0.0.1</div>
          <div className="text-muted">Quad9: 9.9.9.9</div>
          <div className="text-muted">NextDNS: 45.90.28.0</div>
        </div>
      </div>
    </div>
  )

  const BrowserSecuritySection = () => (
    <div className="tab-content-enter space-y-4">
      <div className="surface-card p-5">
        <h3 className="font-semibold mb-2 text-text-bright text-lg">Параметры браузера</h3>

        <div className="space-y-3 mb-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cookies}
              onChange={(e) => setCookies(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-text-bright">Разрешить cookies</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={javascript}
              onChange={(e) => setJavascript(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-text-bright">Включить JavaScript</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sslVerify}
              onChange={(e) => setSslVerify(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm text-text-bright">Проверять SSL сертификаты</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-muted mb-2 font-medium">User-Agent</label>
          <textarea
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-text-bright text-xs max-h-24 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none transition-all"
            placeholder="User-Agent строка"
          />
        </div>

        <div className="p-4 bg-white/3 border border-white/10 rounded-xl text-xs text-text-bright">
          <strong className="text-muted">User-Agent примеры:</strong>
          <div className="mt-3 space-y-2">
            {[
              { label: 'Chrome on Windows', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
              { label: 'Safari on MacOS', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
              { label: 'Firefox on Linux', value: 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0' },
            ].map((ua) => (
              <button
                key={ua.label}
                onClick={() => setUserAgent(ua.value)}
                className="block w-full text-left text-accent hover:underline transition-colors"
              >
                {ua.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const CertificatePinningSection = () => (
    <div className="tab-content-enter space-y-4">
      <div className="surface-card p-5">
        <h3 className="font-semibold mb-2 text-text-bright text-lg">Pinning сертификатов</h3>
        <p className="text-sm text-muted mb-4">Блокируйте изменения SSL сертификатов для защиты от MITM атак.</p>
        
        <label className="block text-sm text-muted mb-2 font-medium">Публичный ключ (SHA-256)</label>
        <textarea
          value={certPin}
          onChange={(e) => setCertPin(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-text-bright text-xs h-24 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none transition-all"
          placeholder="Введите SHA-256 хеш сертификата..."
        />

        <button className="w-full mt-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl font-medium text-red-200 transition-all">
          🔐 Добавить Pinning
        </button>

        <div className="mt-4 p-4 bg-white/3 border border-white/10 rounded-xl text-xs text-muted font-mono break-all">
          <strong className="text-text-bright block mb-2">Получение SHA-256:</strong>
          openssl s_client -connect example.com:443 | openssl x509 -pubkey | openssl pkey -pubin -outform DER | openssl dgst -sha256 -binary | base64
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-xl font-semibold mb-1">Безопасность и приватность</h2>
        <p className="text-sm text-muted">Настройка прокси, VPN, Tor и параметров браузера</p>
      </div>

      <div className="px-6 pb-4 flex gap-2 border-b border-white/10 overflow-x-auto">
        {[
          { id: 'proxy', label: 'Прокси', color: 'blue' },
          { id: 'vpn', label: 'VPN', color: 'green' },
          { id: 'tor', label: 'Tor', color: 'purple' },
          { id: 'dns', label: 'DNS', color: 'cyan' },
          { id: 'browser', label: 'Браузер', color: 'orange' },
          { id: 'cert', label: 'Сертификаты', color: 'red' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tab-button px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap transform hover:scale-105 active:scale-95 ${
              tab === t.id
                ? 'active bg-white/10 text-text-bright'
                : 'bg-white/5 text-muted hover:bg-white/8 hover:text-text-bright'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-6 py-6">
        {tab === 'proxy' && <ProxySection />}
        {tab === 'vpn' && <VPNSection />}
        {tab === 'tor' && <TorSection />}
        {tab === 'dns' && <DNSSection />}
        {tab === 'browser' && <BrowserSecuritySection />}
        {tab === 'cert' && <CertificatePinningSection />}
      </div>

      <div className="px-6 pb-6 pt-4 border-t border-white/10">
        <div className="surface-card p-4 border border-yellow-500/30 bg-yellow-500/5 text-yellow-200 text-sm rounded-xl">
          <strong>Внимание:</strong> Используйте только для законных целей. Некоторые функции требуют установки дополнительных инструментов (Tor, VPN клиент).
        </div>
      </div>
    </div>
  )
}

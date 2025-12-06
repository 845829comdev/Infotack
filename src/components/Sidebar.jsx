import {
  FiGlobe,
  FiMap,
  FiSearch,
  FiCode,
  FiDatabase,
  FiShield,
  FiSettings,
} from 'react-icons/fi'

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'browser', label: 'Браузер', icon: FiGlobe, hint: 'Рабочее окно' },
    { id: 'osint', label: 'OSINT', icon: FiMap, hint: 'Аналитика и поиск' },
    { id: 'pentest', label: 'Пентест', icon: FiSearch, hint: 'Сканирование' },
    { id: 'requests', label: 'Запросы', icon: FiCode, hint: 'HTTP инспекция' },
    { id: 'database', label: 'База данных', icon: FiDatabase, hint: 'Артефакты' },
    { id: 'security', label: 'Безопасность', icon: FiShield, hint: 'Политики' },
    { id: 'settings', label: 'Настройки', icon: FiSettings, hint: 'Тема и UI' },
  ]

  return (
    <aside className="w-72 border-r border-white/10 px-5 py-6 flex flex-col gap-8 backdrop-blur-sm bg-black/15 overflow-y-auto">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-dark">Навигация</p>
        <div className="mt-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
            const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? 'bg-white/5 border-white/20 text-white shadow-lg shadow-black/40'
                    : 'border-transparent text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-accent shadow-[0_0_0_6px_rgba(100,213,255,0.15)]' : 'bg-white/15'
              }`}
                  />
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{item.hint}</p>
                  </div>
                </div>
                {isActive && (
                  <span className="text-[10px] tracking-[0.2em] uppercase text-accent">
                    active
                  </span>
                )}
            </button>
          )
        })}
        </div>
      </div>

      <div className="surface-muted p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-dark mb-2">Сборка</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Версия</p>
            <p className="text-lg font-semibold text-white">1.0.0 Alpha</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Прототип</p>
            <p className="text-sm text-muted-dark">Desktop / Electron</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

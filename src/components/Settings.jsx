import React, { useEffect, useState, useCallback } from 'react'

const THEMES = [
  { id: 'light', label: 'Светлая', icon: '☀️' },
  { id: 'dark', label: 'Тёмная', icon: '🌙' },
  { id: 'black', label: 'Чёрная', icon: '⚫' },
  { id: 'solarized', label: 'Solarized', icon: '🌅' },
]

export default function Settings() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('infotack_theme') || 'dark'
    } catch (e) {
      return 'dark'
    }
  })

  const [accent, setAccent] = useState(() => {
    try {
      return localStorage.getItem('infotack_accent') || '#06b6d4'
    } catch (e) {
      return '#06b6d4'
    }
  })

  const [isChanging, setIsChanging] = useState(false)

  // Оптимизированное применение темы с плавным переходом
  const applyTheme = useCallback((newTheme) => {
    const el = document.documentElement
    
    // Добавляем класс для плавного перехода
    setIsChanging(true)
    
    // Используем requestAnimationFrame для плавности
    requestAnimationFrame(() => {
      // Удаляем все классы тем
    el.classList.remove('theme-light', 'theme-dark', 'theme-black', 'theme-solarized')
      
      // Добавляем новую тему
      el.classList.add(`theme-${newTheme}`)
      
      // Сохраняем в localStorage
    try {
        localStorage.setItem('infotack_theme', newTheme)
      } catch (e) {
        console.warn('Failed to save theme to localStorage:', e)
      }
      
      // Убираем флаг изменения после завершения перехода
      setTimeout(() => {
        setIsChanging(false)
      }, 300)
    })
  }, [])

  // Применение акцентного цвета
  const applyAccent = useCallback((newAccent) => {
    document.documentElement.style.setProperty('--accent', newAccent)
    try {
      localStorage.setItem('infotack_accent', newAccent)
    } catch (e) {
      console.warn('Failed to save accent to localStorage:', e)
    }
  }, [])

  // Применяем тему при изменении
  useEffect(() => {
    applyTheme(theme)
  }, [theme, applyTheme])

  // Применяем акцентный цвет при изменении
  useEffect(() => {
    applyAccent(accent)
  }, [accent, applyAccent])

  // Обработчик смены темы
  const handleThemeChange = useCallback((newTheme) => {
    if (newTheme !== theme && !isChanging) {
      setTheme(newTheme)
    }
  }, [theme, isChanging])

  // Сброс настроек
  const reset = useCallback(() => {
    setTheme('dark')
    setAccent('#06b6d4')
  }, [])

  // Валидация акцентного цвета
  const handleAccentChange = useCallback((value) => {
    // Проверяем, что это валидный hex цвет
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setAccent(value)
    }
  }, [])

  return (
    <div className="p-6 text-gray-200">
      <h2 className="text-2xl font-semibold mb-6">Настройки</h2>

      <section className="mb-8">
        <h3 className="font-medium mb-4 text-lg">Тема оформления</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              disabled={isChanging}
              className={`
                relative px-4 py-3 rounded-lg border-2 transition-all duration-300 text-sm font-medium
                ${theme === t.id 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent shadow-lg scale-105' 
                  : 'bg-gray-800 text-gray-200 border-gray-700 hover:border-gray-600 hover:bg-gray-700'
                }
                ${isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                transform hover:scale-105 active:scale-95
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <span>{t.label}</span>
              </div>
              {theme === t.id && (
                <div className="absolute top-2 right-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        {isChanging && (
          <p className="text-xs text-gray-400 mt-2 text-center">Применение темы...</p>
        )}
      </section>

      <section className="mb-8">
        <h3 className="font-medium mb-4 text-lg">Акцентный цвет</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              aria-label="accent color picker" 
              type="color" 
              value={accent} 
              onChange={(e) => setAccent(e.target.value)} 
              className="w-16 h-16 p-0 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors"
            />
          </div>
          <div className="flex-1">
            <input 
              type="text" 
              value={accent} 
              onChange={(e) => handleAccentChange(e.target.value)}
              placeholder="#06b6d4"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Измените акцентный цвет интерфейса. Введите hex-код цвета (например, #06b6d4).
        </p>
        <div className="mt-4 flex gap-2 flex-wrap">
          <button 
            onClick={() => setAccent('#06b6d4')} 
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs border border-gray-700"
          >
            Циан
          </button>
          <button 
            onClick={() => setAccent('#3b82f6')} 
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs border border-gray-700"
          >
            Синий
          </button>
          <button 
            onClick={() => setAccent('#10b981')} 
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs border border-gray-700"
          >
            Зелёный
          </button>
          <button 
            onClick={() => setAccent('#f59e0b')} 
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs border border-gray-700"
          >
            Оранжевый
          </button>
          <button 
            onClick={() => setAccent('#ef4444')} 
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs border border-gray-700"
          >
            Красный
          </button>
          <button 
            onClick={() => setAccent('#8b5cf6')} 
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs border border-gray-700"
          >
            Фиолетовый
          </button>
        </div>
      </section>

      <section>
        <button 
          onClick={reset} 
          className="px-6 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium border border-gray-700 transition-all duration-200 hover:border-gray-600"
        >
          Сбросить к умолчанию
        </button>
      </section>
    </div>
  )
}

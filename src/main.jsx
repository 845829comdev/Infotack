import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import 'leaflet/dist/leaflet.css'

// Применяем сохранённую тему ДО монтирования React для предотвращения мерцания
// Это критично для плавного отображения
(function applyThemeBeforeMount() {
try {
    const savedTheme = localStorage.getItem('infotack_theme') || 'dark'
    const savedAccent = localStorage.getItem('infotack_accent') || '#06b6d4'
    
    // Применяем тему сразу к documentElement
    document.documentElement.classList.add(`theme-${savedTheme}`)
    document.documentElement.style.setProperty('--accent', savedAccent)
    
    // Также применяем к body для немедленного эффекта
    document.body.style.backgroundColor = 'var(--bg)'
    document.body.style.color = 'var(--text)'
} catch (e) {
    // Если localStorage недоступен, используем тему по умолчанию
    document.documentElement.classList.add('theme-dark')
    document.documentElement.style.setProperty('--accent', '#06b6d4')
}
})()

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

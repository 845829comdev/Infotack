import { FiSearch, FiArrowLeft, FiArrowRight, FiRefreshCw, FiHome } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function Navbar({ url, setUrl, onBack, onForward, onRefresh, onHome, onOpenExternal }) {
  const [input, setInput] = useState(url || '')
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setInput(url || '')
  }, [url])

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInput(value);

    // Use main process to fetch suggestions (avoids CORS)
    if (value.length > 2 && window.electronAPI && window.electronAPI.suggestions) {
      try {
        const res = await window.electronAPI.suggestions(value);
        if (res.ok) setSuggestions(res.suggestions || []);
        else setSuggestions([]);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setUrl(normalizeUrl(input))
      setSuggestions([])
    }
  };

  const normalizeUrl = (u) => {
    if (!u) return '';
    // If user already provided a scheme, trust it
    try {
      const parsed = new URL(u);
      return parsed.href;
    } catch (err) {
      // Not a full URL — decide: if it looks like a domain, add https, otherwise perform a search
      const trimmed = u.trim();
      // Heuristic: if contains spaces or doesn't contain a dot, treat as search
      if (trimmed.includes(' ') || !trimmed.includes('.')) {
        return 'https://www.google.com/search?q=' + encodeURIComponent(trimmed);
      }
      return 'https://' + trimmed;
    }
  };

  const actionButtonClass =
    'w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-muted hover:text-white hover:border-white/30 transition-colors'

  return (
    <div className="surface-card px-5 py-4 flex flex-wrap items-center gap-4">
      <div className="flex gap-2">
        <button onClick={onBack} className={actionButtonClass} aria-label="Назад">
          <FiArrowLeft size={16} />
        </button>
        <button onClick={onForward} className={actionButtonClass} aria-label="Вперёд">
          <FiArrowRight size={16} />
        </button>
        <button onClick={onRefresh} className={actionButtonClass} aria-label="Обновить">
          <FiRefreshCw size={16} />
        </button>
        <button onClick={onHome} className={actionButtonClass} aria-label="Домой">
          <FiHome size={16} />
        </button>
      </div>

      <div className="flex-1 min-w-[280px] relative">
        <div className="flex items-center gap-3 bg-white/3 border border-white/10 rounded-xl px-4 py-2.5">
          <FiSearch size={18} className="text-muted" />
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent outline-none text-white placeholder:text-muted focus:ring-0"
          placeholder="Введите URL или запрос..."
        />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">enter</span>
        </div>

        {suggestions.length > 0 && (
          <ul className="absolute top-full left-0 w-full bg-black/70 border border-white/10 rounded-xl mt-2 z-10 backdrop-blur-md overflow-hidden">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => {
                  setUrl(suggestion)
                  setSuggestions([])
                }}
                className="px-4 py-2 text-sm text-white/90 hover:bg-white/10 cursor-pointer transition-colors"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2">
        <button
          title="Открыть внешне"
          onClick={async () => {
            if (!input) return
            const normalized = normalizeUrl(input)
            try {
              const res = await window.electronAPI.openExternal(normalized)
              if (!res || !res.ok) alert('Не удалось открыть внешне: ' + (res && res.error ? res.error : 'unknown'))
            } catch (err) {
              alert('Ошибка при открытии внешне: ' + String(err))
            }
          }}
          className="px-4 py-2 rounded-xl border border-white/10 text-sm text-muted hover:text-white hover:border-white/30 transition-colors"
        >
          Открыть внешне
        </button>

        <button
          title="Открыть в окне приложения (обходит X-Frame-Options)"
          onClick={async () => {
            if (!input) return
            const normalized = normalizeUrl(input)
            try {
              const res = await window.electronAPI.openInApp(normalized)
              if (!res || !res.ok) alert('Не удалось открыть в приложении: ' + (res && res.error ? res.error : 'unknown'))
            } catch (err) {
              alert('Ошибка при открытии в приложении: ' + String(err))
            }
          }}
          className="px-4 py-2 rounded-xl bg-white/10 text-sm text-white hover:bg-white/20 transition-colors"
        >
          В приложении
        </button>
      </div>
    </div>
  );
}

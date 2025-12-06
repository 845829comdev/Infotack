import { useState, useRef, useEffect } from 'react'
import L from 'leaflet'

// Default icon fix for Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export default function OsintMap() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [searchInput, setSearchInput] = useState('')
  const [markers, setMarkers] = useState([])
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [loading, setLoading] = useState(false)

  // Initialize map
  useEffect(() => {
    if (map.current) return

    if (mapContainer.current) {
      map.current = L.map(mapContainer.current).setView([20, 0], 2)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current)

      // Satellite layer option
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 19,
      })

      const baseLayers = {
        'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }),
        'Satellite': satelliteLayer,
      }

      L.control.layers(baseLayers).addTo(map.current)

      // Map click handler to add markers
      map.current.on('click', (e) => {
        const { lat, lng } = e.latlng
        addMarker(lat, lng, `Marker at ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      })
    }
  }, [])

  const addMarker = (lat, lng, title) => {
    if (!map.current) return

    const marker = L.marker([lat, lng])
      .bindPopup(`<div style="font-size:12px">
        <strong>${title}</strong><br/>
        Lat: ${lat.toFixed(6)}<br/>
        Lng: ${lng.toFixed(6)}<br/>
        <a href="https://maps.google.com/?q=${lat},${lng}" target="_blank">Google Maps</a>
      </div>`)
      .addTo(map.current)

    const newMarker = { lat, lng, title, id: Date.now() }
    setMarkers([...markers, newMarker])

    marker.on('click', () => setSelectedMarker(newMarker))
  }

  const searchLocation = async () => {
    if (!searchInput.trim()) return

    setLoading(true)
    try {
      // Use Nominatim (OpenStreetMap) for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchInput)}&format=json&limit=5`
      )
      const results = await response.json()

      if (results.length > 0) {
        const first = results[0]
        const lat = parseFloat(first.lat)
        const lng = parseFloat(first.lon)

        // Clear old markers
        markers.forEach(m => {
          // In a real app, we'd track marker objects and remove them
        })

        addMarker(lat, lng, first.display_name || searchInput)
        map.current.setView([lat, lng], 13)
      } else {
        alert('Локация не найдена')
      }
    } catch (err) {
      console.error('Ошибка поиска:', err)
      alert('Ошибка при поиске локации')
    } finally {
      setLoading(false)
    }
  }

  const clearMarkers = () => {
    setMarkers([])
    setSelectedMarker(null)
    if (map.current) {
      map.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.current.removeLayer(layer)
        }
      })
    }
  }

  const exportMarkers = () => {
    const data = JSON.stringify(markers, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'osint-markers.json'
    a.click()
  }

  return (
    <div className="h-full flex flex-col text-text-bright">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">OSINT Карта</h2>
        <p className="text-sm text-muted">Добавляйте маркеры и экспортируйте геоданные.</p>
      </div>

      <div className="flex-1 min-h-0 overflow-auto pr-2">
        <div className="mb-4 p-4 bg-white/3 border border-white/10 rounded-xl">
          <label className="block text-sm text-muted mb-2">Поиск локации (адрес / город / координаты)</label>
          <div className="flex gap-2 flex-wrap">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
              className="flex-1 min-w-[240px] bg-black/30 border border-white/10 rounded px-3 py-2 text-text-bright transition-all"
            placeholder="Введите адрес или город..."
          />
          <button
            onClick={searchLocation}
            disabled={loading}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-medium disabled:opacity-50 transition"
          >
            {loading ? 'Поиск...' : 'Поиск'}
          </button>
        </div>
          <div className="text-xs text-muted mt-2">
            💡 Кликните на карту, чтобы добавить маркер. Используйте поиск для быстрого перемещения.
        </div>
      </div>

      <div
        ref={mapContainer}
          className="h-[380px] bg-black/40 border border-white/10 rounded-2xl mb-4"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-4 bg-white/3 border border-white/10 rounded-xl max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-text-bright mb-2">Маркеры ({markers.length})</h3>
          {markers.length === 0 ? (
              <p className="text-sm text-muted">Маркеры не добавлены</p>
          ) : (
            <ul className="space-y-2">
              {markers.map((m) => (
                <li
                  key={m.id}
                  onClick={() => setSelectedMarker(m)}
                  className={`p-2 rounded cursor-pointer text-sm transition ${
                    selectedMarker?.id === m.id
                        ? 'bg-white/20 text-text-bright'
                        : 'bg-black/30 text-muted hover:bg-black/40'
                  }`}
                >
                  <div className="font-medium truncate">{m.title}</div>
                    <div className="text-xs text-muted">{m.lat.toFixed(4)}, {m.lng.toFixed(4)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

          <div className="p-4 bg-white/3 border border-white/10 rounded-xl max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-text-bright mb-2">Детали маркера</h3>
          {selectedMarker ? (
            <div className="space-y-2 text-sm">
              <div>
                  <label className="text-muted-dark">Название:</label>
                  <div className="text-text-bright break-words">{selectedMarker.title}</div>
              </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                    <label className="text-muted-dark">Широта</label>
                    <div className="font-mono text-text-bright">{selectedMarker.lat.toFixed(8)}</div>
              </div>
              <div>
                    <label className="text-muted-dark">Долгота</label>
                    <div className="font-mono text-text-bright">{selectedMarker.lng.toFixed(8)}</div>
                  </div>
              </div>
              <div className="flex gap-2 pt-2">
                <a
                  href={`https://maps.google.com/?q=${selectedMarker.lat},${selectedMarker.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="flex-1 px-2 py-1 bg-white/15 hover:bg-white/25 rounded text-xs font-medium text-center"
                >
                  Google Maps
                </a>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${selectedMarker.lat}&mlon=${selectedMarker.lng}&zoom=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                    className="flex-1 px-2 py-1 bg-white/15 hover:bg-white/25 rounded text-xs font-medium text-center"
                >
                  OSM
                </a>
              </div>
            </div>
          ) : (
              <p className="text-sm text-muted">Выберите маркер для просмотра деталей</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={clearMarkers}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded font-medium text-sm"
        >
          Очистить маркеры
        </button>
        <button
          onClick={exportMarkers}
          disabled={markers.length === 0}
            className="px-4 py-2 border border-white/15 hover:border-white/30 rounded font-medium text-sm disabled:opacity-50"
        >
          Экспортировать
        </button>
        </div>
      </div>
    </div>
  )
}

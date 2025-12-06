import React from 'react'

const CATEGORIES = [
  {
    id: 'phone',
    title: 'Поиск по номеру телефона',
    items: [
      { name: 'Truecaller', url: 'https://www.truecaller.com' },
      { name: 'TruePeopleSearch', url: 'https://www.truepeoplesearch.com' },
      { name: 'NumLookup', url: 'https://www.numlookup.com' },
      { name: 'ReversePhoneUK', url: 'https://www.reversephoneuk.com' },
      { name: 'Opencellid', url: 'https://opencellid.org' },
      { name: 'Sync.Me', url: 'https://sync.me' },
      { name: 'SpyDialer', url: 'https://www.spydialer.com' },
      { name: 'AnyWho', url: 'https://www.anywho.com' },
    ],
  },
  {
    id: 'people',
    title: 'Поиск людей и профилей',
    items: [
      { name: 'Pipl', url: 'https://pipl.com' },
      { name: 'TruePeopleSearch', url: 'https://www.truepeoplesearch.com' },
      { name: 'PeekYou', url: 'https://www.peekyou.com' },
      { name: 'WhitePages', url: 'https://www.whitepages.com' },
      { name: 'Radaris', url: 'https://radaris.com' },
      { name: 'Spokeo', url: 'https://www.spokeo.com' },
      { name: 'ZabaSearch', url: 'https://www.zabasearch.com' },
      { name: 'PeopleFinder', url: 'https://www.peoplefinder.com' },
    ],
  },
  {
    id: 'social',
    title: 'Социальные сети и профили',
    items: [
      { name: 'LinkedIn', url: 'https://www.linkedin.com' },
      { name: 'Facebook', url: 'https://www.facebook.com' },
      { name: 'Twitter / X', url: 'https://twitter.com' },
      { name: 'Instagram', url: 'https://www.instagram.com' },
      { name: 'TikTok', url: 'https://www.tiktok.com' },
      { name: 'Reddit', url: 'https://www.reddit.com' },
      { name: 'VK (VKontakte)', url: 'https://vk.com' },
      { name: 'Telegram (Web)', url: 'https://web.telegram.org' },
      { name: 'Pinterest', url: 'https://www.pinterest.com' },
      { name: 'Quora', url: 'https://www.quora.com' },
    ],
  },
  {
    id: 'phone-geo',
    title: 'Геолокация и оператор (телефон)',
    items: [
      { name: 'OpenCellID', url: 'https://opencellid.org' },
      { name: 'CellMapper', url: 'https://www.cellmapper.net' },
      { name: 'CarrierLookup', url: 'https://www.carrierlookup.com' },
    ],
  },
  {
    id: 'maps',
    title: 'Карты и спутниковые снимки',
    items: [
      { name: 'Google Maps', url: 'https://maps.google.com' },
      { name: 'Google Earth', url: 'https://earth.google.com' },
      { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org' },
      { name: 'Bing Maps', url: 'https://www.bing.com/maps' },
      { name: 'Yandex Maps', url: 'https://yandex.ru/maps' },
      { name: 'Here Maps', url: 'https://wego.here.com' },
      { name: 'Wikimapia', url: 'https://wikimapia.org' },
    ],
  },
  {
    id: 'archives',
    title: 'Архивы и кеши',
    items: [
      { name: 'Wayback Machine', url: 'https://web.archive.org' },
      { name: 'Archive.today', url: 'https://archive.today' },
      { name: 'Google Cache', url: 'https://www.google.com/search?q=cache:' },
      { name: 'ArchiveBox', url: 'https://archivebox.io' },
    ],
  },
  {
    id: 'domain',
    title: 'Домены, DNS, IP, инфраструктура',
    items: [
      { name: 'Whois Lookup', url: 'https://whois.com' },
      { name: 'ICANN WHOIS', url: 'https://whois.icann.org' },
      { name: 'DNSDumpster', url: 'https://dnsdumpster.com' },
      { name: 'SecurityTrails', url: 'https://securitytrails.com' },
      { name: 'Shodan', url: 'https://www.shodan.io' },
      { name: 'Censys', url: 'https://censys.io' },
      { name: 'VirusTotal', url: 'https://www.virustotal.com' },
      { name: 'ViewDNS.info', url: 'https://viewdns.info' },
      { name: 'DNSChecker', url: 'https://dnschecker.org' },
    ],
  },
  {
    id: 'databreach',
    title: 'Утечки данных и проверка e‑mail',
    items: [
      { name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com' },
      { name: 'DeHashed', url: 'https://www.dehashed.com' },
      { name: 'Leak-Lookup', url: 'https://leak-lookup.com' },
      { name: 'BreachDirectory', url: 'https://breachdirectory.org' },
      { name: 'GhostProject', url: 'https://ghostproject.fr' },
    ],
  },
  {
    id: 'images',
    title: 'Поиск по изображениям / метаданные',
    items: [
      { name: 'Google Images', url: 'https://images.google.com' },
      { name: 'TinEye', url: 'https://tineye.com' },
      { name: 'Yandex Images', url: 'https://yandex.ru/images' },
      { name: 'EXIF.tools', url: 'https://exif.tools' },
      { name: 'FotoForensics', url: 'http://fotoforensics.com' },
    ],
  },
  {
    id: 'people-data',
    title: 'Публичные записи и базы данных',
    items: [
      { name: 'WhitePages', url: 'https://www.whitepages.com' },
      { name: 'PublicData', url: 'https://publicdata.com' },
      { name: 'OpenCorporates', url: 'https://opencorporates.com' },
      { name: 'GovRecords (US)', url: 'https://www.usa.gov' },
      { name: 'Business Registries (global)', url: 'https://www.opencorporates.com' },
    ],
  },
  {
    id: 'searches',
    title: 'Поисковые техники / Dorking',
    items: [
      { name: 'Google Dorks (Exploit-DB)', url: 'https://www.exploit-db.com/google-dorks' },
      { name: 'GHDB (Google Hacking Database)', url: 'https://www.exploit-db.com/ghdb' },
      { name: 'OSINT Framework', url: 'https://osintframework.com' },
      { name: 'IntelTechniques', url: 'https://inteltechniques.com' },
    ],
  },
  {
    id: 'tools',
    title: 'Инструменты и платформы OSINT',
    items: [
      { name: 'Maltego', url: 'https://www.maltego.com' },
      { name: 'SpiderFoot', url: 'https://www.spiderfoot.net' },
      { name: 'Recon-ng', url: 'https://github.com/lanmaster53/recon-ng' },
      { name: 'Amass', url: 'https://github.com/OWASP/Amass' },
      { name: 'TheHarvester', url: 'https://github.com/laramies/theHarvester' },
      { name: 'Metagoofil', url: 'https://github.com/laramies/metagoofil' },
    ],
  },
  {
    id: 'paste',
    title: 'Paste / мониторинг утечек',
    items: [
      { name: 'Pastebin', url: 'https://pastebin.com' },
      { name: 'Paste.ee', url: 'https://paste.ee' },
      { name: 'Ghostbin', url: 'https://ghostbin.co' },
      { name: 'Slexy', url: 'https://slexy.org' },
    ],
  },
  {
    id: 'threatint',
    title: 'Аналитика угроз / Malware',
    items: [
      { name: 'VirusTotal', url: 'https://www.virustotal.com' },
      { name: 'Hybrid Analysis', url: 'https://www.hybrid-analysis.com' },
      { name: 'AlienVault OTX', url: 'https://otx.alienvault.com' },
      { name: 'MISP', url: 'https://www.misp-project.org' },
    ],
  },
  {
    id: 'darknet',
    title: 'Dark Web / Onion search',
    items: [
      { name: 'Ahmia', url: 'https://ahmia.fi' },
      { name: 'OnionDir (index)', url: 'http://onion.link' },
    ],
  },
  {
    id: 'images-geo',
    title: 'Геолокация по изображениям / фотоинформация',
    items: [
      { name: 'EXIF.tools', url: 'https://exif.tools' },
      { name: 'Pic2Map', url: 'https://pic2map.com' },
      { name: 'GeoGuessr tools', url: 'https://www.geoguessr.com' },
    ],
  },
  {
    id: 'email',
    title: 'Поиск по email и контактам',
    items: [
      { name: 'Hunter.io', url: 'https://hunter.io' },
      { name: 'RocketReach', url: 'https://rocketreach.co' },
      { name: 'Have I Been Pwned (email)', url: 'https://haveibeenpwned.com' },
    ],
  },
  {
    id: 'map',
    title: 'OSINT карты и георазведка',
    items: [
      { name: 'Google Maps', url: 'https://maps.google.com' },
      { name: 'Google Earth Pro', url: 'https://www.google.com/earth/download/gep/agree.html' },
      { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org' },
      { name: 'Bing Maps Satellite', url: 'https://www.bing.com/maps' },
      { name: 'Yandex Maps (Панорамы)', url: 'https://yandex.ru/maps' },
      { name: 'Here WeGo', url: 'https://wego.here.com' },
      { name: 'Wikimapia', url: 'https://wikimapia.org' },
      { name: 'Mapillary (Street View)', url: 'https://www.mapillary.com' },
      { name: 'Sentinel Hub (спутники)', url: 'https://www.sentinel-hub.com' },
      { name: 'Maxar (точные спутниковые)', url: 'https://www.maxar.com' },
    ],
  },
]

export default function OsintLibrary({ onOpen }) {
  const openInApp = (url) => {
    if (onOpen) onOpen(url)
    else if (window.electronAPI && window.electronAPI.openInApp) window.electronAPI.openInApp(url)
    else window.open(url, '_blank')
  }

  const openExternal = (url) => {
    if (window.electronAPI && window.electronAPI.openExternal) window.electronAPI.openExternal(url)
    else window.open(url, '_blank')
  }

  return (
    <div className="h-full flex flex-col overflow-hidden text-white">
      <div className="px-6 pb-4">
        <h2 className="text-lg font-semibold">Библиотека OSINT-сайтов</h2>
        <p className="text-sm text-muted mt-1">
          Категоризированный набор реальных публичных ресурсов. Используйте их ответственно и согласно закону.
        </p>
      </div>

      <div className="flex-1 overflow-auto pr-5 pl-6 pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
            <div key={cat.id} className="p-4 bg-white/3 border border-white/10 rounded-xl hover:border-white/30 transition">
              <h3 className="font-semibold text-white mb-3 text-sm">{cat.title}</h3>
            <ul className="space-y-2">
              {cat.items.map((it) => (
                <li key={it.url} className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                      <div className="text-xs text-muted font-medium truncate">{it.name}</div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button 
                      onClick={() => openInApp(it.url)}
                      title="Открыть в браузере приложения"
                        className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-medium transition"
                    >
                      Браузер
                    </button>
                    <button 
                      onClick={() => openExternal(it.url)}
                      title="Открыть внешне"
                        className="px-2 py-1 bg-white/5 hover:bg-white/15 rounded text-xs font-medium transition"
                    >
                      Внеш.
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

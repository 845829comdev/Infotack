const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => process.version,
  suggestions: (q) => ipcRenderer.invoke('suggestions', q),
  dnsLookup: (host) => ipcRenderer.invoke('dns-lookup', host),
  fetchHeaders: (url) => ipcRenderer.invoke('fetch-headers', url),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  openInApp: (url) => ipcRenderer.invoke('open-in-app', url),
  whois: (host) => ipcRenderer.invoke('whois', host),
  httpGet: (url) => ipcRenderer.invoke('http-get', url),
  tcpConnect: (host, port, timeout) => ipcRenderer.invoke('tcp-connect', host, port, timeout),
  startRequestCapture: () => ipcRenderer.invoke('start-request-capture'),
  stopRequestCapture: () => ipcRenderer.invoke('stop-request-capture'),
  onRequestStarted: (callback) => {
    ipcRenderer.on('request-started', (event, data) => callback(data));
  },
  onRequestCompleted: (callback) => {
    ipcRenderer.on('request-completed', (event, data) => callback(data));
  },
  onRequestError: (callback) => {
    ipcRenderer.on('request-error', (event, data) => callback(data));
  },
  removeRequestListeners: () => {
    ipcRenderer.removeAllListeners('request-started');
    ipcRenderer.removeAllListeners('request-completed');
    ipcRenderer.removeAllListeners('request-error');
  },
});

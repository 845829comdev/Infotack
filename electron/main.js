const { app, BrowserWindow, ipcMain, shell, session } = require('electron');
const path = require('path');
const dns = require('dns').promises;
const net = require('net');

// use global fetch (Node 18+)

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startUrl = process.env.VITE_DEV_SERVER_URL || `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for renderer requests (avoid CORS by fetching in main)
ipcMain.handle('suggestions', async (event, query) => {
  try {
    const endpoint = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
    const res = await fetch(endpoint);
    const data = await res.json();
    return { ok: true, suggestions: data[1] || [] };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('dns-lookup', async (event, host) => {
  try {
    const records = await dns.resolveAny(host);
    return { ok: true, records };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('fetch-headers', async (event, url) => {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const headers = {};
    res.headers.forEach((v, k) => (headers[k] = v));
    return { ok: true, headers, status: res.status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// Open URL in an internal BrowserWindow (bypasses iframe X-Frame-Options)
ipcMain.handle('open-in-app', async (event, url) => {
  try {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    await win.loadURL(url);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// WHOIS via public API (hackertarget). Use cautiously - public rate limits may apply.
ipcMain.handle('whois', async (event, host) => {
  try {
    const endpoint = `https://api.hackertarget.com/whois/?q=${encodeURIComponent(host)}`;
    const res = await fetch(endpoint);
    const text = await res.text();
    return { ok: true, text };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// Simple HTTP GET (returns truncated body to avoid huge transfers)
ipcMain.handle('http-get', async (event, url) => {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || '';
    let text = '';
    if (contentType.includes('application/json') || contentType.includes('text/') || contentType.includes('application/javascript')) {
      text = await res.text();
      if (text.length > 20000) text = text.slice(0, 20000) + '\n... (truncated)';
    } else {
      text = `Binary content (${contentType}) - length ${res.headers.get('content-length') || 'unknown'}`;
    }
    return { ok: true, status: res.status, contentType, body: text };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// Simple TCP connect check (single port) - for quick reachability check.
// Use responsibly. This only attempts a TCP connect and immediately closes.
ipcMain.handle('tcp-connect', async (event, host, port, timeout = 3000) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const done = (ok, err) => {
      if (settled) return;
      settled = true;
      try { socket.destroy(); } catch (e) {}
      resolve({ ok, error: err ? String(err) : undefined });
    };

    socket.setTimeout(timeout, () => done(false, 'timeout'));
    socket.once('error', (err) => done(false, err));
    socket.connect(port, host, () => done(true));
  });
});

// Перехват HTTP запросов через session.webRequest
// Используем defaultSession для перехвата всех запросов, включая webview
let isCapturing = false;
let captureListeners = null;
const activeRequests = new Map();

ipcMain.handle('start-request-capture', async (event) => {
  try {
    if (isCapturing) {
      return { ok: true }; // Уже запущено
    }

    const webContents = event.sender;
    // Используем defaultSession для перехвата всех запросов (включая webview)
    const ses = session.defaultSession;
    
    const beforeListener = (details, callback) => {
      const requestId = details.id;
      const requestData = {
        id: requestId,
        method: details.method,
        url: details.url,
        headers: details.requestHeaders || {},
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
      
      activeRequests.set(requestId, requestData);
      
      // Отправляем событие в renderer
      webContents.send('request-started', requestData);
      callback({});
    };
    
    const completedListener = (details) => {
      const requestId = details.id;
      const req = activeRequests.get(requestId);
      if (req) {
        req.status = details.statusCode;
        req.statusText = details.statusCode >= 400 ? 'Error' : 'OK';
        req.responseHeaders = details.responseHeaders || {};
        
        webContents.send('request-completed', req);
        activeRequests.delete(requestId);
      }
    };
    
    const errorListener = (details) => {
      const requestId = details.id;
      const req = activeRequests.get(requestId);
      if (req) {
        req.status = 'error';
        req.error = details.error || 'Request failed';
        
        webContents.send('request-error', req);
        activeRequests.delete(requestId);
      }
    };
    
    // Перехватываем все запросы
    ses.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, beforeListener);
    ses.webRequest.onCompleted({ urls: ['<all_urls>'] }, completedListener);
    ses.webRequest.onErrorOccurred({ urls: ['<all_urls>'] }, errorListener);
    
    captureListeners = {
      before: beforeListener,
      completed: completedListener,
      error: errorListener,
      webContents: webContents,
    };
    
    isCapturing = true;
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('stop-request-capture', async (event) => {
  try {
    if (!isCapturing || !captureListeners) {
      return { ok: true };
    }

    const ses = session.defaultSession;
    
    ses.webRequest.onBeforeRequest(null, captureListeners.before);
    ses.webRequest.onCompleted(null, captureListeners.completed);
    ses.webRequest.onErrorOccurred(null, captureListeners.error);
    
    captureListeners = null;
    isCapturing = false;
    activeRequests.clear();
    
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

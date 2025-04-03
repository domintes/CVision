/* eslint-disable no-undef */
const { app, BrowserWindow, ipcMain, dialog, session } = require('electron')
const path = require('path')
const { createReadStream } = require('fs')
const { createInterface } = require('readline')
const glob = require('glob')
const { dirname } = require('path')
const { rename, mkdir } = require('fs/promises')
const process = require('node:process')

// Główne okno aplikacji
let mainWindow

function createWindow() {
  // Bardziej liberalna polityka CSP dla aplikacji lokalnej
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' ws:;"
        ]
      }
    })
  })

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: true,     // Włączamy integrację z Node.js
      sandbox: false,            // Wyłączamy sandbox
      webSecurity: false,        // Wyłączamy webSecurity dla aplikacji lokalnej
    },
  })

  // W trybie produkcyjnym ładuj plik HTML wygenerowany przez Vite
  // W trybie deweloperskim łącz się z serwerem deweloperskim Vite
  if (process.env.NODE_ENV === 'production') {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
  } else {
    // Spróbuj najpierw port 3001 (Vite może używać tego portu, jeśli 3000 jest zajęty)
    const port = process.env.VITE_DEV_SERVER_PORT || 3001
    mainWindow.loadURL(`http://localhost:${port}`)
    
    // W przypadku błędu spróbuj port 3000
    mainWindow.webContents.on('did-fail-load', () => {
      console.log(`Nie udało się załadować http://localhost:${port}, próbuję port 3000...`)
      mainWindow.loadURL('http://localhost:3000')
    })
  }

  // Otwórz narzędzia deweloperskie w trybie deweloperskim
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools()
  }
}

// Inicjalizacja aplikacji po gotowości Electron
app.whenReady().then(() => {
  createWindow()

  // MacOS - specyficzne zachowanie
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  
  // Skonfiguruj obsługę IPC
  setupIpcHandlers()
})

// Zamknij aplikację, gdy wszystkie okna są zamknięte (z wyjątkiem macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

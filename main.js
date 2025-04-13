const { app, BrowserWindow, ipcMain, dialog, session } = require('electron')
const path = require('path')
const { createReadStream } = require('fs')
const { createInterface } = require('readline')
const glob = require('glob')
const { dirname } = require('path')
const { rename, mkdir } = require('fs/promises')
const process = require('node:process')

let mainWindow

function createWindow() {
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
      nodeIntegration: true,
      sandbox: false,
      webSecurity: false,
    },
  })

  if (process.env.NODE_ENV === 'production') {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
  } else {
    const port = process.env.VITE_DEV_SERVER_PORT || 3001
    mainWindow.loadURL(`http://localhost:${port}`)
    
    mainWindow.webContents.on('did-fail-load', () => {
      console.log(`Nie udało się załadować http://localhost:${port}, próbuję port 3000...`)
      mainWindow.loadURL('http://localhost:3000')
    })
  }

  // if (process.env.NODE_ENV !== 'production') {
  //   mainWindow.webContents.openDevTools()
  // }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
  
  setupIpcHandlers()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

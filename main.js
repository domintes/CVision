const { app, BrowserWindow, ipcMain, dialog, session } = require('electron')
const path = require('path')
const { createReadStream, writeFileSync, readFileSync, existsSync, readdirSync } = require('fs')
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
      webSecurity: true,
    },
  })

  if (process.env.NODE_ENV === 'production') {
    // Use path.join to ensure correct path resolution
    const indexPath = path.join(__dirname, 'dist', 'index.html')
    console.log('Loading production file from:', indexPath)
    mainWindow.loadFile(indexPath)
    // Open DevTools in production temporarily to debug
    mainWindow.webContents.openDevTools()
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

function setupIpcHandlers() {
  const profilesDir = path.join(app.getPath('userData'), 'profiles');
  
  // Ensure profiles directory exists
  if (!existsSync(profilesDir)) {
    mkdir(profilesDir, { recursive: true });
  }

  ipcMain.handle('save-profile', async (event, { data, profileName }) => {
    try {
      const filePath = path.join(profilesDir, `${profileName}.json`);
      writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('load-profile', async (event, profileName) => {
    try {
      const filePath = path.join(profilesDir, `${profileName}.json`);
      const data = readFileSync(filePath, 'utf8');
      return { success: true, data: JSON.parse(data) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('delete-profile', async (event, profileName) => {
    try {
      const filePath = path.join(profilesDir, `${profileName}.json`);
      require('fs').unlinkSync(filePath);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-profiles', async () => {
    try {
      const files = readdirSync(profilesDir);
      const profiles = files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
      return { success: true, profiles };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('export-profile', async (event, { data }) => {
    try {
      const { filePath } = await dialog.showSaveDialog({
        defaultPath: `cv_profile_${data.personalInfo?.firstName || 'export'}.json`,
        filters: [{ name: 'JSON Files', extensions: ['json'] }]
      });

      if (filePath) {
        writeFileSync(filePath, JSON.stringify(data, null, 2));
        return { success: true };
      }
      return { success: false, error: 'No file path selected' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('import-profile', async () => {
    try {
      const { filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'JSON Files', extensions: ['json'] }]
      });

      if (filePaths && filePaths[0]) {
        const data = readFileSync(filePaths[0], 'utf8');
        return { success: true, data: JSON.parse(data) };
      }
      return { success: false, error: 'No file selected' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
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

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      const validChannels = [
        'choose-source-folder',
        'choose-destination-folder',
        'search-beatmaps',
        'move-beatmaps'
      ]
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    on: (channel, func) => {
      const validChannels = [
        'source-folder-selected',
        'destination-folder-selected',
        'beatmaps-found',
        'beatmaps-moved',
        'error'
      ]
      if (validChannels.includes(channel)) {
        ipcRenderer.removeAllListeners(channel)
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    },
    invoke: (channel, data) => {
      const validChannels = [
        'save-file-dialog',
        'save-profile',
        'load-profile',
        'get-profiles',
        'delete-profile'
      ];
      if (validChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
    }
  }
})

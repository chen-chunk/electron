const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  const page = process.env.DEV_PATH || `file://${path.join(__dirname, 'build', 'index.html')}`
  win.loadURL(page);
  ipcMain.on('windowCommand', (e, command) => {
    console.log('on windowCommand = ', command);
    switch (command) {
      case 'close':
        app.quit();
        break;
      case 'minimize':
        win.minimize();
        break;
    }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

// 热加载
try {
  require('electron-reloader')(module, {});
} catch (_) { }

const createWindow = () => {
  const page = process.env.DEV_PATH || `file://${path.join(__dirname, 'build', 'index.html')}`;
  const isDev = !!process.env.DEV_PATH;
  // 隐藏菜单
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
    },
  })
  win.loadURL(page);
  // 指令定义
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
  // 快捷键定义
  const shortcutKey = [
    {
      // 打开调试模式
      key: 'Ctrl+F12',
      status: isDev,
      fun: () => {
        const { webContents } = win;
        const isOpen = webContents.isDevToolsOpened();
        if (isOpen) {
          webContents.closeDevTools();
        } else {
          webContents.openDevTools()
        }
      }
    },
    {
      // 全屏
      key: 'C'
    }
  ];
  // TODO 快捷键控制
  const keyboard = [];
  win.webContents.on('before-input-event', (e, i) => {
    console.log(i);
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
const electron = require("electron");
var {app, BrowserWindow} = electron;
const path = require('path');
const url = require('url');
const consumeEvents = require('./listener');

var mainWindow = null;

// Hot-reload
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow () {
  const electronScreen = electron.screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: Math.round(size.width/2),
    height: size.height,
    show: false,
    icon: path.join(__dirname, 'icon.png')
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(path.join(__dirname, 'node_modules', 'electron'))
    });
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'dist', 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
    mainWindow.setMenu(null);
  }  

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

consumeEvents();
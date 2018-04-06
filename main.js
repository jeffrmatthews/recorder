const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const url = require('url')
const rxjs = require('rxjs')

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
      width: 400,
	  height: 600,
	  frame: false
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', onClosed);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
});

function onClosed() {
  mainWindow = null;
}

ipcMain.on('install-angular-cli', ( e, arg ) => {
  const msgInfo = {
	title: "My App Alert",
	message: arg.message,
	buttons: [ "OK" ]
  };
  console.log('test dialig');
  dialog.showMessageBox( msgInfo );
});

ipcMain.on('build-dev', (e, arg) => {
    console.log('build-dev');
});

ipcMain.on('quit-app', ( e, arg ) => {
    app.quit();
});

exports.selectPackageFile = function () {
    dialog.showOpenDialog(mainWindow, {
        title: 'Select a package.json file...',
        properties: ['openFile'],
        filters: [{
            name: '.json',
            extensions: ['json']
        }]
    }, selectedFile => {
        if (selectedFile) {
            mainWindow.webContents.send('file-selected', {file: selectedFile[0]})
        }
    });
}
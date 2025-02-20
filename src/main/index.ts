import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import sqlite3 from 'sqlite3'
import icon from '../../resources/icon.png?asset'

let db: sqlite3.Database

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  // Create a Database and a connection
  db = new sqlite3.Database('mydb.sqlite3 ', (err) => {
    if (err) console.error(err.message)
    console.log('Connected to SQL database')
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        firstname TEXT NOT NULL, 
        lastname TEXT NOT NULL,
        birthdate TEXT  NOT NULL,
        email TEXT NOT NULL 
      )`,
      (err) => {
        if (err) console.error(err.message)
      }
    )
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// ---------------------------CRUD OPERATION-----------------------------
// Create new users(firstname, lastname, birthdate, email)
ipcMain.on('create-user', (event, user) => {
  db.run(
    'INSERT INTO users (firstname, lastname, birthdate, email ) VALUES (?, ?, ?, ?)',
    [user.firstname, user.lastname, user.birthdate, user.email],
    function (err) {
      if (err) event.reply('create-users-response', { success: false, error: err.message })
      else event.reply('create-users-response', { success: true, id: this.lastID })
    }
  )
})
// Read and display all users
ipcMain.handle('fetch-users', async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if(err)
        reject(err)
      else
        resolve(rows)
    })
  })
})
// Update users by Id
ipcMain.on('update-user', (event, user) => {
  db.run(
    `UPDATE users SET
    firstname = ?,
    lastname = ?,
    birthdate = ?,
    email = ?
    WHERE id = ?`,
    [user.firstname, user.lastname, user.birthdate, user.email, user.id],
    function (err) {
      if (err) event.reply('update-user-response', { success: false, error: err.message })
      else event.reply('update-user-response', { success: true })
    }
  )
})
// Delete user by ID
ipcMain.on('delete-user', (event, id) => {
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) event.reply('delete-user-response', { success: false, error: err.message })
    else event.reply('delete-user-response', { success: true })
  })
})

import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

// Interface for callback fn
interface Callback {
  (event: any, response: any): void
}

// Custom APIs for renderer
const api = {
  // API for users handling
  fetchUsers: () => ipcRenderer.invoke('fetch-users'),
  createUser: (user: { firstname: string; lastname: string; birthdate: string; email: string }) =>
    ipcRenderer.send('create-user', user),
  updateUser: (user: {
    id: number
    firstname: string
    lastname: string
    birthdate: string
    email: string
  }) => ipcRenderer.send('update-user', user),
  deleteUser: (id: number) => ipcRenderer.send('delete-user', id),
  onCreateUserResponse: (callback: Callback) => ipcRenderer.on('create-users-response', callback),
  onUpdateUserResponse: (callback: Callback) => ipcRenderer.on('update-user-response', callback),
  onDeleteUserResponse: (callback: Callback) => ipcRenderer.on('delete-user-response', callback)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

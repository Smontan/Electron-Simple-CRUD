import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      createUser: (user: {
        firstname: string
        lastname: string
        birthdate: string
        email: string
      }) => void
      fetchUsers: () => Promise<any[]>
      updateUser: (user: {
        id: number
        firstname: string
        lastname: string
        birthdate: string
        email: string
      }) => void
      deleteUser: (id: number) => void
      onCreateUserResponse: (
        callback: (event: any, response: { success: boolean; err?: string }) => void
      ) => void
      onUpdateUserResponse: (
        callback: (event: any, response: { success: boolean; err?: string }) => void
      ) => void
      onDeleteUserResponse: (
        callback: (event: any, response: { success: boolean; err?: string }) => void
      ) => void
    }
  }
}

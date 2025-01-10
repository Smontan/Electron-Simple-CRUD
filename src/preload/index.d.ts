import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      createUser: (firstname: string, lastname: string, birthdate: Date, email: string) => void
      readUser: () => void
      updateUser: (
        id: number,
        firstname: string,
        lastname: string,
        birthdate: Date,
        email: string
      ) => void
      deleteUser: (id: number) => void
      onCreateUserResponse: (
        callback: (event: any, response: { success: boolean; err?: string }) => void
      ) => void
      onReadUsersResponse: (
        callback: (event: any, response: { success: boolean; user?: any[]; err?: string }) => void
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

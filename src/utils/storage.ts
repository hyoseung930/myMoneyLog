import type { User } from '../types'

const STORAGE_KEYS = {
  SAVED_USERNAME: 'moneylog_saved_username',
  AUTH_TOKEN: 'moneylog_auth_token',
  USER_DATA: 'moneylog_user_data'
}

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error getting from localStorage:', error)
      return null
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error setting to localStorage:', error)
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  getSavedUsername(): string | null {
    return this.get<string>(STORAGE_KEYS.SAVED_USERNAME)
  },

  setSavedUsername(username: string): void {
    this.set(STORAGE_KEYS.SAVED_USERNAME, username)
  },

  removeSavedUsername(): void {
    this.remove(STORAGE_KEYS.SAVED_USERNAME)
  },

  getAuthToken(): string | null {
    return this.get<string>(STORAGE_KEYS.AUTH_TOKEN)
  },

  setAuthToken(token: string): void {
    this.set(STORAGE_KEYS.AUTH_TOKEN, token)
  },

  removeAuthToken(): void {
    this.remove(STORAGE_KEYS.AUTH_TOKEN)
  },

  getUserData(): User | null {
    return this.get<User>(STORAGE_KEYS.USER_DATA)
  },

  setUserData(data: User): void {
    this.set(STORAGE_KEYS.USER_DATA, data)
  },

  removeUserData(): void {
    this.remove(STORAGE_KEYS.USER_DATA)
  }
}

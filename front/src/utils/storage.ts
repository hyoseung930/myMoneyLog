import type { User } from '../types'

const STORAGE_KEYS = {
  SAVED_USERNAME: 'moneylog_saved_username',
  AUTH_TOKEN: 'moneylog_auth_token',
  USER_DATA: 'moneylog_user_data'
}

const SESSION_KEYS = {
  MASTER_KEY: 'moneylog_master_key',
  LAST_ACTIVITY: 'moneylog_last_activity'
}

const SESSION_TIMEOUT = 30 * 60 * 1000

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
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
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

export const masterKeyStorage = {
  getMasterKey(): string | null {
    const lastActivity = window.sessionStorage.getItem(SESSION_KEYS.LAST_ACTIVITY)
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity)
      if (elapsed > SESSION_TIMEOUT) {
        this.clearMasterKey()
        return null
      }
    }
    this.updateActivity()
    return window.sessionStorage.getItem(SESSION_KEYS.MASTER_KEY)
  },

  setMasterKey(key: string): void {
    window.sessionStorage.setItem(SESSION_KEYS.MASTER_KEY, key)
    this.updateActivity()
  },

  clearMasterKey(): void {
    window.sessionStorage.removeItem(SESSION_KEYS.MASTER_KEY)
    window.sessionStorage.removeItem(SESSION_KEYS.LAST_ACTIVITY)
  },

  updateActivity(): void {
    window.sessionStorage.setItem(SESSION_KEYS.LAST_ACTIVITY, Date.now().toString())
  }
}

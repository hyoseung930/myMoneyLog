const STORAGE_KEYS = {
  SAVED_USERNAME: 'moneylog_saved_username',
  AUTH_TOKEN: 'moneylog_auth_token',
  USER_DATA: 'moneylog_user_data'
}

export const storage = {
  get(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error getting from localStorage:', error)
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error setting to localStorage:', error)
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  },

  getSavedUsername() {
    return this.get(STORAGE_KEYS.SAVED_USERNAME)
  },

  setSavedUsername(username) {
    this.set(STORAGE_KEYS.SAVED_USERNAME, username)
  },

  removeSavedUsername() {
    this.remove(STORAGE_KEYS.SAVED_USERNAME)
  },

  getAuthToken() {
    return this.get(STORAGE_KEYS.AUTH_TOKEN)
  },

  setAuthToken(token) {
    this.set(STORAGE_KEYS.AUTH_TOKEN, token)
  },

  removeAuthToken() {
    this.remove(STORAGE_KEYS.AUTH_TOKEN)
  },

  getUserData() {
    return this.get(STORAGE_KEYS.USER_DATA)
  },

  setUserData(data) {
    this.set(STORAGE_KEYS.USER_DATA, data)
  },

  removeUserData() {
    this.remove(STORAGE_KEYS.USER_DATA)
  }
}

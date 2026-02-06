import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '../utils/storage'
import type { User, StoredUser, AuthResponse } from '../types'

const timestamp = Date.now()
console.log('[Auth Module] File loaded at:', timestamp)
window.__AUTH_TIMESTAMP = timestamp

export const useAuthStore = defineStore('auth', () => {
  console.log('[Auth Store] Setup function called, timestamp:', timestamp)
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)

  function loadUser() {
    console.log('[Auth Store] loadUser() called')
    const userData = storage.getUserData()
    const token = storage.getAuthToken()
    
    console.log('[Auth Store] Data check - userData:', userData, 'token:', token)
    
    if (userData && token) {
      user.value = userData
      isAuthenticated.value = true
      console.log('[Auth Store] User authenticated')
    } else {
      console.log('[Auth Store] No auth data')
    }
  }

  function login(username: string, password: string, rememberMe: boolean): AuthResponse {
    const users = storage.get<StoredUser[]>('moneylog_users') || []
    const foundUser = users.find(u => u.username === username && u.password === password)
    
    if (foundUser) {
      user.value = {
        id: foundUser.id,
        username: foundUser.username,
        nickname: foundUser.nickname
      }
      isAuthenticated.value = true
      
      storage.setAuthToken('token_' + foundUser.id)
      storage.setUserData(user.value)
      
      if (rememberMe) {
        storage.setSavedUsername(username)
      } else {
        storage.removeSavedUsername()
      }
      
      return { success: true }
    }
    
    return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' }
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    storage.removeAuthToken()
    storage.removeUserData()
  }

  function signup(username: string, nickname: string, password: string): AuthResponse {
    const users = storage.get<StoredUser[]>('moneylog_users') || []
    
    const existingUser = users.find(u => u.username === username)
    if (existingUser) {
      return { success: false, message: '이미 존재하는 아이디입니다.' }
    }
    
    const newUser: StoredUser = {
      id: Date.now().toString(),
      username,
      nickname,
      password,
      createdAt: new Date().toISOString()
    }
    
    users.push(newUser)
    storage.set('moneylog_users', users)
    
    return { success: true }
  }

  function getSavedUsername(): string | null {
    return storage.getSavedUsername()
  }

  console.log('[Auth Store] Calling loadUser...')
  loadUser()
  console.log('[Auth Store] After loadUser, isAuthenticated:', isAuthenticated.value)

  return {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
    getSavedUsername
  }
})

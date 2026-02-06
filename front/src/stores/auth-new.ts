import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage, masterKeyStorage } from '../utils/storage'
import * as authAPI from '../api/auth'
import * as crypto from '../utils/crypto'

console.log('[NEW AUTH MODULE] ===== LOADED =====', new Date().toISOString())

export const useAuthStore = defineStore('auth', () => {
  console.log('[NEW AUTH STORE] ===== SETUP =====')
  
  const user = ref<any | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const token = ref<string | null>(null)
  const masterKey = ref<CryptoKey | null>(null)

  async function loadUser() {
    console.log('[NEW AUTH] loadUser() called')
    const userData = storage.getUserData()
    const savedToken = storage.getAuthToken()
    
    console.log('[NEW AUTH] userData:', userData, 'token:', savedToken)
    
    if (userData && savedToken) {
      user.value = userData
      token.value = savedToken
      isAuthenticated.value = true
      console.log('[NEW AUTH] Authenticated')
      
      const savedMasterKey = masterKeyStorage.getMasterKey()
      if (savedMasterKey) {
        try {
          masterKey.value = await crypto.importMasterKey(savedMasterKey)
          console.log('[NEW AUTH] Master key restored from session')
        } catch (err) {
          console.error('[NEW AUTH] Failed to restore master key:', err)
        }
      } else {
        console.log('[NEW AUTH] No master key in session')
      }
    } else {
      console.log('[NEW AUTH] Not authenticated')
    }
  }

  async function login(username: string, password: string, rememberMe: boolean) {
    try {
      const response = await authAPI.login({ username, password })
      console.log('[NEW AUTH] Login response:', response)
      console.log('[NEW AUTH] Access token:', response.accessToken)
      console.log('[NEW AUTH] Token type:', typeof response.accessToken)
      console.log('[NEW AUTH] Token first char:', response.accessToken.charCodeAt(0))
      
      user.value = response.user
      token.value = response.accessToken
      isAuthenticated.value = true
      
      console.log('[NEW AUTH] About to save token:', response.accessToken)
      storage.setAuthToken(response.accessToken)
      console.log('[NEW AUTH] Token saved, reading back:', localStorage.getItem('moneylog_auth_token'))
      storage.setUserData(response.user)
      
      if (rememberMe) {
        storage.setSavedUsername(username)
      } else {
        storage.removeSavedUsername()
      }

      if (response.user.encryptedMasterKey && response.user.masterKeySalt) {
        const [iv, ciphertext] = response.user.encryptedMasterKey.split(':')
        const [salt, _] = response.user.masterKeySalt.split(':')
        const decrypted = await crypto.decryptMasterKeyWithPassword(
          ciphertext,
          iv,
          salt,
          password
        )
        masterKey.value = decrypted
        
        const exportedKey = await crypto.exportMasterKey(decrypted)
        masterKeyStorage.setMasterKey(exportedKey)
        console.log('[NEW AUTH] Master key saved to session')
      }
      
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.message || '로그인에 실패했습니다.' }
    }
  }

  function logout() {
    user.value = null
    token.value = null
    masterKey.value = null
    isAuthenticated.value = false
    storage.removeAuthToken()
    storage.removeUserData()
    masterKeyStorage.clearMasterKey()
    console.log('[NEW AUTH] Logged out and cleared session')
  }

  async function signup(username: string, nickname: string, password: string) {
    try {
      const generatedMasterKey = await crypto.generateMasterKey()
      
      const recoveryPhrase = crypto.generateRecoveryPhrase()
      
      const { encryptedKey: encryptedByPassword, salt: passwordSalt, iv: passwordIv } = 
        await crypto.encryptMasterKeyWithPassword(generatedMasterKey, password)
      
      const { encryptedKey: encryptedByRecovery, salt: recoverySalt, iv: recoveryIv } = 
        await crypto.encryptMasterKeyWithRecovery(generatedMasterKey, recoveryPhrase)
      
      const response = await authAPI.signup({
        username,
        nickname,
        password,
        encryptedMasterKeyByPassword: `${passwordIv}:${encryptedByPassword}`,
        passwordSalt: `${passwordSalt}:${passwordIv}`,
        encryptedMasterKeyByRecovery: `${recoveryIv}:${encryptedByRecovery}`,
        recoverySalt: `${recoverySalt}:${recoveryIv}`,
        recoveryKey: recoveryPhrase,
      })
      
      return { 
        success: true, 
        recoveryPhrase,
        message: '회원가입이 완료되었습니다.' 
      }
    } catch (error: any) {
      return { success: false, message: error.message || '회원가입에 실패했습니다.' }
    }
  }

  function getSavedUsername(): string | null {
    return storage.getSavedUsername()
  }

  async function encryptData(data: string): Promise<{ ciphertext: string; iv: string }> {
    if (!masterKey.value) {
      throw new Error('Master key not available')
    }
    return await crypto.encryptWithKey(data, masterKey.value)
  }

  async function decryptData(ciphertext: string, iv: string): Promise<string> {
    if (!masterKey.value) {
      throw new Error('Master key not available')
    }
    return await crypto.decryptWithKey(ciphertext, iv, masterKey.value)
  }

  async function verifyToken(): Promise<boolean> {
    const savedToken = storage.getAuthToken()
    if (!savedToken) {
      logout()
      return false
    }

    try {
      const userData = await authAPI.verifyToken(savedToken)
      user.value = userData
      isAuthenticated.value = true
      return true
    } catch (err) {
      console.error('[NEW AUTH] Token verification failed:', err)
      logout()
      return false
    }
  }

  async function getMasterKey(): Promise<CryptoKey | null> {
    return masterKey.value
  }

  loadUser()

  return {
    user,
    isAuthenticated,
    token,
    masterKey,
    login,
    logout,
    signup,
    getSavedUsername,
    encryptData,
    decryptData,
    verifyToken,
    getMasterKey,
  }
})

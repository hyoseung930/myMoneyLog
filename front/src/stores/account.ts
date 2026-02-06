import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { useAuthStore } from './auth'
import type { Account } from '../types'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<Account[]>([])

  function loadAccounts() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    
    const key = `moneylog_accounts_${authStore.user.id}`
    const stored = storage.get<Account[]>(key)
    
    if (stored) {
      accounts.value = stored
    } else {
      accounts.value = [
        { id: '1', name: '농협', type: '입출 통장', balance: 1000000 },
        { id: '2', name: '신한', type: '입출 통장', balance: 4500000 },
        { id: '3', name: '농협', type: '적금', balance: 0 }
      ]
      saveAccounts()
    }
  }

  function saveAccounts() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    
    const key = `moneylog_accounts_${authStore.user.id}`
    storage.set(key, accounts.value)
  }

  function updateBalance(accountId: string, amount: number) {
    const account = accounts.value.find((a: Account) => a.id === accountId)
    if (account) {
      account.balance += amount
      saveAccounts()
    }
  }

  function addAccount(account: Omit<Account, 'id'>) {
    accounts.value.push({
      ...account,
      id: Date.now().toString()
    })
    saveAccounts()
  }

  function deleteAccount(id: string) {
    accounts.value = accounts.value.filter((a: Account) => a.id !== id)
    saveAccounts()
  }

  const totalBalance = computed(() => {
    return accounts.value.reduce((sum: number, account: Account) => sum + account.balance, 0)
  })

  loadAccounts()

  return {
    accounts,
    totalBalance,
    loadAccounts,
    updateBalance,
    addAccount,
    deleteAccount
  }
})

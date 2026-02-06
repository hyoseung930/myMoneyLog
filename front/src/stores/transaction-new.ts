import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { useAuthStore } from './auth-new'
import type { Transaction } from '../types'

console.log('[NEW TRANSACTION MODULE] ===== LOADED =====')

export const useTransactionStore = defineStore('transaction-new', () => {
  console.log('[NEW TRANSACTION STORE] ===== SETUP =====')
  
  const transactions = ref<Transaction[]>([])
  const currentMonth = ref<Date>(new Date())

  function loadTransactions() {
    const authStore = useAuthStore()
    if (!authStore.user) {
      console.log('[NEW TRANSACTION] No user, loading dummy data')
      transactions.value = generateDummyData()
      return
    }
    
    const key = `moneylog_transactions_${authStore.user.id}`
    transactions.value = storage.get<Transaction[]>(key) || generateDummyData()
  }

  function saveTransactions() {
    const authStore = useAuthStore()
    if (!authStore.user) return
    
    const key = `moneylog_transactions_${authStore.user.id}`
    storage.set(key, transactions.value)
  }

  function generateDummyData(): Transaction[] {
    return []
  }

  function addTransaction(transaction: Omit<Transaction, 'id'>) {
    transactions.value.push({
      ...transaction,
      id: Date.now().toString()
    })
    saveTransactions()
  }

  function deleteTransaction(id: string) {
    transactions.value = transactions.value.filter(t => t.id !== id)
    saveTransactions()
  }

  function getTransactionsByDate(date: string | Date): Transaction[] {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0]
    return transactions.value.filter(t => t.date === dateStr)
  }

  function getTransactionsByMonth(year: number, month: number): Transaction[] {
    return transactions.value.filter(t => {
      const tDate = new Date(t.date)
      return tDate.getFullYear() === year && tDate.getMonth() === month
    })
  }

  const monthlyIncome = computed(() => {
    const year = currentMonth.value.getFullYear()
    const month = currentMonth.value.getMonth()
    
    return getTransactionsByMonth(year, month)
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const monthlyExpense = computed(() => {
    const year = currentMonth.value.getFullYear()
    const month = currentMonth.value.getMonth()
    
    return getTransactionsByMonth(year, month)
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const monthlyTotal = computed(() => {
    return monthlyIncome.value - monthlyExpense.value
  })

  function setCurrentMonth(date: Date) {
    console.log('[NEW TRANSACTION] setCurrentMonth called with:', date)
    currentMonth.value = date
  }

  loadTransactions()

  return {
    transactions,
    currentMonth,
    addTransaction,
    deleteTransaction,
    getTransactionsByDate,
    getTransactionsByMonth,
    monthlyIncome,
    monthlyExpense,
    monthlyTotal,
    loadTransactions,
    setCurrentMonth
  }
})

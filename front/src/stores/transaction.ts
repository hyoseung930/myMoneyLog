import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage'
import { useAuthStore } from './auth-new'
import type { Transaction } from '../types'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])
  const currentMonth = ref<Date>(new Date(2025, 11, 1))

  function loadTransactions() {
    const authStore = useAuthStore()
    if (!authStore.user) {
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
    const dummyData: Transaction[] = [
      { id: '1', date: '2025-12-01', amount: 150000, type: 'income', category: '급여', description: '월급', accountId: '1' },
      { id: '2', date: '2025-12-01', amount: 50000, type: 'expense', category: '식비', description: '식료품', accountId: '1' },
      { id: '3', date: '2025-12-02', amount: 100000, type: 'income', category: '부수입', description: '프리랜서', accountId: '1' },
      { id: '4', date: '2025-12-04', amount: 150000, type: 'income', category: '급여', description: '월급', accountId: '2' },
      { id: '5', date: '2025-12-04', amount: 50000, type: 'expense', category: '교통비', description: '주유', accountId: '2' },
      { id: '6', date: '2025-12-06', amount: 100000, type: 'income', category: '부수입', description: '프리랜서', accountId: '2' },
      { id: '7', date: '2025-12-08', amount: 150000, type: 'income', category: '급여', description: '월급', accountId: '1' },
      { id: '8', date: '2025-12-08', amount: 50000, type: 'expense', category: '식비', description: '외식', accountId: '1' },
      { id: '9', date: '2025-12-08', amount: 100000, type: 'income', category: '부수입', description: '프리랜서', accountId: '1' }
    ]
    saveTransactions()
    return dummyData
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

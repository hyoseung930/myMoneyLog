<template>
  <div class="month-view">
    <Sidebar />
    
    <div class="main-content">
      <Calendar @day-click="handleDayClick" />
    </div>
    
    <DaySidebar
      :is-open="isSidebarOpen"
      :date="selectedDate"
      :transactions="selectedTransactions"
      @close="closeSidebar"
      @add-transaction="openAddModal"
    />
    
    <AddTransactionModal
      v-model="isAddModalOpen"
      :date="selectedDate"
      @submit="handleTransactionSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Calendar from '@/components/dashboard/Calendar.vue'
import DaySidebar from '@/components/month/DaySidebar.vue'
import AddTransactionModal from '@/components/transaction/AddTransactionModal.vue'
import { useAccountsStore } from '@/stores/accounts'
import { useTransactionsStore } from '@/stores/transactions'

const accountsStore = useAccountsStore()
const transactionsStore = useTransactionsStore()

const isSidebarOpen = ref(false)
const isAddModalOpen = ref(false)
const selectedDate = ref<Date | null>(null)

const selectedTransactions = computed(() => {
  if (!selectedDate.value) return []
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  return transactionsStore.transactions.filter(t => {
    const tDate = new Date(t.date).toISOString().split('T')[0]
    return tDate === dateStr
  })
})

const handleDayClick = (date: Date) => {
  selectedDate.value = date
  isSidebarOpen.value = true
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}

const openAddModal = () => {
  isAddModalOpen.value = true
}

const handleTransactionSubmit = async (data: any) => {
  try {
    await transactionsStore.createTransaction(
      data.accountId,
      data.date,
      data.amount.toString(),
      data.type,
      data.category,
      data.description,
      data.time
    )
    
    // 계좌 잔액 자동 업데이트
    const account = accountsStore.accounts.find(a => a.id === data.accountId)
    if (account) {
      const currentBalance = Number(account.balance)
      const newBalance = data.type === 'income' 
        ? currentBalance + data.amount 
        : currentBalance - data.amount
      
      await accountsStore.updateAccount(data.accountId, newBalance.toString())
    }
    
    isAddModalOpen.value = false
    await transactionsStore.fetchTransactions()
    alert(`거래가 추가되었습니다.`)
  } catch (error) {
    console.error('Transaction submit error:', error)
    alert('거래 추가에 실패했습니다.')
  }
}

onMounted(async () => {
  await accountsStore.fetchAccounts()
  await transactionsStore.fetchTransactions()
})
</script>

<style lang="scss" scoped>
.month-view {
  display: flex;
  min-height: 100vh;
  background: $color-card;
}

.main-content {
  margin-left: $sidebar-width;
  flex: 1;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
}
</style>

<template>
  <div class="month-view">
    <Sidebar />
    
    <div class="main-content">
      <Calendar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Calendar from '@/components/dashboard/Calendar.vue'
import { useAccountStore } from '@/stores/account'
import { useTransactionStore } from '@/stores/transaction-new'

const accountStore = useAccountStore()
const transactionStore = useTransactionStore()

onMounted(() => {
  accountStore.loadAccounts()
  transactionStore.loadTransactions()
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

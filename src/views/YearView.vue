<template>
  <div class="year-view">
    <Sidebar />
    
    <div class="main-content">
      <YearGrid />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import YearGrid from '@/components/year/YearGrid.vue'
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
.year-view {
  display: flex;
  min-height: 100vh;
  background: $color-main;
}

.main-content {
  margin-left: $sidebar-width;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>

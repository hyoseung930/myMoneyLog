<template>
  <div class="day-view">
    <Sidebar />
    
    <div class="main-content">
      <div class="day-header">
        <div class="header-left">
          <div class="date-nav">
            <button @click="previousDay" class="nav-btn">‹</button>
            <h2>{{ currentDateFormatted }}</h2>
            <button @click="nextDay" class="nav-btn">›</button>
          </div>
        </div>
        <div class="header-right">
          <span class="total">Total <strong>{{ formatCurrency(dayBalance) }}</strong></span>
        </div>
      </div>
      
      <div class="day-content">
        <div class="day-summary">
          <div class="summary-item income">
            <span class="label">Income</span>
            <span class="amount">+{{ formatCurrency(dayIncome) }}</span>
          </div>
          <div class="summary-item expense">
            <span class="label">Expense</span>
            <span class="amount">-{{ formatCurrency(dayExpense) }}</span>
          </div>
        </div>
        
        <div class="transactions-section">
          <div v-if="dayTransactions.length === 0" class="empty-state">
            <p>No transactions for this day</p>
          </div>
          
          <div v-else class="transactions-list">
            <div 
              v-for="transaction in dayTransactions" 
              :key="transaction.id"
              class="transaction-item"
            >
              <div class="transaction-info">
                <div class="transaction-category">{{ transaction.category }}</div>
                <div class="transaction-description" v-if="transaction.description">{{ transaction.description }}</div>
              </div>
              <div class="transaction-amount" :class="transaction.type">
                {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import { useTransactionStore } from '@/stores/transaction-new'

const transactionStore = useTransactionStore()

const currentDate = ref(new Date())

const currentDateFormatted = computed(() => {
  const date = currentDate.value
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
})

const dateString = computed(() => {
  return currentDate.value.toISOString().split('T')[0]
})

const dayTransactions = computed(() => {
  return transactionStore.getTransactionsByDate(dateString.value)
})

const dayIncome = computed(() => {
  return dayTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const dayExpense = computed(() => {
  return dayTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const dayBalance = computed(() => {
  return dayIncome.value - dayExpense.value
})

const previousDay = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 1)
  currentDate.value = newDate
}

const nextDay = () => {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 1)
  currentDate.value = newDate
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString()
}

onMounted(() => {
  transactionStore.loadTransactions()
})
</script>

<style lang="scss" scoped>
.day-view {
  display: flex;
  height: 100vh;
  background: $color-card;
}

.main-content {
  margin-left: $sidebar-width;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg $spacing-xl;
  border-bottom: 1px solid #CCC;
  background: $color-card;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: $spacing-xl;
    
    .date-nav {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      
      h2 {
        font-size: 18px;
        font-weight: 600;
        color: $color-text;
        min-width: 400px;
        text-align: center;
        margin: 0;
      }
      
      .nav-btn {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #CCC;
        background: white;
        color: $color-text;
        font-size: 20px;
        cursor: pointer;
        transition: all $transition-speed;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background: #F5F5F5;
        }
      }
    }
  }
  
  .header-right {
    .total {
      font-size: 16px;
      color: $color-text;
      
      strong {
        margin-left: $spacing-sm;
        font-weight: 700;
      }
    }
  }
}

.day-content {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-xl;
}

.day-summary {
  display: flex;
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
  padding: $spacing-lg;
  background: white;
  border: 1px solid #CCC;
  border-radius: $border-radius;
  
  .summary-item {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    
    .label {
      font-size: 14px;
      color: rgba($color-text, 0.6);
      font-weight: 500;
    }
    
    .amount {
      font-size: 20px;
      font-weight: 700;
    }
    
    &.income .amount {
      color: $color-income;
    }
    
    &.expense .amount {
      color: $color-expense;
    }
  }
}

.transactions-section {
  background: white;
  border: 1px solid #CCC;
  border-radius: $border-radius;
  padding: $spacing-lg;
  
  .empty-state {
    text-align: center;
    padding: $spacing-xl;
    color: rgba($color-text, 0.5);
  }
  
  .transactions-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  .transaction-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md;
    border-bottom: 1px solid #EEEEEE;
    transition: all $transition-speed;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: #F9F9F9;
    }
    
    .transaction-info {
      flex: 1;
      
      .transaction-category {
        font-size: 14px;
        font-weight: 600;
        color: $color-text;
        margin-bottom: 4px;
      }
      
      .transaction-description {
        font-size: 12px;
        color: rgba($color-text, 0.6);
      }
    }
    
    .transaction-amount {
      font-size: 16px;
      font-weight: 700;
      
      &.income {
        color: $color-income;
      }
      
      &.expense {
        color: $color-expense;
      }
    }
  }
}
</style>

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
          <span class="total">Total <strong :class="{ positive: dayBalance > 0, negative: dayBalance < 0 }">{{ formatTotal(dayBalance) }}</strong></span>
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
          <div class="section-header">
            <h3>거래 내역</h3>
            <button @click="handleAddTransaction" class="add-btn">
              <span>+</span> 추가
            </button>
          </div>
          
          <div v-if="sortedTransactions.length === 0" class="empty-state">
            <p>내역이 없습니다</p>
          </div>
          
          <div v-else class="transactions-list">
            <div 
              v-for="transaction in sortedTransactions" 
              :key="transaction.id"
              class="transaction-item"
              :class="transaction.type"
            >
              <div class="transaction-content">
                <div class="transaction-header">
                  <span class="category">{{ transaction.category }}</span>
                  <span class="amount" :class="transaction.type">
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                  </span>
                </div>
                <div class="transaction-footer">
                  <div v-if="transaction.description" class="transaction-description">
                    {{ transaction.description }}
                  </div>
                  <div class="transaction-time">{{ formatTime(transaction.time) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <AddTransactionModal
      v-model="isAddModalOpen"
      :date="currentDate"
      @submit="handleTransactionSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import AddTransactionModal from '@/components/transaction/AddTransactionModal.vue'
import { useTransactionsStore } from '@/stores/transactions'

const transactionsStore = useTransactionsStore()
const isAddModalOpen = ref(false)

const currentDate = ref(new Date())

const currentDateFormatted = computed(() => {
  const date = currentDate.value
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
})

const dateString = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const dayTransactions = computed(() => {
  console.log('[DayView] All transactions:', transactionsStore.transactions)
  console.log('[DayView] Current dateString:', dateString.value)
  
  const filtered = transactionsStore.transactions.filter(t => {
    const tDate = typeof t.date === 'string' ? t.date : new Date(t.date).toISOString().split('T')[0]
    console.log('[DayView] Comparing', tDate, 'with', dateString.value, ':', tDate === dateString.value)
    return tDate === dateString.value
  })
  
  console.log('[DayView] Filtered transactions:', filtered)
  return filtered
})

const sortedTransactions = computed(() => {
  return [...dayTransactions.value].sort((a, b) => {
    const timeA = a.time || '00:00:00'
    const timeB = b.time || '00:00:00'
    return timeB.localeCompare(timeA)
  })
})

const dayIncome = computed(() => {
  return dayTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
})

const dayExpense = computed(() => {
  return dayTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
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

const formatTotal = (amount: number) => {
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''
  return sign + Math.abs(amount).toLocaleString()
}

const formatTime = (time: any) => {
  if (!time) return '00:00'
  if (typeof time === 'string') {
    return time.substring(0, 5)
  }
  return '00:00'
}

const handleAddTransaction = () => {
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
    alert('거래가 등록되었습니다.')
  } catch (error) {
    console.error('Transaction submit error:', error)
    alert('거래 추가에 실패했습니다.')
  }
}

onMounted(async () => {
  await transactionsStore.fetchTransactions()
})
</script>

<style lang="scss" scoped>
.day-view {
  display: flex;
  height: 100vh;
  background: $color-card;
}

.main-content {
  margin-left: 240px;
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
        
        &.positive {
          color: $color-income;
        }
        
        &.negative {
          color: $color-expense;
        }
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
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-md;
    border-bottom: 1px solid #EEEEEE;
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: $color-text;
      margin: 0;
    }
    
    .add-btn {
      padding: $spacing-xs $spacing-md;
      background: $color-sub;
      color: white;
      border: none;
      border-radius: $border-radius;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all $transition-speed;
      display: flex;
      align-items: center;
      gap: 4px;
      
      span {
        font-size: 16px;
      }
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
  
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
    padding: $spacing-md;
    background: #F9F9F9;
    border-radius: $border-radius;
    border-left: 3px solid transparent;
    transition: all $transition-speed;
    
    &:hover {
      background: #F5F5F5;
    }
    
    &.income {
      border-left-color: $color-income;
    }
    
    &.expense {
      border-left-color: $color-expense;
    }
    
    .transaction-content {
      .transaction-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .category {
          font-size: 14px;
          font-weight: 600;
          color: $color-text;
        }
        
        .amount {
          font-size: 15px;
          font-weight: 700;
          
          &.income {
            color: $color-income;
          }
          
          &.expense {
            color: $color-expense;
          }
        }
      }
      
      .transaction-footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        
        .transaction-description {
          font-size: 13px;
          color: rgba($color-text, 0.6);
          flex: 1;
        }
        
        .transaction-time {
          font-size: 12px;
          color: rgba($color-text, 0.5);
          margin-left: $spacing-sm;
        }
      }
    }
  }
}
</style>

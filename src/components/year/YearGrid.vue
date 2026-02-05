<template>
  <div class="year-grid">
    <div class="year-header">
      <div class="header-left">
        <div class="year-nav">
          <button @click="previousYear" class="nav-btn">‹</button>
          <h2>{{ currentYear }}</h2>
          <button @click="nextYear" class="nav-btn">›</button>
        </div>
      </div>
      <div class="header-right">
        <span class="total">Total <strong>{{ formatCurrency(yearTotal) }}</strong></span>
      </div>
    </div>
    
    <div class="months-grid">
      <div
        v-for="month in months"
        :key="month.index"
        class="month-card"
        @click="goToMonth(month.index)"
      >
        <div class="month-name">{{ month.name }}</div>
        <div class="month-stats">
          <div class="stat income">
            <span class="label">Income</span>
            <span class="amount">+{{ formatCurrency(month.income) }}</span>
          </div>
          <div class="stat expense">
            <span class="label">Expense</span>
            <span class="amount">-{{ formatCurrency(month.expense) }}</span>
          </div>
          <div class="divider"></div>
          <div class="stat total" :class="{ positive: month.total >= 0, negative: month.total < 0 }">
            <span class="label">Total</span>
            <span class="amount">{{ month.total >= 0 ? '+' : '' }}{{ formatCurrency(month.total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transaction-new'

const router = useRouter()
const transactionStore = useTransactionStore()
const currentYear = ref(new Date().getFullYear())

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const months = computed(() => {
  return monthNames.map((name, index) => {
    const monthTransactions = transactionStore.transactions.filter(t => {
      const date = new Date(t.date)
      return date.getFullYear() === currentYear.value && date.getMonth() === index
    })
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      index,
      name,
      income,
      expense,
      total: income - expense
    }
  })
})

const yearTotal = computed(() => {
  return months.value.reduce((sum, month) => sum + month.total, 0)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(amount))
}

const previousYear = () => {
  currentYear.value--
}

const nextYear = () => {
  currentYear.value++
}

const goToMonth = (monthIndex: number) => {
  router.push('/month')
}
</script>

<style lang="scss" scoped>
.year-grid {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $color-card;
}

.year-header {
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
    
    .year-nav {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      
      h2 {
        font-size: 22px;
        font-weight: 600;
        color: $color-text;
        min-width: 100px;
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

.months-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-lg;
  padding: $spacing-xl;
  overflow-y: auto;
}

.month-card {
  background: white;
  border: 1px solid #CCC;
  border-radius: $border-radius;
  padding: $spacing-lg;
  cursor: pointer;
  transition: all $transition-speed;
  height: fit-content;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .month-name {
    font-size: 16px;
    font-weight: 600;
    color: $color-text;
    margin-bottom: $spacing-md;
    text-align: center;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid #EEEEEE;
  }
  
  .month-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      
      .label {
        color: rgba($color-text, 0.6);
        font-weight: 500;
      }
      
      .amount {
        font-weight: 600;
      }
      
      &.income .amount {
        color: $color-income;
      }
      
      &.expense .amount {
        color: $color-expense;
      }
      
      &.total {
        padding-top: 4px;
        margin-top: 2px;
        
        &.positive .amount {
          color: $color-income;
        }
        
        &.negative .amount {
          color: $color-expense;
        }
      }
    }
    
    .divider {
      width: 100%;
      height: 1px;
      background: #CCC;
      margin: 4px 0;
    }
  }
}
</style>

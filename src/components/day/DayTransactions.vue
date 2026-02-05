<template>
  <div class="day-transactions">
    <div class="date-picker">
      <button @click="previousDay" class="nav-btn">‹</button>
      <input
        type="date"
        v-model="selectedDate"
        class="date-input"
      />
      <button @click="nextDay" class="nav-btn">›</button>
    </div>
    
    <div class="day-summary">
      <div class="summary-item income">
        <span class="label">● Income</span>
        <span class="amount">{{ formatAmount(dayIncome) }}</span>
      </div>
      <div class="summary-item expense">
        <span class="label">● Expenses</span>
        <span class="amount">{{ formatAmount(dayExpense) }}</span>
      </div>
      <div class="summary-item total" :class="{ positive: dayTotal >= 0, negative: dayTotal < 0 }">
        <span class="label">Total</span>
        <span class="amount">{{ formatAmount(dayTotal) }}</span>
      </div>
    </div>
    
    <div class="transactions-list">
      <div v-if="dayTransactions.length === 0" class="empty-state">
        <p>No transactions for this day</p>
      </div>
      
      <div
        v-for="transaction in dayTransactions"
        :key="transaction.id"
        class="transaction-item"
        :class="transaction.type"
      >
        <div class="transaction-info">
          <div class="transaction-category">{{ transaction.category }}</div>
          <div class="transaction-memo" v-if="transaction.memo">{{ transaction.memo }}</div>
        </div>
        <div class="transaction-amount" :class="transaction.type">
          {{ transaction.type === 'income' ? '+' : '-' }}{{ formatAmount(transaction.amount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction-new'

const transactionStore = useTransactionStore()
const selectedDate = ref(new Date().toISOString().split('T')[0])

const dayTransactions = computed(() => {
  return transactionStore.transactions
    .filter(t => t.date === selectedDate.value)
    .sort((a, b) => b.id.localeCompare(a.id))
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

const dayTotal = computed(() => dayIncome.value - dayExpense.value)

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ko-KR').format(Math.abs(amount)) + '원'
}

const previousDay = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() - 1)
  selectedDate.value = date.toISOString().split('T')[0]
}

const nextDay = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + 1)
  selectedDate.value = date.toISOString().split('T')[0]
}
</script>

<style lang="scss" scoped>
.day-transactions {
  background: $color-card;
  border-radius: $border-radius;
  padding: $spacing-xl;
}

.date-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  margin-bottom: $spacing-xl;
  
  .date-input {
    padding: $spacing-sm $spacing-md;
    border: 1px solid rgba($color-text, 0.2);
    border-radius: $border-radius;
    font-size: 16px;
    color: $color-text;
    background: $color-main;
    text-align: center;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: $color-sub;
    }
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: $color-main;
    color: $color-text;
    font-size: 20px;
    cursor: pointer;
    transition: all $transition-speed;
    
    &:hover {
      background: darken($color-main, 10%);
    }
  }
}

.day-summary {
  display: flex;
  justify-content: space-around;
  padding: $spacing-lg;
  background: $color-main;
  border-radius: $border-radius;
  margin-bottom: $spacing-xl;
  
  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    
    .label {
      font-size: 14px;
      color: rgba($color-text, 0.7);
    }
    
    .amount {
      font-size: 18px;
      font-weight: 600;
    }
    
    &.income .amount {
      color: $color-income;
    }
    
    &.expense .amount {
      color: $color-expense;
    }
    
    &.total {
      &.positive .amount {
        color: $color-income;
      }
      
      &.negative .amount {
        color: $color-expense;
      }
    }
  }
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  max-height: 600px;
  overflow-y: auto;
  
  .empty-state {
    text-align: center;
    padding: $spacing-xl;
    color: rgba($color-text, 0.5);
  }
  
  .transaction-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-md;
    border-radius: $border-radius;
    border-left: 3px solid transparent;
    background: $color-main;
    transition: all $transition-speed;
    
    &:hover {
      background: darken($color-main, 5%);
    }
    
    &.income {
      border-left-color: $color-income;
    }
    
    &.expense {
      border-left-color: $color-expense;
    }
    
    .transaction-info {
      flex: 1;
      
      .transaction-category {
        font-size: 14px;
        font-weight: 600;
        color: $color-text;
        margin-bottom: 4px;
      }
      
      .transaction-memo {
        font-size: 12px;
        color: rgba($color-text, 0.6);
      }
    }
    
    .transaction-amount {
      font-size: 16px;
      font-weight: 600;
      
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

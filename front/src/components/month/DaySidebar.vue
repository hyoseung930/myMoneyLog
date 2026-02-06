<template>
  <Transition name="sidebar">
    <div v-if="isOpen" class="day-sidebar-overlay" @click="close">
      <div class="day-sidebar" @click.stop>
        <div class="sidebar-header">
          <div class="date-info">
            <h3>{{ formattedDate }}</h3>
            <button class="close-btn" @click="close">×</button>
          </div>
          <button class="add-btn" @click="handleAddTransaction">
            <span>+</span> 추가
          </button>
        </div>
        
        <div class="sidebar-body">
          <div v-if="transactions.length === 0" class="empty-state">
            <p>내역이 없습니다</p>
          </div>
          
          <div v-else class="transaction-list">
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
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Transaction } from '@/types'

interface Props {
  isOpen: boolean
  date: Date | null
  transactions: Transaction[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'close': []
  'add-transaction': []
}>()

const formattedDate = computed(() => {
  if (!props.date) return ''
  
  const year = props.date.getFullYear()
  const month = String(props.date.getMonth() + 1).padStart(2, '0')
  const day = String(props.date.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
})

const sortedTransactions = computed(() => {
  return [...props.transactions].sort((a, b) => {
    const timeA = a.time || '00:00:00'
    const timeB = b.time || '00:00:00'
    return timeB.localeCompare(timeA)
  })
})

const close = () => {
  emit('close')
}

const handleAddTransaction = () => {
  emit('add-transaction')
}

const formatCurrency = (amount: number | string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return numAmount.toLocaleString()
}

const formatTime = (time: any) => {
  if (!time) return '00:00'
  if (typeof time === 'string') {
    return time.substring(0, 5)
  }
  return '00:00'
}
</script>

<style lang="scss" scoped>
.day-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.day-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 500px;
  background: white;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1001;
}

.sidebar-header {
  padding: $spacing-lg;
  border-bottom: 1px solid #EEEEEE;
  
  .date-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    
    h3 {
      font-size: 18px;
      font-weight: 600;
      color: $color-text;
      margin: 0;
    }
    
    .close-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      font-size: 28px;
      color: $color-text;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all $transition-speed;
      
      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
  
  .add-btn {
    width: 100%;
    padding: $spacing-sm;
    background: $color-sub;
    color: white;
    border: none;
    border-radius: $border-radius;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-speed;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    
    span {
      font-size: 18px;
    }
    
    &:hover {
      opacity: 0.9;
    }
  }
}

.sidebar-body {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-lg;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  
  p {
    color: rgba($color-text, 0.4);
    font-size: 14px;
  }
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.transaction-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  background: #F9F9F9;
  border-radius: $border-radius;
  border-left: 3px solid transparent;
  
  &.income {
    border-left-color: $color-income;
  }
  
  &.expense {
    border-left-color: $color-expense;
  }
  
  .transaction-content {
    flex: 1;
    
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

.sidebar-enter-active,
.sidebar-leave-active {
  transition: opacity 0.3s ease;
  
  .day-sidebar {
    transition: transform 0.3s ease;
  }
}

.sidebar-enter-from {
  opacity: 0;
  
  .day-sidebar {
    transform: translateX(100%);
  }
}

.sidebar-leave-to {
  opacity: 0;
  
  .day-sidebar {
    transform: translateX(100%);
  }
}
</style>

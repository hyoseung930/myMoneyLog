<template>
  <Transition name="slide">
    <div v-if="isOpen" class="sidebar-overlay" @click="close">
      <div class="sidebar-panel" @click.stop>
        <div class="sidebar-header">
          <h3>{{ formattedDate }}</h3>
          <div class="header-actions">
            <button @click="handleAdd" class="add-btn">추가</button>
            <button @click="close" class="close-btn">×</button>
          </div>
        </div>
        
        <div class="sidebar-body">
          <div v-if="transactions.length === 0" class="empty-state">
            <p>내역이 없습니다</p>
          </div>
          
          <div v-else class="transaction-list">
            <div
              v-for="transaction in transactions"
              :key="transaction.id"
              class="transaction-item"
              :class="transaction.type"
            >
              <div class="transaction-main">
                <div class="transaction-time">{{ getTime(transaction.date) }}</div>
                <div class="transaction-info">
                  <div class="transaction-category">{{ transaction.category }}</div>
                  <div class="transaction-description" v-if="transaction.description">
                    {{ transaction.description }}
                  </div>
                </div>
              </div>
              <div class="transaction-amount" :class="transaction.type">
                {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
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
  'add': []
}>()

const formattedDate = computed(() => {
  if (!props.date) return ''
  const year = props.date.getFullYear()
  const month = props.date.getMonth() + 1
  const day = props.date.getDate()
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  const dayName = dayNames[props.date.getDay()]
  return `${year}년 ${month}월 ${day}일 (${dayName})`
})

const getTime = (dateStr: string) => {
  const date = new Date(dateStr)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString()
}

const close = () => {
  emit('close')
}

const handleAdd = () => {
  emit('add')
}
</script>

<style lang="scss" scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 8888;
}

.sidebar-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 500px;
  background: white;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 8889;
}

.sidebar-header {
  padding: $spacing-lg;
  border-bottom: 1px solid #EEEEEE;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: $color-text;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
  }
  
  .add-btn {
    padding: 6px 16px;
    background: $color-sub;
    border: none;
    border-radius: $border-radius;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-speed;
    
    &:hover {
      opacity: 0.9;
    }
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
  color: rgba($color-text, 0.4);
  font-size: 14px;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.transaction-item {
  padding: $spacing-md;
  border: 1px solid #EEEEEE;
  border-radius: $border-radius;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $spacing-md;
  
  &.income {
    border-left: 3px solid $color-income;
  }
  
  &.expense {
    border-left: 3px solid $color-expense;
  }
  
  .transaction-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    
    .transaction-time {
      font-size: 12px;
      color: rgba($color-text, 0.5);
      font-weight: 500;
    }
    
    .transaction-info {
      .transaction-category {
        font-size: 14px;
        font-weight: 600;
        color: $color-text;
        margin-bottom: 2px;
      }
      
      .transaction-description {
        font-size: 13px;
        color: rgba($color-text, 0.7);
      }
    }
  }
  
  .transaction-amount {
    font-size: 16px;
    font-weight: 700;
    white-space: nowrap;
    
    &.income {
      color: $color-income;
    }
    
    &.expense {
      color: $color-expense;
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
  
  .sidebar-panel {
    transition: transform 0.3s ease;
  }
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  
  .sidebar-panel {
    transform: translateX(100%);
  }
}
</style>

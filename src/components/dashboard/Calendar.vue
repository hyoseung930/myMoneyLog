<template>
  <div class="calendar">
    <div class="calendar-header">
      <div class="header-left">
        <div class="month-nav">
          <button @click="previousMonth" class="nav-btn">‹</button>
          <h2>{{ monthYear }}</h2>
          <button @click="nextMonth" class="nav-btn">›</button>
        </div>
        <div class="legend">
          <span class="legend-item">
            <span class="dot income"></span>
            Income
          </span>
          <span class="legend-item">
            <span class="dot expense"></span>
            Expenses
          </span>
        </div>
      </div>
      <div class="header-right">
        <span class="total">Total <strong>{{ formatCurrency(monthlyTotal) }}</strong></span>
      </div>
    </div>
    
    <div class="calendar-grid">
      <div class="weekday-header">
        <div
          v-for="day in weekdays"
          :key="day"
          class="weekday"
          :class="{ sunday: day === 'SUNDAY', saturday: day === 'SATURDAY' }"
        >
          {{ day }}
        </div>
      </div>
      
      <div class="calendar-body">
        <div
          v-for="day in calendarDays"
          :key="day.key"
          class="calendar-day"
          :class="{
            'other-month': !day.isCurrentMonth,
            'sunday': day.dayOfWeek === 0,
            'saturday': day.dayOfWeek === 6
          }"
        >
          <div class="day-number">{{ day.date }}</div>
          
          <div v-if="day.isCurrentMonth && day.transactions.length > 0" class="transactions">
            <div
              v-for="transaction in day.transactions"
              :key="transaction.id"
              class="transaction"
              :class="transaction.type"
            >
              {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
            </div>
            <div class="divider"></div>
            <div class="day-total" :class="{ positive: getDayTotal(day.transactions) > 0, negative: getDayTotal(day.transactions) < 0 }">
              {{ getDayTotal(day.transactions) > 0 ? '+' : '' }}{{ formatCurrency(getDayTotal(day.transactions)) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTransactionStore } from '@/stores/transaction-new'

const transactionStore = useTransactionStore()

const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

const currentMonth = computed(() => transactionStore.currentMonth)

const monthYear = computed(() => {
  const date = currentMonth.value
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  return `${months[date.getMonth()]} ${date.getFullYear()}`
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  let currentDate = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const isCurrentMonth = currentDate.getMonth() === month
    
    const dayTransactions = isCurrentMonth 
      ? transactionStore.getTransactionsByDate(dateStr)
      : []
    
    days.push({
      key: `${i}-${dateStr}`,
      date: currentDate.getDate(),
      fullDate: new Date(currentDate),
      dateStr,
      isCurrentMonth,
      dayOfWeek: currentDate.getDay(),
      transactions: dayTransactions
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return days
})

const monthlyTotal = computed(() => transactionStore.monthlyTotal)

const formatCurrency = (amount: number) => {
  return Math.abs(amount).toLocaleString('ko-KR')
}

const previousMonth = () => {
  console.log('[Calendar] Previous month clicked')
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() - 1)
  console.log('[Calendar] New month:', newMonth)
  transactionStore.setCurrentMonth(newMonth)
}

const nextMonth = () => {
  console.log('[Calendar] Next month clicked')
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() + 1)
  console.log('[Calendar] New month:', newMonth)
  transactionStore.setCurrentMonth(newMonth)
}

const getDayTotal = (transactions: any[]) => {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  return income - expense
}
</script>

<style lang="scss" scoped>
.calendar {
  background: $color-card;
  padding: $spacing-lg;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: $spacing-lg;
  
  .header-left {
    .month-nav {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      margin-bottom: $spacing-sm;
      
      .nav-btn {
        background: none;
        border: none;
        font-size: 32px;
        color: $color-text;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        transition: color $transition-speed;
        
        &:hover {
          color: $color-income;
        }
      }
      
      h2 {
        font-size: 32px;
        font-weight: 700;
        color: $color-text;
        margin: 0;
      }
    }
    
    .legend {
      display: flex;
      align-items: center;
      gap: $spacing-md;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: $spacing-xs;
        font-size: 14px;
        
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          
          &.income {
            background: $color-income;
          }
          
          &.expense {
            background: $color-expense;
          }
        }
      }
    }
  }
  
  .header-right {
    .total {
      font-size: 18px;
      color: $color-text;
      font-weight: 400;
      
      strong {
        font-weight: 700;
        margin-left: $spacing-xs;
        color: $color-income;
      }
    }
  }
}

.calendar-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .weekday-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: $spacing-sm;
    
    .weekday {
      padding: $spacing-sm;
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: $color-text;
      
      &.sunday {
        color: #FF5959;
      }
      
      &.saturday {
        color: #3B82F6;
      }
    }
  }
  
  .calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 1px;
    background: #CCC;
    border: 1px solid #CCC;
    flex: 1;
  }
  
  .calendar-day {
    min-height: 100px;
    padding: 6px;
    background: $color-card;
    position: relative;
    display: flex;
    flex-direction: column;
    
    &.other-month {
      background: #EEEEEE;
      
      .day-number {
        color: rgba($color-text, 0.3);
      }
    }
    
    &.sunday .day-number {
      color: #FF5959;
    }
    
    &.saturday .day-number {
      color: #3B82F6;
    }
    
    .day-number {
      font-size: 14px;
      font-weight: 600;
      color: $color-text;
      margin-bottom: 4px;
      line-height: 1;
    }
    
    .transactions {
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex: 1;
      overflow: hidden;
      align-items: flex-end;
      justify-content: flex-end;
      
      .transaction {
        font-size: 12px;
        font-weight: 500;
        line-height: 1.3;
        white-space: nowrap;
        
        &.income {
          color: $color-income;
        }
        
        &.expense {
          color: $color-expense;
        }
      }
      
      .divider {
        width: 100%;
        height: 1px;
        background: #CCC;
        margin: 3px 0 2px 0;
      }
      
      .day-total {
        font-size: 12px;
        font-weight: 600;
        line-height: 1.3;
        
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
</style>

<template>
  <div class="dashboard-view">
    <Sidebar />
    
    <div class="main-content">
      <div class="dashboard-container">
        <div class="chart-section">
          <div class="chart-header">
            <h2>{{ viewMode === 'year' ? 'Yearly' : viewMode === 'month' ? 'Monthly' : 'Daily' }} Comparison</h2>
            <button v-if="selectedDates.length > 0" @click="clearSelection" class="clear-btn">
              Clear Selection
            </button>
          </div>
          <div class="chart-wrapper">
            <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
            <div v-else class="empty-chart">
              <p>Select dates from the calendar to see comparison</p>
            </div>
          </div>
        </div>
        
        <div class="selector-section">
          <div class="view-mode-tabs">
            <button 
              v-for="mode in ['year', 'month', 'day']" 
              :key="mode"
              @click="changeViewMode(mode)"
              class="tab-btn"
              :class="{ active: viewMode === mode }"
            >
              {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
            </button>
          </div>
          
          <div class="selection-info">
            <span class="count">{{ selectedDates.length }} / 10 selected</span>
          </div>
          
          <div class="calendar-grid">
            <div v-if="viewMode === 'year'" class="year-selector">
              <div class="year-nav">
                <button @click="changeYear(-5)" class="nav-btn">‹‹</button>
                <button @click="changeYear(-1)" class="nav-btn">‹</button>
                <span class="year-range">{{ startYear }} - {{ startYear + 9 }}</span>
                <button @click="changeYear(1)" class="nav-btn">›</button>
                <button @click="changeYear(5)" class="nav-btn">››</button>
              </div>
              <div class="years-grid">
                <div
                  v-for="year in yearList"
                  :key="year"
                  @click="toggleDate(year)"
                  class="year-cell"
                  :class="{ selected: isSelected(year) }"
                >
                  {{ year }}
                </div>
              </div>
            </div>
            
            <div v-else-if="viewMode === 'month'" class="month-selector">
              <div class="month-nav">
                <button @click="currentYear--" class="nav-btn">‹</button>
                <span class="current-year">{{ currentYear }}</span>
                <button @click="currentYear++" class="nav-btn">›</button>
              </div>
              <div class="months-grid">
                <div
                  v-for="(month, index) in months"
                  :key="index"
                  @click="toggleDate(`${currentYear}-${String(index + 1).padStart(2, '0')}`)"
                  class="month-cell"
                  :class="{ selected: isSelected(`${currentYear}-${String(index + 1).padStart(2, '0')}`) }"
                >
                  {{ month }}
                </div>
              </div>
            </div>
            
            <div v-else class="day-selector">
              <div class="day-nav">
                <button @click="changeMonth(-1)" class="nav-btn">‹</button>
                <span class="current-month">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
                <button @click="changeMonth(1)" class="nav-btn">›</button>
              </div>
              <div class="weekdays">
                <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
              </div>
              <div class="days-grid">
                <div
                  v-for="day in daysList"
                  :key="day.key"
                  @click="day.isCurrentMonth && toggleDate(day.dateStr)"
                  class="day-cell"
                  :class="{ 
                    'other-month': !day.isCurrentMonth,
                    'selected': isSelected(day.dateStr)
                  }"
                >
                  {{ day.date }}
                </div>
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
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useTransactionStore } from '@/stores/transaction-new'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const transactionStore = useTransactionStore()

const viewMode = ref<'year' | 'month' | 'day'>('month')
const selectedDates = ref<string[]>([])
const startYear = ref(2020)
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const yearList = computed(() => {
  return Array.from({ length: 10 }, (_, i) => startYear.value + i)
})

const daysList = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  let currentDate = new Date(startDate)
  
  for (let i = 0; i < 42; i++) {
    const dateStr = currentDate.toISOString().split('T')[0]
    days.push({
      date: currentDate.getDate(),
      dateStr,
      isCurrentMonth: currentDate.getMonth() === month,
      key: `${dateStr}-${i}`
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return days
})

const chartData = computed(() => {
  if (selectedDates.value.length === 0) return null
  
  const labels: string[] = []
  const incomeData: number[] = []
  const expenseData: number[] = []
  
  selectedDates.value.forEach(dateKey => {
    let income = 0
    let expense = 0
    let label = ''
    
    if (viewMode.value === 'year') {
      label = dateKey
      const year = parseInt(dateKey)
      transactionStore.transactions.forEach(t => {
        const tDate = new Date(t.date)
        if (tDate.getFullYear() === year) {
          if (t.type === 'income') income += t.amount
          else expense += t.amount
        }
      })
    } else if (viewMode.value === 'month') {
      const [year, month] = dateKey.split('-')
      label = `${year}-${month}`
      transactionStore.transactions.forEach(t => {
        const tDate = new Date(t.date)
        if (tDate.getFullYear() === parseInt(year) && tDate.getMonth() === parseInt(month) - 1) {
          if (t.type === 'income') income += t.amount
          else expense += t.amount
        }
      })
    } else {
      label = dateKey
      transactionStore.transactions.forEach(t => {
        if (t.date === dateKey) {
          if (t.type === 'income') income += t.amount
          else expense += t.amount
        }
      })
    }
    
    labels.push(label)
    incomeData.push(income)
    expenseData.push(expense)
  })
  
  return {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        backgroundColor: '#3B82F6',
      },
      {
        label: 'Expense',
        data: expenseData,
        backgroundColor: '#FF5959',
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const changeViewMode = (mode: 'year' | 'month' | 'day') => {
  viewMode.value = mode
  selectedDates.value = []
}

const changeYear = (delta: number) => {
  startYear.value += delta
}

const changeMonth = (delta: number) => {
  currentMonth.value += delta
  if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  } else if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value--
  }
}

const isSelected = (dateKey: string) => {
  return selectedDates.value.includes(dateKey)
}

const toggleDate = (dateKey: string) => {
  const index = selectedDates.value.indexOf(dateKey)
  if (index > -1) {
    selectedDates.value.splice(index, 1)
  } else {
    if (selectedDates.value.length < 10) {
      selectedDates.value.push(dateKey)
    }
  }
}

const clearSelection = () => {
  selectedDates.value = []
}

onMounted(() => {
  transactionStore.loadTransactions()
})
</script>

<style lang="scss" scoped>
.dashboard-view {
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

.dashboard-container {
  flex: 1;
  display: flex;
  gap: $spacing-xl;
  padding: $spacing-xl;
  overflow: hidden;
}

.chart-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #CCC;
  border-radius: $border-radius;
  padding: $spacing-xl;
  overflow: hidden;
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-lg;
    
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: $color-text;
      margin: 0;
    }
    
    .clear-btn {
      padding: $spacing-sm $spacing-md;
      border: 1px solid #CCC;
      border-radius: $border-radius;
      background: white;
      color: $color-text;
      font-size: 14px;
      cursor: pointer;
      transition: all $transition-speed;
      
      &:hover {
        background: #F5F5F5;
      }
    }
  }
  
  .chart-wrapper {
    flex: 1;
    position: relative;
    min-height: 0;
  }
  
  .empty-chart {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: rgba($color-text, 0.4);
    font-size: 16px;
  }
}

.selector-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #CCC;
  border-radius: $border-radius;
  padding: $spacing-lg;
  overflow: hidden;
  
  .view-mode-tabs {
    display: flex;
    gap: $spacing-xs;
    margin-bottom: $spacing-md;
    border-bottom: 1px solid #EEEEEE;
    
    .tab-btn {
      flex: 1;
      padding: $spacing-sm;
      border: none;
      background: none;
      color: rgba($color-text, 0.6);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all $transition-speed;
      border-bottom: 2px solid transparent;
      
      &:hover {
        color: $color-text;
      }
      
      &.active {
        color: $color-sub;
        border-bottom-color: $color-sub;
      }
    }
  }
  
  .selection-info {
    margin-bottom: $spacing-md;
    text-align: center;
    
    .count {
      font-size: 13px;
      color: rgba($color-text, 0.6);
    }
  }
  
  .calendar-grid {
    flex: 1;
    overflow-y: auto;
  }
}

.year-selector, .month-selector, .day-selector {
  .nav-btn {
    padding: $spacing-xs $spacing-sm;
    border: 1px solid #CCC;
    border-radius: 4px;
    background: white;
    color: $color-text;
    font-size: 14px;
    cursor: pointer;
    transition: all $transition-speed;
    
    &:hover {
      background: #F5F5F5;
    }
  }
}

.year-selector {
  .year-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    gap: $spacing-xs;
    
    .year-range {
      font-size: 14px;
      font-weight: 600;
      color: $color-text;
      text-align: center;
      flex: 1;
    }
  }
  
  .years-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-sm;
    
    .year-cell {
      padding: $spacing-md;
      text-align: center;
      border: 1px solid #EEEEEE;
      border-radius: $border-radius;
      cursor: pointer;
      transition: all $transition-speed;
      font-size: 14px;
      
      &:hover {
        background: #F5F5F5;
      }
      
      &.selected {
        background: $color-sub;
        color: white;
        border-color: $color-sub;
      }
    }
  }
}

.month-selector {
  .month-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    gap: $spacing-sm;
    
    .current-year {
      font-size: 16px;
      font-weight: 600;
      color: $color-text;
      text-align: center;
      flex: 1;
    }
  }
  
  .months-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-sm;
    
    .month-cell {
      padding: $spacing-md;
      text-align: center;
      border: 1px solid #EEEEEE;
      border-radius: $border-radius;
      cursor: pointer;
      transition: all $transition-speed;
      font-size: 13px;
      
      &:hover {
        background: #F5F5F5;
      }
      
      &.selected {
        background: $color-sub;
        color: white;
        border-color: $color-sub;
      }
    }
  }
}

.day-selector {
  .day-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    gap: $spacing-sm;
    
    .current-month {
      font-size: 14px;
      font-weight: 600;
      color: $color-text;
      text-align: center;
      flex: 1;
    }
  }
  
  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: $spacing-xs;
    
    .weekday {
      text-align: center;
      font-size: 11px;
      font-weight: 600;
      color: rgba($color-text, 0.5);
      padding: $spacing-xs 0;
    }
  }
  
  .days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    
    .day-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #EEEEEE;
      border-radius: 4px;
      cursor: pointer;
      transition: all $transition-speed;
      font-size: 12px;
      
      &:hover:not(.other-month) {
        background: #F5F5F5;
      }
      
      &.other-month {
        color: #CCCCCC;
        cursor: default;
      }
      
      &.selected {
        background: $color-sub;
        color: white;
        border-color: $color-sub;
      }
    }
  }
}
</style>

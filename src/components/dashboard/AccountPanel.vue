<template>
  <div class="account-panel">
    <div class="panel-header">
      <h3>Account</h3>
      <button class="add-btn" @click="handleAddAccount">Add</button>
    </div>
    
    <div class="account-list">
      <div
        v-for="account in accounts"
        :key="account.id"
        class="account-item"
      >
        <div class="account-info">
          <div class="account-name">{{ account.name }}</div>
          <div class="account-type">{{ account.type }}</div>
        </div>
        <div class="account-balance">
          {{ formatCurrency(account.balance) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAccountStore } from '@/stores/account'

const accountStore = useAccountStore()

const accounts = computed(() => accountStore.accounts)

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('ko-KR') + '원'
}

const handleAddAccount = () => {
  alert('계정 추가 기능은 준비 중입니다.')
}
</script>

<style lang="scss" scoped>
.account-panel {
  background: $color-card;
  border-radius: $border-radius;
  padding: $spacing-lg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.panel-header {
  @include flex-between;
  margin-bottom: $spacing-md;
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: $color-text;
  }
  
  .add-btn {
    padding: $spacing-xs $spacing-md;
    background: $color-sub;
    border: none;
    border-radius: $border-radius;
    color: $color-text;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-speed;
    
    &:hover {
      opacity: 0.8;
    }
  }
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  background: #EFEFFC;
  border-radius: $border-radius;
  
  .account-info {
    .account-name {
      font-size: 14px;
      font-weight: 600;
      color: $color-text;
      margin-bottom: 2px;
    }
    
    .account-type {
      font-size: 12px;
      color: rgba($color-text, 0.6);
    }
  }
  
  .account-balance {
    font-size: 14px;
    font-weight: 600;
    color: $color-text;
  }
}
</style>

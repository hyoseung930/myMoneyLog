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
        <div class="account-info" @click="handleAccountClick(account)">
          <div class="account-name">{{ account.bankName }}</div>
          <div class="account-type">{{ account.accountNumber || "정보 없음" }}</div>
        </div>
        <div class="account-actions">
          <div class="account-balance">
            {{ formatCurrency(Number(account.balance)) }}
          </div>
          <button class="delete-btn" @click.stop="handleDeleteAccount(account.id)" title="계좌 삭제">
            ×
          </button>
        </div>
      </div>
    </div>

    <AccountAddModal v-model="showAddModal" @submit="handleAccountSubmit" />
    <EditAccountModal v-model="showEditModal" :account="selectedAccount" @submit="handleAccountUpdate" @delete="handleAccountDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAccountsStore } from '@/stores/accounts'
import AccountAddModal from '@/components/account/AddAccountModal.vue'
import EditAccountModal from '@/components/account/EditAccountModal.vue'

const accountsStore = useAccountsStore()

const accounts = computed(() => accountsStore.accounts)
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedAccount = ref<any>(null)

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('ko-KR') + '원'
}

const handleAddAccount = () => {
  console.log('[AccountPanel] handleAddAccount clicked')
  showAddModal.value = true
}

const handleAccountSubmit = async (data: { bank: string; accountNumber: string; balance: string }) => {
  console.log('[AccountPanel] handleAccountSubmit called with data:', data)
  try {
    await accountsStore.createAccount(data.bank, data.accountNumber, '입출금', data.balance)
    showAddModal.value = false
    alert('계좌가 등록되었습니다.')
  } catch (error) {
    console.error('[AccountPanel] Error creating account:', error)
    alert('계좌 등록에 실패했습니다.')
  }
}

const handleAccountClick = (account: any) => {
  selectedAccount.value = account
  showEditModal.value = true
}

const handleAccountUpdate = async (data: { id: string; balance: string }) => {
  try {
    await accountsStore.updateAccount(data.id, data.balance)
    showEditModal.value = false
    alert('잔고가 수정되었습니다.')
  } catch (error) {
    alert('잔고 수정에 실패했습니다.')
  }
}

const handleDeleteAccount = async (id: string) => {
  if (!confirm('정말 이 계좌를 삭제하시겠습니까?')) {
    return
  }
  
  try {
    await accountsStore.deleteAccount(id)
    alert('계좌가 삭제되었습니다.')
  } catch (error) {
    alert('계좌 삭제에 실패했습니다.')
  }
}

const handleAccountDelete = async (id: string) => {
  try {
    await accountsStore.deleteAccount(id)
    showEditModal.value = false
    alert('계좌가 삭제되었습니다.')
  } catch (error) {
    alert('계좌 삭제에 실패했습니다.')
  }
}

onMounted(() => {
  accountsStore.fetchAccounts()
})
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
    cursor: pointer;
    flex: 1;
    
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
  
  .account-actions {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    
    .account-balance {
      font-size: 14px;
      font-weight: 600;
      color: $color-text;
    }
    
    .delete-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      background: transparent;
      border: 1px solid rgba($color-text, 0.2);
      border-radius: 50%;
      color: rgba($color-text, 0.5);
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      transition: all $transition-speed;
      
      &:hover {
        background: #ff5959;
        border-color: #ff5959;
        color: white;
      }
    }
  }
}
</style>

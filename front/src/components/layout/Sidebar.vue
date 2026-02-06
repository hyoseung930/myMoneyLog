<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="@/assets/images/logo.svg" alt="My Money Log" class="logo" />
    </div>
    
    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="nav-icon" :class="item.icon"></span>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
    
    <div class="account-section">
      <div class="account-header">
        <h3>Account</h3>
        <button class="add-btn" @click="handleAddAccount">Add</button>
      </div>
      
      <div class="account-list">
        <div
          v-for="account in accounts"
          :key="account.id"
          class="account-item"
          @click="handleAccountClick(account)"
        >
          <div class="account-info">
            <div class="account-name">{{ account.bankName }}</div>
            <div class="account-type">{{ account.accountNumber || "정보 없음" }}</div>
          </div>
          <div class="account-balance">
            {{ formatCurrency(Number(account.balance)) }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-name">{{ user?.nickname || '사용자' }}</div>
        <button @click="handleLogout" class="logout-btn">로그아웃</button>
      </div>
    </div>
    
    <AccountAddModal v-model="showAddModal" @submit="handleAccountSubmit" />
    <EditAccountModal v-model="showEditModal" :account="selectedAccount" @submit="handleAccountUpdate" @delete="handleAccountDelete" />
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth-new'
import { useAccountsStore } from '@/stores/accounts'
import AccountAddModal from '@/components/account/AddAccountModal.vue'
import EditAccountModal from '@/components/account/EditAccountModal.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const accountsStore = useAccountsStore()

const user = computed(() => authStore.user)
const accounts = computed(() => accountsStore.accounts)

const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedAccount = ref<any>(null)

const menuItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/year', label: 'Year', icon: 'calendar' },
  { path: '/month', label: 'Month', icon: 'calendar' },
  { path: '/day', label: 'Day', icon: 'calendar' }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const handleAddAccount = () => {
  showAddModal.value = true
}

const handleAccountSubmit = async (data: { bank: string; accountNumber: string; balance: string }) => {
  console.log("[Sidebar] handleAccountSubmit called with:", data)
  try {
    console.log("[Sidebar] Calling accountsStore.createAccount...")
    await accountsStore.createAccount(data.bank, data.accountNumber, '입출금', data.balance)
    console.log("[Sidebar] Create account successful")
    showAddModal.value = false
    alert('계좌가 등록되었습니다.')
  } catch (error) {
    console.error("[Sidebar] Create account error:", error)
    alert('계좌 등록에 실패했습니다.')
  }
}

const handleAccountClick = (account: any) => {
  console.log("[Sidebar] Account clicked:", account)
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

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('ko-KR') + '원'
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
.sidebar {
  width: $sidebar-width;
  min-height: 100vh;
  background: $color-card;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.sidebar-header {
  padding: $spacing-sm 0;
  text-align: center;
  border-bottom: 1px solid rgba($color-text, 0.1);
  
  .logo {
    width: 220px;
    height: auto;
  }
}

.sidebar-nav {
  padding: $spacing-md 0;
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md $spacing-lg;
    color: $color-text;
    text-decoration: none;
    transition: all $transition-speed;
    border-left: 3px solid transparent;
    
    .nav-icon {
      width: 20px;
      height: 20px;
      position: relative;
      flex-shrink: 0;
      
      &.dashboard::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: currentColor;
        mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z'/%3E%3C/svg%3E");
        mask-size: contain;
        mask-repeat: no-repeat;
      }
      
      &.calendar::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: currentColor;
        mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z'/%3E%3C/svg%3E");
        mask-size: contain;
        mask-repeat: no-repeat;
      }
    }
    
    .nav-label {
      font-size: 14px;
      font-weight: 500;
    }
    
    &:hover {
      background: rgba($color-sub, 0.1);
    }
    
    &.active {
      background: rgba($color-sub, 0.2);
      border-left-color: $color-sub;
      font-weight: 600;
    }
  }
}

.account-section {
  flex: 1;
  padding: $spacing-md $spacing-lg;
  border-top: 1px solid rgba($color-text, 0.1);
  overflow-y: auto;
  
  .account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
    
    h3 {
      font-size: 14px;
      font-weight: 600;
      color: $color-text;
    }
    
    .add-btn {
      padding: 4px 12px;
      background: #000;
      border: none;
      border-radius: $border-radius;
      color: #fff;
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
    gap: $spacing-sm;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .account-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    cursor: pointer;
    padding: $spacing-sm;
    border-radius: $border-radius;
    transition: all $transition-speed;
    
    &:hover {
      background: rgba($color-sub, 0.05);
    }
    
    .account-info {
      flex: 1;
      
      .account-name {
        font-size: 13px;
        font-weight: 600;
        color: $color-text;
        margin-bottom: 2px;
      }
      
      .account-type {
        font-size: 11px;
        color: rgba($color-text, 0.5);
      }
    }
    
    .account-balance {
      font-size: 13px;
      font-weight: 600;
      color: $color-text;
      text-align: right;
    }
  }
}

.sidebar-footer {
  padding: $spacing-lg;
  border-top: 1px solid rgba($color-text, 0.1);
  
  .user-info {
    text-align: center;
    
    .user-name {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: $spacing-sm;
      color: $color-text;
    }
    
    .logout-btn {
      width: 100%;
      padding: $spacing-sm;
      background: transparent;
      border: 1px solid $color-text;
      border-radius: $border-radius;
      color: $color-text;
      font-size: 12px;
      cursor: pointer;
      transition: all $transition-speed;
      
      &:hover {
        background: $color-text;
        color: $color-card;
      }
    }
  }
}
</style>

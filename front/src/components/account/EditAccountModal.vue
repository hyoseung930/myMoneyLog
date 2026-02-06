<template>
  <Modal v-model="isOpen" title="Edit Account">
    <div class="edit-account-form">
      <div class="form-group">
        <label>은행</label>
        <input
          v-model="formData.bank"
          type="text"
          class="form-input"
          disabled
        />
      </div>
      
      <div class="form-group">
        <label for="account-number">계좌번호</label>
        <input
          id="account-number"
          v-model="formData.accountNumber"
          type="text"
          class="form-input"
          disabled
        />
      </div>
      
      <div class="form-group">
        <label for="balance">통장 잔고</label>
        <input
          id="balance"
          v-model="displayBalance"
          @input="handleBalanceInput"
          type="text"
          class="form-input balance-input"
          placeholder="현재 잔고를 입력하세요"
        />
      </div>
    </div>
    
    <template #footer>
      <button @click="handleDelete" class="btn btn-delete">삭제</button>
      <div class="footer-right">
        <button @click="handleCancel" class="btn btn-cancel">취소</button>
        <button @click="handleSubmit" class="btn btn-submit">수정</button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Modal from '@/components/common/Modal.vue'

interface Props {
  modelValue: boolean
  account: {
    id: string
    bankName: string
    accountNumber?: string
    balance: string | number
  } | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: { id: string; balance: string }]
  'delete': [id: string]
}>()

const isOpen = ref(props.modelValue)
const displayBalance = ref('0')

const formatNumber = (value: string): string => {
  const numericValue = value.replace(/[^\d]/g, '')
  if (!numericValue) return ''
  return parseInt(numericValue).toLocaleString('ko-KR')
}

const handleBalanceInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  const numericValue = input.value.replace(/[^\d]/g, '')
  formData.value.balance = numericValue
  displayBalance.value = formatNumber(numericValue)
}

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
  if (newValue && props.account) {
    console.log('[EditAccountModal] Received account:', props.account)
    const balanceStr = String(props.account.balance || 0)
    const accountNum = props.account.accountNumber || '정보 없음'
    
    formData.value = {
      id: props.account.id,
      bank: props.account.bankName,
      accountNumber: accountNum,
      balance: balanceStr
    }
    displayBalance.value = formatNumber(balanceStr)
    
    console.log('[EditAccountModal] FormData set:', formData.value)
    console.log('[EditAccountModal] Display balance:', displayBalance.value)
  }
})

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

const formData = ref({
  id: '',
  bank: '',
  accountNumber: '',
  balance: '0'
})

const handleCancel = () => {
  isOpen.value = false
}

const handleSubmit = () => {
  console.log('[EditAccountModal] Submitting:', formData.value)
  emit('submit', { id: formData.value.id, balance: formData.value.balance })
  isOpen.value = false
}

const handleDelete = () => {
  if (confirm('정말로 이 계좌를 삭제하시겠습니까?')) {
    console.log('[EditAccountModal] Deleting account:', formData.value.id)
    emit('delete', formData.value.id)
    isOpen.value = false
  }
}
</script>

<style lang="scss" scoped>
.edit-account-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  
  label {
    font-size: 14px;
    font-weight: 600;
    color: $color-text;
  }
  
  .form-input {
    padding: $spacing-md;
    border: 1px solid #CCC;
    border-radius: $border-radius;
    font-size: 14px;
    color: $color-text;
    transition: all $transition-speed;
    
    &:focus {
      outline: none;
      border-color: $color-sub;
    }
    
    &:disabled {
      background: #F5F5F5;
      color: #999;
      cursor: not-allowed;
    }
    
    &.balance-input {
      text-align: right;
    }
  }
}

.btn {
  padding: $spacing-sm $spacing-lg;
  border: none;
  border-radius: $border-radius;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all $transition-speed;
  
  &.btn-cancel {
    background: #F5F5F5;
    color: $color-text;
    
    &:hover {
      background: #E0E0E0;
    }
  }
  
  &.btn-submit {
    background: $color-sub;
    color: white;
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  &.btn-delete {
    background: #FF5959;
    color: white;
    
    &:hover {
      opacity: 0.9;
    }
  }
}

.footer-right {
  display: flex;
  gap: $spacing-sm;
  margin-left: auto;
}
</style>

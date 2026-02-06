<template>
  <Modal v-model="isOpen" title="Add Account">
    <div class="add-account-form">
      <div class="form-group">
        <label>은행</label>
        <CustomSelect
          v-model="formData.bank"
          :options="banks"
          placeholder="은행을 선택하세요"
        />
      </div>
      
      <div class="form-group">
        <label for="account-number">계좌번호</label>
        <input
          id="account-number"
          v-model="formData.accountNumber"
          type="text"
          class="form-input"
          placeholder="계좌번호를 입력하세요"
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
      <button @click="handleCancel" class="btn btn-cancel">취소</button>
      <button @click="handleSubmit" class="btn btn-submit" :disabled="!isFormValid">등록</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Modal from '@/components/common/Modal.vue'
import CustomSelect from '@/components/common/CustomSelect.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: { bank: string; accountNumber: string; balance: string }]
}>()

const isOpen = ref(props.modelValue)
const isSelectOpen = ref(false)

watch(() => props.modelValue, (newValue) => {
  isOpen.value = newValue
  if (!newValue) {
    isSelectOpen.value = false
  }
})

watch(isOpen, (newValue) => {
  emit('update:modelValue', newValue)
})

const formData = ref({
  bank: '',
  accountNumber: '',
  balance: '0'
})

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

const toggleSelect = () => {
  isSelectOpen.value = !isSelectOpen.value
}

const selectBank = (bank: string) => {
  formData.value.bank = bank
  isSelectOpen.value = false
}

const banks = [
  'KB국민은행',
  '신한은행',
  '우리은행',
  'NH농협은행',
  '수협은행',
  '하나은행',
  'IBK기업은행',
  'SC제일은행',
  '한국씨티은행',
  '카카오뱅크',
  '토스뱅크',
  'K뱅크'
]

const isFormValid = computed(() => {
  return formData.value.bank !== '' && formData.value.accountNumber.trim() !== ''
})

const handleCancel = () => {
  resetForm()
  isOpen.value = false
}

const handleSubmit = () => {
  if (!formData.value.bank || !formData.value.accountNumber) {
    alert('모든 필드를 입력해주세요.')
    return
  }
  
  emit('submit', { ...formData.value })
  resetForm()
  isOpen.value = false
}

const resetForm = () => {
  formData.value = {
    bank: '',
    accountNumber: '',
    balance: '0'
  }
  displayBalance.value = '0'
}
</script>

<style lang="scss" scoped>
.add-account-form {
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
    
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
    
    &:disabled {
      background: rgba($color-sub, 0.4);
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}
</style>

<template>
  <Modal v-model="isOpen" title="계좌 추가">
    <form @submit.prevent="handleSubmit" class="account-form">
      <div class="form-group">
        <label for="bank">은행 선택</label>
        <select id="bank" v-model="formData.bank" required class="form-control">
          <option value="">은행을 선택하세요</option>
          <option value="KB국민은행">KB국민은행</option>
          <option value="신한은행">신한은행</option>
          <option value="우리은행">우리은행</option>
          <option value="하나은행">하나은행</option>
          <option value="NH농협은행">NH농협은행</option>
          <option value="IBK기업은행">IBK기업은행</option>
          <option value="SC제일은행">SC제일은행</option>
          <option value="카카오뱅크">카카오뱅크</option>
          <option value="토스뱅크">토스뱅크</option>
          <option value="케이뱅크">케이뱅크</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="accountNumber">계좌번호</label>
        <input
          id="accountNumber"
          v-model="formData.accountNumber"
          type="text"
          placeholder="계좌번호를 입력하세요"
          required
          class="form-control"
        />
      </div>
      
      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-cancel">취소</button>
        <button type="submit" class="btn btn-submit">등록</button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Modal from '@/components/common/Modal.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: { bank: string; accountNumber: string }): void
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formData = ref({
  bank: '',
  accountNumber: ''
})

const handleCancel = () => {
  formData.value = {
    bank: '',
    accountNumber: ''
  }
  isOpen.value = false
}

const handleSubmit = () => {
  emit('submit', { ...formData.value })
  formData.value = {
    bank: '',
    accountNumber: ''
  }
  isOpen.value = false
}
</script>

<style lang="scss" scoped>
.account-form {
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
  
  .form-control {
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
    
    &::placeholder {
      color: rgba($color-text, 0.4);
    }
  }
  
  select.form-control {
    cursor: pointer;
  }
}

.form-actions {
  display: flex;
  gap: $spacing-md;
  margin-top: $spacing-md;
  
  .btn {
    flex: 1;
    padding: $spacing-md;
    border: none;
    border-radius: $border-radius;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all $transition-speed;
    
    &.btn-cancel {
      background: transparent;
      border: 1px solid #CCC;
      color: $color-text;
      
      &:hover {
        background: #F5F5F5;
      }
    }
    
    &.btn-submit {
      background: $color-sub;
      color: white;
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>

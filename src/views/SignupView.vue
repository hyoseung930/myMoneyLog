<template>
  <div class="signup-view">
    <div class="signup-container">
      <div class="logo-section">
        <img src="@/assets/images/logo.svg" alt="My Money Log" class="logo" />
      </div>
      
      <form @submit.prevent="handleSignup" class="signup-form">
        <FloatingInput
          v-model="formData.username"
          label="아이디"
          id="username"
          type="text"
        />
        
        <FloatingInput
          v-model="formData.nickname"
          label="별명"
          id="nickname"
          type="text"
        />
        
        <FloatingInput
          v-model="formData.password"
          label="비밀번호"
          id="password"
          type="password"
        />
        
        <FloatingInput
          v-model="formData.confirmPassword"
          label="비밀번호 확인"
          id="confirmPassword"
          type="password"
        />
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        
        <div class="button-group">
          <Button type="submit" variant="primary">
            회원가입
          </Button>
          
          <Button type="button" variant="secondary" @click="goToLogin">
            로그인
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-new'
import FloatingInput from '@/components/common/FloatingInput.vue'
import Button from '@/components/common/Button.vue'
import { validation } from '@/utils/validation'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  nickname: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const successMessage = ref('')

const handleSignup = () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!validation.isRequired(formData.value.username)) {
    errorMessage.value = validation.getErrorMessage('아이디', 'required')
    return
  }
  
  if (!validation.isUsername(formData.value.username)) {
    errorMessage.value = validation.getErrorMessage('아이디', 'username')
    return
  }
  
  if (!validation.isRequired(formData.value.nickname)) {
    errorMessage.value = validation.getErrorMessage('별명', 'required')
    return
  }
  
  if (!validation.isPassword(formData.value.password)) {
    errorMessage.value = validation.getErrorMessage('비밀번호', 'password')
    return
  }
  
  if (!validation.passwordsMatch(formData.value.password, formData.value.confirmPassword)) {
    errorMessage.value = validation.getErrorMessage('', 'passwordsMatch')
    return
  }
  
  const result = authStore.signup(
    formData.value.username,
    formData.value.nickname,
    formData.value.password
  )
  
  if (result.success) {
    successMessage.value = '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } else {
    errorMessage.value = result.message || '회원가입에 실패했습니다.'
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.signup-view {
  min-height: 100vh;
  @include flex-center;
  background: linear-gradient(135deg, $color-main 0%, $color-main-light 100%);
  padding: $spacing-lg;
}

.signup-container {
  width: 100%;
  max-width: 400px;
  background: $color-card;
  border-radius: $border-radius * 2;
  padding: $spacing-xl * 2;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo-section {
  text-align: center;
  margin-bottom: $spacing-xl;
  
  .logo {
    width: 150px;
    height: auto;
  }
}

.signup-form {
  .error-message {
    margin-bottom: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background: $color-expense-lighter;
    border: 1px solid $color-expense;
    border-radius: $border-radius;
    color: $color-expense-dark;
    font-size: 14px;
    text-align: center;
  }
  
  .success-message {
    margin-bottom: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background: $color-income-lighter;
    border: 1px solid $color-income;
    border-radius: $border-radius;
    color: $color-income-dark;
    font-size: 14px;
    text-align: center;
  }
  
  .button-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    
    button {
      width: 100%;
    }
  }
}
</style>

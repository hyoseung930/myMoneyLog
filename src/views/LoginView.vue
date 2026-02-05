<template>
  <div class="login-view">
    <div class="login-container">
      <div class="logo-section">
        <img src="@/assets/images/logo.svg" alt="My Money Log" class="logo" />
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <FloatingInput
          v-model="formData.username"
          label="아이디"
          id="username"
          type="text"
        />
        
        <FloatingInput
          v-model="formData.password"
          label="비밀번호"
          id="password"
          type="password"
        />
        
        <div class="form-options">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="formData.rememberMe"
            />
            <span>아이디 저장</span>
          </label>
          
          <button type="button" class="link-button" @click="handleForgotPassword">
            비밀번호 찾기
          </button>
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div class="button-group">
          <Button type="submit" variant="primary">
            로그인
          </Button>
          
          <Button type="button" variant="secondary" @click="goToSignup">
            회원가입
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-new'
import FloatingInput from '@/components/common/FloatingInput.vue'
import Button from '@/components/common/Button.vue'
import { validation } from '@/utils/validation'

console.log('[LoginView] Component loaded')

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  password: '',
  rememberMe: false
})

const errorMessage = ref('')

onMounted(() => {
  console.log('[LoginView] Component mounted')
  const savedUsername = authStore.getSavedUsername()
  if (savedUsername) {
    formData.value.username = savedUsername
    formData.value.rememberMe = true
  }
})

const handleLogin = () => {
  errorMessage.value = ''
  
  if (!validation.isRequired(formData.value.username)) {
    errorMessage.value = validation.getErrorMessage('아이디', 'required')
    return
  }
  
  if (!validation.isRequired(formData.value.password)) {
    errorMessage.value = validation.getErrorMessage('비밀번호', 'required')
    return
  }
  
  const result = authStore.login(
    formData.value.username,
    formData.value.password,
    formData.value.rememberMe
  )
  
  if (result.success) {
    router.push('/')
  } else {
    errorMessage.value = result.message || '로그인에 실패했습니다.'
  }
}

const handleForgotPassword = () => {
  alert('비밀번호 찾기 기능은 준비 중입니다.')
}

const goToSignup = () => {
  router.push('/signup')
}
</script>

<style lang="scss" scoped>
.login-view {
  min-height: 100vh;
  @include flex-center;
  background: linear-gradient(135deg, $color-main 0%, $color-main-light 100%);
  padding: $spacing-lg;
}

.login-container {
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

.login-form {
  .form-options {
    @include flex-between;
    margin-bottom: $spacing-lg;
    
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      font-size: 14px;
      cursor: pointer;
      
      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
    }
    
    .link-button {
      background: none;
      border: none;
      color: $color-text;
      font-size: 14px;
      cursor: pointer;
      text-decoration: underline;
      
      &:hover {
        opacity: 0.7;
      }
    }
  }
  
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

<template>
  <div class="floating-input">
    <input
      :type="type"
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="isFocused = true"
      @blur="handleBlur"
      autocomplete="off"
    />
    <label :for="id" :class="{ active: isActive }">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  type?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const isFocused = ref(false)

const isActive = computed(() => {
  return isFocused.value || props.modelValue
})

const handleBlur = () => {
  isFocused.value = false
}
</script>

<style lang="scss" scoped>
.floating-input {
  position: relative;
  margin-bottom: $spacing-lg;
  
  input {
    width: 100%;
    padding: $spacing-sm;
    padding-top: 16px;
    border: none;
    border-bottom: 2px solid rgba($color-text, 0.2);
    border-radius: 0;
    font-size: 14px;
    background: $color-card;
    transition: all $transition-speed;
    
    &:focus {
      outline: none;
      border-bottom-color: $color-sub;
    }
  }
  
  label {
    position: absolute;
    left: $spacing-sm;
    top: 50%;
    transform: translateY(-50%);
    color: rgba($color-text, 0.6);
    font-size: 14px;
    pointer-events: none;
    transition: all $transition-speed;
    background: $color-card;
    padding: 0 4px;
    
    &.active {
      top: 0;
      font-size: 11px;
      color: $color-sub;
    }
  }
}
</style>

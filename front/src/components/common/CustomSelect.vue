<template>
  <div class="custom-select" v-click-outside="closeDropdown">
    <div class="select-trigger" @click="toggleDropdown">
      <span class="selected-value" :class="{ placeholder: !modelValue }">
        {{ displayValue || placeholder }}
      </span>
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </div>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="select-dropdown">
        <div
          v-for="option in options"
          :key="option"
          class="select-option"
          :class="{ selected: option === modelValue }"
          @click="selectOption(option)"
        >
          {{ option }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue: string
  options: string[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '선택하세요'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)

const displayValue = computed(() => {
  return props.modelValue || ''
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectOption = (option: string) => {
  emit('update:modelValue', option)
  closeDropdown()
}

const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: MouseEvent) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement & { clickOutsideEvent?: (event: MouseEvent) => void }) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  width: 100%;
}

.select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  border: 1px solid #CCC;
  border-radius: $border-radius;
  background: white;
  cursor: pointer;
  transition: all $transition-speed;
  user-select: none;
  
  &:hover {
    border-color: #999;
  }
  
  &:focus-within {
    border-color: $color-sub;
  }
  
  .selected-value {
    font-size: 14px;
    color: $color-text;
    flex: 1;
    
    &.placeholder {
      color: rgba($color-text, 0.4);
    }
  }
  
  .arrow {
    font-size: 10px;
    color: rgba($color-text, 0.5);
    transition: transform $transition-speed;
    margin-left: $spacing-sm;
    
    &.open {
      transform: rotate(180deg);
    }
  }
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #CCC;
  border-radius: $border-radius;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 240px;
  overflow-y: auto;
  z-index: 1000;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F5F5F5;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #CCC;
    border-radius: 3px;
    
    &:hover {
      background: #999;
    }
  }
}

.select-option {
  padding: $spacing-md;
  font-size: 14px;
  color: $color-text;
  cursor: pointer;
  transition: all $transition-speed;
  
  &:hover {
    background: rgba($color-sub, 0.1);
  }
  
  &.selected {
    background: rgba($color-sub, 0.2);
    font-weight: 600;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #F5F5F5;
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

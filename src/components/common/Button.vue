<template>
  <button
    :class="['btn', `btn-${variant}`]"
    :type="type"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: string
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button'
})

defineEmits<{
  click: []
}>()
</script>

<style lang="scss" scoped>
.btn {
  @include button-base;
  
  &-primary {
    background: $color-sub;
    color: #FFFFFF;
    font-weight: 600;
  }
  
  &-secondary {
    background: transparent;
    color: $color-text;
    border: 2px solid $color-text;
  }
  
  &-text {
    background: transparent;
    color: $color-text;
    padding: $spacing-sm;
    
    &:hover {
      opacity: 1;
      text-decoration: underline;
    }
  }
}
</style>

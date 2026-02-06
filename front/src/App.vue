<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  console.log('[App] Component mounted, current route:', route.path)
})
</script>

<style lang="scss">
</style>

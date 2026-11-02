<script setup lang="ts">
import Users from '@/components/Users.vue'
</script>

<template>
  <main class="app">
    <h1 class="app__title">Users</h1>
    <Users />
  </main>
</template>

<style>
body {
  margin: 0;
  background: #f4f6fb;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #1b2559;
}
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}
.app__title {
  text-align: center;
  margin: 0 0 24px;
}
</style>

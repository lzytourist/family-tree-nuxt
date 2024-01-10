<script setup lang="ts">

defineProps({
  toggleSidebar: Function,
  isAuthenticated: Boolean,
  signOut: Function
});
</script>

<template>
  <nav class="p-4 fixed top-0 w-full backdrop-blur-md bg-opacity-70 shadow">
    <UContainer class="flex justify-between items-center">
      <!-- Brand Name -->
      <div class="text-black font-bold text-2xl dark:text-white">Family Tree</div>

      <!-- Mobile Menu Button -->
      <button @click="toggleSidebar" class="lg:hidden text-white">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      <!-- Desktop Menu -->
      <div class="hidden lg:flex space-x-4">
        <NuxtLink href="/" class="text-black dark:text-white">Home</NuxtLink>
        <NuxtLink href="/dashboard" class="text-black dark:text-white" v-if="isAuthenticated">Dashboard</NuxtLink>
        <NuxtLink href="/sign-in" class="text-black dark:text-white" v-if="!isAuthenticated">Sign In</NuxtLink>
        <NuxtLink href="/sign-up" class="text-black dark:text-white" v-if="!isAuthenticated">Sign Up</NuxtLink>
        <UButton v-if="isAuthenticated" @click="signOut" icon="i-heroicons-arrow-left-start-on-rectangle" variant="outline"></UButton>
      </div>
    </UContainer>
  </nav>
</template>

<style scoped>

</style>
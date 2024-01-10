<script setup lang="ts">
import {useAuthStore} from "~/stores/authStore";

defineProps({
  isSidebarVisible: Boolean,
  toggleSidebar: Function,
  signOut: Function,
});

const beforeEnter = (el: HTMLElement) => {
  el.style.transform = 'translateX(-100%)';
};
const enter = (el: HTMLElement, done: Function) => {
  el.offsetHeight; // Trigger reflow
  el.style.transition = 'transform 0.3s';
  el.style.transform = 'translateX(0)';
  done();
};
const leave = (el: HTMLElement, done: Function) => {
  el.style.transition = 'transform 0.3s';
  el.style.transform = 'translateX(-100%)';
  done();
}

const {isAuthenticated} = useAuthStore();
</script>

<template>
  <transition name="sidebar" @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <div v-show="isSidebarVisible" class="lg:hidden fixed inset-0 bg-gray-800 backdrop-blur-md bg-opacity-50 z-50">
      <div class="flex justify-end p-4">
        <!-- Close Sidebar Button -->
        <button @click="toggleSidebar" class="text-white">
          <svg class="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Sidebar Content -->
      <div class="flex flex-col items-center h-screen justify-center">
        <NuxtLink href="/" class="text-white mb-4">Home</NuxtLink>
        <NuxtLink href="/sign-in" class="text-white mb-4" v-if="!isAuthenticated">Sign In</NuxtLink>
        <NuxtLink href="/sign-up" class="text-white mb-4" v-if="!isAuthenticated">Sign Up</NuxtLink>
        <UButton class="mb-4" v-if="isAuthenticated" @click="signOut">Sign Out</UButton>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.sidebar-enter-active, .sidebar-leave-active {
  transition: transform 0.3s;
}

.sidebar-enter, .sidebar-leave-to {
  transform: translateX(-100%);
}
</style>
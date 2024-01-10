<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import {useAuthStore} from "~/stores/authStore";

const isSidebarVisible = ref(false);

const toggleSidebar = () => {
  isSidebarVisible.value = !isSidebarVisible.value
};

const authStore = useAuthStore();
const {isAuthenticated} = storeToRefs(authStore);

const signOut = () => {
  authStore.logout();

  const router = useRouter();
  return router.push('/sign-in');
};
</script>

<template>
  <Navbar :toggleSidebar="toggleSidebar" :is-authenticated="isAuthenticated" :sign-out="signOut"/>
  <Sidebar :isSidebarVisible="isSidebarVisible" :toggleSidebar="toggleSidebar" :sign-out="signOut"/>
  <main class="mt-16">
    <slot/>
  </main>
  <footer class="py-8 bg-secondary text-center">
    <p>Copyright &copy; <NuxtLink to="/" class="text-primary">Family Tree</NuxtLink></p>
  </footer>
  <UNotifications />
</template>

<style scoped></style>

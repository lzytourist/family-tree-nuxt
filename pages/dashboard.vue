<script lang="ts" setup>
import AddPerson from "~/components/AddPerson.vue";

useSeoMeta({
  title: 'Dashboard | Family Tree',
});

definePageMeta({
  middleware: ['authenticated']
});

const isOpen = ref(false);

defineShortcuts({
  escape: {
    usingInput: true,
    whenever: [isOpen],
    handler: () => {
      isOpen.value = false
    }
  }
});

</script>

<template>
  <UContainer class="flex justify-center">
    <UCard
        class="w-full mt-4"
    >
      <template #header>
        <div class="flex justify-between">
          <h1 class="text-2xl font-bold">People</h1>
          <UButton variant="outline" icon="i-heroicons-user-plus" @click="isOpen = true">Add</UButton>
        </div>
      </template>
    </UCard>

    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Add Person
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                     @click="isOpen = false"/>
          </div>
        </template>

        <AddPerson />
      </UCard>
    </UModal>
  </UContainer>
</template>

<style scoped></style>

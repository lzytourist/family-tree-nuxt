<script lang="ts" setup>
import type {FormSubmitEvent} from "#ui/types";
import {z} from 'zod';
import {useAuthStore} from "~/stores/authStore";

useSeoMeta({
  title: 'Sign In',
  description: 'Sign in into your family tree account.'
});

const schema = z.object({
  username: z.string().email('Invalid email'),
  password: z.string()
});

const state = reactive({
  username: 'lzytourist@gmail.com',
  password: 'k!r3vai?',
  loading: false
});

type Schema = z.output<typeof schema>;

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  const {data, error, pending, status} = await useFetch('http://127.0.0.1:8000/api/auth/token/login/', {
    method: 'POST',
    body: event.data,
    watch: false
  });

  state.loading = pending.value;

  const toast = useToast();

  if (status.value === 'success') {
    const token = data.value as Token
    const cookie = useCookie('AUTH-TOKEN');
    cookie.value = token.auth_token;

    toast.add({
      title: 'Login successful'
    });

    const router = useRouter();
    return router.push('/dashboard');
  } else if (error.value?.statusCode === 400) {
    const messages = error.value?.data as Object;

    for (const [key, value] of Object.entries(messages)) {
      const message = value as Array<string>;

      toast.add({
        title: message.at(0)
      });
    }
  } else {
    toast.add({
      title: 'Something went wrong!'
    });
  }
};
</script>

<template>
  <UContainer class="flex justify-center">
    <UCard class="lg:w-1/3 mt-4">
      <template #header>
        <h1 class="text-2xl font-bold">Sign in</h1>
        <p class="text-gray-400">Access your account.</p>
      </template>
      <UForm :state="state" :schema="schema" @submit="handleSubmit">
        <UFormGroup label="Email" name="username" class="pb-2">
          <UInput type="email" name="username" id="email" placeholder="john@email.com" v-model="state.username"/>
        </UFormGroup>
        <UFormGroup label="Password" name="password" class="py-2">
          <UInput type="password" name="password" id="password" placeholder="********" v-model="state.password"/>
        </UFormGroup>
        <UButton type="submit" :loading="state.loading" block variant="outline" label="Submit" class="mt-3"/>
      </UForm>
    </UCard>
  </UContainer>
</template>

<style scoped></style>

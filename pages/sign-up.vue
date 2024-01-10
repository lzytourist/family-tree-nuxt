<script lang="ts" setup>
import {z} from 'zod';
import type {FormSubmitEvent} from "#ui/types";

useSeoMeta({
  title: 'Sign Up',
  description: 'Sign up for a family tree account to have a organized family tree and manage history.'
});

const schema = z.object({
  first_name: z.string()
      .min(2, 'Please enter at least 2 characters.')
      .max(100, "Please enter a maximum of 100 characters."),
  last_name: z.string()
      .min(2, 'Please enter at least 2 characters.')
      .max(100, "Please enter a maximum of 100 characters."),
  email: z.string().email('Invalid email'),
  password: z.string()
      .min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: 'Password does not match.',
  path: ['confirm_password']
});

const state = reactive({
  first_name: undefined,
  last_name: undefined,
  email: undefined,
  password: undefined,
  confirm_password: undefined,
  loading: false
});

type Schema = z.output<typeof schema>;

const form = ref();

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  state.loading = true;
  form.value.clear();

  const {data, error} = await useFetch('http://127.0.0.1:8000/api/auth/users/', {
    method: 'POST',
    body: event.data,
    watch: false
  });

  if (error.value?.statusCode === 400) {
    let errors = []
    for (const [key, value] of Object.entries(error.value.data)) {
      const messages = value as Array<string>
      errors.push({
        path: key,
        message: messages.at(0)
      });
    }
    form.value.setErrors(errors);
  }

  if (data.value) {
    const toast = useToast();
    const router = useRouter();

    toast.add({
      title: 'Registration successful!',
      description: 'Please login to access your account.',
      icon: 'i-bi-hand-thumbs-up-fill',
      actions: [
        {
          label: 'Login',
          click: () => {
            router.push('/sign-in')
          }
        }
      ]
    })
  }

  state.loading = false;
};
</script>

<template>
  <UContainer class="flex justify-center">
    <UCard class="mt-4 lg:w-1/3">
      <template #header>
        <h1 class="text-2xl font-bold">Sign up</h1>
        <p class="text-gray-400">Create an account to store you family tree.</p>
      </template>

      <UForm ref="form" :schema="schema" :state="state" @submit="handleSubmit">
        <UFormGroup class="pb-2" label="First name" name="first_name">
          <UInput placeholder="John" icon="i-heroicons-user" v-model="state.first_name"/>
        </UFormGroup>
        <UFormGroup class="py-2" label="Last name" name="last_name">
          <UInput placeholder="Doe" icon="i-heroicons-user" v-model="state.last_name"/>
        </UFormGroup>
        <UFormGroup class="py-2" label="Email" name="email">
          <UInput type="email" placeholder="you@example.com" icon="i-heroicons-envelope" v-model="state.email"/>
        </UFormGroup>
        <UFormGroup class="py-2" label="Password" name="password">
          <UInput type="password" placeholder="********" icon="i-heroicons-key" v-model="state.password"/>
        </UFormGroup>
        <UFormGroup class="py-2" label="Confirm password" name="confirm_password">
          <UInput type="password" placeholder="********" icon="i-heroicons-key" v-model="state.confirm_password"/>
        </UFormGroup>
        <UButton type="submit" size="lg" variant="outline" :loading="state.loading" block class="mt-3">Submit</UButton>
      </UForm>

      <template #footer>
        <p>Already have an account? <NuxtLink to="/sign-in" class="text-primary">Sign in here.</NuxtLink></p>
      </template>
    </UCard>
  </UContainer>
</template>

<style scoped></style>

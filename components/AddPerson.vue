<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";

const props = defineProps({
  //@ts-ignore
  fatherId: {
    type: [Number, null],
    default: null,
  },
  motherId: {
    type: [Number, null],
    default: null,
  },
});

const schema = z.object({
  name: z.string().min(2).max(200),
  gender: z.string(),
  child_no: z.number().min(1),
  nationality: z.string().optional(),
  father_id: z.number().or(z.null()).optional(),
  mother_id: z.number().or(z.null()).optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  name: 'Monowar Hossain Khan',
  gender: 'male',
  dob: undefined,
  nationality: 'Bangladeshi',
  father_id: undefined,
  mother_id: undefined,
  child_no: 1
});

state.father_id = props.fatherId;

const genders = [
  {
    name: 'male',
    value: 'Male'
  },
  {
    name: 'female',
    value: 'Female'
  }
];

const date = ref(new Date());

const label = computed(() => date.value.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
);

const cookie = useCookie('AUTH-TOKEN');

const loading = ref(false);
const fetchParent = async (q: string, parent_type: string) => {
  loading.value = true;
  const {data, pending, status} = await useFetch(`http://127.0.0.1:8000/api/people?gender=${parent_type}&search=${q}`, {
    watch: false,
    headers: {
      Authorization: `Token ${cookie.value}`
    }
  });
  loading.value = pending.value;

  if (status.value === 'success') {
    const people = data.value as People;
    return people.results;
  }

  return [];
};

const fetchFather = async (q: string) => fetchParent(q, 'male');
const fetchMother = async (q: string) => fetchParent(q, 'female');

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  console.log(event.data);
};

</script>

<template>
  <UForm :state="state" :schema="schema" @submit="handleSubmit">
    <UFormGroup label="Full name" name="name" class="my-2">
      <UInput type="text" name="name" id="name" v-model="state.name"/>
    </UFormGroup>
    <UFormGroup label="Gender" name="gender" class="my-2">
      <USelectMenu placeholder="Select gender" v-model="state.gender" :options="genders" value-attribute="name"
                   option-attribute="value"/>
    </UFormGroup>
    <UFormGroup label="Date of birth" name="dob" class="my-2">
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UInput v-model="state.dob" :model-value="label" class="w-full"/>
        <template #panel="{ close }">
          <DatePicker v-model="date" @close="close"/>
        </template>
      </UPopover>
    </UFormGroup>
    <UFormGroup label="Father" name="father_id" class="my-2" v-if="!fatherId">
      <USelectMenu
          v-model="state.father_id"
          :loading="loading"
          :searchable="fetchFather"
          placeholder="Search for a father..."
          option-attribute="name"
          trailing
          by="id"
      />
    </UFormGroup>
    <UFormGroup label="Mother" name="mother_id" class="my-2" v-if="!motherId">
      <USelectMenu
          v-model="state.mother_id"
          :loading="loading"
          :searchable="fetchMother"
          placeholder="Search for a father..."
          option-attribute="name"
          trailing
          by="id"
      />
    </UFormGroup>
    <UFormGroup label="Nationality" name="nationality" class="my-2">
      <UInput v-model="state.nationality"/>
    </UFormGroup>
    <UFormGroup label="Child no" name="child_no" class="my-2">
      <UInput v-model="state.child_no" type="number"/>
    </UFormGroup>
    <UButton block variant="outline" :loading="loading" type="submit" label="Submit" />
  </UForm>
</template>

<style scoped>

</style>
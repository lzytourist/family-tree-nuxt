<script setup lang="ts">
import {z} from "zod";
import type {FormSubmitEvent} from "#ui/types";

const props = defineProps({
  //@ts-ignore
  fatherId: {
    type: [Number, null],
    default: undefined,
  },
  motherId: {
    type: [Number, null],
    default: undefined,
  },
  closeModal: Function
});

const schema = z.object({
  name: z.string().min(2).max(200),
  gender: z.string(),
  child_no: z.number().min(1),
  nationality: z.string().optional(),
  father_id: z.number().or(z.null()).optional(),
  mother_id: z.number().or(z.null()).optional(),
  dob: z.any().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  name: undefined,
  gender: 'male',
  dob: undefined,
  nationality: 'Bangladeshi',
  father_id: undefined,
  mother_id: undefined,
  child_no: 1
});

state.father_id = props.fatherId;
state.mother_id = props.motherId;

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
);

const cookie = useCookie('AUTH-TOKEN');

const loading = ref(false);
const selectLoading = ref({
  father: false,
  mother: false
});
const form = ref();

const fetchParent = async (q: string, gender: string) => {
  const {data, pending, status} = await useFetch(`http://127.0.0.1:8000/api/people?gender=${gender}&search=${q}`, {
    watch: false,
    headers: {
      Authorization: `Token ${cookie.value}`
    }
  });

  if (status.value === 'success') {
    const people = data.value as People;
    return people.results;
  }

  return [];
};

const fetchFather = async (q: string) => {
  selectLoading.value.father = true;
  const res = await fetchParent(q, 'male');
  selectLoading.value.father = false;
  return res;
};

const fetchMother = async (q: string) => {
  selectLoading.value.mother = true;
  const res = await fetchParent(q, 'female');
  selectLoading.value.mother = false;
  return res;
};

const formatDate = (date: string) => {
  let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

const handleSubmit = async (event: FormSubmitEvent<Schema>, close: boolean = true) => {
  loading.value = true;

  const {data, error, pending, status} = await useFetch(`http://127.0.0.1:8000/api/people`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${cookie.value}`
    },
    body: event.data,
    watch: false
  });

  loading.value = pending.value;

  const toast = useToast();

  if (status.value === 'success') {
    toast.add({
      title: 'Person added successfully!',
    });

    if (close) {
      props.closeModal();
    }
  } else {
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
    } else {
      toast.add({
        title: 'Error!',
        description: 'Something went wrong.'
      });
    }
  }
};

const addAnother = () => {
  form.value.submit();
};

</script>

<template>
  <UForm ref="form" :state="state" :schema="schema" @submit="handleSubmit">
    <UFormGroup label="Full name" name="name" class="my-2">
      <UInput type="text" name="name" id="name" v-model="state.name"/>
    </UFormGroup>
    <UFormGroup label="Gender" name="gender" class="my-2">
      <USelectMenu placeholder="Select gender" v-model="state.gender" :options="genders" value-attribute="name"
                   option-attribute="value"/>
    </UFormGroup>
    <UFormGroup label="Date of birth" name="dob" class="my-2">
      <UInput type="date" v-model="state.dob"/>
    </UFormGroup>
    <UFormGroup label="Father" name="father_id" class="my-2" v-if="!fatherId">
      <USelectMenu
          v-model="state.father_id"
          :loading="selectLoading.father"
          :searchable="fetchFather"
          placeholder="Search for father"
          option-attribute="name"
          value-attribute="id"
          trailing
          by="id"
          :search-attributes="['name']"
      >
        <template #option="{ option: person }">
          <span class="truncate">{{ person.name }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>
    <UFormGroup label="Mother" name="mother_id" class="my-2" v-if="!motherId">
      <USelectMenu
          v-model="state.mother_id"
          :loading="selectLoading.mother"
          :searchable="fetchMother"
          placeholder="Search for mother"
          option-attribute="name"
          value-attribute="id"
          trailing
          by="id"
          :search-attributes="['name']"
      >
        <template #option="{ option: person }">
          <span class="truncate">{{ person.name }}</span>
        </template>
      </USelectMenu>
    </UFormGroup>
    <UFormGroup label="Nationality" name="nationality" class="my-2">
      <UInput v-model="state.nationality"/>
    </UFormGroup>
    <UFormGroup label="Child no" name="child_no" class="my-2">
      <UInput v-model="state.child_no" type="number"/>
    </UFormGroup>
    <UButton block variant="outline" :loading="loading" type="submit" label="Submit"/>
  </UForm>
</template>

<style scoped>

</style>
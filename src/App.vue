<script setup lang="ts">
import CustomInput from '@/components/CustomInput.vue'
import { InputType } from '@/enums/InputType.ts'
import { ref } from 'vue'
import { RecordType } from '@/enums/RecordType.ts'
import CustomSelect from '@/components/CustomSelect.vue'

const mark = ref('')
const recordType = ref(RecordType.LOCAL)
const login = ref('')
const password = ref('')
</script>

<template>
  <main>
    <div class="flex items-center gap-2">
      <h1 class="text-lg font-bold">Учетные записи</h1>
      <button class="p-2 border border-gray-300 rounded-sm hover:bg-gray-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>

    <CustomInput
      :type="InputType.PASSWORD"
      :modelValue="password"
      @update:modelValue="password = $event" />
    <CustomInput :type="InputType.TEXT" :modelValue="mark" />
    <CustomSelect v-model="recordType" :options="[RecordType.LDAP, RecordType.LOCAL]" />
    <CustomInput :type="InputType.TEXT" :modelValue="login" />
    <button>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14 11v6m-4-6v6M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M7 7l2-4h6l2 4"
          stroke-width="1" />
      </svg>
    </button>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RecordType } from '@/enums/RecordType.ts'

const props = defineProps<{
  options: RecordType[]
  modelValue?: RecordType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: RecordType): void
}>()

const selected = computed({
  get: () => props.modelValue ?? RecordType.LOCAL,
  set: (value: RecordType) => {
    emit('update:modelValue', value)
  },
})

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selected.value = target.value as RecordType
}
</script>

<template>
  <select
    :value="selected"
    @change="onChange"
    class="w-full min-h-[34px] border rounded border-gray-300 py-1 px-2 pr-4 focus:outline-none focus:ring focus:border-blue-500">
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>

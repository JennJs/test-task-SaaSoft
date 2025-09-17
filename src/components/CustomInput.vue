<script setup lang="ts">
import { ref, computed } from 'vue'
import { InputType } from '@/enums/InputType.ts'

interface Props {
  type: InputType
  modelValue: string | null
  onBlur: () => void
  error: string | null
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isPasswordVisible = ref(false)

const inputType = computed(() => {
  if (props.type === InputType.PASSWORD) {
    return isPasswordVisible.value ? InputType.TEXT : InputType.PASSWORD
  }
  return InputType.TEXT
})

const toggleVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative">
    <input
      :type="inputType"
      :value="modelValue"
      @input="handleChange"
      @blur="onBlur"
      :class="[
        'w-full border rounded border-gray-300 py-1 px-2 pr-10 focus:outline-none focus:ring focus:border-blue-500',
        error && 'border-red-300',
      ]" />
    <button
      v-if="type === InputType.PASSWORD"
      type="button"
      @click="toggleVisibility"
      class="absolute top-[5px] right-0 px-3 flex items-center focus:outline-none">
      <svg
        v-if="isPasswordVisible"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24">
        <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
          <path
            d="M8.25 12a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0M12 9.75a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5" />
          <path
            d="M4.323 10.646c-.419.604-.573 1.077-.573 1.354s.154.75.573 1.354c.406.583 1.008 1.216 1.77 1.801C7.62 16.327 9.713 17.25 12 17.25s4.38-.923 5.907-2.095c.762-.585 1.364-1.218 1.77-1.801c.419-.604.573-1.077.573-1.354s-.154-.75-.573-1.354c-.406-.583-1.008-1.216-1.77-1.801C16.38 7.673 14.287 6.75 12 6.75s-4.38.923-5.907 2.095c-.762.585-1.364 1.218-1.77 1.801m.856-2.991C6.91 6.327 9.316 5.25 12 5.25s5.09 1.077 6.82 2.405c.867.665 1.583 1.407 2.089 2.136c.492.709.841 1.486.841 2.209s-.35 1.5-.841 2.209c-.506.729-1.222 1.47-2.088 2.136c-1.73 1.328-4.137 2.405-6.821 2.405s-5.09-1.077-6.82-2.405c-.867-.665-1.583-1.407-2.089-2.136C2.6 13.5 2.25 12.723 2.25 12s.35-1.5.841-2.209c.506-.729 1.222-1.47 2.088-2.136" />
        </g>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <g
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2">
          <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
          <path
            d="M16.681 16.673A8.7 8.7 0 0 1 12 18q-5.4 0-9-6q1.908-3.18 4.32-4.674m2.86-1.146A9 9 0 0 1 12 6q5.4 0 9 6q-1 1.665-2.138 2.87M3 3l18 18" />
        </g>
      </svg>
    </button>
    <span v-if="error" class="block mt-1 text-xs text-red-400">{{ error }}</span>
  </div>
</template>

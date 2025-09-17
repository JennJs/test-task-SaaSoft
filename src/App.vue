<script setup lang="ts">
import CustomInput from '@/components/CustomInput.vue'
import { InputType } from '@/enums/InputType.ts'
import { onMounted, ref } from 'vue'
import { RecordType } from '@/enums/RecordType.ts'
import CustomSelect from '@/components/CustomSelect.vue'
import { useAccountStore } from '@/stores/accounts.ts'
import { storeToRefs } from 'pinia'
import type { IAccount } from '@/types/account.ts'

const accountStore = useAccountStore()
const { accounts } = storeToRefs(accountStore)
const {
  addAccount,
  removeAccount,
  updateAccount,
  loadAccounts,
  saveAccountsToLocalStorage,
  accountErrors,
  validateAccount,
} = accountStore

const currentField = ref<string | null>(null)

onMounted(() => {
  loadAccounts()
})

const onFieldBlur = (account: IAccount, field: keyof IAccount) => {
  currentField.value = field
  validateAccount(account)
  saveAccountsToLocalStorage()
}

const onRecordTypeChange = (event: RecordType, account: IAccount) => {
  updateAccount(account.id, { recordType: event })
  validateAccount(account)
  saveAccountsToLocalStorage()
}
</script>

<template>
  <main>
    <section class="flex items-center gap-2 mb-4">
      <h1 class="text-lg font-bold">Учетные записи</h1>
      <button @click="addAccount()" class="p-2 border border-gray-300 rounded-sm hover:bg-gray-50">
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
    </section>
    <div class="flex items-center gap-2 mb-4 text-xs bg-[#eef4fa] rounded-sm py-0.5 px-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-1-5h2v2h-2zm2-1.645V14h-2v-1.5a1 1 0 0 1 1-1a1.5 1.5 0 1 0-1.471-1.794l-1.962-.393A3.501 3.501 0 1 1 13 13.355" />
      </svg>
      <span
        >Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</span
      >
    </div>
    <section>
      <table class="table-auto w-full border-separate border-spacing-2">
        <thead class="text-xs text-gray-400 text-left">
          <tr>
            <th class="w-[24%]">Метки</th>
            <th class="w-[24%]">Тип записи</th>
            <th class="w-[24%]">Логин</th>
            <th class="w-[24%]">Пароль</th>
            <th class="w-[4%]"></th>
          </tr>
        </thead>
        <tbody>
          <tr class="align-top" v-for="account in accounts" :key="account.id">
            <td>
              <CustomInput
                :type="InputType.TEXT"
                :modelValue="account.markString"
                :onBlur="() => onFieldBlur(account, 'markString')"
                @update:modelValue="updateAccount(account.id, { markString: $event })"
                :error="
                  currentField === 'markString'
                    ? (accountErrors[account.id]?.['markString'] ?? null)
                    : null
                " />
            </td>
            <td>
              <CustomSelect
                v-model="account.recordType"
                :options="[RecordType.LDAP, RecordType.LOCAL]"
                @update:modelValue="($event) => onRecordTypeChange($event, account)" />
            </td>
            <td :colspan="account.recordType === RecordType.LOCAL ? 1 : 2">
              <CustomInput
                :type="InputType.TEXT"
                :modelValue="account.login"
                @update:modelValue="updateAccount(account.id, { login: $event })"
                :onBlur="() => onFieldBlur(account, 'login')"
                :error="
                  currentField === 'login' ? (accountErrors[account.id]?.['login'] ?? null) : null
                " />
            </td>
            <td v-if="account.recordType === RecordType.LOCAL">
              <CustomInput
                :type="InputType.PASSWORD"
                :modelValue="account.password"
                @update:modelValue="updateAccount(account.id, { password: $event })"
                :onBlur="() => onFieldBlur(account, 'password')"
                :error="
                  currentField === 'password'
                    ? (accountErrors[account.id]?.['password'] ?? null)
                    : null
                " />
            </td>
            <td>
              <button
                class="mt-[5px] hover:bg-gray-50 hover:rounded"
                @click="removeAccount(account.id)">
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
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

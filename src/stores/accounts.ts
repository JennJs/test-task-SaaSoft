import { RecordType } from '@/enums/RecordType.ts'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IAccount } from '@/types/account.ts'
import { STORAGE_KEY } from '@/const'

export const useAccountStore = defineStore('account', () => {
  const accounts = ref<IAccount[]>([])
  const accountErrors = ref<Record<string, Record<string, string>>>({})

  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 15)
  }

  const addAccount = () => {
    const newAccount: IAccount = {
      id: generateId(),
      markArray: [],
      recordType: RecordType.LOCAL,
      login: '',
      password: null,
      isValid: false,
      markString: '',
    }
    accounts.value.push(newAccount)
  }

  const removeAccount = (id: string) => {
    accounts.value = accounts.value.filter((account) => account.id !== id)
    saveOrRemoveAccountsFromLocalStorage()
  }

  const updateAccount = (id: string, updatedFields: Partial<Omit<IAccount, 'id' | 'isValid'>>) => {
    const index = accounts.value.findIndex((account) => account.id === id)
    if (index !== -1) {
      const oldAccount = accounts.value[index]

      let updatedAccount: IAccount = {
        ...oldAccount,
        ...updatedFields,
      }

      if (updatedFields.markString) {
        updatedAccount.markArray = transformMark(updatedAccount.markString)
      }

      if (updatedAccount.recordType === RecordType.LDAP) {
        updatedAccount.password = null
      }

      accounts.value.splice(index, 1, updatedAccount)
    }
  }

  const loadAccounts = () => {
    try {
      const storedAccounts = localStorage.getItem(STORAGE_KEY)
      if (storedAccounts) {
        accounts.value = JSON.parse(storedAccounts, (key, value) => {
          if (key === 'recordType' && typeof value === 'string') {
            return value as RecordType
          }
          return value
        })
      }
    } catch (error) {
      console.error('Error get data from localStorage:', error)
      accounts.value = []
    }
  }

  const transformMark = (markString: string) => {
    const markArray = markString
      .split(';')
      .map((item) => item.trim())
      .filter((item) => item !== '')
    return markArray.map((text) => ({ text }))
  }

  const saveOrRemoveAccountsFromLocalStorage = () => {
    try {
      if (Object.keys(accountErrors.value).length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.value))
      } else {
        const storedAccounts = localStorage.getItem(STORAGE_KEY)
        if (storedAccounts) {
          const errorIds = Object.keys(accountErrors.value)
          const accountWithoutErrors = JSON.parse(storedAccounts).filter(
            (acc: IAccount) => !errorIds.includes(acc.id),
          )
          localStorage.setItem(STORAGE_KEY, JSON.stringify(accountWithoutErrors))
        }
      }
    } catch (error) {
      console.error('Error save to localStorage:', error)
    }
  }

  const validateAccount = (account: IAccount) => {
    if (!accountErrors.value[account.id]) {
      accountErrors.value[account.id] = {}
    }
    if (account.markString.length > 50) {
      accountErrors.value[account.id]['markString'] = 'Максимум 50 символов'
    } else {
      delete accountErrors.value[account.id]['markString']
    }

    if (!account.login || account.login.trim().length === 0) {
      accountErrors.value[account.id]['login'] = 'Обязательное поле'
    } else if (account.login.length > 100) {
      accountErrors.value[account.id]['login'] = 'Максимум 100 символов'
    } else {
      delete accountErrors.value[account.id]['login']
    }

    if (account.recordType === RecordType.LOCAL) {
      if (!account.password || account.password.trim().length === 0) {
        accountErrors.value[account.id]['password'] = 'Обязательное поле'
      } else if (account.password.length > 100) {
        accountErrors.value[account.id]['password'] = 'Максимум 100 символов'
      } else {
        delete accountErrors.value[account.id]['password']
      }
    } else {
      delete accountErrors.value[account.id]['password']
    }
    if (Object.keys(accountErrors.value[account.id]).length === 0) {
      delete accountErrors.value[account.id]
    }
  }

  return {
    accounts,
    addAccount,
    transformMark,
    removeAccount,
    updateAccount,
    loadAccounts,
    saveAccountsToLocalStorage: saveOrRemoveAccountsFromLocalStorage,
    validateAccount,
    accountErrors,
  }
})

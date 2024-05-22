export const storagePrefix = '__daily-jj-tea-helper'

export function getStorage(key: string, isJson = false): string | Record<string, any> {
  const fullKey = `${storagePrefix}-${key}`
  const storage = window.localStorage.getItem(fullKey)
  return isJson ? JSON.parse(storage || '{}') : storage
}

export function setStorage(key: string, value: any, isJson = false) {
  const fullKey = `${storagePrefix}-${key}`
  const storage = isJson ? JSON.stringify(value) : value
  window.localStorage.setItem(fullKey, storage)
}

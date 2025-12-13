<template>
  <div class="tw-mt-7">

    <!-- Навигация -->
    <div class="tw-flex tw-items-center tw-gap-2">
      <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
      <span>→</span>
      <span class="tw-text-gray-400">Выдать товары клиентам</span>
    </div>

    <!-- Предупреждение -->
    <p class="tw-text-red-500 tw-text-center tw-mt-4 tw-text-[16px]">
      Внимания! После сканирования заказ считается выполненным!
    </p>

    <!-- Сканер штрих кодов -->
    <div class="tw-mt-4 tw-bg-green-50 tw-border tw-border-green-200 tw-rounded-xl tw-p-4 tw-flex tw-items-center tw-justify-between">
      <div class="tw-flex tw-items-center tw-gap-2">
        <span class="tw-text-2xl">🔫</span>
        <input
          ref="scannerInput"
          v-model="scannerCode"
          @keyup.enter="handleScannerInput"
          type="text"
          placeholder="Сканируйте штрих кодов..."
          class="tw-bg-transparent tw-outline-none tw-text-gray-700 tw-w-[300px]"
          autofocus
        >
      </div>
      <button 
        @click="finishScanning"
        class="tw-text-blue-600 hover:tw-underline"
      >
        Завершить
      </button>
    </div>

    <!-- Ручной ввод -->
    <div class="tw-mt-4 tw-flex tw-items-center tw-gap-2">
      <input
        v-model="manualCode"
        @keyup.enter="addManualCode"
        type="text"
        placeholder="Или введите штрих код"
        class="tw-border tw-rounded-lg tw-px-4 tw-py-2 tw-w-[250px]"
      >
      <button 
        @click="addManualCode"
        :disabled="!manualCode || loading"
        class="tw-bg-green-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-green-600 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
      >
        Добавить
      </button>
    </div>

    <!-- Таблица -->
    <div class="tw-mt-4 tw-bg-white tw-rounded-xl tw-shadow-md tw-overflow-hidden">
      <table class="tw-w-full">
        <thead class="tw-bg-gray-50">
          <tr>
            <th class="tw-text-left tw-px-4 tw-py-3 tw-font-medium tw-text-gray-700 tw-border-b">Трек-код</th>
            <th class="tw-text-left tw-px-4 tw-py-3 tw-font-medium tw-text-gray-700 tw-border-b">Состояния</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in completedTracks" :key="index" class="tw-border-b last:tw-border-b-0">
            <td class="tw-px-4 tw-py-3 tw-text-gray-800">{{ item.trackCode }}</td>
            <td class="tw-px-4 tw-py-3">
              <span 
                :class="item.success ? 'tw-text-green-600' : 'tw-text-red-600'"
              >
                {{ item.status }}
              </span>
            </td>
          </tr>
          <tr v-if="completedTracks.length === 0">
            <td colspan="2" class="tw-px-4 tw-py-8 tw-text-center tw-text-gray-400">
              Сканируйте или введите трек-код для начала
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const { $axios } = useNuxtApp()
const token = useCookie('token')

const scannerInput = ref<HTMLInputElement | null>(null)
const scannerCode = ref('')
const manualCode = ref('')
const loading = ref(false)

interface CompletedTrack {
  trackCode: string
  status: string
  success: boolean
}

const completedTracks = ref<CompletedTrack[]>([])

onMounted(() => {
  // Автофокус на сканер
  scannerInput.value?.focus()
})

// Обработка ввода со сканера
const handleScannerInput = async () => {
  if (!scannerCode.value.trim()) return
  
  await completeTrack(scannerCode.value.trim())
  scannerCode.value = ''
  scannerInput.value?.focus()
}

// Добавление вручную
const addManualCode = async () => {
  if (!manualCode.value.trim()) return
  
  await completeTrack(manualCode.value.trim())
  manualCode.value = ''
}

// Завершить трек
const completeTrack = async (trackCode: string) => {
  loading.value = true
  
  try {
    const res = await $axios.post(
      '/admin/tracks/complete-tracks',
      { productId: trackCode },
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )
    
    completedTracks.value.unshift({
      trackCode,
      status: 'Выполнено ✓',
      success: true
    })
    
    toast.success(`Трек ${trackCode} выполнен!`)
    
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Ошибка'
    
    completedTracks.value.unshift({
      trackCode,
      status: errorMessage,
      success: false
    })
    
    toast.error(`Ошибка: ${errorMessage}`)
  } finally {
    loading.value = false
  }
}

// Завершить сканирование
const finishScanning = () => {
  toast.info(`Сканирование завершено. Обработано: ${completedTracks.value.length} треков`)
}
</script>

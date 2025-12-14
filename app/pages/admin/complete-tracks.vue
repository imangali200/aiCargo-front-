<template>
  <div class="tw-py-6 animate-fadeIn">
    <!-- Header -->
    <div class="tw-mb-6">
      <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-mb-4">
        <router-link class="tw-text-cyan-400 hover:tw-text-cyan-300 tw-transition-colors" to="/admin">Главная</router-link>
        <span class="tw-text-white/60">→</span>
        <span class="tw-text-white/60">Выдать товар</span>
      </div>
      <h1 class="tw-text-2xl tw-font-bold tw-text-white tw-mb-2">Выдать товар клиенту</h1>
      <p class="tw-text-white/60">Сканируйте штрих-код для завершения заказа</p>
    </div>

    <!-- Warning -->
    <div class="tw-bg-red-500/10 tw-border tw-border-red-500/20 tw-rounded-2xl tw-p-4 tw-mb-6">
      <div class="tw-flex tw-items-center tw-gap-3">
        <div class="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-red-500/20 tw-flex tw-items-center tw-justify-center tw-text-red-400 tw-flex-shrink-0">
          <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <p class="tw-text-red-400 tw-font-medium">Внимание! После сканирования заказ считается выполненным!</p>
      </div>
    </div>

    <!-- Scanner Card -->
    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-5 tw-mb-4">
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-4">
        <div class="tw-flex tw-items-center tw-gap-3 tw-flex-1">
          <div class="tw-w-12 tw-h-12 tw-rounded-xl tw-bg-gradient-to-br tw-from-emerald-500 tw-to-green-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-flex-shrink-0">
            <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <input
            ref="scannerInput"
            v-model="scannerCode"
            @keyup.enter="handleScannerInput"
            type="text"
            placeholder="Сканируйте штрих-код..."
            class="tw-flex-1 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-px-4 tw-py-3 tw-text-white placeholder:tw-text-white/60 tw-outline-none focus:tw-border-emerald-500/50 tw-transition-colors"
            autofocus
          >
        </div>
        <button 
          @click="finishScanning"
          class="tw-px-5 tw-py-3 tw-bg-emerald-500/20 tw-border tw-border-emerald-500/30 tw-rounded-xl tw-text-emerald-400 tw-font-semibold hover:tw-bg-emerald-500/30 tw-transition-all tw-flex tw-items-center tw-gap-2"
        >
          <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Завершить
        </button>
      </div>
    </div>

    <!-- Manual Input -->
    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-5 tw-mb-6">
      <p class="tw-text-white/60 tw-text-sm tw-mb-3">Или введите трек-код вручную</p>
      <div class="tw-flex tw-items-center tw-gap-3">
        <input
          v-model="manualCode"
          @keyup.enter="addManualCode"
          type="text"
          placeholder="Введите трек-код"
          class="tw-flex-1 sm:tw-max-w-xs tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-px-4 tw-py-3 tw-text-white placeholder:tw-text-white/60 tw-outline-none focus:tw-border-cyan-500/50 tw-transition-colors"
        >
        <button 
          @click="addManualCode"
          :disabled="!manualCode || loading"
          class="tw-px-5 tw-py-3 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-xl tw-text-white tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-cyan-500/30 tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-flex tw-items-center tw-gap-2"
        >
          <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Выдать
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 tw-gap-4 tw-mb-6" v-if="completedTracks.length > 0">
      <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-white">{{ completedTracks.length }}</p>
        <p class="tw-text-white/60 tw-text-sm">Всего</p>
      </div>
      <div class="tw-bg-emerald-500/10 tw-border tw-border-emerald-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-emerald-400">{{ completedTracks.filter(t => t.success).length }}</p>
        <p class="tw-text-emerald-400/70 tw-text-sm">Выдано</p>
      </div>
      <div class="tw-bg-red-500/10 tw-border tw-border-red-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-red-400">{{ completedTracks.filter(t => !t.success).length }}</p>
        <p class="tw-text-red-400/70 tw-text-sm">Ошибки</p>
      </div>
    </div>

    <!-- Tracks Table -->
    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden">
      <div class="tw-px-5 tw-py-4 tw-border-b tw-border-white/10">
        <h2 class="tw-text-lg tw-font-semibold tw-text-white">Выданные товары</h2>
      </div>
      
      <!-- Table Header -->
      <div class="tw-hidden sm:tw-grid tw-grid-cols-2 tw-gap-4 tw-px-5 tw-py-3 tw-bg-white/[0.02] tw-border-b tw-border-white/10">
        <span class="tw-text-white/60 tw-text-sm tw-font-medium">Трек-код</span>
        <span class="tw-text-white/60 tw-text-sm tw-font-medium">Статус</span>
      </div>

      <!-- Table Body -->
      <div class="tw-divide-y tw-divide-white/5">
        <div 
          v-for="(item, index) in completedTracks" 
          :key="index" 
          class="tw-px-5 tw-py-4 hover:tw-bg-white/[0.02] tw-transition-colors"
        >
          <div class="tw-flex tw-flex-col sm:tw-grid sm:tw-grid-cols-2 tw-gap-2 sm:tw-gap-4">
            <div>
              <span class="tw-text-white/60 tw-text-xs sm:tw-hidden">Трек-код:</span>
              <p class="tw-text-white tw-font-mono">{{ item.trackCode }}</p>
            </div>
            <div class="tw-flex tw-items-center tw-gap-2">
              <span 
                :class="[
                  'tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium',
                  item.success 
                    ? 'tw-bg-emerald-500/20 tw-text-emerald-400' 
                    : 'tw-bg-red-500/20 tw-text-red-400'
                ]"
              >
                {{ item.success ? '✓' : '✗' }} {{ item.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="completedTracks.length === 0" class="tw-px-5 tw-py-16 tw-text-center">
          <div class="tw-w-16 tw-h-16 tw-rounded-2xl tw-bg-white/5 tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
            <svg class="tw-w-8 tw-h-8 tw-text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="tw-text-white/60">Сканируйте или введите трек-код для начала</p>
        </div>
      </div>
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
  scannerInput.value?.focus()
})

const handleScannerInput = async () => {
  if (!scannerCode.value.trim()) return
  
  await completeTrack(scannerCode.value.trim())
  scannerCode.value = ''
  scannerInput.value?.focus()
}

const addManualCode = async () => {
  if (!manualCode.value.trim()) return
  
  await completeTrack(manualCode.value.trim())
  manualCode.value = ''
}

const completeTrack = async (trackCode: string) => {
  loading.value = true
  
  try {
    await $axios.post(
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
      status: 'Выдано',
      success: true
    })
    
    toast.success(`Трек ${trackCode} выдан клиенту!`, { position: 'top-center' })
    
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Ошибка'
    
    completedTracks.value.unshift({
      trackCode,
      status: errorMessage,
      success: false
    })
    
    toast.error(`Ошибка: ${errorMessage}`, { position: 'top-center' })
  } finally {
    loading.value = false
  }
}

const finishScanning = () => {
  const successCount = completedTracks.value.filter(t => t.success).length
  toast.success(`Сканирование завершено. Выдано: ${successCount} товаров`, { position: 'top-center' })
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

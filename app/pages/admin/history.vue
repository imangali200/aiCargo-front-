<template>
  <div class="tw-py-6 animate-fadeIn">
    <!-- Header -->
    <div class="tw-mb-6">
      <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-mb-4">
        <router-link class="tw-text-cyan-400 hover:tw-text-cyan-300 tw-transition-colors" to="/admin">Главная</router-link>
        <span class="tw-text-white/60">→</span>
        <span class="tw-text-white/60">История</span>
      </div>
      <h1 class="tw-text-2xl tw-font-bold tw-text-white tw-mb-2">История товаров</h1>
      <p class="tw-text-white/60">Все товары и их статусы</p>
    </div>

    <!-- Filters -->
    <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-4 tw-mb-6">
      <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-items-start sm:tw-items-center tw-justify-between">
        <!-- Tab Filters -->
        <div class="tw-flex tw-flex-wrap tw-gap-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            @click="activeTab = tab.value"
            :class="[
              'tw-px-4 tw-py-2 tw-rounded-xl tw-text-sm tw-font-medium tw-transition-all',
              activeTab === tab.value 
                ? 'tw-bg-cyan-500 tw-text-white tw-shadow-lg tw-shadow-cyan-500/30' 
                : 'tw-bg-white/5 tw-text-white/60 hover:tw-bg-white/10'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Search -->
        <div class="tw-flex tw-items-center tw-gap-2">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Трек-код іздеу..."
            class="tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-px-3 tw-py-2 tw-text-white tw-text-sm tw-outline-none focus:tw-border-cyan-500/50 placeholder:tw-text-white/60"
          >
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-4 tw-gap-4 tw-mb-6">
      <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-white">{{ stats.total }}</p>
        <p class="tw-text-white/60 tw-text-sm">Барлығы</p>
      </div>
      <div class="tw-bg-blue-500/10 tw-border tw-border-blue-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-blue-400">{{ stats.registered }}</p>
        <p class="tw-text-blue-400/70 tw-text-sm">Тіркелді</p>
      </div>
      <div class="tw-bg-cyan-500/10 tw-border tw-border-cyan-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-cyan-400">{{ stats.atWarehouse }}</p>
        <p class="tw-text-cyan-400/70 tw-text-sm">Складта</p>
      </div>
      <div class="tw-bg-emerald-500/10 tw-border tw-border-emerald-500/20 tw-rounded-xl tw-p-4 tw-text-center">
        <p class="tw-text-2xl tw-font-bold tw-text-emerald-400">{{ stats.completed }}</p>
        <p class="tw-text-emerald-400/70 tw-text-sm">Берілді</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="tw-text-center tw-py-16">
      <div class="tw-w-12 tw-h-12 tw-border-4 tw-border-cyan-500/20 tw-border-t-cyan-500 tw-rounded-full tw-animate-spin tw-mx-auto"></div>
      <p class="tw-mt-4 tw-text-white/60">Жүктелуде...</p>
    </div>

    <!-- History List -->
    <div v-else class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden">
      <div class="tw-px-5 tw-py-4 tw-border-b tw-border-white/10 tw-flex tw-items-center tw-justify-between">
        <h2 class="tw-text-lg tw-font-semibold tw-text-white">Товарлар тізімі</h2>
        <span class="tw-text-white/60 tw-text-sm">{{ filteredProducts.length }} жазба</span>
      </div>
      
      <!-- Table Header -->
      <div class="tw-hidden sm:tw-grid tw-grid-cols-12 tw-gap-4 tw-px-5 tw-py-3 tw-bg-white/[0.02] tw-border-b tw-border-white/10">
        <span class="tw-col-span-3 tw-text-white/60 tw-text-sm tw-font-medium">Трек-код</span>
        <span class="tw-col-span-3 tw-text-white/60 tw-text-sm tw-font-medium">Сипаттама</span>
        <span class="tw-col-span-2 tw-text-white/60 tw-text-sm tw-font-medium">Статус</span>
        <span class="tw-col-span-2 tw-text-white/60 tw-text-sm tw-font-medium">Тіркелген</span>
        <span class="tw-col-span-2 tw-text-white/60 tw-text-sm tw-font-medium">Соңғы өзгеріс</span>
      </div>

      <!-- Table Body -->
      <div class="tw-divide-y tw-divide-white/5">
        <div 
          v-for="item in filteredProducts" 
          :key="item.id" 
          class="tw-px-5 tw-py-4 hover:tw-bg-white/[0.02] tw-transition-colors"
        >
          <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-12 tw-gap-2 sm:tw-gap-4 tw-items-center">
            <!-- Track Code -->
            <div class="tw-col-span-3">
              <span class="tw-text-white/60 tw-text-xs sm:tw-hidden">Трек-код: </span>
              <span class="tw-text-white tw-font-mono tw-font-medium">{{ item.productId }}</span>
            </div>
            
            <!-- Product Name -->
            <div class="tw-col-span-3">
              <span class="tw-text-white/60 tw-text-xs sm:tw-hidden">Сипаттама: </span>
              <span class="tw-text-white/70">{{ item.productName || '—' }}</span>
            </div>
            
            <!-- Status -->
            <div class="tw-col-span-2">
              <span 
                :class="[
                  'tw-px-2.5 tw-py-1 tw-rounded-lg tw-text-xs tw-font-medium',
                  getStatusStyle(item)
                ]"
              >
                {{ getStatusLabel(item) }}
              </span>
            </div>
            
            <!-- Registered Date -->
            <div class="tw-col-span-2">
              <span class="tw-text-white/60 tw-text-xs sm:tw-hidden">Тіркелген: </span>
              <span class="tw-text-white/60 tw-text-sm">{{ formatDate(item.client_registered) }}</span>
            </div>
            
            <!-- Last Update -->
            <div class="tw-col-span-2">
              <span class="tw-text-white/60 tw-text-xs sm:tw-hidden">Соңғы: </span>
              <span class="tw-text-white/60 tw-text-sm">{{ formatDate(getLastUpdate(item)) }}</span>
            </div>
          </div>

          <!-- Timeline (mobile) -->
          <div class="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2 sm:tw-hidden">
            <span v-if="item.client_registered" class="tw-px-2 tw-py-0.5 tw-bg-blue-500/20 tw-text-blue-400 tw-text-xs tw-rounded">📝 Тіркелді</span>
            <span v-if="item.china_warehouse" class="tw-px-2 tw-py-0.5 tw-bg-amber-500/20 tw-text-amber-400 tw-text-xs tw-rounded">🇨🇳 Қытайда</span>
            <span v-if="item.aicargo" class="tw-px-2 tw-py-0.5 tw-bg-cyan-500/20 tw-text-cyan-400 tw-text-xs tw-rounded">📦 Складта</span>
            <span v-if="item.given_to_client" class="tw-px-2 tw-py-0.5 tw-bg-emerald-500/20 tw-text-emerald-400 tw-text-xs tw-rounded">✅ Берілді</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="tw-px-5 tw-py-16 tw-text-center">
          <div class="tw-w-16 tw-h-16 tw-rounded-2xl tw-bg-white/5 tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
            <svg class="tw-w-8 tw-h-8 tw-text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <p class="tw-text-white/60">Товарлар табылмады</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const toast = useToast()
const { $axios } = useNuxtApp()
const token = useCookie('token')

const loading = ref(false)
const activeTab = ref('all')
const searchQuery = ref('')

const tabs = [
  { label: 'Барлығы', value: 'all' },
  { label: '📝 Тіркелді', value: 'registered' },
  { label: '📦 Складта', value: 'warehouse' },
  { label: '✅ Берілді', value: 'completed' }
]

interface Product {
  id: number
  productId: string
  productName: string
  client_registered: string | null
  china_warehouse: string | null
  aicargo: string | null
  given_to_client: string | null
  deleteAt: string | null
}

const products = ref<Product[]>([])

const stats = computed(() => ({
  total: products.value.length,
  registered: products.value.filter(p => p.client_registered && !p.aicargo && !p.given_to_client).length,
  atWarehouse: products.value.filter(p => p.aicargo && !p.given_to_client).length,
  completed: products.value.filter(p => p.given_to_client).length
}))

const filteredProducts = computed(() => {
  let result = products.value

  // Filter by tab
  if (activeTab.value === 'registered') {
    result = result.filter(p => p.client_registered && !p.aicargo && !p.given_to_client)
  } else if (activeTab.value === 'warehouse') {
    result = result.filter(p => p.aicargo && !p.given_to_client)
  } else if (activeTab.value === 'completed') {
    result = result.filter(p => p.given_to_client)
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.productId.toLowerCase().includes(query) || 
      (p.productName && p.productName.toLowerCase().includes(query))
    )
  }

  return result
})

const getStatusLabel = (item: Product) => {
  if (item.given_to_client) return '✅ Берілді'
  if (item.aicargo) return '📦 Складта'
  if (item.china_warehouse) return '🇨🇳 Қытайда'
  return '📝 Тіркелді'
}

const getStatusStyle = (item: Product) => {
  if (item.given_to_client) return 'tw-bg-emerald-500/20 tw-text-emerald-400'
  if (item.aicargo) return 'tw-bg-cyan-500/20 tw-text-cyan-400'
  if (item.china_warehouse) return 'tw-bg-amber-500/20 tw-text-amber-400'
  return 'tw-bg-blue-500/20 tw-text-blue-400'
}

const getLastUpdate = (item: Product) => {
  if (item.given_to_client) return item.given_to_client
  if (item.aicargo) return item.aicargo
  if (item.china_warehouse) return item.china_warehouse
  return item.client_registered
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchProducts = async () => {
  loading.value = true
  
  try {
    const res = await $axios.get('/products', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    products.value = res.data || []
    
  } catch (err: any) {
    console.error('Products fetch error:', err)
    toast.error('Деректерді жүктеу кезінде қате болды', { position: 'top-center' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
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

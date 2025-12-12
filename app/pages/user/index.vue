<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import { useToast, POSITION } from 'vue-toastification'

interface Product {
    id: number
    productId: string
    description: string | null
    client_registered: string | null
    china_warehouse: string | null
    aicargo: string | null
    given_to_client: string | null
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()


const products = ref<Product[]>([])
const loading = ref(false)
const searchQuery = ref('')
const searchLoading = ref(false)

// Modal states
const showAddModal = ref(false)
const newTrackCode = ref('')
const newDescription = ref('')
const addLoading = ref(false)

// Pagination
const currentPage = ref(1)
const perPage = 10

const paginatedProducts = computed(() => {
    if (!products.value.length) return []
    const start = (currentPage.value - 1) * perPage
    return products.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(products.value.length / perPage))

// Get user's products
async function getMyProducts() {
    loading.value = true
    try {
        const response = await $axios.get('products/my', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        products.value = response.data
    } catch (error: any) {
        console.error(error)
        if (error.response?.status !== 404) {
            toast.error('Ошибка при загрузке треков', { position: 'top-center' as POSITION })
        }
        products.value = []
    } finally {
        loading.value = false
    }
}

// Add new track
async function addTrack() {
    if (!newTrackCode.value.trim()) {
        toast.warning('Введите трек-код', { position: 'top-center' as POSITION })
        return
    }
    if (!newDescription.value.trim()) {
        toast.warning('Введите описание товара', { position: 'top-center' as POSITION })
        return
    }
    
    addLoading.value = true
    try {
        await $axios.post('products', 
            { 
                productId: newTrackCode.value.trim(),
                productName: newDescription.value.trim()
            },
            { headers: { 'Authorization': `Bearer ${token.value}` } }
        )
        toast.success('Трек-код успешно добавлен!', { position: 'top-center' as POSITION })
        newTrackCode.value = ''
        newDescription.value = ''
        showAddModal.value = false
        await getMyProducts()
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при добавлении трека', { position: 'top-center' as POSITION })
    } finally {
        addLoading.value = false
    }
}

// Search track
async function searchTrack() {
    if (!searchQuery.value.trim()) {
        await getMyProducts()
        return
    }
    
    searchLoading.value = true
    try {
        const response = await $axios.get(`products/${searchQuery.value.trim()}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        products.value = response.data ? [response.data] : []
    } catch (error: any) {
        console.error(error)
        if (error.response?.status === 404) {
            toast.warning('Трек не найден', { position: 'top-center' as POSITION })
            products.value = []
        } else {
            toast.error('Ошибка при поиске', { position: 'top-center' as POSITION })
        }
    } finally {
        searchLoading.value = false
    }
}

// Delete track
async function deleteTrack(productId: string) {
    if (!confirm(`Удалить трек ${productId}?`)) return
    
    try {
        await $axios.delete(`products/${productId}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        toast.success('Трек удалён', { position: 'top-center' as POSITION })
        await getMyProducts()
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка при удалении', { position: 'top-center' as POSITION })
    }
}

// Format date with time
function formatDateTime(date: string | null) {
    if (!date) return null
    return new Date(date).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Get header gradient based on current status
function getHeaderGradient(product: Product) {
    if (product.given_to_client) {
        return 'tw-from-green-500 tw-to-green-600' // Выдан - жасыл
    }
    if (product.aicargo) {
        return 'tw-from-purple-500 tw-to-purple-600' // Тараз - күлгін
    }
    if (product.china_warehouse) {
        return 'tw-from-blue-500 tw-to-blue-600' // Китай - көк
    }
    return 'tw-from-amber-500 tw-to-orange-500' // Регистрация - оранжевый
}

// View track details
function viewTrack(productId: string) {
    router.push(`/user/track/${productId}`)
}

// Clear search
function clearSearch() {
    searchQuery.value = ''
    getMyProducts()
}

onMounted(() => {
    getMyProducts()
})
</script>

<template>
    <div class="tw-mt-5 tw-px-0 md:tw-px-3 tw-pb-6">
        <!-- Header Buttons -->
        <div class="tw-grid tw-grid-cols-4 tw-gap-2 sm:tw-gap-3">
            <button 
                @click="showAddModal = true"
                class="tw-bg-[#0891B2] tw-text-white tw-py-3 tw-rounded-xl tw-font-medium hover:tw-bg-[#0e7490] tw-transition-colors tw-text-xs sm:tw-text-sm"
            >
                Добавить
            </button>
            <router-link 
                to="/user/info"
                class="tw-bg-[#27839a] tw-text-white tw-py-3 tw-rounded-xl tw-font-medium hover:tw-bg-[#0e7490] tw-transition-colors tw-text-center tw-text-xs sm:tw-text-sm"
            >
                Инфо
            </router-link>
            <router-link 
                to="/user/feed"
                class="tw-bg-[#EC4899] tw-text-white tw-py-3 tw-rounded-xl tw-font-medium hover:tw-bg-[#DB2777] tw-transition-colors tw-text-center tw-text-xs sm:tw-text-sm"
            >
                📝 Лента
            </router-link>
            <router-link 
                to="/user/archive"
                class="tw-bg-[#7C3AED] tw-text-white tw-py-3 tw-rounded-xl tw-font-medium hover:tw-bg-[#6D28D9] tw-transition-colors tw-text-center tw-text-xs sm:tw-text-sm"
            >
                Архив
            </router-link>
        </div>

        <!-- Search -->
        <div class="tw-mt-4">
            <input 
                v-model="searchQuery"
                @keyup.enter="searchTrack"
                type="text" 
                placeholder="Поиск..."
                class="tw-w-full tw-h-12 tw-px-4 tw-rounded-xl tw-border tw-border-gray-200 tw-bg-white focus:tw-outline-none focus:tw-border-[#0891B2] tw-transition-colors"
            >
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-mt-10 tw-text-center tw-py-12">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-10 tw-w-10 tw-border-4 tw-border-[#0891B2] tw-border-t-transparent"></div>
            <p class="tw-mt-3 tw-text-gray-500">Загрузка...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="!products.length" class="tw-mt-6 tw-text-center tw-py-12 tw-bg-white tw-rounded-2xl">
            <div class="tw-text-5xl tw-mb-4">📦</div>
            <h3 class="tw-text-lg tw-font-semibold tw-text-gray-700 tw-mb-2">У вас нет треков</h3>
            <p class="tw-text-gray-400 tw-mb-4">Добавьте свой первый трек-код</p>
            <button 
                @click="showAddModal = true"
                class="tw-bg-[#0891B2] tw-text-white tw-px-6 tw-py-3 tw-rounded-xl hover:tw-bg-[#0e7490] tw-transition-colors"
            >
                Добавить трек
            </button>
        </div>

        <!-- Products List -->
        <div v-else class="tw-mt-4">
            <!-- Product Cards Grid -->
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-4">
                <div 
                    v-for="product in paginatedProducts" 
                    :key="product.id"
                    class="tw-bg-white tw-rounded-2xl tw-overflow-hidden tw-shadow-md hover:tw-shadow-xl tw-transition-all tw-duration-300 tw-border tw-border-gray-100"
                >
                <!-- Header with gradient based on status -->
                <div :class="['tw-bg-gradient-to-r', getHeaderGradient(product), 'tw-px-4 tw-py-3']">
                    <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
                        <div>
                            <p class="tw-text-white/70 tw-text-[10px] tw-font-medium">Трек-код</p>
                            <p class="tw-text-white tw-font-bold tw-text-sm tw-tracking-wide">{{ product.productId.toUpperCase() }}</p>
                        </div>
                        <button 
                            @click="deleteTrack(product.productId)"
                            class="tw-bg-white/20 hover:tw-bg-red-500 tw-text-white tw-p-1.5 tw-rounded-lg tw-transition-all tw-duration-200"
                        >
                            <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                    
                    <!-- Progress bar -->
                    <div class="tw-h-1.5 tw-bg-white/30 tw-rounded-full tw-overflow-hidden">
                        <div 
                            class="tw-h-full tw-bg-white tw-rounded-full tw-transition-all tw-duration-500"
                            :style="{ width: ([product.client_registered, product.china_warehouse, product.aicargo, product.given_to_client].filter(Boolean).length / 4 * 100) + '%' }"
                        ></div>
                    </div>
                </div>

                <!-- Content -->
                <div class="tw-p-3">
                    <!-- Description -->
                    <div class="tw-bg-gray-50 tw-rounded-xl tw-p-2.5 tw-mb-3">
                        <p class="tw-text-[10px] tw-text-gray-400">Описание</p>
                        <p class="tw-text-gray-800 tw-font-medium tw-text-xs tw-line-clamp-2">{{ product.description || 'Не указано' }}</p>
                    </div>

                    <!-- Timeline -->
                    <div class="tw-relative">
                        <!-- Vertical line -->
                        <div class="tw-absolute tw-left-[11px] tw-top-3 tw-bottom-3 tw-w-0.5 tw-bg-gray-200"></div>
                        
                        <div class="tw-space-y-2">
                            <!-- Step 1: Registered - ORANGE -->
                            <div class="tw-flex tw-items-center tw-gap-2.5 tw-relative">
                                <div 
                                    :class="product.client_registered 
                                        ? 'tw-bg-gradient-to-br tw-from-orange-400 tw-to-orange-600 tw-shadow-md tw-shadow-orange-200' 
                                        : 'tw-bg-gray-200'"
                                    class="tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-z-10"
                                >
                                    <svg v-if="product.client_registered" class="tw-w-3 tw-h-3 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span v-else class="tw-text-gray-400 tw-text-[10px] tw-font-bold">1</span>
                                </div>
                                <div class="tw-flex-1 tw-flex tw-items-center tw-justify-between">
                                    <p :class="product.client_registered ? 'tw-text-gray-700' : 'tw-text-gray-400'" class="tw-font-medium tw-text-xs">
                                        Регистрация
                                    </p>
                                    <p :class="product.client_registered ? 'tw-text-orange-600' : 'tw-text-gray-400'" class="tw-text-[10px]">
                                        {{ formatDateTime(product.client_registered) || '—' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Step 2: China warehouse - BLUE -->
                            <div class="tw-flex tw-items-center tw-gap-2.5 tw-relative">
                                <div 
                                    :class="product.china_warehouse 
                                        ? 'tw-bg-gradient-to-br tw-from-blue-400 tw-to-blue-600 tw-shadow-md tw-shadow-blue-200' 
                                        : 'tw-bg-gray-200'"
                                    class="tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-z-10"
                                >
                                    <svg v-if="product.china_warehouse" class="tw-w-3 tw-h-3 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span v-else class="tw-text-gray-400 tw-text-[10px] tw-font-bold">2</span>
                                </div>
                                <div class="tw-flex-1 tw-flex tw-items-center tw-justify-between">
                                    <p :class="product.china_warehouse ? 'tw-text-gray-700' : 'tw-text-gray-400'" class="tw-font-medium tw-text-xs">
                                        Китай
                                    </p>
                                    <p :class="product.china_warehouse ? 'tw-text-blue-600' : 'tw-text-gray-400'" class="tw-text-[10px]">
                                        {{ formatDateTime(product.china_warehouse) || '—' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Step 3: Taraz warehouse - PURPLE -->
                            <div class="tw-flex tw-items-center tw-gap-2.5 tw-relative">
                                <div 
                                    :class="product.aicargo 
                                        ? 'tw-bg-gradient-to-br tw-from-purple-400 tw-to-purple-600 tw-shadow-md tw-shadow-purple-200' 
                                        : 'tw-bg-gray-200'"
                                    class="tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-z-10"
                                >
                                    <svg v-if="product.aicargo" class="tw-w-3 tw-h-3 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span v-else class="tw-text-gray-400 tw-text-[10px] tw-font-bold">3</span>
                                </div>
                                <div class="tw-flex-1 tw-flex tw-items-center tw-justify-between">
                                    <p :class="product.aicargo ? 'tw-text-gray-700' : 'tw-text-gray-400'" class="tw-font-medium tw-text-xs">
                                        Тараз
                                    </p>
                                    <p :class="product.aicargo ? 'tw-text-purple-600' : 'tw-text-gray-400'" class="tw-text-[10px]">
                                        {{ formatDateTime(product.aicargo) || '—' }}
                                    </p>
                                </div>
                            </div>

                            <!-- Step 4: Given to client - GREEN -->
                            <div class="tw-flex tw-items-center tw-gap-2.5 tw-relative">
                                <div 
                                    :class="product.given_to_client 
                                        ? 'tw-bg-gradient-to-br tw-from-green-400 tw-to-green-600 tw-shadow-md tw-shadow-green-200' 
                                        : 'tw-bg-gray-200'"
                                    class="tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-z-10"
                                >
                                    <svg v-if="product.given_to_client" class="tw-w-3 tw-h-3 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                                    </svg>
                                    <span v-else class="tw-text-gray-400 tw-text-[10px] tw-font-bold">4</span>
                                </div>
                                <div class="tw-flex-1 tw-flex tw-items-center tw-justify-between">
                                    <p :class="product.given_to_client ? 'tw-text-gray-700' : 'tw-text-gray-400'" class="tw-font-medium tw-text-xs">
                                        Выдан
                                    </p>
                                    <p :class="product.given_to_client ? 'tw-text-green-600' : 'tw-text-gray-400'" class="tw-text-[10px]">
                                        {{ formatDateTime(product.given_to_client) || '—' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- View Details Button -->
                    <button 
                        @click="viewTrack(product.productId)"
                        class="tw-w-full tw-mt-3 tw-py-2 tw-bg-gray-100 hover:tw-bg-[#0891B2] hover:tw-text-white tw-text-gray-600 tw-rounded-lg tw-text-xs tw-font-medium tw-transition-all tw-duration-200"
                    >
                        Подробнее →
                    </button>
                </div>
            </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-mt-5">
                <button 
                    @click="currentPage--" 
                    :disabled="currentPage === 1"
                    class="tw-w-9 tw-h-9 tw-rounded-lg tw-bg-white tw-border tw-border-gray-200 tw-shadow-sm disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-bg-gray-50 tw-flex tw-items-center tw-justify-center tw-text-sm"
                >
                    ←
                </button>
                <div class="tw-px-3 tw-py-1.5 tw-bg-[#0891B2] tw-text-white tw-rounded-lg tw-font-semibold tw-text-xs">
                    {{ currentPage }} / {{ totalPages }}
                </div>
                <button 
                    @click="currentPage++" 
                    :disabled="currentPage === totalPages"
                    class="tw-w-9 tw-h-9 tw-rounded-lg tw-bg-white tw-border tw-border-gray-200 tw-shadow-sm disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-bg-gray-50 tw-flex tw-items-center tw-justify-center tw-text-sm"
                >
                    →
                </button>
            </div>

            <!-- Total count -->
            <div class="tw-bg-white tw-rounded-xl tw-p-3 tw-mt-4 tw-flex tw-items-center tw-justify-between tw-shadow-sm">
                <span class="tw-text-gray-600 tw-text-sm">Количество треков</span>
                <span class="tw-bg-[#0891B2] tw-text-white tw-px-3 tw-py-1 tw-rounded-full tw-font-bold tw-text-sm">{{ products.length }}</span>
            </div>
        </div>

        <!-- Add Modal -->
        <Teleport to="body">
            <div 
                v-if="showAddModal" 
                class="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4"
                @click.self="showAddModal = false"
            >
                <div class="tw-bg-white tw-rounded-2xl tw-p-6 tw-w-full tw-max-w-md tw-shadow-2xl">
                    <div class="tw-flex tw-items-center tw-justify-between tw-mb-6">
                        <h3 class="tw-text-xl tw-font-bold tw-text-gray-800">Добавить трек</h3>
                        <button 
                            @click="showAddModal = false"
                            class="tw-text-gray-400 hover:tw-text-gray-600 tw-text-2xl"
                        >
                            ×
                        </button>
                    </div>
                    
                    <div class="tw-mb-4">
                        <label class="tw-block tw-text-sm tw-text-gray-500 tw-mb-2">Трек-код *</label>
                        <input 
                            v-model="newTrackCode"
                            type="text" 
                            placeholder="Введите трек-код"
                            class="tw-w-full tw-h-12 tw-px-4 tw-rounded-xl tw-border tw-border-gray-200 focus:tw-outline-none focus:tw-border-[#0891B2] tw-transition-colors"
                            autofocus
                        >
                    </div>

                    <div class="tw-mb-6">
                        <label class="tw-block tw-text-sm tw-text-gray-500 tw-mb-2">Описание товара *</label>
                        <textarea 
                            v-model="newDescription"
                            @keyup.ctrl.enter="addTrack"
                            placeholder="Например: Куртка зимняя, размер L"
                            rows="3"
                            class="tw-w-full tw-px-4 tw-py-3 tw-rounded-xl tw-border tw-border-gray-200 focus:tw-outline-none focus:tw-border-[#0891B2] tw-transition-colors tw-resize-none"
                        ></textarea>
                    </div>

                    <div class="tw-flex tw-gap-3">
                        <button 
                            @click="showAddModal = false"
                            class="tw-flex-1 tw-py-3 tw-rounded-xl tw-border tw-border-gray-200 tw-text-gray-600 hover:tw-bg-gray-50 tw-transition-colors"
                        >
                            Отмена
                        </button>
                        <button 
                            @click="addTrack"
                            :disabled="addLoading || !newTrackCode.trim() || !newDescription.trim()"
                            class="tw-flex-1 tw-py-3 tw-rounded-xl tw-bg-[#0891B2] tw-text-white hover:tw-bg-[#0e7490] tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                        >
                            {{ addLoading ? 'Добавление...' : 'Добавить' }}
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Floating Action Button - Create Post -->
        <router-link 
            to="/user/create-post"
            class="tw-fixed tw-bottom-6 tw-right-6 tw-w-14 tw-h-14 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white tw-text-2xl tw-shadow-lg hover:tw-shadow-xl tw-transition-all hover:tw-scale-110 tw-z-40"
            style="background: linear-gradient(135deg, #EC4899, #DB2777);"
        >
            ✏️
        </router-link>
    </div>
</template>

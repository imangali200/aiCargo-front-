<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import { useToast } from '~/composables/useToast'

interface Product {
    id: number
    productId: string
    description: string | null
    client_registered: string | null
    china_warehouse: string | null
    aicargo: string | null
    given_to_client: string | null
}

interface UserProfile {
    id: number
    phoneNumber: string
    name: string
    surname: string
    code: string
    branch: string
    isActive: boolean
    role: string
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const userProfile = ref<UserProfile | null>(null)
const isUserActive = ref(true)
const profileLoading = ref(true)

const products = ref<Product[]>([])
const loading = ref(false)
const searchQuery = ref('')
const searchLoading = ref(false)
const isSearchMode = ref(false)

const showAddModal = ref(false)
const newTrackCode = ref('')
const newDescription = ref('')
const addLoading = ref(false)

const currentPage = ref(1)
const perPage = 10

const paginatedProducts = computed(() => {
    if (!products.value.length) return []
    const start = (currentPage.value - 1) * perPage
    return products.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(products.value.length / perPage))

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
            toast.error('Ошибка при загрузке треков', { position: 'top-center'  })
        }
        products.value = []
    } finally {
        loading.value = false
    }
}

async function addTrack() {
    if (!newTrackCode.value.trim()) {
        toast.warning('Введите трек-код', { position: 'top-center'  })
        return
    }
    if (!newDescription.value.trim()) {
        toast.warning('Введите описание товара', { position: 'top-center'  })
        return
    }
    
    addLoading.value = true
    try {
        await $axios.post('products', 
            { productId: newTrackCode.value.trim(), productName: newDescription.value.trim() },
            { headers: { 'Authorization': `Bearer ${token.value}` } }
        )
        toast.success('Трек-код успешно добавлен!', { position: 'top-center'  })
        newTrackCode.value = ''
        newDescription.value = ''
        showAddModal.value = false
        await getMyProducts()
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при добавлении трека', { position: 'top-center'  })
    } finally {
        addLoading.value = false
    }
}

async function searchTrack() {
    if (!searchQuery.value.trim()) {
        await getMyProducts()
        isSearchMode.value = false
        return
    }
    
    searchLoading.value = true
    try {
        const response = await $axios.get(`products/${searchQuery.value.trim()}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        products.value = response.data ? [response.data] : []
        isSearchMode.value = true
    } catch (error: any) {
        console.error(error)
        if (error.response?.status === 404) {
            toast.warning('Трек не найден', { position: 'top-center'  })
            products.value = []
        } else {
            toast.error('Ошибка при поиске', { position: 'top-center'  })
        }
        isSearchMode.value = true
    } finally {
        searchLoading.value = false
    }
}

async function deleteTrack(productId: string) {
    if (!confirm(`Удалить трек ${productId}?`)) return
    
    try {
        await $axios.delete(`products/${productId}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        toast.success('Трек удалён', { position: 'top-center'  })
        await getMyProducts()
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка при удалении', { position: 'top-center'  })
    }
}

function formatDateTime(date: string | null) {
    if (!date) return null
    return new Date(date).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
}

function getStatusGradient(product: Product) {
    if (product.given_to_client) return 'tw-from-green-500 tw-to-green-600'
    if (product.aicargo) return 'tw-from-violet-500 tw-to-violet-600'
    if (product.china_warehouse) return 'tw-from-blue-500 tw-to-blue-600'
    return 'tw-from-amber-500 tw-to-orange-500'
}

function viewTrack(productId: string) {
    router.push(`/user/track/${productId}`)
}

function clearSearch() {
    searchQuery.value = ''
    isSearchMode.value = false
    getMyProducts()
}

async function checkUserProfile() {
    profileLoading.value = true
    try {
        const response = await $axios.get('profile', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        userProfile.value = response.data
        isUserActive.value = response.data.isActive
        if (response.data.isActive) {
            await getMyProducts()
        }
    } catch (error: any) {
        console.error('Profile check error:', error)
        isUserActive.value = false
    } finally {
        profileLoading.value = false
    }
}

onMounted(() => {
    checkUserProfile()
})
</script>

<template>
    <!-- Loading state -->
    <div v-if="profileLoading" class="tw-min-h-[80vh] tw-flex tw-items-center tw-justify-center">
        <div class="tw-text-center">
            <div class="tw-w-12 tw-h-12 tw-border-4 tw-border-cyan-500/20 tw-border-t-cyan-500 tw-rounded-full tw-animate-spin tw-mx-auto"></div>
            <p class="tw-mt-4 tw-text-white/60">Загрузка...</p>
        </div>
    </div>

    <!-- Not activated user -->
    <div v-else-if="!isUserActive" class="tw-min-h-[80vh] tw-flex tw-items-center tw-justify-center tw-px-4">
        <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-3xl tw-p-8 tw-max-w-md tw-w-full tw-text-center tw-shadow-2xl animate-slideUp">
            <div class="tw-w-20 tw-h-20 tw-mx-auto tw-mb-6 tw-bg-gradient-to-br tw-from-amber-400 tw-to-orange-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-shadow-amber-500/30">
                <svg class="tw-w-10 tw-h-10 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
            </div>
            <h2 class="tw-text-2xl tw-font-bold tw-text-white tw-mb-3">Ожидание активации</h2>
            <p class="tw-text-white/60 tw-text-lg tw-mb-6">Вас еще не активировали.</p>
            <div class="tw-bg-emerald-500/10 tw-border tw-border-emerald-500/30 tw-rounded-2xl tw-p-5">
                <p class="tw-text-white/70 tw-mb-3">Напишите в WhatsApp:</p>
                <a href="https://wa.me/77752329889" target="_blank" class="tw-inline-flex tw-items-center tw-gap-3 tw-bg-gradient-to-r tw-from-green-500 tw-to-green-600 tw-text-white tw-px-6 tw-py-3 tw-rounded-xl tw-font-semibold tw-text-lg hover:tw-from-green-600 hover:tw-to-green-700 tw-transition-all tw-shadow-md hover:tw-shadow-lg">
                    <svg class="tw-w-6 tw-h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    +7 775 232 98 89
                </a>
            </div>
        </div>
    </div>

    <!-- Main content -->
    <div v-else class="tw-py-6 animate-fadeIn">
        <!-- Action Buttons -->
        <div class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-4 tw-gap-3">
            <button @click="showAddModal = true" class="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-py-3.5 tw-px-4 tw-rounded-xl tw-font-semibold tw-text-sm tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-text-white tw-shadow-lg tw-shadow-cyan-500/30 hover:tw-translate-y-[-2px] hover:tw-shadow-xl tw-transition-all tw-duration-300">
                <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                <span>Добавить</span>
            </button>
            <router-link to="/user/info" class="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-py-3.5 tw-px-4 tw-rounded-xl tw-font-semibold tw-text-sm tw-bg-cyan-500/15 tw-border tw-border-cyan-500/30 tw-text-cyan-400 hover:tw-bg-cyan-500/25 tw-transition-all tw-duration-300">
                <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Инфо</span>
            </router-link>
            <router-link to="/user/feed" class="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-py-3.5 tw-px-4 tw-rounded-xl tw-font-semibold tw-text-sm tw-bg-pink-500/15 tw-border tw-border-pink-500/30 tw-text-pink-400 hover:tw-bg-pink-500/25 tw-transition-all tw-duration-300">
                <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                <span>Posts</span>
            </router-link>
            <router-link to="/user/archive" class="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-py-3.5 tw-px-4 tw-rounded-xl tw-font-semibold tw-text-sm tw-bg-violet-500/15 tw-border tw-border-violet-500/30 tw-text-violet-400 hover:tw-bg-violet-500/25 tw-transition-all tw-duration-300">
                <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                <span>Архив</span>
            </router-link>
        </div>

        <!-- Search -->
        <div class="tw-mt-5">
            <div class="tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-overflow-hidden focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all tw-duration-300" :class="{ 'tw-border-cyan-500': isSearchMode }">
                <div class="tw-px-4 tw-text-white/40">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input v-model="searchQuery" @keyup.enter="searchTrack" type="text" placeholder="Поиск по трек-коду..." class="tw-flex-1 tw-min-w-0 tw-h-[52px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30">
                <div class="tw-flex tw-items-center tw-gap-1.5 tw-pr-1.5 tw-flex-shrink-0">
                    <button @click="searchTrack" class="tw-h-10 tw-px-5 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-lg tw-text-white tw-font-semibold tw-text-sm hover:tw-from-cyan-600 hover:tw-to-cyan-700 tw-transition-all tw-flex-shrink-0">Поиск</button>
                    <button v-if="isSearchMode" @click="clearSearch" class="tw-w-10 tw-h-10 tw-bg-red-500/20 tw-rounded-lg tw-text-red-400 tw-flex tw-items-center tw-justify-center hover:tw-bg-red-500/30 tw-transition-all tw-flex-shrink-0">
                        <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Search indicator -->
        <div v-if="isSearchMode" class="tw-mt-3 tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-white/60">
            <span>🔍</span>
            <span>Результат поиска:</span>
            <span class="tw-font-semibold tw-text-cyan-400">"{{ searchQuery }}"</span>
            <span class="tw-text-white/40">({{ products.length }} найдено)</span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-mt-10 tw-text-center tw-py-12">
            <div class="tw-w-10 tw-h-10 tw-border-4 tw-border-cyan-500/20 tw-border-t-cyan-500 tw-rounded-full tw-animate-spin tw-mx-auto"></div>
            <p class="tw-mt-3 tw-text-white/50">Загрузка...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="!products.length" class="tw-mt-6 tw-text-center tw-py-12 tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl">
            <div class="tw-text-5xl tw-mb-4">📦</div>
            <h3 class="tw-text-lg tw-font-semibold tw-text-white tw-mb-2">У вас нет треков</h3>
            <p class="tw-text-white/40 tw-mb-4">Добавьте свой первый трек-код</p>
            <button @click="showAddModal = true" class="tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-text-white tw-px-6 tw-py-3 tw-rounded-xl tw-font-semibold hover:tw-from-cyan-600 hover:tw-to-cyan-700 tw-transition-all tw-shadow-lg tw-shadow-cyan-500/30">
                Добавить трек
            </button>
        </div>

        <!-- Products List -->
        <div v-else class="tw-mt-5">
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-4">
                <div v-for="product in paginatedProducts" :key="product.id" class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden hover:tw-border-white/20 hover:tw-translate-y-[-4px] hover:tw-shadow-2xl tw-transition-all tw-duration-300">
                    <!-- Header -->
                    <div :class="['tw-bg-gradient-to-r tw-px-4 tw-py-3', getStatusGradient(product)]">
                        <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
                            <div>
                                <p class="tw-text-white/70 tw-text-[10px] tw-font-medium">Трек-код</p>
                                <p class="tw-text-white tw-font-bold tw-text-sm tw-tracking-wide">{{ product.productId.toUpperCase() }}</p>
                            </div>
                            <button @click="deleteTrack(product.productId)" class="tw-w-8 tw-h-8 tw-bg-white/20 hover:tw-bg-red-500 tw-text-white tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-200">
                                <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                        <!-- Progress bar -->
                        <div class="tw-h-1.5 tw-bg-white/30 tw-rounded-full tw-overflow-hidden">
                            <div class="tw-h-full tw-bg-white tw-rounded-full tw-transition-all tw-duration-500" :style="{ width: ([product.client_registered, product.china_warehouse, product.aicargo, product.given_to_client].filter(Boolean).length / 4 * 100) + '%' }"></div>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="tw-p-3">
                        <div class="tw-bg-white/5 tw-rounded-xl tw-p-2.5 tw-mb-3">
                            <p class="tw-text-[10px] tw-text-white/40">Описание</p>
                            <p class="tw-text-white tw-font-medium tw-text-xs tw-line-clamp-2">{{ product.description || 'Не указано' }}</p>
                        </div>

                        <!-- Timeline -->
                        <div class="tw-relative">
                            <div class="tw-absolute tw-left-[11px] tw-top-3 tw-bottom-3 tw-w-0.5 tw-bg-white/10"></div>
                            <div class="tw-space-y-2">
                                <!-- Step 1: Registered -->
                                <div class="tw-flex tw-items-center tw-gap-2.5 tw-relative">
                                    <div :class="['tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-z-10', product.client_registered ? 'tw-bg-gradient-to-br tw-from-orange-400 tw-to-orange-600 tw-shadow-md tw-shadow-orange-500/30' : 'tw-bg-white/10']">
                                        <svg v-if="product.client_registered" class="tw-w-3 tw-h-3 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                                        <span v-else class="tw-text-white/40 tw-text-[10px] tw-font-bold">1</span>
                                    </div>
                                    <div class="tw-flex-1 tw-flex tw-items-center tw-justify-between">
                                        <p :class="['tw-font-medium tw-text-xs', product.client_registered ? 'tw-text-white/90' : 'tw-text-white/40']">Регистрация</p>
                                        <p :class="['tw-text-[10px]', product.client_registered ? 'tw-text-orange-400' : 'tw-text-white/30']">{{ formatDateTime(product.client_registered) || '—' }}</p>
                                    </div>
                                </div>
                                <!-- Step 2: China -->
                                <div class="tw-flex tw-items-center tw-gap-2.5 tw-relative">
                                    <div :class="['tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-z-10', product.china_warehouse ? 'tw-bg-gradient-to-br tw-from-blue-400 tw-to-blue-600 tw-shadow-md tw-shadow-blue-500/30' : 'tw-bg-white/10']">
                                        <svg v-if="product.china_warehouse" class="tw-w-3 tw-h-3 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                                        <span v-else class="tw-text-white/40 tw-text-[10px] tw-font-bold">2</span>
                                    </div>
                                    <div class="tw-flex-1 tw-flex tw-items-center tw-justify-between">
                                        <p :class="['tw-font-medium tw-text-xs', product.china_warehouse ? 'tw-text-white/90' : 'tw-text-white/40']">Китай</p>
                                        <p :class="['tw-text-[10px]', product.china_warehouse ? 'tw-text-blue-400' : 'tw-text-white/30']">{{ formatDateTime(product.china_warehouse) || '—' }}</p>
                                    </div>
                                </div>
                                <!-- Step 3: Taraz -->
                                <div class="tw-flex tw-items-center tw-gap-2.5 tw-relative">
                                    <div :class="['tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-z-10', product.aicargo ? 'tw-bg-gradient-to-br tw-from-violet-400 tw-to-violet-600 tw-shadow-md tw-shadow-violet-500/30' : 'tw-bg-white/10']">
                                        <svg v-if="product.aicargo" class="tw-w-3 tw-h-3 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                                        <span v-else class="tw-text-white/40 tw-text-[10px] tw-font-bold">3</span>
                                    </div>
                                    <div class="tw-flex-1 tw-flex tw-items-center tw-justify-between">
                                        <p :class="['tw-font-medium tw-text-xs', product.aicargo ? 'tw-text-white/90' : 'tw-text-white/40']">Тараз</p>
                                        <p :class="['tw-text-[10px]', product.aicargo ? 'tw-text-violet-400' : 'tw-text-white/30']">{{ formatDateTime(product.aicargo) || '—' }}</p>
                                    </div>
                                </div>
                                <!-- Step 4: Delivered -->
                                <div class="tw-flex tw-items-center tw-gap-2.5 tw-relative">
                                    <div :class="['tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-z-10', product.given_to_client ? 'tw-bg-gradient-to-br tw-from-green-400 tw-to-green-600 tw-shadow-md tw-shadow-green-500/30' : 'tw-bg-white/10']">
                                        <svg v-if="product.given_to_client" class="tw-w-3 tw-h-3 tw-text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                                        <span v-else class="tw-text-white/40 tw-text-[10px] tw-font-bold">4</span>
                                    </div>
                                    <div class="tw-flex-1 tw-flex tw-items-center tw-justify-between">
                                        <p :class="['tw-font-medium tw-text-xs', product.given_to_client ? 'tw-text-white/90' : 'tw-text-white/40']">Выдан</p>
                                        <p :class="['tw-text-[10px]', product.given_to_client ? 'tw-text-green-400' : 'tw-text-white/30']">{{ formatDateTime(product.given_to_client) || '—' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button @click="viewTrack(product.productId)" class="tw-w-full tw-mt-3 tw-py-2.5 tw-bg-white/5 tw-border tw-border-white/10 hover:tw-bg-gradient-to-r hover:tw-from-cyan-500 hover:tw-to-cyan-600 hover:tw-border-transparent tw-text-white/70 hover:tw-text-white tw-rounded-lg tw-text-xs tw-font-medium tw-transition-all tw-duration-200 tw-flex tw-items-center tw-justify-center tw-gap-2">
                            Подробнее
                            <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="tw-flex tw-justify-center tw-items-center tw-gap-3 tw-mt-5">
                <button @click="currentPage--" :disabled="currentPage === 1" class="tw-w-10 tw-h-10 tw-rounded-lg tw-bg-white/5 tw-border tw-border-white/10 tw-text-white/70 disabled:tw-opacity-30 disabled:tw-cursor-not-allowed hover:tw-bg-cyan-500/20 hover:tw-border-cyan-500/30 hover:tw-text-cyan-400 tw-transition-all tw-flex tw-items-center tw-justify-center">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <div class="tw-px-4 tw-py-2 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-lg tw-text-white tw-font-semibold tw-text-sm">{{ currentPage }} / {{ totalPages }}</div>
                <button @click="currentPage++" :disabled="currentPage === totalPages" class="tw-w-10 tw-h-10 tw-rounded-lg tw-bg-white/5 tw-border tw-border-white/10 tw-text-white/70 disabled:tw-opacity-30 disabled:tw-cursor-not-allowed hover:tw-bg-cyan-500/20 hover:tw-border-cyan-500/30 hover:tw-text-cyan-400 tw-transition-all tw-flex tw-items-center tw-justify-center">
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>

            <!-- Total count -->
            <div class="tw-mt-4 tw-p-4 tw-bg-white/[0.03] tw-border tw-border-white/10 tw-rounded-xl tw-flex tw-items-center tw-justify-between">
                <span class="tw-text-white/60 tw-text-sm">Количество треков</span>
                <span class="tw-px-4 tw-py-1.5 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-full tw-text-white tw-font-bold tw-text-sm">{{ products.length }}</span>
            </div>
        </div>

        <!-- Add Modal -->
        <Teleport to="body">
            <div v-if="showAddModal" class="tw-fixed tw-inset-0 tw-bg-black/70 tw-backdrop-blur-sm tw-flex tw-items-center tw-justify-center tw-z-[100] tw-p-4" @click.self="showAddModal = false">
                <div class="tw-w-full tw-max-w-md tw-bg-gradient-to-br tw-from-[#1e293b] tw-to-[#0f172a] tw-border tw-border-white/10 tw-rounded-3xl tw-shadow-2xl animate-modalSlideUp">
                    <div class="tw-flex tw-justify-between tw-items-center tw-p-6 tw-pb-0">
                        <h3 class="tw-text-xl tw-font-bold tw-text-white">Добавить трек</h3>
                        <button @click="showAddModal = false" class="tw-w-9 tw-h-9 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-lg tw-text-white/50 hover:tw-bg-red-500/20 hover:tw-border-red-500/30 hover:tw-text-red-400 tw-transition-all tw-flex tw-items-center tw-justify-center">
                            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    
                    <div class="tw-p-6 tw-space-y-5">
                        <div>
                            <label class="tw-block tw-text-sm tw-text-white/60 tw-mb-2">Трек-код *</label>
                            <div class="tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                                <div class="tw-px-4 tw-text-white/40">
                                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
                                </div>
                                <input v-model="newTrackCode" type="text" placeholder="Введите трек-код" class="tw-flex-1 tw-h-[50px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30 tw-pr-4" autofocus>
                            </div>
                        </div>

                        <div>
                            <label class="tw-block tw-text-sm tw-text-white/60 tw-mb-2">Описание товара *</label>
                            <div class="tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                                <textarea v-model="newDescription" @keyup.ctrl.enter="addTrack" placeholder="Например: Куртка зимняя, размер L" rows="3" class="tw-w-full tw-p-4 tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30 tw-resize-none"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="tw-flex tw-gap-3 tw-p-6 tw-pt-0">
                        <button @click="showAddModal = false" class="tw-flex-1 tw-h-12 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white/70 tw-font-semibold hover:tw-bg-white/10 tw-transition-all">Отмена</button>
                        <button @click="addTrack" :disabled="addLoading || !newTrackCode.trim() || !newDescription.trim()" class="tw-flex-1 tw-h-12 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-xl tw-text-white tw-font-semibold hover:tw-from-cyan-600 hover:tw-to-cyan-700 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-all tw-flex tw-items-center tw-justify-center">
                            <span v-if="!addLoading">Добавить</span>
                            <div v-else class="tw-w-5 tw-h-5 tw-border-2 tw-border-white/30 tw-border-t-white tw-rounded-full tw-animate-spin"></div>
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- FAB -->
        <router-link to="/user/create-post" class="tw-fixed tw-bottom-6 tw-right-6 tw-w-14 tw-h-14 tw-rounded-full tw-bg-gradient-to-r tw-from-pink-500 tw-to-pink-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-shadow-lg tw-shadow-pink-500/40 hover:tw-scale-110 hover:tw-shadow-xl tw-transition-all tw-z-40">
            <svg class="tw-w-6 tw-h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
        </router-link>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

.animate-slideUp {
    animation: slideUp 0.6s ease-out;
}

.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

.animate-modalSlideUp {
    animation: modalSlideUp 0.3s ease-out;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes modalSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>

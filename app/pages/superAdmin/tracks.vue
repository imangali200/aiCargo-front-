<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import { useToast, POSITION } from 'vue-toastification'
const { $axios } = useNuxtApp()
const token = useCookie('token')
const router = useRouter()
const toast = useToast()

export interface Products {
    id: number
    productId: string
    productName: string
    client_registered: string 
    china_warehouse: string | null
    aicargo: string | null
    given_to_client: string | null
    deletedAt: null | string
}

const products = ref<Products[]>([])
const currentPage = ref(1)
const perPage = 20
const loading = ref(false)
const searchValue = ref('')
const removeSearchButton = ref(false)

// Computed
const paginatedProducts = computed(() => {
    if (!products.value.length) return []
    const start = (currentPage.value - 1) * perPage
    return products.value.slice(start, start + perPage)
})

const totalPages = computed(() => {
    return Math.ceil(products.value.length / perPage)
})

// Methods
function changePage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

async function getProducts() {
    loading.value = true
    try {
        const response = await $axios.get('products', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        products.value = response.data
        searchValue.value = ''
        removeSearchButton.value = false
        currentPage.value = 1
    } catch (error) {
        console.error(error)
        toast.error('Ошибка при загрузке товаров', {
            position: 'top-center' as POSITION
        })
    } finally {
        loading.value = false
    }
}

const search = async () => {
    if (!searchValue.value.trim()) {
        toast.warning('Введите трек-код', { position: 'top-center' as POSITION })
        return
    }
    
    loading.value = true
    try {
        const res = await $axios.get('products/productId', {
            params: { productId: searchValue.value },
            headers: { Authorization: `Bearer ${token.value}` }
        })
        products.value = Array.isArray(res.data) ? res.data : [res.data]
        removeSearchButton.value = true
        currentPage.value = 1
    } catch (error: any) {
        console.error(error)
        if (error.response?.status === 404) {
            products.value = []
            toast.warning('Товар не найден', { position: 'top-center' as POSITION })
        } else {
            toast.error('Ошибка при поиске', { position: 'top-center' as POSITION })
        }
        removeSearchButton.value = true
    } finally {
        loading.value = false
    }
}

const toHistory = (productId: string) => {
    router.push(`/superAdmin/track/${productId}`)
}

const getProductStatus = (product: Products) => {
    if (product.given_to_client) return { text: 'Выдан клиенту', date: product.given_to_client, color: 'tw-text-green-600' }
    if (product.aicargo) return { text: 'На складе AiCargo', date: product.aicargo, color: 'tw-text-blue-600' }
    if (product.china_warehouse) return { text: 'Склад в Китае', date: product.china_warehouse, color: 'tw-text-orange-500' }
    return { text: 'Зарегистрирован', date: product.client_registered, color: 'tw-text-gray-500' }
}

const formatDate = (time: string) => {
    if (!time) return '—'
    const date = new Date(time)
    return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

onMounted(() => {
    getProducts()
})
</script>

<template>
    <div class="tw-pt-7 tw-px-2 sm:tw-px-0">
        <!-- Навигация -->
        <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <span>⤑</span>
            <span class="tw-text-gray-400">Товары</span>
        </div>

        <!-- Іздеу -->
        <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-2 tw-mt-4">
            <input 
                @keyup.enter="search" 
                v-model="searchValue"
                class="tw-h-[36px] tw-w-full sm:tw-w-[250px] tw-border tw-rounded-lg tw-border-gray-300 tw-px-3"
                placeholder="Поиск по трек-коду" 
                type="text"
            >
            <div class="tw-flex tw-gap-2">
                <button 
                    @click="search"
                    :disabled="loading"
                    class="tw-bg-[#0891B2] tw-text-white tw-h-[36px] tw-px-4 tw-rounded-lg tw-flex-1 sm:tw-flex-none disabled:tw-opacity-50"
                >
                    Найти
                </button>
                <button 
                    @click="getProducts" 
                    v-if="removeSearchButton"
                    class="tw-bg-red-600 tw-text-white tw-h-[36px] tw-px-3 tw-rounded-lg"
                >
                    ✕
                </button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-mt-6 tw-text-center tw-py-8">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-[#0891B2] tw-border-t-transparent"></div>
            <p class="tw-mt-2 tw-text-gray-500">Загрузка...</p>
        </div>

        <div v-else class="tw-mt-4 tw-border-t tw-border-gray-200 tw-pt-4">
            <p class="tw-text-gray-500 tw-text-sm">Показано {{ paginatedProducts.length }} из {{ products.length }}</p>

            <!-- 📱 Mobile: Cards -->
            <div class="tw-block lg:tw-hidden tw-mt-4 tw-space-y-3">
                <div 
                    v-for="product in paginatedProducts" 
                    :key="'mobile-' + product.id"
                    class="tw-bg-white tw-rounded-xl tw-shadow tw-p-4"
                >
                    <!-- Header -->
                    <div class="tw-flex tw-justify-between tw-items-start tw-mb-3">
                        <div>
                            <p class="tw-font-mono tw-font-semibold tw-text-gray-800">{{ product.productId }}</p>
                            <p class="tw-text-xs tw-text-gray-400">ID: {{ product.id }}</p>
                        </div>
                        <span 
                            :class="getProductStatus(product).color"
                            class="tw-text-xs tw-font-medium"
                        >
                            {{ getProductStatus(product).text }}
                        </span>
                    </div>

                    <!-- Info -->
                    <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-text-sm tw-mb-3">
                        <div>
                            <p class="tw-text-gray-400 tw-text-xs">Создан</p>
                            <p class="tw-text-gray-700 tw-text-xs">{{ formatDate(product.client_registered) }}</p>
                        </div>
                        <div>
                            <p class="tw-text-gray-400 tw-text-xs">Последнее обновление</p>
                            <p class="tw-text-gray-700 tw-text-xs">{{ formatDate(getProductStatus(product).date) }}</p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <button 
                        @click="toHistory(product.productId)"
                        class="tw-w-full tw-bg-[#0891B2] tw-text-white tw-py-2 tw-rounded-lg tw-text-sm hover:tw-bg-[#0e7490] tw-transition-colors"
                    >
                        История
                    </button>
                </div>

                <!-- Empty -->
                <div v-if="!paginatedProducts.length" class="tw-text-center tw-py-8 tw-text-gray-400">
                    <p class="tw-text-4xl tw-mb-2">📦</p>
                    <p>Товары не найдены</p>
                </div>
            </div>

            <!-- 💻 Desktop: Table -->
            <div class="tw-hidden lg:tw-block tw-overflow-x-auto tw-mt-4">
                <table class="tw-min-w-full tw-border tw-border-gray-300 tw-border-collapse">
                    <thead class="tw-bg-gray-100">
                        <tr>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Трек-код</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Состояние</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Дата создания</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in paginatedProducts" :key="'desktop-' + product.id" class="hover:tw-bg-gray-50">
                            <td class="tw-border tw-text-sm tw-border-gray-300 tw-px-4 tw-py-2">{{ product.id }}</td>
                            <td class="tw-border tw-text-sm tw-border-gray-300 tw-px-4 tw-py-2 tw-font-mono">{{ product.productId }}</td>
                            <td class="tw-border tw-text-sm tw-border-gray-300 tw-px-4 tw-py-2">
                                <span :class="getProductStatus(product).color" class="tw-font-medium">
                                    {{ getProductStatus(product).text }}
                                </span>
                                <span class="tw-text-gray-400 tw-text-xs tw-block">
                                    {{ formatDate(getProductStatus(product).date) }}
                                </span>
                            </td>
                            <td class="tw-border tw-text-sm tw-border-gray-300 tw-px-4 tw-py-2">
                                {{ formatDate(product.client_registered) }}
                            </td>
                            <td class="tw-border tw-border-gray-300 tw-px-4 tw-py-2">
                                <button 
                                    @click="toHistory(product.productId)"
                                    class="tw-bg-[#0891B2] tw-text-white tw-px-3 tw-py-1 tw-rounded-lg tw-text-sm hover:tw-bg-[#0e7490] tw-transition-colors"
                                >
                                    История
                                </button>
                            </td>
                        </tr>
                        <tr v-if="!paginatedProducts.length">
                            <td colspan="5" class="tw-text-center tw-py-8 tw-text-gray-400">
                                Товары не найдены
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="tw-flex tw-justify-center tw-items-center tw-gap-1 sm:tw-gap-2 tw-mt-6 tw-flex-wrap">
                <button 
                    @click="changePage(currentPage - 1)" 
                    :disabled="currentPage === 1"
                    class="tw-px-3 tw-py-2 tw-rounded-lg tw-bg-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-text-sm"
                >
                    ←
                </button>

                <template v-for="page in totalPages" :key="page">
                    <button 
                        v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
                        @click="changePage(page)"
                        :class="page === currentPage ? 'tw-bg-[#0891B2] tw-text-white' : 'tw-bg-gray-200'"
                        class="tw-px-3 tw-py-2 tw-rounded-lg tw-text-sm tw-min-w-[40px]"
                    >
                        {{ page }}
                    </button>
                    <span 
                        v-else-if="page === currentPage - 2 || page === currentPage + 2" 
                        class="tw-px-1 tw-text-gray-400"
                    >...</span>
                </template>

                <button 
                    @click="changePage(currentPage + 1)" 
                    :disabled="currentPage === totalPages"
                    class="tw-px-3 tw-py-2 tw-rounded-lg tw-bg-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-text-sm"
                >
                    →
                </button>
            </div>

            <p v-if="totalPages > 1" class="tw-text-center tw-text-gray-400 tw-text-xs tw-mt-2">
                Страница {{ currentPage }} из {{ totalPages }}
            </p>
        </div>
    </div>
</template>

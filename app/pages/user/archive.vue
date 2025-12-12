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

const products = ref<Product[]>([])
const loading = ref(false)

// Pagination
const currentPage = ref(1)
const perPage = 10

const paginatedProducts = computed(() => {
    if (!products.value.length) return []
    const start = (currentPage.value - 1) * perPage
    return products.value.slice(start, start + perPage)
})

const totalPages = computed(() => Math.ceil(products.value.length / perPage))

// Get archived products
async function getArchiveProducts() {
    loading.value = true
    try {
        const response = await $axios.get('products/archive', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        products.value = response.data
    } catch (error: any) {
        console.error(error)
        if (error.response?.status !== 404) {
            toast.error('Ошибка при загрузке архива', { position: 'top-center' as POSITION })
        }
        products.value = []
    } finally {
        loading.value = false
    }
}

// Restore product
async function restoreProduct(productId: string) {
    if (!confirm(`Восстановить трек ${productId}?`)) return
    
    try {
        await $axios.post(`products/${productId}/restore`, {}, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        toast.success('Трек восстановлен', { position: 'top-center' as POSITION })
        await getArchiveProducts()
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка при восстановлении', { position: 'top-center' as POSITION })
    }
}

// Format date
function formatDate(date: string | null) {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('ru-RU')
}

onMounted(() => {
    getArchiveProducts()
})
</script>

<template>
    <div class="tw-mt-5 tw-px-0 md:tw-px-3 tw-pb-6">
        <!-- Header -->
        <div class="tw-flex tw-items-center tw-justify-between tw-mb-6">
            <div class="tw-flex tw-items-center tw-gap-3">
                <router-link 
                    to="/user"
                    class="tw-bg-gray-100 tw-p-2 tw-rounded-lg hover:tw-bg-gray-200 tw-transition-colors"
                >
                    ← 
                </router-link>
                <h1 class="tw-text-xl tw-font-bold tw-text-gray-800">🗄️ Архив</h1>
            </div>
            <span class="tw-bg-purple-100 tw-text-purple-700 tw-px-3 tw-py-1 tw-rounded-full tw-text-sm tw-font-medium">
                {{ products.length }} треков
            </span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-text-center tw-py-12">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-10 tw-w-10 tw-border-4 tw-border-[#7C3AED] tw-border-t-transparent"></div>
            <p class="tw-mt-3 tw-text-gray-500">Загрузка...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="!products.length" class="tw-text-center tw-py-16 tw-bg-white tw-rounded-2xl">
            <div class="tw-text-5xl tw-mb-4">🗑️</div>
            <h3 class="tw-text-lg tw-font-semibold tw-text-gray-700 tw-mb-2">Архив пуст</h3>
            <p class="tw-text-gray-400 tw-mb-4">Удалённые треки появятся здесь</p>
            <router-link 
                to="/user"
                class="tw-inline-block tw-bg-[#0891B2] tw-text-white tw-px-6 tw-py-3 tw-rounded-xl hover:tw-bg-[#0e7490] tw-transition-colors"
            >
                ← На главную
            </router-link>
        </div>

        <!-- Products List -->
        <div v-else>
            <!-- Mobile Cards -->
            <div class="tw-block lg:tw-hidden tw-space-y-3">
                <div 
                    v-for="product in paginatedProducts" 
                    :key="product.id"
                    class="tw-bg-white tw-rounded-xl tw-p-4 tw-shadow-sm tw-border tw-border-gray-100"
                >
                    <div class="tw-flex tw-items-start tw-justify-between tw-mb-2">
                        <div>
                            <p class="tw-text-xs tw-text-gray-400">Трек-код</p>
                            <p class="tw-font-mono tw-font-bold tw-text-gray-800">{{ product.productId.toUpperCase() }}</p>
                        </div>
                        <span class="tw-bg-gray-100 tw-text-gray-500 tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium">
                            В архиве
                        </span>
                    </div>
                    <p v-if="product.description" class="tw-text-sm tw-text-gray-600 tw-mb-3 tw-line-clamp-2">
                        {{ product.description }}
                    </p>
                    <div class="tw-flex tw-items-center tw-justify-between">
                        <span class="tw-text-sm tw-text-gray-400">{{ formatDate(product.client_registered) }}</span>
                        <button 
                            @click="restoreProduct(product.productId)"
                            class="tw-bg-green-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm hover:tw-bg-green-600 tw-transition-colors"
                        >
                            ♻️ Восстановить
                        </button>
                    </div>
                </div>
            </div>

            <!-- Desktop Table -->
            <div class="tw-hidden lg:tw-block tw-bg-white tw-rounded-xl tw-overflow-hidden tw-shadow-sm">
                <table class="tw-w-full">
                    <thead class="tw-bg-gray-50">
                        <tr>
                            <th class="tw-text-left tw-px-4 tw-py-3 tw-text-gray-500 tw-font-medium">Трек-код</th>
                            <th class="tw-text-left tw-px-4 tw-py-3 tw-text-gray-500 tw-font-medium">Описание</th>
                            <th class="tw-text-left tw-px-4 tw-py-3 tw-text-gray-500 tw-font-medium">Дата создания</th>
                            <th class="tw-text-center tw-px-4 tw-py-3 tw-text-gray-500 tw-font-medium">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="product in paginatedProducts" 
                            :key="product.id"
                            class="tw-border-t tw-border-gray-100 hover:tw-bg-gray-50 tw-transition-colors"
                        >
                            <td class="tw-px-4 tw-py-3">
                                <span class="tw-font-mono tw-font-semibold tw-text-gray-800">{{ product.productId.toUpperCase() }}</span>
                            </td>
                            <td class="tw-px-4 tw-py-3 tw-text-gray-600 tw-max-w-[200px] tw-truncate">
                                {{ product.description || '—' }}
                            </td>
                            <td class="tw-px-4 tw-py-3 tw-text-gray-500">{{ formatDate(product.client_registered) }}</td>
                            <td class="tw-px-4 tw-py-3 tw-text-center">
                                <button 
                                    @click="restoreProduct(product.productId)"
                                    class="tw-bg-green-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm hover:tw-bg-green-600 tw-transition-colors"
                                >
                                    ♻️ Восстановить
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-mt-4">
                <button 
                    @click="currentPage--" 
                    :disabled="currentPage === 1"
                    class="tw-px-4 tw-py-2 tw-rounded-lg tw-bg-white tw-border tw-border-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-bg-gray-50"
                >
                    ←
                </button>
                <span class="tw-px-4 tw-py-2 tw-text-gray-600">{{ currentPage }} / {{ totalPages }}</span>
                <button 
                    @click="currentPage++" 
                    :disabled="currentPage === totalPages"
                    class="tw-px-4 tw-py-2 tw-rounded-lg tw-bg-white tw-border tw-border-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-bg-gray-50"
                >
                    →
                </button>
            </div>
        </div>
    </div>
</template>

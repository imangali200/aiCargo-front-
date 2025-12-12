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

const route = useRoute()
const router = useRouter()
const productId = route.params.productId
const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()

const product = ref<Product | null>(null)
const loading = ref(false)

async function getProduct() {
    loading.value = true
    try {
        const response = await $axios.get(`products/${productId}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        product.value = response.data
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при загрузке', { position: 'top-center' as POSITION })
    } finally {
        loading.value = false
    }
}

const formatDate = (time: string | null) => {
    if (!time) return '—'
    return new Date(time).toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const goBack = () => router.back()

// Статус шагов
const getSteps = computed(() => {
    if (!product.value) return []
    
    return [
        {
            step: 1,
            title: 'Зарегистрирован',
            description: 'Трек-код создан',
            date: product.value.client_registered,
            completed: !!product.value.client_registered,
            icon: '📝'
        },
        {
            step: 2,
            title: 'Склад в Китае',
            description: 'Посылка принята',
            date: product.value.china_warehouse,
            completed: !!product.value.china_warehouse,
            icon: '🏭'
        },
        {
            step: 3,
            title: 'Склад в Таразе',
            description: 'В Казахстане',
            date: product.value.aicargo,
            completed: !!product.value.aicargo,
            icon: '📦'
        },
        {
            step: 4,
            title: 'Получен',
            description: 'Выдан вам',
            date: product.value.given_to_client,
            completed: !!product.value.given_to_client,
            icon: '✅'
        }
    ]
})

const currentStep = computed(() => {
    if (!product.value) return 0
    if (product.value.given_to_client) return 4
    if (product.value.aicargo) return 3
    if (product.value.china_warehouse) return 2
    return 1
})

const progressPercent = computed(() => (currentStep.value / 4) * 100)

onMounted(() => getProduct())
</script>

<template>
    <div class="tw-mt-5 tw-px-0 md:tw-px-3 tw-pb-6">
        <!-- Навигация -->
        <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-flex-wrap">
            <router-link class="tw-text-[#0891B2] hover:tw-underline" to="/user">Главная</router-link>
            <span class="tw-text-gray-400">/</span>
            <span class="tw-text-gray-500 tw-font-mono tw-bg-gray-100 tw-px-2 tw-py-0.5 tw-rounded">{{ productId }}</span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-mt-10 tw-text-center tw-py-16">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-4 tw-border-[#0891B2] tw-border-t-transparent"></div>
            <p class="tw-mt-4 tw-text-gray-500">Загрузка...</p>
        </div>

        <!-- Content -->
        <div v-else-if="product" class="tw-mt-6">
            
            <!-- Main Card -->
            <div class="tw-bg-gradient-to-br tw-from-[#0891B2] tw-to-[#0e7490] tw-rounded-2xl tw-p-6 tw-text-white tw-shadow-lg">
                <div class="tw-flex tw-items-start tw-justify-between">
                    <div>
                        <p class="tw-text-white/70 tw-text-sm tw-mb-1">Трек-код</p>
                        <p class="tw-text-2xl sm:tw-text-[20px] tw-font-bold tw-font-mono tw-tracking-wider">
                            {{ product.productId.toUpperCase() }}
                        </p>
                        <p v-if="product.description" class="tw-text-white/80 tw-text-sm tw-mt-2">
                            📦 {{ product.description }}
                        </p>
                    </div>
                    <button 
                        @click="goBack"
                        class="tw-bg-white/20 hover:tw-bg-white/30 tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm tw-transition-colors"
                    >
                        ← Назад
                    </button>
                </div>
                
                <!-- Progress -->
                <div class="tw-mt-6">
                    <div class="tw-flex tw-justify-between tw-text-sm tw-mb-2">
                        <span class="tw-text-white/70">Прогресс доставки</span>
                        <span class="tw-font-medium">{{ currentStep }} из 4</span>
                    </div>
                    <div class="tw-h-3 tw-bg-white/20 tw-rounded-full tw-overflow-hidden">
                        <div 
                            class="tw-h-full tw-bg-white tw-rounded-full tw-transition-all tw-duration-500"
                            :style="{ width: progressPercent + '%' }"
                        ></div>
                    </div>
                </div>

                <!-- Status Badge -->
                <div class="tw-mt-4 tw-flex tw-items-center tw-gap-2">
                    <span 
                        :class="currentStep === 4 
                            ? 'tw-bg-green-400 tw-text-green-900' 
                            : 'tw-bg-yellow-400 tw-text-yellow-900'"
                        class="tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold"
                    >
                        {{ currentStep === 4 ? '✓ Получен' : '⏳ В пути' }}
                    </span>
                </div>
            </div>

            <!-- Timeline -->
            <div class="tw-bg-white tw-rounded-2xl tw-p-6 tw-shadow-sm tw-border tw-border-gray-100 tw-mt-4">
                <h3 class="tw-font-semibold tw-text-gray-800 tw-mb-6 tw-flex tw-items-center tw-gap-2">
                    <span class="tw-text-xl">📍</span> История
                </h3>
                
                <div class="tw-relative">
                    <!-- Vertical line -->
                    <div class="tw-absolute tw-left-4 tw-top-0 tw-bottom-0 tw-w-0.5 tw-bg-gray-200"></div>
                    <div 
                        class="tw-absolute tw-left-4 tw-top-0 tw-w-0.5 tw-bg-[#0891B2] tw-transition-all tw-duration-500"
                        :style="{ height: ((currentStep - 1) * 25 + 12.5) + '%' }"
                    ></div>

                    <div class="tw-space-y-4">
                        <div 
                            v-for="step in getSteps" 
                            :key="step.step"
                            class="tw-relative tw-flex tw-items-start tw-gap-4 tw-pl-1"
                        >
                            <div 
                                :class="step.completed 
                                    ? 'tw-bg-[#0891B2] tw-text-white tw-shadow-lg tw-shadow-cyan-200' 
                                    : 'tw-bg-gray-100 tw-text-gray-400 tw-border-2 tw-border-gray-200'"
                                class="tw-relative tw-z-10 tw-w-7 tw-h-7 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs tw-flex-shrink-0"
                            >
                                <span v-if="step.completed">{{ step.icon }}</span>
                                <span v-else>{{ step.step }}</span>
                            </div>
                            
                            <div 
                                :class="step.completed ? 'tw-bg-cyan-50 tw-border-cyan-100' : 'tw-bg-gray-50 tw-border-gray-100'"
                                class="tw-flex-1 tw-p-4 tw-rounded-xl tw-border"
                            >
                                <div class="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-justify-between tw-gap-1">
                                    <div>
                                        <p :class="step.completed ? 'tw-text-gray-800' : 'tw-text-gray-400'" class="tw-font-semibold">
                                            {{ step.title }}
                                        </p>
                                        <p class="tw-text-xs tw-text-gray-400">{{ step.description }}</p>
                                    </div>
                                    <p v-if="step.completed" class="tw-text-sm tw-font-medium tw-text-[#0891B2]">
                                        {{ formatDate(step.date) }}
                                    </p>
                                    <p v-else class="tw-text-sm tw-text-gray-400 tw-italic">Ожидание...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Not found -->
        <div v-else-if="!loading" class="tw-mt-10 tw-text-center tw-py-16 tw-bg-white tw-rounded-2xl tw-shadow-sm">
            <div class="tw-text-6xl tw-mb-4">📦</div>
            <h3 class="tw-text-xl tw-font-semibold tw-text-gray-700 tw-mb-2">Трек не найден</h3>
            <p class="tw-text-gray-400 tw-mb-6">Проверьте правильность трек-кода</p>
            <button 
                @click="goBack"
                class="tw-bg-[#0891B2] tw-text-white tw-px-6 tw-py-3 tw-rounded-xl hover:tw-bg-[#0e7490] tw-transition-colors tw-font-medium"
            >
                ← Назад
            </button>
        </div>
    </div>
</template>

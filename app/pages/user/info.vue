<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth', 'user-active']
})

import { useToast } from '~/composables/useToast'

const toast = useToast()
const router = useRouter()

const warehouseAddress = '15046378819 浙江省义乌市北苑街道莲塘二区7幢嘉宏仓库 (刘备 Al-код TARAZ)'
const copied = ref(false)

async function copyAddress() {
    try {
        await navigator.clipboard.writeText(warehouseAddress)
        copied.value = true
        toast.success('Адрес скопирован!', { position: 'top-center'  })
        setTimeout(() => { copied.value = false }, 2000)
    } catch (error) {
        toast.error('Ошибка при копировании', { position: 'top-center'  })
    }
}

function goBack() {
    router.back()
}
</script>

<template>
    <div class="tw-py-6 animate-fadeIn">
        <!-- Header -->
        <div class="tw-flex tw-items-center tw-gap-4 tw-mb-6">
            <button @click="goBack" class="tw-w-11 tw-h-11 tw-bg-white/5 tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-text-white/70 hover:tw-bg-white/10 hover:tw-text-white tw-transition-all">
                <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <h1 class="tw-flex-1 tw-text-2xl tw-font-bold tw-text-white">Информация</h1>
            <div class="tw-text-3xl">🏭</div>
        </div>

        <!-- Main Card -->
        <div class="tw-relative tw-overflow-hidden tw-bg-gradient-to-br tw-from-emerald-500 tw-via-green-500 tw-to-teal-500 tw-rounded-3xl tw-p-6 tw-mb-6">
            <div class="tw-absolute tw-w-40 tw-h-40 tw-rounded-full tw-bg-white/10 tw--top-16 tw--right-16"></div>
            <div class="tw-absolute tw-w-32 tw-h-32 tw-rounded-full tw-bg-white/10 tw--bottom-12 tw--left-12"></div>
            
            <div class="tw-relative tw-z-10">
                <div class="tw-flex tw-items-center tw-gap-4 tw-mb-5">
                    <div class="tw-w-14 tw-h-14 tw-bg-white/20 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-text-3xl">🇨🇳</div>
                    <div>
                        <p class="tw-text-sm tw-text-white/80">Адрес склада</p>
                        <h2 class="tw-text-xl tw-font-bold tw-text-white">в Китае</h2>
                    </div>
                </div>
                
                <div class="tw-bg-white/20 tw-rounded-2xl tw-p-5 tw-mb-5">
                    <p class="tw-text-white tw-text-base tw-leading-relaxed tw-font-medium">{{ warehouseAddress }}</p>
                </div>

                <button @click="copyAddress" :class="['tw-w-full tw-py-4 tw-rounded-2xl tw-font-bold tw-text-lg tw-shadow-lg tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-3', copied ? 'tw-bg-emerald-500 tw-text-white' : 'tw-bg-white tw-text-gray-800 hover:tw-translate-y-[-2px] hover:tw-shadow-xl']">
                    <svg v-if="copied" class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    <svg v-else class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                    {{ copied ? 'Скопировано!' : 'Копировать адрес' }}
                </button>
            </div>
        </div>

        <!-- Instructions -->
        <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-6 tw-mb-6">
            <div class="tw-flex tw-items-center tw-gap-3 tw-mb-5">
                <span class="tw-text-2xl">📋</span>
                <h3 class="tw-text-lg tw-font-bold tw-text-white">Как использовать</h3>
            </div>
            
            <div class="tw-space-y-3">
                <div class="tw-flex tw-items-center tw-gap-4 tw-p-4 tw-rounded-xl tw-bg-gradient-to-r tw-from-orange-500/15 tw-to-orange-500/5">
                    <div class="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-gradient-to-br tw-from-orange-500 tw-to-orange-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-shadow-lg tw-shadow-orange-500/30 tw-flex-shrink-0">1</div>
                    <p class="tw-text-white/90 tw-flex-1">Скопируйте адрес склада</p>
                    <span class="tw-text-xl">📋</span>
                </div>
                
                <div class="tw-flex tw-items-center tw-gap-4 tw-p-4 tw-rounded-xl tw-bg-gradient-to-r tw-from-blue-500/15 tw-to-blue-500/5">
                    <div class="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-gradient-to-br tw-from-blue-500 tw-to-blue-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-shadow-lg tw-shadow-blue-500/30 tw-flex-shrink-0">2</div>
                    <p class="tw-text-white/90 tw-flex-1">Укажите при заказе в Китае</p>
                    <span class="tw-text-xl">🛒</span>
                </div>
                
                <div class="tw-flex tw-items-center tw-gap-4 tw-p-4 tw-rounded-xl tw-bg-gradient-to-r tw-from-violet-500/15 tw-to-violet-500/5">
                    <div class="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-gradient-to-br tw-from-violet-500 tw-to-violet-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-shadow-lg tw-shadow-violet-500/30 tw-flex-shrink-0">3</div>
                    <p class="tw-text-white/90 tw-flex-1">Добавьте трек-код</p>
                    <span class="tw-text-xl">➕</span>
                </div>
                
                <div class="tw-flex tw-items-center tw-gap-4 tw-p-4 tw-rounded-xl tw-bg-gradient-to-r tw-from-emerald-500/15 tw-to-emerald-500/5">
                    <div class="tw-w-10 tw-h-10 tw-rounded-xl tw-bg-gradient-to-br tw-from-emerald-500 tw-to-emerald-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-shadow-lg tw-shadow-emerald-500/30 tw-flex-shrink-0">4</div>
                    <p class="tw-text-white/90 tw-flex-1">Отслеживайте доставку</p>
                    <span class="tw-text-xl">📦</span>
                </div>
            </div>
        </div>

        <!-- Close button -->
        <button @click="goBack" class="tw-w-full tw-flex tw-items-center tw-justify-center tw-gap-3 tw-py-4 tw-bg-red-500/15 tw-border tw-border-red-500/30 tw-rounded-xl tw-text-red-400 tw-font-semibold hover:tw-bg-red-500/25 tw-transition-all">
            <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            Закрыть
        </button>
    </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import { useToast, POSITION } from 'vue-toastification'

const toast = useToast()
const router = useRouter()

const warehouseAddress = '广东省 佛山市 南海区 里水镇新联工业区工业大道东一路3号航达C库区(刘备 AI-AI-3192 taraze)'

const copied = ref(false)

async function copyAddress() {
    try {
        await navigator.clipboard.writeText(warehouseAddress)
        copied.value = true
        toast.success('Адрес скопирован!', { position: 'top-center' as POSITION })
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch (error) {
        toast.error('Ошибка при копировании', { position: 'top-center' as POSITION })
    }
}

function goBack() {
    router.back()
}
</script>

<template>
    <div class="tw-mt-5 tw-px-0 md:tw-px-3 tw-pb-6">
        <!-- Header -->
        <div class="tw-flex tw-items-center tw-justify-between tw-mb-6">
            <div class="tw-flex tw-items-center tw-gap-3">
                <button 
                    @click="goBack"
                    class="tw-bg-white tw-shadow-md tw-p-2.5 tw-rounded-xl hover:tw-shadow-lg tw-transition-all"
                >
                    ←
                </button>
                <h1 class="tw-text-xl tw-font-bold tw-text-gray-800">Информация</h1>
            </div>
            <div class="tw-text-3xl">🏭</div>
        </div>

        <!-- Main Card with Address -->
        <div 
            class="tw-relative tw-overflow-hidden  tw-p-6 tw-shadow-2xl"
            style="background: linear-gradient(135deg, #10B981, #059669, #0D9488); border-radius: 24px; "
        >
            <!-- Decorative circles -->
            <div 
                class="tw-absolute tw-rounded-full"
                style="top: -40px; right: -40px; width: 160px; height: 160px; background: rgba(255,255,255,0.1);"
            ></div>
            <div 
                class="tw-absolute tw-rounded-full"
                style="bottom: -40px; left: -40px; width: 128px; height: 128px; background: rgba(255,255,255,0.1);"
            ></div>
            
            <div class="tw-relative tw-z-10">
                <!-- Title -->
                <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
                    <div 
                        class="tw-p-3 tw-rounded-2xl"
                        style="background: rgba(255,255,255,0.2);"
                    >
                        <span class="tw-text-3xl">🇨🇳</span>
                    </div>
                    <div>
                        <p class="tw-text-sm" style="color: rgba(255,255,255,0.8);">Адрес склада</p>
                        <h2 class="tw-text-white tw-font-bold tw-text-xl">в Китае</h2>
                    </div>
                </div>
                
                <!-- Address -->
                <div 
                    class="tw-rounded-2xl tw-p-4 tw-mb-5"
                    style="background: rgba(255,255,255,0.2);"
                >
                    <p class="tw-text-white tw-text-lg tw-leading-relaxed tw-font-medium">
                        {{ warehouseAddress }}
                    </p>
                </div>

                <!-- Copy Button -->
                <button 
                    @click="copyAddress"
                    :style="copied ? 'background: #10B981; color: white;' : 'background: white; color: #1F2937;'"
                    class="tw-w-full tw-py-4 tw-rounded-2xl tw-font-bold tw-text-lg tw-shadow-lg tw-transition-all tw-mt-4 tw-flex tw-items-center tw-justify-center tw-gap-3"
                >
                    <span v-if="copied">✓</span>
                    <span v-else>📋</span>
                    {{ copied ? 'Скопировано!' : 'Копировать адрес' }}
                </button>
            </div>
        </div>

        <!-- Instructions -->
        <div class="tw-bg-white tw-rounded-[12px] tw-p-6 tw-shadow-lg tw-border tw-border-gray-100 tw-mt-5">
            <div class="tw-flex tw-items-center tw-gap-3 tw-mb-5">
                <span class="tw-text-2xl">📋</span>
                <h3 class="tw-font-bold tw-text-gray-800 tw-text-lg tw-mb-3">Как использовать</h3>
            </div>
            
            <div class="tw-space-y-3">
                <!-- Step 1 -->
                <div 
                    class="tw-flex tw-items-center tw-gap-4 tw-p-3 tw-rounded-2xl"
                    style="background: linear-gradient(90deg, #FFF7ED, #FFFBEB);"
                >
                    <div 
                        class="tw-w-10 tw-h-10 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-shadow-md"
                        style="background: linear-gradient(135deg, #F97316, #EA580C);"
                    >1</div>
                    <p class="tw-text-gray-700 tw-flex-1">Скопируйте адрес склада</p>
                    <span class="tw-text-xl">📋</span>
                </div>
                
                <!-- Step 2 -->
                <div 
                    class="tw-flex tw-items-center tw-gap-4 tw-p-3 tw-rounded-2xl"
                    style="background: linear-gradient(90deg, #EFF6FF, #ECFEFF);"
                >
                    <div 
                        class="tw-w-10 tw-h-10 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-shadow-md"
                        style="background: linear-gradient(135deg, #3B82F6, #2563EB);"
                    >2</div>
                    <p class="tw-text-gray-700 tw-flex-1">Укажите при заказе в Китае</p>
                    <span class="tw-text-xl">🛒</span>
                </div>
                
                <!-- Step 3 -->
                <div 
                    class="tw-flex tw-items-center tw-gap-4 tw-p-3 tw-rounded-2xl"
                    style="background: linear-gradient(90deg, #FAF5FF, #F3E8FF);"
                >
                    <div 
                        class="tw-w-10 tw-h-10 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-shadow-md"
                        style="background: linear-gradient(135deg, #A855F7, #9333EA);"
                    >3</div>
                    <p class="tw-text-gray-700 tw-flex-1">Добавьте трек-код</p>
                    <span class="tw-text-xl">➕</span>
                </div>
                
                <!-- Step 4 -->
                <div 
                    class="tw-flex tw-items-center tw-gap-4 tw-p-3 tw-rounded-2xl"
                    style="background: linear-gradient(90deg, #ECFDF5, #D1FAE5);"
                >
                    <div 
                        class="tw-w-10 tw-h-10 tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-text-white tw-font-bold tw-shadow-md"
                        style="background: linear-gradient(135deg, #10B981, #059669);"
                    >4</div>
                    <p class="tw-text-gray-700 tw-flex-1">Отслеживайте доставку</p>
                    <span class="tw-text-xl">📦</span>
                </div>
            </div>
        </div>

        <!-- Close button -->
        <button 
            @click="goBack"
            class="tw-w-full tw-mt-5 tw-text-white tw-py-4 tw-rounded-2xl tw-font-bold tw-text-lg tw-shadow-lg tw-transition-all"
            style="background: linear-gradient(90deg, #EF4444, #DC2626);"
        >
            Закрыть
        </button>
    </div>
</template>

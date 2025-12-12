<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import { useToast, POSITION } from 'vue-toastification'

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const link = ref('')
const review = ref('')
const submitting = ref(false)

async function createPost() {
    if (!link.value.trim()) {
        toast.warning('Введите ссылку', { position: 'top-center' as POSITION })
        return
    }
    if (!review.value.trim()) {
        toast.warning('Введите отзыв', { position: 'top-center' as POSITION })
        return
    }

    submitting.value = true
    try {
        await $axios.post('post', 
            {
                link: link.value.trim(),
                review: review.value.trim()
            },
            { headers: { 'Authorization': `Bearer ${token.value}` } }
        )
        toast.success('Пост создан!', { position: 'top-center' as POSITION })
        router.push('/user/me')
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при создании поста', { position: 'top-center' as POSITION })
    } finally {
        submitting.value = false
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
                    class="tw-bg-gray-100 tw-p-2.5 tw-rounded-xl hover:tw-bg-gray-200 tw-transition-colors"
                >
                    ←
                </button>
                <h1 class="tw-text-xl tw-font-bold tw-text-gray-800">Создать пост</h1>
            </div>
            <span class="tw-text-3xl">📝</span>
        </div>

        <!-- Form -->
        <div class="tw-bg-white tw-p-6 tw-shadow-lg" style="border-radius: 24px;">
            <!-- Preview -->
            <div 
                class="tw-mb-6 tw-p-4 tw-text-white"
                style="background: linear-gradient(135deg, #0891B2, #0e7490); border-radius: 16px;"
            >
                <p class="tw-text-white/70 tw-text-sm tw-mb-2">Предпросмотр поста</p>
                <p class="tw-font-medium">{{ review || 'Ваш отзыв появится здесь...' }}</p>
                <p v-if="link" class="tw-text-[#38BDF8] tw-text-sm tw-mt-2 tw-underline">{{ link }}</p>
            </div>

            <!-- Link Input -->
            <div class="tw-mb-4">
                <label class="tw-block tw-text-sm tw-text-gray-500 tw-mb-2">Ссылка на товар *</label>
                <input 
                    v-model="link"
                    type="text"
                    placeholder="https://example.com/product"
                    class="tw-w-full tw-h-12 tw-px-4 tw-border tw-border-gray-200 focus:tw-outline-none focus:tw-border-[#0891B2] tw-transition-colors"
                    style="border-radius: 12px;"
                >
            </div>

            <!-- Review Input -->
            <div class="tw-mb-6">
                <label class="tw-block tw-text-sm tw-text-gray-500 tw-mb-2">Ваш отзыв *</label>
                <textarea 
                    v-model="review"
                    placeholder="Расскажите о товаре, качестве, доставке..."
                    rows="5"
                    class="tw-w-full tw-px-4 tw-py-3 tw-border tw-border-gray-200 focus:tw-outline-none focus:tw-border-[#0891B2] tw-transition-colors tw-resize-none"
                    style="border-radius: 12px;"
                ></textarea>
                <p class="tw-text-right tw-text-xs tw-text-gray-400 tw-mt-1">{{ review.length }} / 500</p>
            </div>

            <!-- Submit Button -->
            <button 
                @click="createPost"
                :disabled="submitting || !link.trim() || !review.trim()"
                class="tw-w-full tw-py-4 tw-text-white tw-font-bold tw-text-lg tw-transition-all disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                style="background: linear-gradient(90deg, #0891B2, #0e7490); border-radius: 16px;"
            >
                {{ submitting ? 'Создание...' : '✨ Опубликовать' }}
            </button>
        </div>

        <!-- Tips -->
        <div class="tw-bg-white tw-p-5 tw-mt-4 tw-shadow-sm" style="border-radius: 16px;">
            <h3 class="tw-font-bold tw-text-gray-800 tw-mb-3">💡 Советы для хорошего поста:</h3>
            <ul class="tw-space-y-2 tw-text-sm tw-text-gray-600">
                <li class="tw-flex tw-items-start tw-gap-2">
                    <span>✓</span>
                    <span>Добавьте ссылку на товар</span>
                </li>
                <li class="tw-flex tw-items-start tw-gap-2">
                    <span>✓</span>
                    <span>Опишите качество товара</span>
                </li>
                <li class="tw-flex tw-items-start tw-gap-2">
                    <span>✓</span>
                    <span>Расскажите о скорости доставки</span>
                </li>
                <li class="tw-flex tw-items-start tw-gap-2">
                    <span>✓</span>
                    <span>Поделитесь своим опытом</span>
                </li>
            </ul>
        </div>
    </div>
</template>

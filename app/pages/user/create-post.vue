<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth', 'user-active']
})

import { useToast } from '~/composables/useToast'

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const link = ref('')
const review = ref('')
const submitting = ref(false)

async function createPost() {
    if (!link.value.trim()) {
        toast.warning('Введите ссылку', { position: 'top-center'  })
        return
    }
    if (!review.value.trim()) {
        toast.warning('Введите отзыв', { position: 'top-center'  })
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
        toast.success('Пост создан!', { position: 'top-center'  })
        router.push('/user/me')
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при создании поста', { position: 'top-center'  })
    } finally {
        submitting.value = false
    }
}

function goBack() {
    router.back()
}
</script>

<template>
    <div class="tw-py-6 animate-fadeIn">
        <!-- Header -->
        <div class="tw-flex tw-items-center tw-justify-between tw-mb-6">
            <div class="tw-flex tw-items-center tw-gap-3">
                <button 
                    @click="goBack"
                    class="tw-w-10 tw-h-10 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white/70 hover:tw-bg-white/10 hover:tw-text-white tw-transition-all tw-flex tw-items-center tw-justify-center"
                >
                    <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h1 class="tw-text-xl tw-font-bold tw-text-white">Создать пост</h1>
            </div>
            <div class="tw-w-12 tw-h-12 tw-rounded-2xl tw-bg-gradient-to-br tw-from-pink-500 tw-to-pink-600 tw-flex tw-items-center tw-justify-center tw-shadow-lg tw-shadow-pink-500/30">
                <span class="tw-text-2xl">📝</span>
            </div>
        </div>

        <!-- Form -->
        <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-6">
            <!-- Preview -->
            <div 
                class="tw-mb-6 tw-p-4"
                style="background: linear-gradient(135deg, #EC4899, #8B5CF6); border-radius: 16px;"
            >
                <p class="tw-text-white/70 tw-text-sm tw-mb-2">Предпросмотр поста</p>
                <p class="tw-font-medium tw-text-white">{{ review || 'Ваш отзыв появится здесь...' }}</p>
                <p v-if="link" class="tw-text-pink-300 tw-text-sm tw-mt-2 tw-underline">{{ link }}</p>
            </div>

            <!-- Link Input -->
            <div class="tw-mb-4">
                <label class="tw-block tw-text-sm tw-text-white/60 tw-mb-2">Ссылка на товар *</label>
                <div class="tw-flex tw-items-center tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                    <div class="tw-px-4 tw-text-white/40">
                        <svg class="tw-w-5 tw-h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                    </div>
                    <input 
                        v-model="link"
                        type="text"
                        placeholder="https://example.com/product"
                        class="tw-flex-1 tw-h-[50px] tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30 tw-pr-4"
                    >
                </div>
            </div>

            <!-- Review Input -->
            <div class="tw-mb-6">
                <label class="tw-block tw-text-sm tw-text-white/60 tw-mb-2">Ваш отзыв *</label>
                <div class="tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl focus-within:tw-border-cyan-500 focus-within:tw-shadow-lg focus-within:tw-shadow-cyan-500/10 tw-transition-all">
                    <textarea 
                        v-model="review"
                        placeholder="Расскажите о товаре, качестве, доставке..."
                        rows="5"
                        maxlength="500"
                        class="tw-w-full tw-p-4 tw-bg-transparent tw-border-none tw-outline-none tw-text-white placeholder:tw-text-white/30 tw-resize-none"
                    ></textarea>
                </div>
                <p class="tw-text-right tw-text-xs tw-text-white/40 tw-mt-2">{{ review.length }} / 500</p>
            </div>

            <!-- Submit Button -->
            <button 
                @click="createPost"
                :disabled="submitting || !link.trim() || !review.trim()"
                class="tw-w-full tw-h-14 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-xl tw-text-white tw-font-bold tw-text-lg hover:tw-from-cyan-600 hover:tw-to-cyan-700 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-transition-all tw-shadow-lg tw-shadow-cyan-500/30 tw-flex tw-items-center tw-justify-center tw-gap-2"
            >
                <span v-if="!submitting">✨ Опубликовать</span>
                <div v-else class="tw-flex tw-items-center tw-gap-2">
                    <div class="tw-w-5 tw-h-5 tw-border-2 tw-border-white/30 tw-border-t-white tw-rounded-full tw-animate-spin"></div>
                    <span>Создание...</span>
                </div>
            </button>
        </div>

        <!-- Tips -->
        <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-5 tw-mt-4">
            <h3 class="tw-font-bold tw-text-white tw-mb-4 tw-flex tw-items-center tw-gap-2">
                <span class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-amber-500/20 tw-flex tw-items-center tw-justify-center">💡</span>
                Советы для хорошего поста
            </h3>
            <ul class="tw-space-y-3">
                <li class="tw-flex tw-items-start tw-gap-3">
                    <span class="tw-w-5 tw-h-5 tw-rounded-full tw-bg-cyan-500/20 tw-flex tw-items-center tw-justify-center tw-text-cyan-400 tw-text-xs tw-flex-shrink-0 tw-mt-0.5">✓</span>
                    <span class="tw-text-white/70 tw-text-sm">Добавьте ссылку на товар</span>
                </li>
                <li class="tw-flex tw-items-start tw-gap-3">
                    <span class="tw-w-5 tw-h-5 tw-rounded-full tw-bg-cyan-500/20 tw-flex tw-items-center tw-justify-center tw-text-cyan-400 tw-text-xs tw-flex-shrink-0 tw-mt-0.5">✓</span>
                    <span class="tw-text-white/70 tw-text-sm">Опишите качество товара</span>
                </li>
                <li class="tw-flex tw-items-start tw-gap-3">
                    <span class="tw-w-5 tw-h-5 tw-rounded-full tw-bg-cyan-500/20 tw-flex tw-items-center tw-justify-center tw-text-cyan-400 tw-text-xs tw-flex-shrink-0 tw-mt-0.5">✓</span>
                    <span class="tw-text-white/70 tw-text-sm">Расскажите о скорости доставки</span>
                </li>
                <li class="tw-flex tw-items-start tw-gap-3">
                    <span class="tw-w-5 tw-h-5 tw-rounded-full tw-bg-cyan-500/20 tw-flex tw-items-center tw-justify-center tw-text-cyan-400 tw-text-xs tw-flex-shrink-0 tw-mt-0.5">✓</span>
                    <span class="tw-text-white/70 tw-text-sm">Поделитесь своим опытом</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>

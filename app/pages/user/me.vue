<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth', 'user-active']
})

import { useToast, POSITION } from 'vue-toastification'

interface Post {
    id: number
    link: string
    review: string
    likesCount: number
    createAt: string
}

type LikedPost = Post

interface SavedProduct {
    id: number
    productId: string
    description: string
    createdAt: string
}

interface Profile {
    id: number
    phoneNumber: string
    name: string
    surname: string
    code: string
    branch: string
    isActive: boolean
    role: string
    createAt: string
    posts: Post[]
    postLikes: LikedPost[]
    saved: SavedProduct[] | null
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const profile = ref<Profile | null>(null)
const loading = ref(false)
const activeTab = ref<'posts' | 'likes' | 'saved'>('posts')

async function getProfile() {
    loading.value = true
    try {
        const response = await $axios.get('profile', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        profile.value = response.data
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка при загрузке профиля', { position: 'top-center' as POSITION })
    } finally {
        loading.value = false
    }
}

const posts = computed(() => profile.value?.posts || [])
const likedPosts = computed(() => profile.value?.postLikes || [])
const savedProducts = computed(() => profile.value?.saved || [])

function goBack() {
    router.back()
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })
}

onMounted(() => {
    getProfile()
})
</script>

<template>
    <div class="tw-py-6 animate-fadeIn">
        <!-- Loading -->
        <div v-if="loading" class="tw-text-center tw-py-16">
            <div class="tw-w-12 tw-h-12 tw-border-4 tw-border-cyan-500/20 tw-border-t-cyan-500 tw-rounded-full tw-animate-spin tw-mx-auto"></div>
            <p class="tw-mt-4 tw-text-white/50">Загрузка...</p>
        </div>

        <div v-else-if="profile">
            <!-- Profile Header -->
            <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-p-6 tw-mb-6">
                <div class="tw-flex tw-items-start tw-gap-5">
                    <!-- Avatar -->
                    <div class="tw-w-20 tw-h-20 md:tw-w-28 md:tw-h-28 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-text-3xl md:tw-text-4xl tw-font-bold tw-text-white tw-flex-shrink-0 tw-bg-gradient-to-br tw-from-cyan-500 tw-to-cyan-600 tw-shadow-lg tw-shadow-cyan-500/30">
                        {{ profile.name?.charAt(0).toUpperCase() || 'U' }}
                    </div>

                    <!-- Info -->
                    <div class="tw-flex-1">
                        <h1 class="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-white tw-mb-3">
                            {{ profile.name }} {{ profile.surname }}
                        </h1>

                        <!-- Buttons -->
                        <div class="tw-flex tw-gap-2 tw-mb-4 tw-flex-wrap">
                            <button @click="goBack" class="tw-px-4 tw-py-2 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white/70 tw-font-medium tw-text-sm hover:tw-bg-white/10 tw-transition-all tw-flex tw-items-center tw-gap-2">
                                <span>←</span> Назад
                            </button>
                        </div>

                        <!-- Stats -->
                        <div class="tw-flex tw-gap-5 tw-mb-4 tw-flex-wrap">
                            <div class="tw-flex tw-items-center tw-gap-1.5">
                                <span class="tw-font-bold tw-text-white">{{ posts.length }}</span>
                                <span class="tw-text-white/50 tw-text-sm">Постов</span>
                            </div>
                            <div class="tw-flex tw-items-center tw-gap-1.5">
                                <span class="tw-font-bold tw-text-white">{{ likedPosts.length }}</span>
                                <span class="tw-text-white/50 tw-text-sm">Лайков</span>
                            </div>
                            <div class="tw-flex tw-items-center tw-gap-1.5">
                                <span class="tw-font-bold tw-text-white">{{ savedProducts.length }}</span>
                                <span class="tw-text-white/50 tw-text-sm">Сохранённых</span>
                            </div>
                        </div>

                        <!-- Contact Info -->
                        <div class="tw-text-white/60 tw-text-sm tw-space-y-1">
                            <p>📱 {{ profile.phoneNumber }}</p>
                            <p>📍 {{ profile.branch }} • Код: {{ profile.code }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden">
                <div class="tw-flex tw-border-b tw-border-white/10 tw-px-2 tw-pt-2">
                    <button 
                        @click="activeTab = 'posts'"
                        class="tw-flex-1 tw-py-4 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-font-medium tw-text-sm tw-transition-all tw-border-b-2"
                        :class="activeTab === 'posts' ? 'tw-border-cyan-500 tw-text-cyan-400' : 'tw-border-transparent tw-text-white/50 hover:tw-text-white/70'"
                    >
                        <span class="tw-text-lg">📝</span> Посты
                    </button>
                    <button 
                        @click="activeTab = 'likes'"
                        class="tw-flex-1 tw-py-4 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-font-medium tw-text-sm tw-transition-all tw-border-b-2"
                        :class="activeTab === 'likes' ? 'tw-border-pink-500 tw-text-pink-400' : 'tw-border-transparent tw-text-white/50 hover:tw-text-white/70'"
                    >
                        <span class="tw-text-lg">❤️</span> Лайки
                    </button>
                    <button 
                        @click="activeTab = 'saved'"
                        class="tw-flex-1 tw-py-4 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-font-medium tw-text-sm tw-transition-all tw-border-b-2"
                        :class="activeTab === 'saved' ? 'tw-border-violet-500 tw-text-violet-400' : 'tw-border-transparent tw-text-white/50 hover:tw-text-white/70'"
                    >
                        <span class="tw-text-lg">🔖</span> Сохранённые
                    </button>
                </div>

                <!-- Content -->
                <div class="tw-min-h-[300px]">
                    <!-- Posts Tab -->
                    <div v-if="activeTab === 'posts'">
                        <div v-if="!posts.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
                            <div class="tw-w-20 tw-h-20 tw-rounded-2xl tw-bg-white/5 tw-flex tw-items-center tw-justify-center tw-mb-4">
                                <span class="tw-text-4xl">📝</span>
                            </div>
                            <h3 class="tw-text-xl tw-font-bold tw-text-white tw-mb-2">Создайте свой первый пост</h3>
                            <p class="tw-text-white/50 tw-text-sm">Здесь появятся ваши посты</p>
                        </div>
                        
                        <div v-else class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-p-4">
                            <div v-for="post in posts" :key="post.id" class="tw-bg-white/[0.03] tw-border tw-border-white/10 tw-rounded-xl tw-overflow-hidden hover:tw-border-cyan-500/30 tw-transition-all tw-cursor-pointer">
                                <div class="tw-p-4 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-text-white">
                                    <div class="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                        <span class="tw-text-lg">📝</span>
                                        <span class="tw-font-bold tw-text-sm">Пост #{{ post.id }}</span>
                                    </div>
                                    <p class="tw-text-white/70 tw-text-xs">{{ formatDate(post.createAt) }}</p>
                                </div>
                                <div class="tw-p-4">
                                    <div class="tw-mb-3">
                                        <p class="tw-text-xs tw-text-white/40 tw-mb-1">Ссылка:</p>
                                        <a :href="post.link" target="_blank" class="tw-text-cyan-400 tw-text-sm tw-underline tw-break-all tw-line-clamp-2">{{ post.link }}</a>
                                    </div>
                                    <div class="tw-mb-3">
                                        <p class="tw-text-xs tw-text-white/40 tw-mb-1">Отзыв:</p>
                                        <p class="tw-text-white/80 tw-text-sm tw-line-clamp-3">{{ post.review }}</p>
                                    </div>
                                    <div class="tw-flex tw-items-center tw-gap-2 tw-pt-3 tw-border-t tw-border-white/10">
                                        <span>❤️</span>
                                        <span class="tw-font-bold tw-text-white">{{ post.likesCount }}</span>
                                        <span class="tw-text-white/40 tw-text-sm">лайков</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Likes Tab -->
                    <div v-if="activeTab === 'likes'">
                        <div v-if="!likedPosts.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
                            <div class="tw-w-20 tw-h-20 tw-rounded-2xl tw-bg-white/5 tw-flex tw-items-center tw-justify-center tw-mb-4">
                                <span class="tw-text-4xl">❤️</span>
                            </div>
                            <h3 class="tw-text-xl tw-font-bold tw-text-white tw-mb-2">Нет лайкнутых постов</h3>
                            <p class="tw-text-white/50 tw-text-sm">Здесь появятся посты которые вы лайкнули</p>
                        </div>
                        
                        <div v-else class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-p-4">
                            <div v-for="post in likedPosts" :key="post.id" class="tw-bg-white/[0.03] tw-border tw-border-white/10 tw-rounded-xl tw-overflow-hidden hover:tw-border-pink-500/30 tw-transition-all tw-cursor-pointer">
                                <div class="tw-p-4 tw-bg-gradient-to-r tw-from-pink-500 tw-to-pink-600 tw-text-white">
                                    <div class="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                        <span class="tw-text-lg">❤️</span>
                                        <span class="tw-font-bold tw-text-sm">Пост #{{ post.id }}</span>
                                    </div>
                                    <p class="tw-text-white/70 tw-text-xs">{{ formatDate(post.createAt) }}</p>
                                </div>
                                <div class="tw-p-4">
                                    <div class="tw-mb-3">
                                        <p class="tw-text-xs tw-text-white/40 tw-mb-1">Ссылка:</p>
                                        <a :href="post.link" target="_blank" class="tw-text-pink-400 tw-text-sm tw-underline tw-break-all tw-line-clamp-2">{{ post.link }}</a>
                                    </div>
                                    <div class="tw-mb-3">
                                        <p class="tw-text-xs tw-text-white/40 tw-mb-1">Отзыв:</p>
                                        <p class="tw-text-white/80 tw-text-sm tw-line-clamp-3">{{ post.review }}</p>
                                    </div>
                                    <div class="tw-flex tw-items-center tw-gap-2 tw-pt-3 tw-border-t tw-border-white/10">
                                        <span>❤️</span>
                                        <span class="tw-font-bold tw-text-white">{{ post.likesCount }}</span>
                                        <span class="tw-text-white/40 tw-text-sm">лайков</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Saved Tab -->
                    <div v-if="activeTab === 'saved'">
                        <div v-if="!savedProducts.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
                            <div class="tw-w-20 tw-h-20 tw-rounded-2xl tw-bg-white/5 tw-flex tw-items-center tw-justify-center tw-mb-4">
                                <span class="tw-text-4xl">🔖</span>
                            </div>
                            <h3 class="tw-text-xl tw-font-bold tw-text-white tw-mb-2">Нет сохранённых товаров</h3>
                            <p class="tw-text-white/50 tw-text-sm">Сохранённые товары появятся здесь</p>
                        </div>
                        
                        <div v-else class="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-3 tw-p-4">
                            <div v-for="product in savedProducts" :key="product.id" class="tw-bg-gradient-to-br tw-from-violet-500/10 tw-to-violet-500/20 tw-border tw-border-violet-500/20 tw-rounded-xl tw-p-4 tw-text-center hover:tw-border-violet-500/40 tw-transition-all tw-cursor-pointer">
                                <span class="tw-text-3xl tw-mb-2 tw-block">📦</span>
                                <p class="tw-font-bold tw-text-white tw-text-sm">{{ product.productId }}</p>
                                <p class="tw-text-white/50 tw-text-xs tw-line-clamp-2 tw-mt-1">{{ product.description || '' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-20">
            <div class="tw-text-5xl tw-mb-4">😕</div>
            <p class="tw-text-white/50 tw-mb-4">Профиль не найден</p>
            <button @click="goBack" class="tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-xl tw-text-white tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-cyan-500/30 tw-transition-all">
                ← Назад
            </button>
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

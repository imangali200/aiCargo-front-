<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import { useToast, POSITION } from 'vue-toastification'

interface Post {
    id: number
    link: string
    review: string
    likesCount: number
    createAt: string
}

// LikedPost is same structure as Post
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

// Get profile info (includes posts and saved)
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

// Computed for posts
const posts = computed(() => profile.value?.posts || [])

// Computed for liked posts
const likedPosts = computed(() => profile.value?.postLikes || [])

// Computed for saved products
const savedProducts = computed(() => profile.value?.saved || [])

function goBack() {
    router.back()
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

onMounted(() => {
    getProfile()
})
</script>

<template>
    <div class="tw-pb-6 tw-bg-white tw-min-h-screen">
        <!-- Loading -->
        <div v-if="loading" class="tw-text-center tw-py-16">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-4 tw-border-[#0891B2] tw-border-t-transparent"></div>
            <p class="tw-mt-4 tw-text-gray-500">Загрузка...</p>
        </div>

        <div v-else-if="profile">
            <!-- Profile Header Section -->
            <div class="tw-px-4 md:tw-px-8 tw-pt-6 tw-pb-4">
                <div class="tw-flex tw-items-start tw-gap-6">
                    <!-- Avatar -->
                    <div 
                        class="tw-w-24 tw-h-24 md:tw-w-32 md:tw-h-32 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-4xl md:tw-text-5xl tw-font-bold tw-text-white tw-flex-shrink-0"
                        style="background: linear-gradient(135deg, #0891B2, #0e7490);"
                    >
                        {{ profile.name?.charAt(0).toUpperCase() || 'U' }}
                    </div>

                    <!-- Info -->
                    <div class="tw-flex-1 tw-pt-2">
                        <!-- Name -->
                        <div class="tw-flex tw-items-center tw-gap-3 tw-mb-2">
                            <h1 class="tw-text-xl md:tw-text-2xl tw-font-bold tw-text-gray-900">
                                {{ profile.name }} {{ profile.surname }}
                            </h1>
                        </div>

                        <!-- Buttons -->
                        <div class="tw-flex tw-gap-2 tw-mb-4">
                            <button 
                                class="tw-px-4 tw-py-2 tw-font-semibold tw-text-sm"
                                style="background: #f3f4f6; border-radius: 8px;"
                            >
                                ✏️ Изменить профиль
                            </button>
                            <button 
                                @click="goBack"
                                class="tw-px-4 tw-py-2 tw-font-semibold tw-text-sm"
                                style="background: #f3f4f6; border-radius: 8px;"
                            >
                                ← Назад
                            </button>
                        </div>

                        <!-- Stats -->
                        <div class="tw-flex tw-gap-5 tw-mb-3 tw-flex-wrap">
                            <div class="tw-flex tw-items-center tw-gap-1">
                                <span class="tw-font-bold tw-text-gray-900">{{ posts.length }}</span>
                                <span class="tw-text-gray-500 tw-text-sm">Постов</span>
                            </div>
                            <div class="tw-flex tw-items-center tw-gap-1">
                                <span class="tw-font-bold tw-text-gray-900">{{ likedPosts.length }}</span>
                                <span class="tw-text-gray-500 tw-text-sm">Лайков</span>
                            </div>
                            <div class="tw-flex tw-items-center tw-gap-1">
                                <span class="tw-font-bold tw-text-gray-900">{{ savedProducts.length }}</span>
                                <span class="tw-text-gray-500 tw-text-sm">Сохранённых</span>
                            </div>
                        </div>

                        <!-- Info -->
                        <div class="tw-text-gray-600 tw-text-sm">
                            <p>📱 {{ profile.phoneNumber }}</p>
                            <p>📍 {{ profile.branch }} • Код: {{ profile.code }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tw-border-t tw-border-gray-200">
                <div class="tw-flex">
                    <button 
                        @click="activeTab = 'posts'"
                        class="tw-flex-1 tw-py-3 tw-flex tw-items-center tw-justify-center tw-gap-1 tw-font-medium tw-text-xs sm:tw-text-sm tw-transition-all tw-border-b-2"
                        :class="activeTab === 'posts' 
                            ? 'tw-border-[#0891B2] tw-text-[#0891B2]' 
                            : 'tw-border-transparent tw-text-gray-500'"
                    >
                        <span class="tw-text-base">📝</span>
                        Посты
                    </button>
                    <button 
                        @click="activeTab = 'likes'"
                        class="tw-flex-1 tw-py-3 tw-flex tw-items-center tw-justify-center tw-gap-1 tw-font-medium tw-text-xs sm:tw-text-sm tw-transition-all tw-border-b-2"
                        :class="activeTab === 'likes' 
                            ? 'tw-border-[#EC4899] tw-text-[#EC4899]' 
                            : 'tw-border-transparent tw-text-gray-500'"
                    >
                        <span class="tw-text-base">❤️</span>
                        Лайки
                    </button>
                    <button 
                        @click="activeTab = 'saved'"
                        class="tw-flex-1 tw-py-3 tw-flex tw-items-center tw-justify-center tw-gap-1 tw-font-medium tw-text-xs sm:tw-text-sm tw-transition-all tw-border-b-2"
                        :class="activeTab === 'saved' 
                            ? 'tw-border-[#8B5CF6] tw-text-[#8B5CF6]' 
                            : 'tw-border-transparent tw-text-gray-500'"
                    >
                        <span class="tw-text-base">🔖</span>
                        Сохранённые
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="tw-min-h-[300px]">
                <!-- Posts Tab -->
                <div v-if="activeTab === 'posts'">
                    <!-- Empty state -->
                    <div v-if="!posts.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
                        <div 
                            class="tw-w-20 tw-h-20 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-4"
                            style="background: #f3f4f6;"
                        >
                            <span class="tw-text-4xl">📝</span>
                        </div>
                        <h3 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-2">Создайте свой первый пост</h3>
                        <p class="tw-text-gray-500 tw-text-sm">Здесь появятся ваши посты</p>
                    </div>
                    
                    <!-- Posts grid -->
                    <div v-else class="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-3 tw-p-4">
                        <div 
                            v-for="post in posts" 
                            :key="post.id"
                            class="tw-bg-white tw-rounded-2xl tw-overflow-hidden tw-shadow-md hover:tw-shadow-lg tw-transition-all tw-cursor-pointer"
                        >
                            <!-- Post Header -->
                            <div 
                                class="tw-p-4 tw-text-white"
                                style="background: linear-gradient(135deg, #0891B2, #0e7490);"
                            >
                                <div class="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                                    <span class="tw-text-lg">📝</span>
                                    <span class="tw-font-bold tw-text-sm">Пост #{{ post.id }}</span>
                                </div>
                                <p class="tw-text-white/80 tw-text-xs">
                                    {{ formatDate(post.createAt) }}
                                </p>
                            </div>
                            
                            <!-- Post Content -->
                            <div class="tw-p-4">
                                <!-- Link -->
                                <div class="tw-mb-3">
                                    <p class="tw-text-xs tw-text-gray-400 tw-mb-1">Ссылка:</p>
                                    <a 
                                        :href="post.link" 
                                        target="_blank"
                                        class="tw-text-[#0891B2] tw-text-sm tw-underline tw-break-all tw-line-clamp-2"
                                    >
                                        {{ post.link }}
                                    </a>
                                </div>
                                
                                <!-- Review -->
                                <div class="tw-mb-3">
                                    <p class="tw-text-xs tw-text-gray-400 tw-mb-1">Отзыв:</p>
                                    <p class="tw-text-gray-700 tw-text-sm tw-line-clamp-3">{{ post.review }}</p>
                                </div>
                                
                                <!-- Likes -->
                                <div class="tw-flex tw-items-center tw-gap-2 tw-pt-2 tw-border-t tw-border-gray-100">
                                    <span class="tw-text-red-500">❤️</span>
                                    <span class="tw-font-bold tw-text-gray-800">{{ post.likesCount }}</span>
                                    <span class="tw-text-gray-400 tw-text-sm">лайков</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Likes Tab -->
                <div v-if="activeTab === 'likes'">
                    <!-- Empty state -->
                    <div v-if="!likedPosts.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
                        <div 
                            class="tw-w-20 tw-h-20 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-4"
                            style="background: #f3f4f6;"
                        >
                            <span class="tw-text-4xl">❤️</span>
                        </div>
                        <h3 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-2">Нет лайкнутых постов</h3>
                        <p class="tw-text-gray-500 tw-text-sm">Здесь появятся посты которые вы лайкнули</p>
                    </div>
                    
                    <!-- Liked posts grid -->
                    <div v-else class="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-3 tw-p-4">
                        <div 
                            v-for="post in likedPosts" 
                            :key="post.id"
                            class="tw-bg-white tw-rounded-2xl tw-overflow-hidden tw-shadow-md hover:tw-shadow-lg tw-transition-all tw-cursor-pointer"
                        >
                            <!-- Post Header - Pink gradient -->
                            <div 
                                class="tw-p-4 tw-text-white"
                                style="background: linear-gradient(135deg, #EC4899, #DB2777);"
                            >
                                <div class="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                                    <span class="tw-text-lg">❤️</span>
                                    <span class="tw-font-bold tw-text-sm">Пост #{{ post.id }}</span>
                                </div>
                                <p class="tw-text-white/80 tw-text-xs">
                                    {{ formatDate(post.createAt) }}
                                </p>
                            </div>
                            
                            <!-- Post Content -->
                            <div class="tw-p-4">
                                <!-- Link -->
                                <div class="tw-mb-3">
                                    <p class="tw-text-xs tw-text-gray-400 tw-mb-1">Ссылка:</p>
                                    <a 
                                        :href="post.link" 
                                        target="_blank"
                                        class="tw-text-[#EC4899] tw-text-sm tw-underline tw-break-all tw-line-clamp-2"
                                    >
                                        {{ post.link }}
                                    </a>
                                </div>
                                
                                <!-- Review -->
                                <div class="tw-mb-3">
                                    <p class="tw-text-xs tw-text-gray-400 tw-mb-1">Отзыв:</p>
                                    <p class="tw-text-gray-700 tw-text-sm tw-line-clamp-3">{{ post.review }}</p>
                                </div>
                                
                                <!-- Likes -->
                                <div class="tw-flex tw-items-center tw-gap-2 tw-pt-2 tw-border-t tw-border-gray-100">
                                    <span class="tw-text-red-500">❤️</span>
                                    <span class="tw-font-bold tw-text-gray-800">{{ post.likesCount }}</span>
                                    <span class="tw-text-gray-400 tw-text-sm">лайков</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Saved Tab -->
                <div v-if="activeTab === 'saved'">
                    <!-- Empty state -->
                    <div v-if="!savedProducts.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
                        <div 
                            class="tw-w-20 tw-h-20 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-4"
                            style="background: #f3f4f6;"
                        >
                            <span class="tw-text-4xl">🔖</span>
                        </div>
                        <h3 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-2">Нет сохранённых товаров</h3>
                        <p class="tw-text-gray-500 tw-text-sm">Сохранённые товары появятся здесь</p>
                    </div>
                    
                    <!-- Saved grid -->
                    <div v-else class="tw-grid tw-grid-cols-3 tw-gap-0.5">
                        <div 
                            v-for="product in savedProducts" 
                            :key="product.id"
                            class="tw-aspect-square tw-overflow-hidden tw-cursor-pointer hover:tw-opacity-80 tw-transition-all tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-2"
                            style="background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.2));"
                        >
                            <span class="tw-text-3xl tw-mb-2">📦</span>
                            <p class="tw-font-bold tw-text-gray-800 tw-text-xs tw-text-center">{{ product.productId }}</p>
                            <p class="tw-text-gray-500 tw-text-[10px] tw-text-center tw-line-clamp-2 tw-mt-1">{{ product.description || '' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

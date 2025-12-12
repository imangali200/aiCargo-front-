<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

interface Post {
    id: number
    link: string
    review: string
    likesCount: number
    createAt: string
}

interface Profile {
    id: number
    name: string
    surname: string
    posts: Post[]
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const route = useRoute()
const router = useRouter()

const profile = ref<Profile | null>(null)
const loading = ref(false)

const userId = computed(() => route.params.id as string)

async function getUserProfile() {
    loading.value = true
    try {
        const response = await $axios.get(`profile/${userId.value}`, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        profile.value = response.data
    } catch (error: any) {
        console.error('Profile error:', error.response?.data || error)
    } finally {
        loading.value = false
    }
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

function goBack() {
    router.back()
}

// Computed for posts
const posts = computed(() => profile.value?.posts || [])

// Watch for route changes
watch(userId, (newId) => {
    if (newId) {
        getUserProfile()
    }
}, { immediate: true })
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

                        <!-- Username -->
                        <p class="tw-text-gray-500 tw-text-sm tw-mb-3">
                            @{{ profile.name?.toLowerCase() || 'user' }}
                        </p>

                        <!-- Back Button -->
                        <button 
                            @click="goBack"
                            class="tw-px-4 tw-py-2 tw-font-semibold tw-text-sm"
                            style="background: #f3f4f6; border-radius: 8px;"
                        >
                            ← Назад
                        </button>

                        <!-- Stats -->
                        <div class="tw-flex tw-gap-5 tw-mt-4">
                            <div class="tw-flex tw-items-center tw-gap-1">
                                <span class="tw-font-bold tw-text-gray-900">{{ posts.length }}</span>
                                <span class="tw-text-gray-500 tw-text-sm">Постов</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tw-border-t tw-border-gray-200">
                <div class="tw-flex">
                    <button 
                        class="tw-flex-1 tw-py-3 tw-flex tw-items-center tw-justify-center tw-gap-1 tw-font-medium tw-text-xs sm:tw-text-sm tw-border-b-2 tw-border-[#0891B2] tw-text-[#0891B2]"
                    >
                        <span class="tw-text-base">📝</span>
                        Посты
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="tw-min-h-[300px]">
                <!-- Posts Tab -->
                <div>
                    <!-- Empty state -->
                    <div v-if="!posts.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
                        <div 
                            class="tw-w-20 tw-h-20 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-4"
                            style="background: #f3f4f6;"
                        >
                            <span class="tw-text-4xl">📝</span>
                        </div>
                        <h3 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-2">Нет постов</h3>
                        <p class="tw-text-gray-500 tw-text-sm">У пользователя пока нет постов</p>
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
                                        :href="post.link.startsWith('http') ? post.link : `https://${post.link}`" 
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
            </div>
        </div>

        <!-- Error State -->
        <div v-else class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-20">
            <div class="tw-text-5xl tw-mb-4">😕</div>
            <p class="tw-text-gray-500 tw-mb-4">Профиль не найден</p>
            <button 
                @click="goBack"
                class="tw-bg-[#0891B2] tw-text-white tw-px-6 tw-py-2 tw-rounded-xl"
            >
                ← Назад
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth', 'user-active']
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
    <div class="tw-py-6 animate-fadeIn">
        <!-- Loading -->
        <div v-if="loading" class="tw-text-center tw-py-16">
            <div class="tw-w-12 tw-h-12 tw-border-4 tw-border-cyan-500/20 tw-border-t-cyan-500 tw-rounded-full tw-animate-spin tw-mx-auto"></div>
            <p class="tw-mt-4 tw-text-white/60">Загрузка...</p>
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

                        <!-- Username -->
                        <p class="tw-text-white/60 tw-text-sm tw-mb-3">
                            @{{ profile.name?.toLowerCase() || 'user' }}
                        </p>

                        <!-- Buttons -->
                        <div class="tw-flex tw-gap-2 tw-mb-4 tw-flex-wrap">
                            <button @click="goBack" class="tw-px-4 tw-py-2 tw-bg-white/5 tw-border tw-border-white/10 tw-rounded-xl tw-text-white/70 tw-font-medium tw-text-sm hover:tw-bg-white/10 tw-transition-all tw-flex tw-items-center tw-gap-2">
                                <span>←</span> Назад
                            </button>
                        </div>

                        <!-- Stats -->
                        <div class="tw-flex tw-gap-5 tw-flex-wrap">
                            <div class="tw-flex tw-items-center tw-gap-1.5">
                                <span class="tw-font-bold tw-text-white">{{ posts.length }}</span>
                                <span class="tw-text-white/60 tw-text-sm">Постов</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="tw-bg-white/[0.03] tw-backdrop-blur-xl tw-border tw-border-white/10 tw-rounded-2xl tw-overflow-hidden tw-mb-6">
                <div class="tw-flex tw-border-b tw-border-white/10 tw-px-2 tw-pt-2">
                    <button 
                        class="tw-flex-1 tw-py-4 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-font-medium tw-text-sm tw-transition-all tw-border-b-2 tw-border-cyan-500 tw-text-cyan-400"
                    >
                        <span class="tw-text-lg">📝</span> Посты
                    </button>
                </div>

                <!-- Content -->
                <div class="tw-min-h-[300px]">
                    <!-- Posts Tab -->
                    <div>
                        <!-- Empty state -->
                        <div v-if="!posts.length" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
                            <div class="tw-w-20 tw-h-20 tw-rounded-2xl tw-bg-white/5 tw-flex tw-items-center tw-justify-center tw-mb-4">
                                <span class="tw-text-4xl">📝</span>
                            </div>
                            <h3 class="tw-text-xl tw-font-bold tw-text-white tw-mb-2">Нет постов</h3>
                            <p class="tw-text-white/60 tw-text-sm">У пользователя пока нет постов</p>
                        </div>
                        
                        <!-- Posts grid -->
                        <div v-else class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4 tw-p-4">
                            <div 
                                v-for="post in posts" 
                                :key="post.id"
                                class="tw-bg-white/[0.03] tw-border tw-border-white/10 tw-rounded-xl tw-overflow-hidden hover:tw-border-cyan-500/30 tw-transition-all tw-cursor-pointer"
                            >
                                <!-- Post Header -->
                                <div class="tw-p-4 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-text-white">
                                    <div class="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                        <span class="tw-text-lg">📝</span>
                                        <span class="tw-font-bold tw-text-sm">Пост #{{ post.id }}</span>
                                    </div>
                                    <p class="tw-text-white/70 tw-text-xs">
                                        {{ formatDate(post.createAt) }}
                                    </p>
                                </div>
                                
                                <!-- Post Content -->
                                <div class="tw-p-4">
                                    <!-- Link -->
                                    <div class="tw-mb-3">
                                        <p class="tw-text-xs tw-text-white/60 tw-mb-1">Ссылка:</p>
                                        <a 
                                            :href="post.link.startsWith('http') ? post.link : `https://${post.link}`" 
                                            target="_blank"
                                            class="tw-text-cyan-400 tw-text-sm tw-underline tw-break-all tw-line-clamp-2"
                                        >
                                            {{ post.link }}
                                        </a>
                                    </div>
                                    
                                    <!-- Review -->
                                    <div class="tw-mb-3">
                                        <p class="tw-text-xs tw-text-white/60 tw-mb-1">Отзыв:</p>
                                        <p class="tw-text-white/80 tw-text-sm tw-line-clamp-3">{{ post.review }}</p>
                                    </div>
                                    
                                    <!-- Likes -->
                                    <div class="tw-flex tw-items-center tw-gap-2 tw-pt-3 tw-border-t tw-border-white/10">
                                        <span>❤️</span>
                                        <span class="tw-font-bold tw-text-white">{{ post.likesCount }}</span>
                                        <span class="tw-text-white/60 tw-text-sm">лайков</span>
                                    </div>
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
            <p class="tw-text-white/60 tw-mb-4">Профиль не найден</p>
            <button 
                @click="goBack"
                class="tw-px-6 tw-py-3 tw-bg-gradient-to-r tw-from-cyan-500 tw-to-cyan-600 tw-rounded-xl tw-text-white tw-font-semibold hover:tw-shadow-lg hover:tw-shadow-cyan-500/30 tw-transition-all"
            >
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

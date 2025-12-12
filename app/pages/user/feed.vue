<script setup lang="ts">
definePageMeta({
    layout: 'post',
    middleware: 'auth'
})

import { useToast, POSITION } from 'vue-toastification'

interface User {
    id: number
    name: string
    surname: string
    phoneNumber: string
}

interface Comment {
    id: number
    text: string
    createAt: string
    user?: User
}

interface Post {
    id: number
    link: string
    review: string
    likesCount: number
    createAt: string
    user?: User
    comments?: Comment[]
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const posts = ref<Post[]>([])
const loading = ref(false)

// Comment states
const showComments = ref(false)
const activePostId = ref<number | null>(null)
const newComment = ref('')
const sendingComment = ref(false)

// Get all posts
async function getPosts() {
    loading.value = true
    try {
        const response = await $axios.get('post', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        posts.value = Array.isArray(response.data) ? response.data : [response.data]
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка при загрузке постов', { position: 'top-center' as POSITION })
        posts.value = []
    } finally {
        loading.value = false
    }
}

// Like post
async function likePost(postId: number) {
    try {
        console.log('Like post:', postId)
        const response = await $axios.post(`post/likes/${postId}`, {}, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        console.log('Like response:', response.data)
        const post = posts.value.find(p => p.id === postId)
        if (post) {
            post.likesCount++
        }
        toast.success('❤️', { position: 'top-center' as POSITION, timeout: 1000 })
    } catch (error: any) {
        console.error('Like error:', error.response?.data || error)
        toast.error(error.response?.data?.message || 'Ошибка при лайке', { position: 'top-center' as POSITION })
    }
}

// Save post
async function savePost(postId: number) {
    try {
        await $axios.post(`post/${postId}/save`, {}, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        toast.success('Пост сохранён!', { position: 'top-center' as POSITION })
    } catch (error: any) {
        console.error(error)
    }
}

// Open comments panel
function openComments(postId: number) {
    activePostId.value = postId
    showComments.value = true
    newComment.value = ''
}

// Close comments panel
function closeComments() {
    showComments.value = false
    activePostId.value = null
    newComment.value = ''
}

// Send comment
async function sendComment() {
    if (!newComment.value.trim() || !activePostId.value) return
    
    sendingComment.value = true
    try {
        const response = await $axios.post('post/comment', 
            {
                postId: activePostId.value,
                text: newComment.value.trim()
            },
            { headers: { 'Authorization': `Bearer ${token.value}` } }
        )
        
        const post = posts.value.find(p => p.id === activePostId.value)
        if (post) {
            if (!post.comments) post.comments = []
            post.comments.push({
                id: response.data?.id || Date.now(),
                text: newComment.value.trim(),
                createAt: new Date().toISOString(),
                user: undefined
            })
        }
        
        newComment.value = ''
        toast.success('Комментарий добавлен!', { position: 'top-center' as POSITION })
    } catch (error: any) {
        console.error(error)
        toast.error('Ошибка при отправке комментария', { position: 'top-center' as POSITION })
    } finally {
        sendingComment.value = false
    }
}

const activePost = computed(() => {
    return posts.value.find(p => p.id === activePostId.value)
})

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

function formatTime(date: string) {
    return new Date(date).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

function goBack() {
    router.back()
}

function goToUserProfile(userId: number | undefined) {
    if (userId) {
        router.push(`/user/profile/${userId}`)
    }
}

onMounted(() => {
    getPosts()
})
</script>

<template>
    <!-- Full screen container -->
    <div 
        class="tw-h-screen tw-overflow-hidden tw-bg-black tw-fixed tw-inset-0 tw-z-10"
    >
        <!-- Loading -->
        <div v-if="loading" class="tw-h-full tw-flex tw-items-center tw-justify-center">
            <div class="tw-text-center">
                <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-12 tw-w-12 tw-border-4 tw-border-white tw-border-t-transparent"></div>
                <p class="tw-mt-4 tw-text-white">Загрузка...</p>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!posts.length" class="tw-h-full tw-flex tw-items-center tw-justify-center">
            <div class="tw-text-center">
                <div class="tw-text-6xl tw-mb-4">📝</div>
                <h3 class="tw-text-xl tw-font-bold tw-text-white tw-mb-2">Нет постов</h3>
                <p class="tw-text-gray-400 tw-mb-6">Будьте первым, кто создаст пост!</p>
                <button 
                    @click="goBack"
                    class="tw-bg-[#0891B2] tw-text-white tw-px-6 tw-py-3 tw-rounded-xl tw-font-medium hover:tw-bg-[#0e7490] tw-transition-colors"
                >
                    ← Назад
                </button>
            </div>
        </div>

        <!-- Posts Feed (TikTok style) -->
        <div 
            v-else 
            class="tw-h-full tw-overflow-y-scroll tw-snap-y tw-snap-mandatory"
            style="scroll-snap-type: y mandatory; -webkit-overflow-scrolling: touch;"
        >
            <div 
                v-for="(post, index) in posts" 
                :key="post.id"
                :id="`post-${index}`"
                class="tw-h-full tw-snap-start tw-snap-always tw-relative tw-flex tw-items-end tw-justify-center"
                style="scroll-snap-align: start; min-height: 100vh;"
            >
                <!-- Background gradient - FULL SCREEN -->
                <div 
                    class="tw-absolute tw-inset-0"
                    :style="`background: linear-gradient(135deg, hsl(${(post.id * 40) % 360}, 60%, 25%), hsl(${(post.id * 40 + 60) % 360}, 60%, 15%));`"
                ></div>

                <!-- Back button - INSIDE gradient -->
                <button 
                    @click="goBack"
                    class="tw-absolute tw-top-4 tw-left-4 tw-z-20 tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white tw-text-lg hover:tw-scale-110 tw-transition-transform"
                    style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);"
                >
                    ←
                </button>

                <!-- Content - Centered on desktop -->
                <div class="tw-relative tw-z-10 tw-w-full tw-max-w-2xl tw-px-5 tw-pb-8 tw-pr-20">
                    <!-- User Info (clickable) -->
                    <div 
                        class="tw-flex tw-items-center tw-gap-3 tw-mb-4 tw-cursor-pointer group"
                        @click="goToUserProfile(post.user?.id)"
                    >
                        <!-- Avatar with gradient border -->
                        <div class="tw-relative">
                            <div 
                                class="tw-w-12 tw-h-12 tw-rounded-full tw-p-[2px] group-hover:tw-scale-105 tw-transition-transform"
                                style="background: linear-gradient(135deg, #EC4899, #8B5CF6, #0EA5E9);"
                            >
                                <div 
                                    class="tw-w-full tw-h-full tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-lg tw-font-bold tw-text-white"
                                    style="background: rgba(0,0,0,0.5);"
                                >
                                    {{ post.user?.name?.charAt(0).toUpperCase() || 'U' }}
                                </div>
                            </div>
                        </div>
                        <div>
                            <p class="tw-text-white tw-font-semibold group-hover:tw-underline">
                                @{{ post.user?.name || 'user' }}
                            </p>
                            <p class="tw-text-white/50 tw-text-xs">{{ formatDate(post.createAt) }}</p>
                        </div>
                    </div>

                    <!-- Review -->
                    <div class="tw-mb-3">
                        <p class="tw-text-white tw-text-base tw-leading-relaxed">
                            {{ post.review }}
                        </p>
                    </div>

                    <!-- Link -->
                    <div v-if="post.link">
                        <a 
                            :href="post.link.startsWith('http') ? post.link : `https://${post.link}`" 
                            target="_blank"
                            class="tw-inline-flex tw-items-center tw-gap-1 tw-text-[#38BDF8] tw-text-sm hover:tw-underline"
                        >
                            🔗 {{ post.link }}
                        </a>
                    </div>
                </div>

                <!-- Right Side Actions -->
                <div class="tw-absolute tw-right-4 tw-bottom-8 tw-flex tw-flex-col tw-items-center tw-gap-5 tw-z-10">
                    <!-- Like -->
                    <button 
                        @click="likePost(post.id)"
                        class="tw-flex tw-flex-col tw-items-center tw-gap-1 group"
                    >
                        <div 
                            class="tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-2xl group-hover:tw-scale-110 tw-transition-all"
                            style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);"
                        >
                            ❤️
                        </div>
                        <span class="tw-text-white tw-text-xs tw-font-medium">{{ post.likesCount }}</span>
                    </button>

                    <!-- Comments -->
                    <button 
                        @click="openComments(post.id)"
                        class="tw-flex tw-flex-col tw-items-center tw-gap-1 group"
                    >
                        <div 
                            class="tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-2xl group-hover:tw-scale-110 tw-transition-all"
                            style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);"
                        >
                            💬
                        </div>
                        <span class="tw-text-white tw-text-xs tw-font-medium">{{ post.comments?.length || 0 }}</span>
                    </button>

                    <!-- Save -->
                    <button 
                        @click="savePost(post.id)"
                        class="tw-flex tw-flex-col tw-items-center tw-gap-1 group"
                    >
                        <div 
                            class="tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-2xl group-hover:tw-scale-110 tw-transition-all"
                            style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);"
                        >
                            🔖
                        </div>
                    </button>

                    <!-- Share -->
                    <button class="tw-flex tw-flex-col tw-items-center tw-gap-1 group">
                        <div 
                            class="tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-2xl group-hover:tw-scale-110 tw-transition-all"
                            style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);"
                        >
                            📤
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Comments Panel -->
        <Teleport to="body">
            <div 
                v-if="showComments"
                class="tw-fixed tw-inset-0 tw-z-[100]"
            >
                <!-- Overlay -->
                <div 
                    class="tw-absolute tw-inset-0 tw-bg-black/60"
                    @click="closeComments"
                ></div>

                <!-- Panel -->
                <div 
                    class="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-white tw-max-h-[70vh] tw-flex tw-flex-col"
                    style="border-radius: 24px 24px 0 0; animation: slideUp 0.3s ease-out;"
                >
                    <!-- Header -->
                    <div class="tw-flex tw-items-center tw-justify-between tw-px-6 tw-py-4 tw-border-b tw-border-gray-100">
                        <h3 class="tw-text-lg tw-font-bold tw-text-gray-800">
                            💬 Комментарии
                            <span class="tw-text-gray-400 tw-font-normal tw-text-sm tw-ml-2">
                                {{ activePost?.comments?.length || 0 }}
                            </span>
                        </h3>
                        <button 
                            @click="closeComments"
                            class="tw-w-8 tw-h-8 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-text-gray-500 hover:tw-bg-gray-200 tw-transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <!-- Comments List -->
                    <div class="tw-flex-1 tw-overflow-y-auto tw-px-6 tw-py-4">
                        <!-- Empty -->
                        <div 
                            v-if="!activePost?.comments?.length"
                            class="tw-text-center tw-py-12"
                        >
                            <div class="tw-text-5xl tw-mb-4">💭</div>
                            <p class="tw-text-gray-500">Пока нет комментариев</p>
                            <p class="tw-text-gray-400 tw-text-sm">Будьте первым!</p>
                        </div>

                        <!-- Comments -->
                        <div 
                            v-else
                            class="tw-space-y-4"
                        >
                            <div 
                                v-for="comment in activePost?.comments" 
                                :key="comment.id"
                                class="tw-flex tw-gap-3"
                            >
                                <!-- Avatar -->
                                <div 
                                    class="tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-sm tw-font-bold tw-text-white tw-flex-shrink-0"
                                    style="background: linear-gradient(135deg, #0891B2, #0e7490);"
                                >
                                    {{ comment.user?.name?.charAt(0).toUpperCase() || 'U' }}
                                </div>

                                <!-- Content -->
                                <div class="tw-flex-1">
                                    <div class="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                                        <span class="tw-font-semibold tw-text-gray-800 tw-text-sm">
                                            {{ comment.user?.name || 'Вы' }}
                                        </span>
                                        <span class="tw-text-gray-400 tw-text-xs">
                                            {{ formatTime(comment.createAt) }}
                                        </span>
                                    </div>
                                    <p class="tw-text-gray-600">{{ comment.text }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Input -->
                    <div class="tw-px-6 tw-py-4 tw-border-t tw-border-gray-100 tw-bg-gray-50">
                        <div class="tw-flex tw-gap-3">
                            <input 
                                v-model="newComment"
                                type="text"
                                placeholder="Напишите комментарий..."
                                class="tw-flex-1 tw-h-12 tw-px-4 tw-bg-white tw-border tw-border-gray-200 focus:tw-outline-none focus:tw-border-[#0891B2] tw-transition-colors"
                                style="border-radius: 24px;"
                                @keyup.enter="sendComment"
                            >
                            <button 
                                @click="sendComment"
                                :disabled="!newComment.trim() || sendingComment"
                                class="tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white disabled:tw-opacity-50 disabled:tw-cursor-not-allowed hover:tw-scale-105 tw-transition-transform"
                                style="background: linear-gradient(135deg, #0891B2, #0e7490);"
                            >
                                {{ sendingComment ? '...' : '➤' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
/* Hide scrollbar */
.tw-overflow-y-scroll::-webkit-scrollbar {
    display: none;
}
.tw-overflow-y-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}
</style>

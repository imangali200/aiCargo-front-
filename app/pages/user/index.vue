<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

import { useToast } from '~/composables/useToast'

interface Author {
    id: number
    name: string
    surname: string
}

interface Comment {
    id: number
    text: string
    createAt: string
    author?: Author
}

interface Post {
    id: number
    link: string
    review: string
    likesCount: number
    isLiked?: boolean
    isSaved?: boolean
    createAt: string
    author?: Author
    comments?: Comment[]
    commentsCount?: number
}

interface UserProfile {
    id: number
    phoneNumber: string
    name: string
    surname: string
    isActive: boolean
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const userProfile = ref<UserProfile | null>(null)
const isLoggedIn = computed(() => !!token.value)

const posts = ref<Post[]>([])
const loading = ref(false)

const expandedComments = ref<Set<number>>(new Set())
const commentText = ref<{ [key: number]: string }>({})

const showLoginModal = ref(false)

async function getPosts() {
    loading.value = true
    try {
        const response = await $axios.get('post')
        posts.value = Array.isArray(response.data) ? response.data : [response.data]
    } catch {
        posts.value = []
    } finally {
        loading.value = false
    }
}

async function likePost(postId: number) {
    if (!token.value) {
        showLoginModal.value = true
        return
    }

    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const wasLiked = post.isLiked
    const oldCount = post.likesCount

    post.isLiked = !post.isLiked
    post.likesCount = post.isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1)

    try {
        await $axios.get('post/likes/' + postId, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
    } catch {
        post.isLiked = wasLiked
        post.likesCount = oldCount
    }
}

async function savePost(postId: number) {
    if (!token.value) {
        showLoginModal.value = true
        return
    }

    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const wasSaved = post.isSaved
    post.isSaved = !post.isSaved

    try {
        await $axios.post('post/save/' + postId, {}, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        toast.success(post.isSaved ? 'Сохранено!' : 'Удалено из сохраненных', { position: 'top-center' })
    } catch {
        post.isSaved = wasSaved
        toast.error('Ошибка!', { position: 'top-center' })
    }
}

async function loadComments(postId: number) {
    try {
        const response = await $axios.get(`post/${postId}/comment`)
        const post = posts.value.find(p => p.id === postId)
        if (post) {
            post.comments = Array.isArray(response.data) ? response.data : []
        }
    } catch {}
}

function toggleComments(postId: number) {
    if (expandedComments.value.has(postId)) {
        expandedComments.value.delete(postId)
    } else {
        expandedComments.value.add(postId)
        loadComments(postId)
    }
}

async function submitComment(postId: number) {
    if (!token.value) {
        showLoginModal.value = true
        return
    }

    const text = commentText.value[postId]?.trim()
    if (!text) return

    const post = posts.value.find(p => p.id === postId)
    
    const newComment: Comment = {
        id: Date.now(),
        text: text,
        createAt: new Date().toISOString(),
        author: {
            id: userProfile.value?.id || 0,
            name: userProfile.value?.name || 'User',
            surname: userProfile.value?.surname || ''
        }
    }
    
    if (post) {
        if (!post.comments) post.comments = []
        post.comments.push(newComment)
        post.commentsCount = (post.commentsCount || 0) + 1
    }
    
    commentText.value[postId] = ''
    
    try {
        await $axios.post('post/comment', 
            { postId, text },
            { headers: { 'Authorization': `Bearer ${token.value}` } }
        )
    } catch {
        if (post && post.comments) {
            post.comments = post.comments.filter(c => c.id !== newComment.id)
            post.commentsCount = Math.max(0, (post.commentsCount || 1) - 1)
        }
        toast.error('Ошибка!', { position: 'top-center' })
    }
}

function formatDate(date: string) {
    const now = new Date()
    const postDate = new Date(date)
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000)
    
    if (diff < 60) return 'сейчас'
    if (diff < 3600) return Math.floor(diff / 60) + ' мин'
    if (diff < 86400) return Math.floor(diff / 3600) + ' ч'
    if (diff < 604800) return Math.floor(diff / 86400) + ' дн'
    return postDate.toLocaleDateString('ru-RU')
}

function goToProfile(authorId: number | undefined) {
    if (authorId) router.push('/user/profile/' + authorId)
}

async function loadUserProfile() {
    if (token.value) {
        try {
            const response = await $axios.get('profile', {
                headers: { 'Authorization': `Bearer ${token.value}` }
            })
            userProfile.value = response.data
        } catch {}
    }
}

function goToLogin() {
    router.push('/auth/login')
}

onMounted(() => {
    getPosts()
    loadUserProfile()
})
</script>

<template>
    <div class="feed">
        <div v-if="loading" class="loading-inline">
            <div class="spinner"></div>
        </div>

        <div v-else-if="!posts.length" class="empty-feed">
            <div class="empty-icon">📝</div>
            <h3>Нет постов</h3>
            <p>Создайте первый пост!</p>
        </div>

        <div v-else class="posts">
            <div v-for="post in posts" :key="post.id" class="post">
                <div class="post-header" @click="goToProfile(post.author?.id)">
                    <div class="post-left">
                        <div class="post-avatar">{{ post.author?.name?.charAt(0).toUpperCase() || 'U' }}</div>
                        <div class="post-line" v-if="expandedComments.has(post.id) && post.comments?.length"></div>
                    </div>
                    <div class="post-info">
                        <div class="post-top">
                            <span class="post-name">{{ post.author?.name || 'user' }}</span>
                            <span class="post-time">{{ formatDate(post.createAt) }}</span>
                        </div>
                    </div>
                    <button class="post-more">•••</button>
                </div>

                <div class="post-content">
                    <p class="post-text">{{ post.review }}</p>
                    <a v-if="post.link" :href="post.link.startsWith('http') ? post.link : 'https://' + post.link" target="_blank" class="post-link">🔗 {{ post.link }}</a>
                </div>

                <div class="post-actions">
                    <button class="action-btn" :class="{ liked: post.isLiked }" @click="likePost(post.id)">
                        {{ post.isLiked ? '❤️' : '♡' }} {{ post.likesCount }}
                    </button>
                    <button class="action-btn" @click="toggleComments(post.id)">
                        💬 {{ post.commentsCount || post.comments?.length || '' }}
                    </button>
                    <button class="action-btn" :class="{ saved: post.isSaved }" @click="savePost(post.id)">
                        {{ post.isSaved ? '🔖' : '☆' }}
                    </button>
                </div>

                <div v-if="expandedComments.has(post.id)" class="comments-section">
                    <div v-if="isLoggedIn" class="comment-input-row">
                        <div class="comment-avatar">{{ userProfile?.name?.charAt(0).toUpperCase() || 'U' }}</div>
                        <input v-model="commentText[post.id]" @keyup.enter="submitComment(post.id)" type="text" placeholder="Оставьте комментарий..." class="comment-input" />
                        <button @click="submitComment(post.id)" :disabled="!commentText[post.id]?.trim()" class="comment-submit">Отправить</button>
                    </div>
                    <div v-else class="login-prompt" @click="goToLogin">
                        <span>Войдите, чтобы оставить комментарий →</span>
                    </div>

                    <div v-if="post.comments?.length" class="comments-list">
                        <div v-for="comment in post.comments" :key="comment.id" class="comment-item">
                            <div class="comment-avatar small" @click="goToProfile(comment.author?.id)">{{ comment.author?.name?.charAt(0).toUpperCase() || 'U' }}</div>
                            <div class="comment-content">
                                <div class="comment-header">
                                    <span class="comment-name" @click="goToProfile(comment.author?.id)">{{ comment.author?.name || 'user' }}</span>
                                    <span class="comment-time">{{ formatDate(comment.createAt) }}</span>
                                </div>
                                <p class="comment-text">{{ comment.text }}</p>
                            </div>
                        </div>
                    </div>

                    <div v-else class="no-comments">
                        <p>Комментариев пока нет</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <div v-if="showLoginModal" class="modal-overlay" @click="showLoginModal = false">
            <div class="modal-content" @click.stop>
                <div class="modal-icon">🔐</div>
                <h3>Требуется авторизация</h3>
                <p>Войдите, чтобы выполнить это действие</p>
                <div class="modal-buttons">
                    <button class="modal-btn primary" @click="goToLogin">Войти</button>
                    <button class="modal-btn secondary" @click="showLoginModal = false">Закрыть</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.loading-inline { display: flex; justify-content: center; padding: 40px 0; }
.spinner { width: 32px; height: 32px; border: 3px solid #333; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty-feed { text-align: center; padding: 60px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-feed h3 { font-size: 18px; font-weight: 600; color: #fff; margin: 0 0 8px; }
.empty-feed p { color: #777; margin: 0; }

.feed { padding: 8px 0; }
.posts { display: flex; flex-direction: column; }
.post { padding: 16px 0; border-bottom: 1px solid #222; }

.post-header { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
.post-left { display: flex; flex-direction: column; align-items: center; }
.post-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; color: #fff; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); flex-shrink: 0; }
.post-line { width: 2px; flex: 1; background: #333; margin-top: 8px; min-height: 20px; }
.post-info { flex: 1; }
.post-top { display: flex; align-items: center; gap: 8px; }
.post-name { font-size: 15px; font-weight: 600; color: #fff; }
.post-time { font-size: 14px; color: #555; }
.post-more { padding: 8px; background: transparent; border: none; color: #555; cursor: pointer; font-size: 16px; border-radius: 50%; }
.post-more:hover { background: #222; color: #fff; }

.post-content { padding-left: 52px; margin-top: 4px; }
.post-text { font-size: 15px; color: #fff; line-height: 1.5; margin: 0 0 8px; white-space: pre-wrap; }
.post-link { display: inline-block; font-size: 14px; color: #1d9bf0; text-decoration: none; margin-bottom: 8px; }
.post-link:hover { text-decoration: underline; }

.post-actions { display: flex; gap: 4px; padding-left: 52px; margin-top: 12px; }
.action-btn { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: transparent; border: none; color: #555; cursor: pointer; border-radius: 20px; font-size: 15px; transition: all 0.2s; }
.action-btn:hover { background: #111; color: #fff; }
.action-btn.liked { color: #f91880; }
.action-btn.saved { color: #f59e0b; }

.comments-section { padding-left: 52px; margin-top: 16px; }
.comment-input-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-top: 1px solid #222; }
.comment-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #333, #555); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #888; flex-shrink: 0; }
.comment-avatar.small { width: 28px; height: 28px; font-size: 11px; cursor: pointer; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color: #fff; }
.comment-input { flex: 1; height: 40px; background: transparent; border: none; outline: none; color: #fff; font-size: 14px; }
.comment-input::placeholder { color: #555; }
.comment-submit { padding: 8px 16px; background: transparent; border: 1px solid #333; border-radius: 20px; color: #fff; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.comment-submit:hover:not(:disabled) { background: #fff; color: #000; }
.comment-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.login-prompt { padding: 16px; border-top: 1px solid #222; text-align: center; cursor: pointer; color: #1d9bf0; font-size: 14px; transition: all 0.2s; }
.login-prompt:hover { background: #111; }

.comments-list { display: flex; flex-direction: column; gap: 12px; padding: 12px 0; }
.comment-item { display: flex; gap: 10px; }
.comment-content { flex: 1; }
.comment-header { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
.comment-name { font-size: 14px; font-weight: 600; color: #fff; cursor: pointer; }
.comment-name:hover { text-decoration: underline; }
.comment-time { font-size: 13px; color: #555; }
.comment-text { font-size: 14px; color: #ccc; line-height: 1.4; margin: 0; }

.no-comments { padding: 20px 0; text-align: center; }
.no-comments p { font-size: 14px; color: #555; margin: 0; }

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: #000; border: 1px solid #333; border-radius: 20px; padding: 32px; text-align: center; max-width: 320px; width: 100%; }
.modal-icon { font-size: 48px; margin-bottom: 16px; }
.modal-content h3 { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.modal-content p { font-size: 14px; color: #777; margin: 0 0 24px; }
.modal-buttons { display: flex; flex-direction: column; gap: 12px; }
.modal-btn { padding: 14px 24px; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; }
.modal-btn.primary { background: #fff; color: #000; }
.modal-btn.primary:hover { background: #eee; }
.modal-btn.secondary { background: transparent; color: #fff; border: 1px solid #333; }
.modal-btn.secondary:hover { background: #111; }
</style>

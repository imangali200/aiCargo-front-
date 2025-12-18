<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

import { useToast } from '~/composables/useToast'

interface Post {
    id: number
    link: string
    review: string
    likesCount: number
    createAt: string
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
    postLikes: Post[]
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const profile = ref<Profile | null>(null)
const loading = ref(false)
const activeTab = ref<'posts' | 'likes'>('posts')
const isLoggedIn = computed(() => !!token.value)

async function getProfile() {
    loading.value = true
    try {
        const response = await $axios.get('profile', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        profile.value = response.data
    } catch {
        profile.value = null
    } finally {
        loading.value = false
    }
}

async function logout() {
    token.value = null
    router.push('/auth/login')
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

function goToLogin() {
    router.push('/auth/login')
}

onMounted(() => {
    if (token.value) {
        getProfile()
    }
})
</script>

<template>
    <div v-if="!isLoggedIn" class="login-required">
        <div class="login-card">
            <div class="login-icon">👤</div>
            <h2>Профиль</h2>
            <p>Войдите, чтобы просмотреть профиль</p>
            <button class="login-btn" @click="goToLogin">Войти</button>
        </div>
    </div>

    <div v-else-if="loading" class="loading-screen">
        <div class="spinner"></div>
    </div>

    <div v-else-if="profile" class="profile-page">
        <div class="profile-header">
            <div class="profile-info">
                <h1 class="profile-name">{{ profile.name }} {{ profile.surname }}</h1>
                <p class="profile-username">@{{ profile.code }}</p>
            </div>
            <div class="profile-avatar">{{ profile.name.charAt(0).toUpperCase() }}</div>
        </div>

        <div class="profile-stats">
            <span class="stat">{{ profile.posts?.length || 0 }} постов</span>
        </div>

        <div class="profile-actions">
            <button class="action-btn logout" @click="logout">Выйти</button>
            <a :href="'tel:' + profile.phoneNumber" class="action-btn phone">📞 {{ profile.phoneNumber }}</a>
        </div>

        <div class="profile-tabs">
            <button :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Посты</button>
            <button :class="{ active: activeTab === 'likes' }" @click="activeTab = 'likes'">Понравившиеся</button>
        </div>

        <div v-if="activeTab === 'posts'" class="tab-content">
            <div v-if="!profile.posts?.length" class="empty-tab">
                <p>Нет постов</p>
            </div>
            <div v-else class="posts-list">
                <div v-for="post in profile.posts" :key="post.id" class="post-card">
                    <p class="post-text">{{ post.review }}</p>
                    <a v-if="post.link" :href="post.link.startsWith('http') ? post.link : 'https://' + post.link" target="_blank" class="post-link">🔗 {{ post.link }}</a>
                    <div class="post-meta">
                        <span>♡ {{ post.likesCount }}</span>
                        <span>{{ formatDate(post.createAt) }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'likes'" class="tab-content">
            <div v-if="!profile.postLikes?.length" class="empty-tab">
                <p>Нет понравившихся постов</p>
            </div>
            <div v-else class="posts-list">
                <div v-for="post in profile.postLikes" :key="post.id" class="post-card">
                    <p class="post-text">{{ post.review }}</p>
                    <a v-if="post.link" :href="post.link.startsWith('http') ? post.link : 'https://' + post.link" target="_blank" class="post-link">🔗 {{ post.link }}</a>
                    <div class="post-meta">
                        <span>♡ {{ post.likesCount }}</span>
                        <span>{{ formatDate(post.createAt) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-required { min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.login-card { text-align: center; padding: 40px 24px; border: 1px solid #333; border-radius: 20px; max-width: 320px; }
.login-icon { font-size: 64px; margin-bottom: 16px; }
.login-card h2 { font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.login-card p { font-size: 15px; color: #777; margin: 0 0 24px; }
.login-btn { width: 100%; padding: 14px 24px; background: #fff; color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; }
.login-btn:hover { background: #eee; }

.loading-screen { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
.spinner { width: 32px; height: 32px; border: 3px solid #333; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.profile-page { padding: 20px 0; }
.profile-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.profile-info { flex: 1; }
.profile-name { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 4px; }
.profile-username { font-size: 15px; color: #777; margin: 0; }
.profile-avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: #fff; }

.profile-stats { margin-bottom: 20px; }
.stat { font-size: 15px; color: #fff; }

.profile-actions { display: flex; gap: 12px; margin-bottom: 24px; }
.action-btn { flex: 1; padding: 12px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; transition: all 0.2s; }
.action-btn.logout { background: transparent; border: 1px solid #333; color: #fff; }
.action-btn.logout:hover { background: #222; }
.action-btn.phone { background: #222; border: none; color: #fff; }
.action-btn.phone:hover { background: #333; }

.profile-tabs { display: flex; border-bottom: 1px solid #222; margin-bottom: 20px; }
.profile-tabs button { flex: 1; padding: 14px 0; background: transparent; border: none; color: #777; font-size: 15px; font-weight: 600; cursor: pointer; position: relative; transition: color 0.2s; }
.profile-tabs button.active { color: #fff; }
.profile-tabs button.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #fff; }

.tab-content { min-height: 200px; }
.empty-tab { text-align: center; padding: 40px 0; }
.empty-tab p { color: #555; font-size: 15px; margin: 0; }

.posts-list { display: flex; flex-direction: column; gap: 16px; }
.post-card { padding: 16px; border: 1px solid #222; border-radius: 16px; }
.post-text { font-size: 15px; color: #fff; line-height: 1.5; margin: 0 0 8px; }
.post-link { display: inline-block; font-size: 14px; color: #1d9bf0; text-decoration: none; margin-bottom: 8px; }
.post-link:hover { text-decoration: underline; }
.post-meta { display: flex; gap: 16px; font-size: 14px; color: #555; }
</style>

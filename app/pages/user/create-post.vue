<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

import { useToast } from '~/composables/useToast'

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const link = ref('')
const review = ref('')
const submitting = ref(false)
const isLoggedIn = computed(() => !!token.value)

async function createPost() {
    if (!link.value.trim()) {
        toast.warning('Введите ссылку', { position: 'top-center' })
        return
    }
    if (!review.value.trim()) {
        toast.warning('Введите отзыв', { position: 'top-center' })
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
        toast.success('Пост опубликован!', { position: 'top-center' })
        router.push('/user')
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка', { position: 'top-center' })
    } finally {
        submitting.value = false
    }
}

function goBack() {
    router.back()
}

function goToLogin() {
    router.push('/auth/login')
}
</script>

<template>
    <div v-if="!isLoggedIn" class="login-required">
        <div class="login-card">
            <div class="login-icon">✏️</div>
            <h2>Создать пост</h2>
            <p>Войдите, чтобы создать пост</p>
            <button class="login-btn" @click="goToLogin">Войти</button>
        </div>
    </div>

    <div v-else class="create-page">
        <div class="create-header">
            <button @click="goBack" class="cancel-btn">Отмена</button>
            <h1>Новый пост</h1>
            <button @click="createPost" :disabled="submitting || !link.trim() || !review.trim()" class="submit-btn">
                {{ submitting ? '...' : 'Опубликовать' }}
            </button>
        </div>

        <div class="create-form">
            <div class="form-group">
                <label>Ссылка</label>
                <input v-model="link" type="url" placeholder="https://example.com/product" class="form-input" />
            </div>

            <div class="form-group">
                <label>Отзыв</label>
                <textarea v-model="review" placeholder="Что вы думаете об этом товаре?..." rows="6" class="form-textarea"></textarea>
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

.create-page { padding: 0; }

.create-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #222; margin-bottom: 24px; }
.create-header h1 { font-size: 17px; font-weight: 700; color: #fff; margin: 0; }
.cancel-btn { background: transparent; border: none; color: #fff; font-size: 15px; cursor: pointer; padding: 8px 0; }
.submit-btn { padding: 10px 20px; background: #fff; border: none; border-radius: 20px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.submit-btn:hover:not(:disabled) { background: #e5e5e5; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.create-form { display: flex; flex-direction: column; gap: 24px; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 14px; font-weight: 600; color: #777; }

.form-input, .form-textarea { width: 100%; padding: 16px; background: #111; border: 1px solid #333; border-radius: 12px; color: #fff; font-size: 16px; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
.form-input:focus, .form-textarea:focus { border-color: #555; }
.form-input::placeholder, .form-textarea::placeholder { color: #555; }
.form-textarea { resize: none; font-family: inherit; line-height: 1.5; }
</style>

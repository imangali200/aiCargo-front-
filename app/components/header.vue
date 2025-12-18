<template>
    <header class="threads-header">
        <div class="threads-header-content">
            <router-link to="/" class="threads-logo">
                <img src="/images/logo.png" alt="Ai-CARGO" class="logo-img" />
            </router-link>

            <button v-if="!isLoggedIn" @click="goToLogin" class="auth-btn">
                Войти
            </button>
            <button v-else @click="goToSearch" class="search-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
const router = useRouter()
const token = useCookie('token')

const isLoggedIn = computed(() => !!token.value)

function goToLogin() {
    router.push('/auth/login')
}

function goToSearch() {
    router.push('/user/search')
}
</script>

<style scoped>
.threads-header { position: sticky; top: 0; z-index: 100; background: #000; border-bottom: 1px solid #222; }
.threads-header-content { max-width: 620px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; }
.threads-logo { position: absolute; left: 50%; transform: translateX(-50%); text-decoration: none; transition: opacity 0.2s; }
.threads-logo:hover { opacity: 0.8; }
.logo-img { height: 36px; width: auto; filter: brightness(0) invert(1); }
.auth-btn { margin-left: auto; padding: 10px 20px; background: #fff; border: none; border-radius: 10px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
.auth-btn:hover { background: #e5e5e5; }
.search-btn { margin-left: auto; width: 40px; height: 40px; background: transparent; border: none; border-radius: 50%; color: #777; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.search-btn:hover { background: #222; color: #fff; }
</style>

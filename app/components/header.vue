<template>
    <header class="tw-relative tw-z-50 tw-bg-[#0f172a]/80 tw-backdrop-blur-xl tw-border-b tw-border-white/10">
        <div class="tw-max-w-[1400px] tw-mx-auto tw-px-4 md:tw-px-10 lg:tw-px-16 tw-py-3 tw-flex tw-justify-between tw-items-center">
            <!-- Logo -->
            <router-link to="/" class="tw-flex tw-items-center tw-gap-3 tw-no-underline hover:tw-opacity-90 tw-transition-opacity">
                <div class="tw-w-[52px] tw-h-[52px] tw-rounded-xl tw-overflow-hidden tw-flex tw-items-center tw-justify-center">
                    <img class="tw-w-full tw-h-full tw-object-cover tw-rounded-xl" src="/images/logo.png" alt="AI Cargo">
                </div>
                <div class="tw-hidden sm:tw-block">
                    <h1 class="tw-text-white tw-font-bold tw-text-lg tw-leading-tight tw-m-0">AI-CARGO</h1>
                    <p class="tw-text-white/50 tw-text-xs tw-m-0">Карго сервис</p>
                </div>
            </router-link>
            <div class="tw-flex tw-items-center tw-gap-4">
                <!-- Profile Icon -->
                <button 
                    @click="goToProfile"
                    class="tw-w-[42px] tw-h-[42px] tw-rounded-xl tw-bg-gradient-to-br tw-from-cyan-500 tw-to-cyan-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-border-none tw-cursor-pointer tw-transition-all tw-duration-300 tw-shadow-lg tw-shadow-cyan-500/30 hover:tw-translate-y-[-2px] hover:tw-shadow-xl hover:tw-shadow-cyan-500/40"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-w-5 tw-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </button>
                <div class="tw-w-px tw-h-6 tw-bg-white/20"></div>
                <button @click="removetoken" class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-bg-red-500/10 tw-border tw-border-red-500/30 tw-rounded-xl tw-text-red-400 tw-font-medium tw-text-sm tw-cursor-pointer tw-transition-all tw-duration-300 hover:tw-bg-red-500/20 hover:tw-border-red-500/50 hover:tw-text-red-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="tw-w-5 tw-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span class="tw-hidden sm:tw-inline">Выход</span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
    role: string
}

const router = useRouter()
const token = useCookie('token')

const goToProfile = () => {
    if (!token.value) {
        router.push('/auth/login')
        return
    }
    
    try {
        const payload = jwtDecode<JwtPayload>(token.value)
        
        if (payload.role === 'superAdmin') {
            router.push('/superAdmin/me')
        } else if (payload.role === 'admin') {
            router.push('/admin/me')
        } else {
            router.push('/user/me')
        }
    } catch (error) {
        router.push('/user/me')
    }
}

const removetoken = async () => {
    token.value = ''
    navigateTo('/auth/login')
}
</script>

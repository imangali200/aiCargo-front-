<template>
    <header class="tw-h-[65px] tw-w-full lg:tw-px-[144px] md:tw-px-[80px] tw-px-[20px] tw-flex tw-justify-between tw-items-center tw-py-4 tw-border-b-[2px]">
        <div>
            <img class="tw-w-[60px] tw-h-[60px] tw-object-cover" src="/images/logo.png" alt="">
        </div>
        <div class="tw-flex tw-gap-4 tw-items-center">
            <!-- Profile Icon -->
            <button 
                @click="goToProfile"
                class="tw-w-10 tw-h-10 tw-rounded-full tw-bg-gradient-to-br tw-from-[#0891B2] tw-to-[#0e7490] tw-flex tw-items-center tw-justify-center tw-text-white tw-shadow-md hover:tw-shadow-lg tw-transition-all hover:tw-scale-105"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="tw-w-5 tw-h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </button>
            <p class="tw-border-l-[1px] tw-border-gray-300 tw-h-[20px]"></p>
            <button @click="removetoken" class="tw-text-red-500 tw-font-[500] hover:tw-text-red-600 tw-transition-colors">
                Выход
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
const router = useRouter()
const token = useCookie('token')

const goToProfile = () => {
    router.push('/user/me')
}

const removetoken = async () => {
    token.value = ''
    navigateTo('/auth/login')
}
</script>

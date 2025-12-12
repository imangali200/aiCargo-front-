<template>
    <div>
        <div class="tw-bg-white  tw-rounded-[6px] tw-mt-4 tw-p-5">
            <p  class="tw-text-gray-500">Вы являетесь администратором склада: <span class="tw-text-black tw-text-[18px]" v-if="profileData && profileData.branch">{{profileData.branch}}</span></p>
        </div>
        <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3 sm:tw-gap-10 tw-pt-5">
            <div
                class="tw-w-full sm:tw-w-[200px] tw-bg-white tw-h-[76px] tw-rounded-[12px] tw-pl-5 tw-flex tw-items-center hover:tw-bg-yellow-100 hover:tw-text-blue-600 hover:tw-underline tw-text-[18px] tw-cursor-pointer tw-transition tw-duration-200">
                <router-link to="/admin/new-receipts">Принять товары <br> / Accept goods</router-link>
            </div>
            <div
                class="tw-w-full sm:tw-w-[200px] tw-bg-white tw-h-[76px] tw-rounded-[12px] tw-pl-5 tw-flex tw-items-center hover:tw-bg-yellow-100 tw-cursor-pointer hover:tw-text-blue-600 hover:tw-underline  tw-text-[18px] tw-transition tw-duration-200">
                <router-link to="admin/import">История / History</router-link>
            </div>
            <div
                class="tw-w-full sm:tw-w-[200px] tw-bg-white tw-h-[76px] tw-rounded-[12px] tw-pl-5 tw-flex tw-items-center hover:tw-bg-yellow-100 tw-cursor-pointe hover:tw-text-blue-600 hover:tw-underline  tw-text-[18px] tw-transition tw-duration-200">
                <router-link to="/superAdmin/tracks">Импорт</router-link>
            </div>
        </div>
    </div>


</template>
<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

const { $axios } = useNuxtApp()
const token = useCookie('token')

export interface profile{
    id:number,
    phoneNumber:string,
    name:string,
    surname:string,
    code:string | number | null,
    branch:string | null,
    password:string,
    isActive:boolean,
    role:string,
    postLikes:object,
    createAt:string,
    deletedAt:string | null
}

const profileData = ref<profile | null>(null)


async function getBranchesName() {
    try {
        const getBranch = await $axios.get('/profile', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        profileData.value = getBranch.data
        console.log(profileData.value)
    } catch (error) {
        console.log(error)
    }
}
onMounted(()=>{
    getBranchesName()
})
</script>
<template>
    <header class="tw-h-[65px] tw-w-full  lg:tw-px-[144px] md:tw-px-[80px] tw-px-[40px] tw-flex  tw-justify-between tw-items-center tw-py-4 tw-border-b-[2px]">
        <div>
            <img class="tw-w-[60px] tw-h-[60px] tw-object-cover" src="/images/logo.png" alt="">
        </div>
        <div class="tw-flex tw-gap-3 tw-items-center">
            <p>{{role}}</p>
            <p class="tw-border-l-[1px] tw-border-gray-400 tw-h-[14px]"></p>
            <p @click="removetoken" class="tw-text-red-500 tw-font-[500]">Выход</p>
        </div>
    </header>
</template>
<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';
import type { myJwtPayload } from '~/pages/auth/login.vue';

const role = ref<string>('')

const token = useCookie('token')
if (token) {
    const data = jwtDecode<myJwtPayload>(token.value!)
    role.value = data.role
}
const removetoken = async ()=>{
    token.value = ''
    navigateTo('/auth/login')
}


</script>
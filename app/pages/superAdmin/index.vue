<template>
    <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-3 sm:tw-gap-10 tw-pt-5">
        <div
            class="tw-w-full sm:tw-w-[200px] tw-bg-white tw-h-[76px] tw-rounded-[12px] tw-pl-5 tw-flex tw-items-center hover:tw-bg-yellow-100 hover:tw-text-blue-600 hover:tw-underline tw-text-[18px] tw-cursor-pointer tw-transition tw-duration-200">
            <router-link to="/superAdmin/users">Пользователи</router-link>
        </div>
        <div
            class="tw-w-full sm:tw-w-[200px] tw-bg-white tw-h-[76px] tw-rounded-[12px] tw-pl-5 tw-flex tw-items-center hover:tw-bg-yellow-100 tw-cursor-pointer hover:tw-text-blue-600 hover:tw-underline  tw-text-[18px] tw-transition tw-duration-200">
            <router-link to="superAdmin/warehouses">Склады</router-link></div>
        <div
            class="tw-w-full sm:tw-w-[200px] tw-bg-white tw-h-[76px] tw-rounded-[12px] tw-pl-5 tw-flex tw-items-center hover:tw-bg-yellow-100 tw-cursor-pointe hover:tw-text-blue-600 hover:tw-underline  tw-text-[18px] tw-transition tw-duration-200">
            <router-link to="/superAdmin/tracks">Товары</router-link></div>
    </div>

</template>
<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})
</script>
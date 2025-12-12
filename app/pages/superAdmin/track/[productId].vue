<script setup lang="ts">
    definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import type { Products } from '../tracks.vue'

const route = useRoute()
const id = route.params.productId

const product = ref<Products | null>(null)

const { $axios } = useNuxtApp()

const token = useCookie('token')

async function getProduct() {
    const productRes = await $axios.get(`products/${id}`, {
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    })
    product.value = productRes.data
    console.log(product.value)

}

const formatData = (time: string) => {
    if (!time) return ''
    const date = new Date(time)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


onMounted(() => {
    getProduct()
})

</script>
<template>
    <div class="tw-mt-7">
        <div class="tw-flex tw-items-center tw-gap-3">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <p>⤑</p>
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin/tracks"> Товары</router-link>
            <p>⤑</p>
            <p class="tw-text-gray-400">{{ id }}</p>
        </div>
        <div v-if="product" class="tw-bg-white tw-p-6 tw-rounded-[8px] tw-mt-5">
            <p class="tw-text-gray-500 tw-border-b-[1px] tw-pb-3">Трек код: <span class="tw-text-black">{{
                product.productId.toUpperCase() }}</span></p>
            <p class="tw-text-gray-500 tw-border-b-[1px] tw-py-3">Создан в: <span class="tw-text-black">{{
                formatData(product.client_registered)}}</span></p>
            <div class="tw-border-b-[1px] tw-py-3 ">
                <h3>История:</h3>
                <div class="tw-flex tw-items-center tw-gap-3 tw-ml-5 tw-mt-2">
                    <p
                        class="tw-bg-green-800 tw-text-white tw-w-[25px] tw-h-[25px] tw-flex tw-items-center tw-justify-center tw-rounded-[50%]">
                        1</p>
                    <p v-if="product.china_warehouse">{{ formatData(product.china_warehouse)}}</p>
                    <p v-else>Не выдан</p>
                </div>
                <div v-if="product.aicargo" class="tw-flex tw-items-center tw-gap-3 tw-ml-5 tw-mt-2">
                    <p
                        class="tw-bg-green-800 tw-text-white tw-w-[25px] tw-h-[25px] tw-flex tw-items-center tw-justify-center tw-rounded-[50%]">
                        2</p>
                    <p v-if="product.china_warehouse">{{ formatData(product.aicargo)}}</p>
                    <p v-else>Не выдан</p>
                </div>
            </div>

            

        </div>
    </div>
</template>
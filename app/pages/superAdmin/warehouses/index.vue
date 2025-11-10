<script setup lang="ts">
import { useToast, POSITION } from 'vue-toastification';
import type { Branch } from '~/pages/auth/register.vue';
const token = useCookie('token')
const { $axios } = useNuxtApp()
const toast = useToast()
const branchData = ref<Branch[]>([])

async function getBranches() {
    try {
        const res = await $axios.get('branch', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })

        branchData.value = res.data
        console.log(branchData.value)
    } catch (error) {
        console.log(error)
    }

}
const removeBranch = async(id:number)=>{
    const branchRes = await $axios.delete(`branch/${id}`,{
        headers:{
            'Authorization':`Bearer ${token.value}`
        }
    })
    console.log(branchRes)
}
onMounted(() => {
    getBranches()
})
</script>
<template>
    <div class="tw-mt-7">
        <div class="tw-flex tw-items-center tw-gap-4">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <p>⤑</p>
            <p class="tw-text-gray-400">Склады</p>
        </div>
        <div class="tw-flex tw-justify-end tw-mt-3 tw-border-b-[1px] tw-pb-3">
            <div class="tw-flex tw-gap-2">
                <button class="tw-w-[100px] tw-h-[38px] tw-rounded-[6px] tw-bg-red-600 tw-text-white"><router-link
                        to="/superAdmin/warehouses/trash">Корзина</router-link></button>
                <button class="tw-w-[100px] tw-h-[38px] tw-rounded-[6px] tw-bg-[#0891B2] tw-text-white"><router-link
                        to="/superAdmin/create">Добавить</router-link></button>
            </div>
        </div>
        <table v-if="branchData.length > 0"
            class="tw-min-w-full tw-border tw-mt-[20px] tw-border-gray-300 tw-border-collapse ">
            <thead class="tw-bg-gray-100">
                <tr>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Склад</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Ответственные</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="data in branchData" :key="data.id">
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.id }}</td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.branchName }}</td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.responsibleName }}
                    </td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">
                        <div class="tw-flex tw-items-center tw-gap-2 tw-text-white">
                            <button class="tw-bg-[#0891B2] tw-py-1 tw-px-2 tw-rounded-[4px]">изм.</button>
                            <button @click="removeBranch(data.id)" class="tw-bg-red-600 tw-py-1 tw-px-2 tw-rounded-[4px]">уд.</button>
                        </div>
                    </td>
                </tr>
            </tbody>

        </table>
        <div v-else class="tw-mt-4">
            <h1>Нет никакого склада</h1>
        </div>
    </div>
</template>
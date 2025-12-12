<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})
import { useToast, POSITION } from 'vue-toastification';
import type { Branch } from '~/pages/auth/register.vue';
const token = useCookie('token')
const { $axios } = useNuxtApp()
const toast = useToast()
const branchData = ref<Branch[]>([])
const loading = ref(false)

async function getBranches() {
    loading.value = true
    try {
        const res = await $axios.get('branch', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })

        branchData.value = res.data
    } catch (error) {
        console.log(error)
        toast.error('Ошибка при загрузке складов', {
            position: 'top-center' as POSITION
        })
    } finally {
        loading.value = false
    }

}
const removeBranch = async (id: number) => {
    try {
        const branchRes = await $axios.delete(`branch/${id}`, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        if (branchRes.status === 200) {
            toast.success('успешно удалено', {
                position: 'top-center' as POSITION
            })
        } else {
            toast.success('не успешно удалено', {
                position: 'top-center' as POSITION
            })
        }
        getBranches()
    } catch (error) {
        console.log(error)
    }

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
                        to="/superAdmin/warehouses/create">Добавить</router-link></button>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-mt-6 tw-text-center tw-py-8">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-[#0891B2] tw-border-t-transparent"></div>
            <p class="tw-mt-2 tw-text-gray-500">Загрузка...</p>
        </div>

        <table v-else class="tw-min-w-full tw-border tw-mt-[20px] tw-border-gray-300 tw-border-collapse ">
            <thead class="tw-bg-gray-100">
                <tr>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Склад</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Ответственные</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Действия</th>
                </tr>
            </thead>
            <tbody v-if="branchData.length > 0">
                <tr v-for="data in branchData" :key="data.id" class="hover:tw-bg-gray-50">
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.id }}</td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.branchName }}</td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.responsibleName }}
                    </td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">
                        <div class="tw-flex tw-items-center tw-gap-2 tw-text-white">
                            <button class="tw-bg-[#0891B2] tw-py-1 tw-px-2 tw-rounded-[4px]">изм.</button>
                            <button @click="removeBranch(data.id)"
                                class="tw-bg-red-600 tw-py-1 tw-px-2 tw-rounded-[4px]">уд.</button>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td class="tw-text-center tw-py-8 tw-text-gray-400" :colspan="4">
                        Нет никакого склада
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>
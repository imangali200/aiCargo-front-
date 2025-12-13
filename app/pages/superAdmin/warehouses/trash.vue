<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})
import { useToast } from '~/composables/useToast';
import type { Branch } from '~/pages/auth/register.vue';
const token = useCookie('token')
const { $axios } = useNuxtApp()
const toast = useToast()
const branchData = ref<Branch[]>([])
const loading = ref(false)

async function getBranches() {
    loading.value = true
    try {
        const res = await $axios.get('branch/trash', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        branchData.value = res.data
    } catch (error) {
        console.error(error)
        toast.error('Ошибка при загрузке данных', {
            position: 'top-center'         })
    } finally {
        loading.value = false
    }
}

const restoreBranch = async (id: number) => {
    try {
        const branchRes = await $axios.put(`branch/restore/${id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        toast.success('Филиал успешно восстановлен', {
            position: 'top-center'         })
        getBranches()
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при восстановлении филиала', {
            position: 'top-center'         })
    }
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
    getBranches()
})
</script>
<template>
    <div class="tw-mt-7">
        <div class="tw-flex tw-items-center tw-gap-4">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <p>⤑</p>
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin/warehouses">Склады</router-link>
            <p>⤑</p>
            <p class="tw-text-gray-400">Корзина</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-mt-6 tw-text-center tw-py-8">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-red-500 tw-border-t-transparent"></div>
            <p class="tw-mt-2 tw-text-gray-500">Загрузка...</p>
        </div>

        <table v-else class="tw-min-w-full tw-border tw-mt-[20px] tw-border-gray-300 tw-border-collapse">
            <thead class="tw-bg-red-200">
                <tr>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Склад</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Ответственные</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Этап</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Действия</th>
                </tr>
            </thead>
            <tbody v-if="branchData.length > 0">
                <tr v-for="data in branchData" :key="data.id" class="tw-bg-red-50 hover:tw-bg-red-100 tw-transition-colors">
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.id }}</td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.branchName }}</td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.responsibleName }}</td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">
                        Удалил Super в {{ formatData(data.deleteAt) }}
                    </td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">
                        <button 
                            @click="restoreBranch(data.id)"
                            class="tw-bg-green-600 hover:tw-bg-green-700 tw-text-white tw-py-1 tw-px-3 tw-rounded-[4px] tw-transition-colors"
                        >
                            Восстановить
                        </button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td class="tw-text-center tw-py-8 tw-text-gray-400" :colspan="5">
                        Корзина пуста
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

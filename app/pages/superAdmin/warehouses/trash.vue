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

async function getBranches() {
    try {
        const res = await $axios.get('branch/trash', {
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
const restoreBranch = async (id: number) => {
    const branchRes = await $axios.put(`branch/restore/${id}`, {}, {
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    })
    if (branchRes.status === 200) {
        toast.success('филиал успешно восстановлена', {
            position: 'top-center' as POSITION
        })
    } else {
        toast.success('филиал не успешно восстановлена', {
            position: 'top-center' as POSITION
        })
    }
    getBranches()

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
        <table class="tw-min-w-full tw-border tw-mt-[20px] tw-border-gray-300 tw-border-collapse ">
            <thead class="tw-bg-red-200">
                <tr>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Склад</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Ответственные</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left"> Этап</th>
                    <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Действия</th>
                </tr>
            </thead>
            <tbody v-if="branchData.length > 0">
                <tr class="tw-bg-red-100" v-for="data in branchData" :key="data.id">
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.id }}</td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.branchName }}</td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ data.responsibleName }}
                    </td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">Удалил Super в {{
                        formatData(data.deleteAt) }}
                    </td>
                    <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">
                        <div class="tw-flex tw-items-center tw-gap-2 tw-text-white">
                            <button @click="restoreBranch(data.id)"
                                class="tw-bg-red-600 tw-py-1 tw-px-2 tw-rounded-[4px]">восстановить</button>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tbody v-else class=" tw-bg-red-100 tw-w-full">
                <tr>
                    <td class=" tw-text-start tw-py-1 tw-pl-3 tw-text-red-700" :colspan="5">
                        Нет никакого склада
                    </td>
                </tr>

            </tbody>
        </table>

    </div>
</template>
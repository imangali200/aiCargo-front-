<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})
import type { User } from '../users.vue'
import { useToast } from '~/composables/useToast'
const toast = useToast()
const router = useRouter()
const { $axios } = useNuxtApp()
const token = useCookie('token')
const adminList = ref<User[]>([])

const selectAdmin = ref<string>('')
const branchName = ref<string>('')
const errorMessage = ref<string>('')
const loading = ref(false)
const submitting = ref(false)

const goBack = () => {
    router.back()
}

async function getFreeAdmins() {
    loading.value = true
    try {
        const admins = await $axios.get('user/admins', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        adminList.value = admins.data
    } catch (error: any) {
        console.log(error)
        if (error.response?.status === 404) {
            adminList.value = []
        } else {
            toast.error('Ошибка при загрузке администраторов', {
                position: 'top-center'             })
        }
    } finally {
        loading.value = false
    }
}

const createBranch = async () => {
    if (!selectAdmin.value || !branchName.value) {
        errorMessage.value = 'Необходимо заполнить все поля.'
        return
    }
    
    submitting.value = true
    errorMessage.value = ''
    
    try {
        const resBranch = await $axios.post('branch', {
            branchName: branchName.value,
            responsibleName: selectAdmin.value
        }, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        
        toast.success('Филиал успешно создан', {
            position: 'top-center'         })
        return navigateTo('/superAdmin/warehouses')
    } catch (error: any) {
        console.log(error)
        toast.error(error.response?.data?.message || 'Ошибка при создании филиала', {
            position: 'top-center'         })
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    getFreeAdmins()
})
</script>
<template>
    <div class="tw-mt-7">
        <div class="tw-flex tw-items-center tw-gap-4">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <p>⤑</p>
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin/warehouses">Склады</router-link>
            <p>⤑</p>
            <p class="tw-text-gray-400">Добавить склад</p>
        </div>
        <div class="tw-mt-4 tw-flex tw-items-center tw-justify-between tw-border-b-[1px] tw-border-gray-200 tw-pb-5">
            <h3 class="tw-text-[18px] tw-font-[400]">Добавить склад</h3>
            <button @click="goBack()"
                class="tw-bg-red-600 tw-text-white tw-h-[38px] tw-px-4 tw-rounded-[8px]">Назад</button>
        </div>
        
        <!-- Loading -->
        <div v-if="loading" class="tw-mt-6 tw-text-center tw-py-8">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-[#0891B2] tw-border-t-transparent"></div>
            <p class="tw-mt-2 tw-text-gray-500">Загрузка...</p>
        </div>

        <div v-else class="tw-mt-5 tw-bg-white tw-p-5 tw-rounded-[10px]">
            <form class="tw-flex tw-flex-col tw-gap-4" @submit.prevent='createBranch'>
                <div class="tw-flex tw-flex-col tw-gap-1">
                    <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="nameBranch">Название склада</label>
                    <input 
                        v-model="branchName" 
                        type="text" 
                        id="nameBranch" 
                        placeholder="Склад в Китае"
                        class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" 
                    />
                </div>
                <div class="tw-flex tw-flex-col tw-gap-1">
                    <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="selectAdmin">Ответственный администратор</label>
                    <select 
                        id="selectAdmin"
                        class="tw-w-[250px] tw-h-[36px] tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-px-2"
                        v-model="selectAdmin"
                    >
                        <option value="" disabled>Выберите администратора</option>
                        <option v-for="admin in adminList" :key="admin.id" :value="admin.name + ' ' + admin.surname">
                            {{ admin.name }} {{ admin.surname }}
                        </option>
                    </select>
                    <p v-if="!adminList?.length" class="tw-text-gray-500 tw-text-sm tw-mt-1">
                        У вас нет доступных администраторов, 
                        <router-link class="tw-text-blue-500 hover:tw-underline" to="/superAdmin/create">добавьте их</router-link>
                    </p>
                </div>
                <p v-if="errorMessage" class="tw-text-red-500">{{ errorMessage }}</p>
                <button 
                    type="submit"
                    :disabled="submitting"
                    class="tw-bg-[#0891B2] tw-text-white tw-w-[200px] tw-rounded-[10px] tw-h-[40px] disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                >
                    {{ submitting ? 'Сохранение...' : 'Сохранить' }}
                </button>
            </form>
        </div>
    </div>
</template>

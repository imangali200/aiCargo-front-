<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})
import type { User } from '../users.vue'
import { useToast, POSITION } from 'vue-toastification'
const toast = useToast()
const router = useRouter()
const { $axios } = useNuxtApp()
const token = useCookie('token')
const adminList = ref<User[]>([])

const selectAdmin = ref<string>()
const branchName = ref<string>()
const errorMessage = ref<string>()

const goBack = () => {
    router.back()
}

async function getFreeAdmins() {
    try {
        const admins = await $axios.get('user/admins', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })

        if (admins.status === 404) {
            adminList.value = []
        } else {
            adminList.value = admins.data
        }
        console.log(adminList.value)
    } catch (error) {
        console.log(error)
    }
}
const createBranch = async () => {
    if (!selectAdmin.value || !branchName.value || selectAdmin.value === 'undefined undefined') {
        errorMessage.value = 'Необходимо заполнить все поля.'
        return
    }
    try {
        const resBranch = await $axios.post('branch', {
            branchName: branchName.value,
            responsibleName: selectAdmin.value
        }, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        if (resBranch.status === 201) {
            toast.success('Филиал успешно создана', {
                position: 'top-center' as POSITION
            })
        } else {
            toast.warning('Филиал не успешно создана', {
                position: 'top-center' as POSITION
            })
        }
        errorMessage.value = ''
        return navigateTo('/superAdmin/warehouses')
    } catch (error) {
        console.log(error)
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
        <div class="tw-mt-5 tw-bg-white tw-p-5 tw-rounded-[10px]">
            <form class="tw-flex tw-flex-col tw-gap-4" @submit.prevent='createBranch' action="">
                <div class="tw-flex tw-flex-col tw-gap-1">
                    <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="nameBranch">Названия</label>
                    <input v-model="branchName" type="text" id="nameBranch" placeholder="Склад в Китае"
                        class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
                </div>
                <div>
                    <select class="tw-w-[200px] tw-h-[30px] tw-border-[1px] tw-border-gray-400 tw-rounded-[6px]"
                        v-model="selectAdmin">
                        <option v-for="admin in adminList" :key="admin.id" :value="admin.name + ' ' + admin.surname">{{
                            admin.name }} {{ admin.surname }}</option>
                    </select>
                    <p v-if="!adminList?.length">У вас нет доступных администраторов, <router-link
                            class="tw-text-blue-500" to="/superAdmin/users">добавьте их</router-link></p>
                </div>
                <p class="tw-text-red-500">{{ errorMessage }}</p>
                <button type="submit"
                    class="tw-bg-[#0891B2] tw-text-white tw-w-[200px] tw-rounded-[10px] tw-h-[40px]">Сохранить</button>
            </form>
        </div>
    </div>
</template>
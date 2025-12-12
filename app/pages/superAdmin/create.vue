<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import type { Branch } from '../auth/register.vue'

const { $axios } = useNuxtApp()
import { useToast, POSITION } from "vue-toastification";
const toast = useToast();

const phoneNumber = ref<string>('')
const selectBranch = ref<string>('')
const codeUser = ref<string>('')
const name = ref<string>('')
const surname = ref<string>('')
const password = ref<string>('')
const errorMessage = ref<string>('')
const role = ref<string>('superAdmin')
const token = useCookie('token')

const router = useRouter()

const branches = ref<Branch[]>([])

const goToBack = () => {

    router.back()
}

async function getBranches() {
    const res = await $axios.get('branch')
    branches.value = res.data
}
const createUser = async () => {
    if (
        !phoneNumber.value ||
        !name.value ||
        !surname.value ||
        !role.value ||
        !password.value
    ) {
        errorMessage.value = 'Пожалуйста, заполните все поля'
        return
    }
    try {
        const response = await $axios.post('admin/createuser', {
            phoneNumber: phoneNumber.value,
            code: codeUser.value || '',
            name: name.value,
            surname: surname.value,
            role: role.value,
            branch: selectBranch.value.length === 0 ? null :selectBranch.value,
            password: password.value
        }, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        if (response.status === 201) {
            toast.success('Успешно выполнено!', {
                position: "top-center" as POSITION,
                timeout: 3000
            })
        }else{
            toast.warning('Не удалось добавить пользователя',{
                position:'top-center' as POSITION
            })
        }

        return navigateTo('/superAdmin/users')
    } catch (error) {
        console.log(error)
        toast.error("Ошибка сервиса")
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
            <routerLink class="tw-text-blue-600 hover:tw-underline" to="/superAdmin/users">Пользователи</routerLink>
            <p>⤑</p>
            <p class="tw-text-gray-400">Добавить пользователь</p>
        </div>
        <div class="tw-flex tw-items-center tw-justify-between tw-mt-5 tw-border-b-[1px] tw-border-gray-200 tw-pb-5">
            <span class="tw-text-[18px] tw-font-[500]">Добавить пользователь</span>
            <button @click="goToBack"
                class="tw-bg-red-600 tw-text-white tw-h-[38px] tw-px-4 tw-rounded-[8px]">Назад</button>
        </div>
        <form action="" @submit.prevent="createUser"
            class="tw-bg-white tw-rounded-[8px] tw-shadow-2xl tw-mt-5 tw-p-6 tw-flex tw-flex-col tw-gap-5">
            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="code">Код (для клиентов)</label>
                <input type="text" id="code" v-model="codeUser"
                    class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
            </div>
            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="phoneNumber">Телефон</label>
                <input v-model="phoneNumber" ref="phoneInput" type="text" id="phoneNumber" placeholder="8701 001 0101"
                    class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent tw-text-[15px]" />
            </div>
            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="name">Имя на английском</label>
                <input id="name" type="text" v-model="name"
                    class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
            </div>
            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="surname">Фамилия на
                    английском</label>
                <input type="text" id="surname" v-model="surname"
                    class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
            </div>

            <div class="tw-flex tw-flex-col tw-gap-1 tw-w-[200px]">
                <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="role">Роль:</label>
                <select type="text" id="role" v-model="role"
                    class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent">
                    <option value="superAdmin">superAdmin</option>
                    <option value="admin">admin</option>
                    <option value="user">user</option>
                </select>
            </div>

            <div class="tw-flex tw-flex-col tw-gap-1 tw-w-[300px]">
                <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="password">Склад:</label>
                <select id="password" v-model="selectBranch"
                    class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-bg-transparent">
                    <option v-for="branch in branches" :key="branch.id" :value="branch.branchName">
                        {{ branch.branchName }}
                    </option>
                </select>
            </div>


            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="password">Пароль</label>
                <input type="text" id="password" v-model="password"
                    class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
                <p class="tw-text-[14px] tw-text-red-500">{{ errorMessage }}</p>
            </div>
            <button type="submit" class="tw-bg-[#0891B2] tw-text-white tw-w-[180px] tw-h-[37px] tw-rounded-md">
                Сохранить
            </button>
        </form>
    </div>
</template>
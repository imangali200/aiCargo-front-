<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import type { Branch } from '../auth/register.vue'
import { useToast, POSITION } from "vue-toastification";

const { $axios } = useNuxtApp()
const toast = useToast();
const token = useCookie('token')
const router = useRouter()

const phoneNumber = ref('')
const selectBranch = ref('')
const codeUser = ref('')
const name = ref('')
const surname = ref('')
const password = ref('')
const errorMessage = ref('')
const role = ref('user')
const branches = ref<Branch[]>([])
const loading = ref(false)
const submitting = ref(false)

const goToBack = () => {
    router.back()
}

async function getBranches() {
    loading.value = true
    try {
        const res = await $axios.get('branch')
        branches.value = res.data
    } catch (error) {
        console.error(error)
        toast.error('Ошибка при загрузке складов', {
            position: 'top-center' as POSITION
        })
    } finally {
        loading.value = false
    }
}

const createUser = async () => {
    if (!phoneNumber.value || !name.value || !surname.value || !role.value || !password.value) {
        errorMessage.value = 'Пожалуйста, заполните все обязательные поля'
        return
    }

    submitting.value = true
    errorMessage.value = ''

    try {
        const response = await $axios.post('admin/createuser', {
            phoneNumber: phoneNumber.value,
            code: codeUser.value || '',
            name: name.value,
            surname: surname.value,
            role: role.value,
            branch: selectBranch.value || null,
            password: password.value
        }, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })

        toast.success('Пользователь успешно создан!', {
            position: "top-center" as POSITION,
            timeout: 3000
        })

        return navigateTo('/superAdmin/users')
    } catch (error: any) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Ошибка при создании пользователя', {
            position: 'top-center' as POSITION
        })
    } finally {
        submitting.value = false
    }
}

onMounted(() => {
    getBranches()
})
</script>

<template>
    <div class="tw-mt-7">
        <!-- Навигация -->
        <div class="tw-flex tw-items-center tw-gap-2 tw-flex-wrap">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <span>⤑</span>
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin/users">Пользователи</router-link>
            <span>⤑</span>
            <span class="tw-text-gray-400">Добавить пользователя</span>
        </div>

        <!-- Header -->
        <div class="tw-flex tw-items-center tw-justify-between tw-mt-5 tw-border-b tw-border-gray-200 tw-pb-5">
            <span class="tw-text-lg tw-font-medium">Добавить пользователя</span>
            <button 
                @click="goToBack"
                class="tw-bg-red-600 tw-text-white tw-h-[38px] tw-px-4 tw-rounded-lg hover:tw-bg-red-700 tw-transition-colors"
            >
                Назад
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-mt-6 tw-text-center tw-py-8">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-[#0891B2] tw-border-t-transparent"></div>
            <p class="tw-mt-2 tw-text-gray-500">Загрузка...</p>
        </div>

        <!-- Form -->
        <form 
            v-else
            @submit.prevent="createUser"
            class="tw-bg-white tw-rounded-xl tw-shadow-lg tw-mt-5 tw-p-6 tw-flex tw-flex-col tw-gap-5"
        >
            <!-- Код -->
            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-sm tw-text-gray-600" for="code">Код (для клиентов)</label>
                <input 
                    type="text" 
                    id="code" 
                    v-model="codeUser"
                    placeholder="Например: KZ001"
                    class="tw-border tw-border-gray-300 tw-rounded-lg tw-h-[40px] tw-px-3 tw-bg-transparent" 
                />
            </div>

            <!-- Телефон -->
            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-sm tw-text-gray-600" for="phoneNumber">
                    Телефон <span class="tw-text-red-500">*</span>
                </label>
                <input 
                    v-model="phoneNumber" 
                    type="text" 
                    id="phoneNumber" 
                    placeholder="8701 001 0101"
                    class="tw-border tw-border-gray-300 tw-rounded-lg tw-h-[40px] tw-px-3 tw-bg-transparent" 
                />
            </div>

            <!-- Имя -->
            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-sm tw-text-gray-600" for="name">
                    Имя <span class="tw-text-red-500">*</span>
                </label>
                <input 
                    id="name" 
                    type="text" 
                    v-model="name"
                    placeholder="Ivan"
                    class="tw-border tw-border-gray-300 tw-rounded-lg tw-h-[40px] tw-px-3 tw-bg-transparent" 
                />
            </div>

            <!-- Фамилия -->
            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-sm tw-text-gray-600" for="surname">
                    Фамилия <span class="tw-text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    id="surname" 
                    v-model="surname"
                    placeholder="Ivanov"
                    class="tw-border tw-border-gray-300 tw-rounded-lg tw-h-[40px] tw-px-3 tw-bg-transparent" 
                />
            </div>

            <!-- Роль -->
            <div class="tw-flex tw-flex-col tw-gap-1 tw-w-full sm:tw-w-[250px]">
                <label class="tw-text-sm tw-text-gray-600" for="role">
                    Роль <span class="tw-text-red-500">*</span>
                </label>
                <select 
                    id="role" 
                    v-model="role"
                    class="tw-border tw-border-gray-300 tw-rounded-lg tw-h-[40px] tw-px-3 tw-bg-transparent"
                >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                    <option value="superAdmin">Super Admin</option>
                </select>
            </div>

            <!-- Склад -->
            <div class="tw-flex tw-flex-col tw-gap-1 tw-w-full sm:tw-w-[300px]">
                <label class="tw-text-sm tw-text-gray-600" for="branch">Склад</label>
                <select 
                    id="branch" 
                    v-model="selectBranch"
                    class="tw-border tw-border-gray-300 tw-rounded-lg tw-h-[40px] tw-px-3 tw-bg-transparent"
                >
                    <option value="">Не выбран</option>
                    <option v-for="branch in branches" :key="branch.id" :value="branch.branchName">
                        {{ branch.branchName }}
                    </option>
                </select>
            </div>

            <!-- Пароль -->
            <div class="tw-flex tw-flex-col tw-gap-1">
                <label class="tw-text-sm tw-text-gray-600" for="userPassword">
                    Пароль <span class="tw-text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    id="userPassword" 
                    v-model="password"
                    placeholder="Введите пароль"
                    class="tw-border tw-border-gray-300 tw-rounded-lg tw-h-[40px] tw-px-3 tw-bg-transparent" 
                />
            </div>

            <!-- Error message -->
            <p v-if="errorMessage" class="tw-text-red-500 tw-text-sm">{{ errorMessage }}</p>

            <!-- Submit -->
            <button 
                type="submit" 
                :disabled="submitting"
                class="tw-bg-[#0891B2] tw-text-white tw-w-full sm:tw-w-[200px] tw-h-[42px] tw-rounded-lg hover:tw-bg-[#0e7490] tw-transition-colors disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
            >
                {{ submitting ? 'Сохранение...' : 'Сохранить' }}
            </button>
        </form>
    </div>
</template>

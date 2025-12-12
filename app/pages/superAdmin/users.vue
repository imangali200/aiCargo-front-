<script setup lang="ts">
    definePageMeta({
    layout: 'default',
    middleware: 'auth'
})

import { useToast, POSITION } from 'vue-toastification'
const { $axios } = useNuxtApp()
const token = useCookie('token')
const router = useRouter()
export interface User {
    branch: boolean | string
    code: null | string
    id: number
    role: 'superAdmin' | 'admin' | 'user'
    name: string
    surname: string
    phoneNumber: string
    password: string
    isActive: boolean
    createAt: string
    deletedAt: null | string
}
const toast = useToast()
const users = ref<User[]>([])
const currentPage = ref(1)
const perPage = 20

const removeSearchButton = ref<boolean>(false)

const searchValue = ref<string>("")


const routeToEdit = (id: number) => {
    router.push(`edit/${id}`)
}

const paginatedUsers = computed(() => {
    if (!users) {
        return []
    }
    const start = (currentPage.value - 1) * perPage
    return users.value.slice(start, start + perPage)
})
const totalPages = computed(() => {
    return Math.ceil(users.value.length / perPage)
})

function changePage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

async function getUsers() {
    try {
        const response = await $axios.get('admin', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })

        const sortedUsers = [
            ...response.data.filter((u: User) => u.role === 'superAdmin'),
            ...response.data.filter((u: User) => u.role === 'admin'),
            ...response.data.filter((u: User) => u.role === 'user')
        ]
        users.value = sortedUsers
        searchValue.value = ''
        removeSearchButton.value = false
    } catch (error) {
        console.log(error)
    }
}

const search = async () => {
    try {
        const res = await $axios.get('/user/search', {
            params: { search: searchValue.value },
            headers: { Authorization: `Bearer ${token.value}` }
        })
        users.value = res.data
        removeSearchButton.value = true
    } catch (error) {
        console.log(error)
    }

}

const deleteUser = async (id: number) => {
    const isConfirm = confirm("Действительно хотите удалить?")
    if (!isConfirm) return
    try {
        const activeData = await $axios.delete(`user/${id}`, {
            headers: { Authorization: `Bearer ${token.value}` }
        })
        toast.success('успешно удалено', {
            position: 'top-center' as POSITION
        })
        getUsers()
    } catch (error) {
        console.log(error)
    }

}

const disactive = async (id: number) => {
    try {
        const resActive = await $axios.put(`user/active/${id}`, {}, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        if (resActive.status === 200) {
            toast.success('Пользователь успешно деактивирован', {
                position: 'top-center' as POSITION,
            });
        } else {
            toast.warning('Не удалось деактивировать пользователя', {
                position: 'top-center' as POSITION,
            });
        }
    } catch (error) {
        console.log(error)
        toast.error('ошибка от сервера')
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
    getUsers()
})
</script>
<template>
    <div class="tw-pt-7">
        <div class="tw-flex tw-items-center tw-gap-3">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <p>⤑</p>
            <p class="tw-text-gray-400">Пользователи</p>
        </div>
        <div
            class="tw-flex tw-flex-col tw-items-start tw-gap-3 sm:tw-flex-row  tw-justify-between sm:tw-items-center sm:tw-gap-0 tw-mt-4">
            <div class="tw-flex tw-gap-2">
                <input @keyup.enter='search' v-model="searchValue"
                    class="tw-h-[36px] tw-w-[220px] tw-border-[1px] tw-rounded-[8px] tw-border-gray-300 tw-pl-3"
                    placeholder="Пойск" type="text">
                <button @click="search"
                    class="tw-bg-[#0891B2] tw-text-white tw-h-[34px] tw-px-3 tw-rounded-[6px]">Найти</button>
                <button @click="getUsers" v-if="removeSearchButton"
                    class="tw-bg-red-600 tw-text-white tw-h-[34px] tw-px-3 tw-rounded-[6px]">Очистить пойск</button>
            </div>
            <div class="tw-flex tw-gap-2">
                <button class="tw-w-[100px] tw-h-[38px] tw-rounded-[6px] tw-bg-red-600 tw-text-white"><router-link
                        to="/superAdmin/trash">Корзина</router-link></button>
                <button class="tw-w-[100px] tw-h-[38px] tw-rounded-[6px] tw-bg-[#0891B2] tw-text-white"><router-link
                        to="/superAdmin/create">Добавить</router-link></button>
            </div>
        </div>

        <div class="tw-mt-[15px] tw-border-t-[1px]  tw-border-gray-200">
            <p class="tw-mt-4 tw-text-gray-500">Показано {{ users.length }} результатов</p>
            <table class="tw-min-w-full tw-border tw-mt-[20px] tw-border-gray-300 tw-border-collapse ">
                <thead class="tw-bg-gray-100">
                    <tr>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Код</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Роль</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Телефон</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Фамиля Имя</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Пароль</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Состояние</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in paginatedUsers" :key="user.id" class="hover:tw-bg-gray-100">
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w-[20px]">{{ user.id
                        }}</td>
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w-[150px]">{{
                            user.code }}</td>
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w-[120px]">{{
                            user.role }}</td>
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w-[160px]">{{
                            user.phoneNumber }}</td>
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w-[200px]">{{
                            user.name }} {{ user.surname }}</td>
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ user.password }}</td>
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">
                            <span v-if="user.role === 'admin'">
                                <span v-if="user.branch">Администратор {{ user.branch }}</span>
                                <span v-else> Еще не привязан на склад</span>
                            </span>
                            <span v-if="user.role === 'superAdmin'">
                                {{ user.branch }}
                            </span>
                            <span v-if="user.role === 'user'">
                                Активировал Super в
                                {{ formatData(user.createAt) }}
                            </span>
                        </td>

                        <td class="tw-border tw-border-gray-300 tw-w-[120px]">
                            <div class="tw-flex tw-justify-center tw-items-center tw-gap-1 tw-flex-wrap">
                                <button @click="disactive(user.id)"
                                    class="tw-bg-[#BE185D] tw-text-white tw-rounded-md tw-text-[14px] tw-px-2"
                                    v-if="user.role === 'user'">
                                    {{ user.isActive ? 'Деактировать' : 'Активировать' }}
                                </button>
                                <button @click="routeToEdit(user.id)"
                                    class="tw-bg-[#0891B2] tw-px-2 tw-rounded-md tw-text-white tw-text-[14px]">изм.</button>
                                <button @click="deleteUser(user.id)"
                                    class="tw-bg-red-600 tw-px-2 tw-rounded-md tw-text-white tw-text-[14px]">уд.</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-mt-4">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                class="tw-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded tw-bg-gray-200 disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed tw-text-[16px]">
                &larr; Previous
            </button>

            <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                :class="page === currentPage ? 'tw-bg-[#0891B2] tw-text-white' : 'tw-bg-gray-200 tw-text-black'"
                class="tw-px-3 tw-py-1 tw-rounded tw-text-[16px] hover:tw-bg-gray-300">
                {{ page }}
            </button>

            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="tw-flex tw-items-center tw-gap-1 tw-px-3 tw-py-1 tw-rounded tw-bg-gray-200 disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed tw-text-[16px]">
                Next &rarr;
            </button>
        </div>


    </div>
</template>
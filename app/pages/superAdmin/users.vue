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
const perPage =20
const loading = ref(false)

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
    loading.value = true
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
    } finally {
        loading.value = false
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
    <div class="tw-pt-7 tw-px-2 sm:tw-px-0">
        <!-- Навигация -->
        <div class="tw-flex tw-items-center tw-gap-2 tw-text-sm">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <span>⤑</span>
            <span class="tw-text-gray-400">Пользователи</span>
        </div>

        <!-- Іздеу және батырмалар -->
        <div class="tw-flex tw-flex-col tw-gap-3 tw-mt-4">
            <!-- Іздеу -->
            <div class="tw-flex tw-flex-col sm:tw-flex-row tw-gap-2">
                <input 
                    @keyup.enter='search' 
                    v-model="searchValue"
                    class="tw-h-[36px] tw-w-full sm:tw-w-[220px] tw-border tw-rounded-lg tw-border-gray-300 tw-px-3"
                    placeholder="Поиск" 
                    type="text"
                >
                <div class="tw-flex tw-gap-2">
                    <button 
                        @click="search"
                        class="tw-bg-[#0891B2] tw-text-white tw-h-[36px] tw-px-4 tw-rounded-lg tw-flex-1 sm:tw-flex-none"
                    >
                        Найти
                    </button>
                    <button 
                        @click="getUsers" 
                        v-if="removeSearchButton"
                        class="tw-bg-red-600 tw-text-white tw-h-[36px] tw-px-3 tw-rounded-lg"
                    >
                        ✕
                    </button>
                </div>
            </div>

            <!-- Батырмалар -->
            <div class="tw-flex tw-gap-2 tw-justify-between sm:tw-justify-end">
                <router-link 
                    to="/superAdmin/trash"
                    class="tw-h-[36px] tw-px-4 tw-rounded-lg tw-bg-red-600 tw-text-white tw-flex tw-items-center tw-text-sm"
                >
                    Корзина
                </router-link>
                <router-link 
                    to="/superAdmin/create"
                    class="tw-h-[36px] tw-px-4 tw-rounded-lg tw-bg-[#0891B2] tw-text-white tw-flex tw-items-center tw-text-sm"
                >
                    + Добавить
                </router-link>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="tw-mt-6 tw-text-center tw-py-8">
            <div class="tw-inline-block tw-animate-spin tw-rounded-full tw-h-8 tw-w-8 tw-border-4 tw-border-[#0891B2] tw-border-t-transparent"></div>
            <p class="tw-mt-2 tw-text-gray-500">Загрузка...</p>
        </div>

        <div v-else class="tw-mt-4 tw-border-t tw-border-gray-200 tw-pt-4">
            <p class="tw-text-gray-500 tw-text-sm">Показано {{ paginatedUsers.length }} из {{ users.length }}</p>

            <!-- 📱 Mobile: Cards -->
            <div class="tw-block lg:tw-hidden tw-mt-4 tw-space-y-3">
                <div 
                    v-for="user in paginatedUsers" 
                    :key="'mobile-' + user.id"
                    class="tw-bg-white tw-rounded-xl tw-shadow tw-p-4"
                >
                    <!-- Header -->
                    <div class="tw-flex tw-justify-between tw-items-start tw-mb-3">
                        <div>
                            <p class="tw-font-semibold tw-text-gray-800">{{ user.name }} {{ user.surname }}</p>
                            <p class="tw-text-xs tw-text-gray-500">ID: {{ user.id }} • {{ user.role }}</p>
                        </div>
                        <span 
                            v-if="user.role === 'user'"
                            :class="user.isActive ? 'tw-bg-green-100 tw-text-green-700' : 'tw-bg-red-100 tw-text-red-700'"
                            class="tw-text-xs tw-px-2 tw-py-1 tw-rounded-full"
                        >
                            {{ user.isActive ? 'Активен' : 'Неактивен' }}
                        </span>
                    </div>

                    <!-- Info Grid -->
                    <div class="tw-grid tw-grid-cols-2 tw-gap-2 tw-text-sm tw-mb-3">
                        <div>
                            <p class="tw-text-gray-400 tw-text-xs">Код</p>
                            <p class="tw-text-gray-700">{{ user.code || '—' }}</p>
                        </div>
                        <div>
                            <p class="tw-text-gray-400 tw-text-xs">Телефон</p>
                            <p class="tw-text-gray-700">{{ user.phoneNumber }}</p>
                        </div>
                        <div>
                            <p class="tw-text-gray-400 tw-text-xs">Пароль</p>
                            <p class="tw-text-gray-700">{{ user.password }}</p>
                        </div>
                        <div>
                            <p class="tw-text-gray-400 tw-text-xs">Состояние</p>
                            <p class="tw-text-gray-700 tw-text-xs">
                                <span v-if="user.role === 'admin'">
                                    {{ user.branch ? user.branch : 'Не привязан' }}
                                </span>
                                <span v-else-if="user.role === 'superAdmin'">{{ user.branch || 'Super' }}</span>
                                <span v-else>{{ formatData(user.createAt) }}</span>
                            </p>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="tw-flex tw-gap-2 tw-pt-3 tw-border-t tw-border-gray-100">
                        <button 
                            v-if="user.role === 'user'"
                            @click="disactive(user.id)"
                            :class="user.isActive ? 'tw-bg-pink-600' : 'tw-bg-green-600'"
                            class="tw-text-white tw-rounded-lg tw-text-sm tw-px-3 tw-py-2 tw-flex-1"
                        >
                            {{ user.isActive ? 'Деакт.' : 'Акт.' }}
                        </button>
                        <button 
                            @click="routeToEdit(user.id)"
                            class="tw-bg-[#0891B2] tw-px-3 tw-py-2 tw-rounded-lg tw-text-white tw-text-sm tw-flex-1"
                        >
                            Изменить
                        </button>
                        <button 
                            @click="deleteUser(user.id)"
                            class="tw-bg-red-600 tw-px-3 tw-py-2 tw-rounded-lg tw-text-white tw-text-sm"
                        >
                            Уд.
                        </button>
                    </div>
                </div>

                <!-- Empty state -->
                <div v-if="!paginatedUsers.length" class="tw-text-center tw-py-8 tw-text-gray-400">
                    Пользователи не найдены
                </div>
            </div>

            <!-- 💻 Desktop: Table -->
            <div class="tw-hidden lg:tw-block tw-overflow-x-auto tw-mt-4">
                <table class="tw-min-w-full tw-border tw-border-gray-300 tw-border-collapse">
                    <thead class="tw-bg-gray-100">
                        <tr>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Код</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Роль</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Телефон</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Фамилия Имя</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Пароль</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Состояние</th>
                            <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in paginatedUsers" :key="'desktop-' + user.id" class="hover:tw-bg-gray-50">
                            <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ user.id }}</td>
                            <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ user.code || '—' }}</td>
                            <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ user.role }}</td>
                            <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ user.phoneNumber }}</td>
                            <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ user.name }} {{ user.surname }}</td>
                            <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">{{ user.password }}</td>
                            <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2">
                                <span v-if="user.role === 'admin'">
                                    <span v-if="user.branch">Администратор {{ user.branch }}</span>
                                    <span v-else>Еще не привязан на склад</span>
                                </span>
                                <span v-if="user.role === 'superAdmin'">{{ user.branch }}</span>
                                <span v-if="user.role === 'user'">
                                    Активировал Super в {{ formatData(user.createAt) }}
                                </span>
                            </td>
                            <td class="tw-border tw-border-gray-300 tw-px-2 tw-py-2">
                                <div class="tw-flex tw-justify-center tw-items-center tw-gap-1 tw-flex-wrap">
                                    <button 
                                        @click="disactive(user.id)"
                                        class="tw-bg-[#BE185D] tw-text-white tw-rounded-md tw-text-[13px] tw-px-2 tw-py-0.5"
                                        v-if="user.role === 'user'"
                                    >
                                        {{ user.isActive ? 'Деакт.' : 'Акт.' }}
                                    </button>
                                    <button 
                                        @click="routeToEdit(user.id)"
                                        class="tw-bg-[#0891B2] tw-px-2 tw-py-0.5 tw-rounded-md tw-text-white tw-text-[13px]"
                                    >
                                        изм.
                                    </button>
                                    <button 
                                        @click="deleteUser(user.id)"
                                        class="tw-bg-red-600 tw-px-2 tw-py-0.5 tw-rounded-md tw-text-white tw-text-[13px]"
                                    >
                                        уд.
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!paginatedUsers.length">
                            <td colspan="8" class="tw-text-center tw-py-8 tw-text-gray-400">
                                Пользователи не найдены
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (Mobile + Desktop) -->
            <div v-if="totalPages > 1" class="tw-flex tw-justify-center tw-items-center tw-gap-1 sm:tw-gap-2 tw-mt-6 tw-flex-wrap">
                <button 
                    @click="changePage(currentPage - 1)" 
                    :disabled="currentPage === 1"
                    class="tw-px-3 tw-py-2 tw-rounded-lg tw-bg-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-text-sm"
                >
                    ←
                </button>

                <template v-for="page in totalPages" :key="page">
                    <button 
                        v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
                        @click="changePage(page)"
                        :class="page === currentPage ? 'tw-bg-[#0891B2] tw-text-white' : 'tw-bg-gray-200'"
                        class="tw-px-3 tw-py-2 tw-rounded-lg tw-text-sm tw-min-w-[40px]"
                    >
                        {{ page }}
                    </button>
                    <span 
                        v-else-if="page === currentPage - 2 || page === currentPage + 2" 
                        class="tw-px-1 tw-text-gray-400"
                    >...</span>
                </template>

                <button 
                    @click="changePage(currentPage + 1)" 
                    :disabled="currentPage === totalPages"
                    class="tw-px-3 tw-py-2 tw-rounded-lg tw-bg-gray-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed tw-text-sm"
                >
                    →
                </button>
            </div>

            <!-- Page info -->
            <p v-if="totalPages > 1" class="tw-text-center tw-text-gray-400 tw-text-xs tw-mt-2">
                Страница {{ currentPage }} из {{ totalPages }}
            </p>
        </div>
    </div>
</template>
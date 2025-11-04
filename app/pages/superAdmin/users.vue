<script setup lang="ts">
const { $axios } = useNuxtApp()
const token = useCookie('token')
const users = ref([])
const currentPage = ref(1)
const perPage = 20

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
    const response = await $axios.get('admin', {
        headers: {
            'Authorization': `Bearer ${token.value}`
        }
    })
    users.value = response.data
    console.log(users.value)
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
                <input class="tw-h-[36px] tw-w-[220px] tw-border-[1px] tw-rounded-[8px] tw-border-gray-300 tw-pl-3"
                    placeholder="Пойск" type="text">
                <button class="tw-bg-[#0891B2] tw-text-white tw-h-[34px] tw-px-3 tw-rounded-[6px]">Найти</button>
            </div>
            <div class="tw-flex tw-gap-2">
                <button class="tw-w-[100px] tw-h-[38px] tw-rounded-[6px] tw-bg-red-600 tw-text-white">Корзина</button>
                <button
                    class="tw-w-[100px] tw-h-[38px] tw-rounded-[6px] tw-bg-[#0891B2] tw-text-white">Добавить</button>
            </div>
        </div>
        <div class="">
            <table class="tw-min-w-full tw-border tw-border-gray-300 tw-border-collapse">
                <thead class="tw-bg-gray-100">
                    <tr>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Код</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Телефон</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Фамиля Имя</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Пароль</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Состояние</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in paginatedUsers" :key="user.id" class="hover:tw-bg-gray-100">
                        <td class="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{{ user.id }}</td>
                        <td class="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{{ user.code }}</td>
                        <td class="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{{ user.phoneNumber }}</td>
                        <td class="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{{ user.name}} {{ user.surname }}</td>
                        <td class="tw-border tw-border-gray-300 tw-px-4 tw-py-2">{{ user.password }}</td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>
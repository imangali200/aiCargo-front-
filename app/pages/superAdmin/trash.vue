<script setup lang="ts">
import type { User } from './users.vue'
import { useToast,POSITION } from 'vue-toastification'
const toast = useToast()


const { $axios } = useNuxtApp()
const token = useCookie('token')
const archiveUsers = ref<User[]>([])

const getKorzina = async () => {
    try {
        const res = await $axios.get('admin/archive', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        archiveUsers.value = res.data || []
    } catch (error) {
        console.log(error)
    }
}
const formatDate = (dateString: string) => {
    if (!dateString) return "—";

    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const restoreUser = async (id: number) => {
    const isConfirm = confirm("Действительно хотите удалить?");

    if (!isConfirm) {
        return; 
    }
    try {
        const restoreData = await $axios.patch(`user/archive/${id}`,{}, {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        if(restoreData.status = 200){
            toast.success('пользователь удален из архива',{
                position:'top-center' as POSITION
            })
        }else{
            toast.warning('пользователь не удален из архива',{
                position:'top-center' as POSITION
            })
        }
        getKorzina()
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    getKorzina()
})
</script>
<template>
    <div class="container tw-mt-7">
        <div class="tw-flex tw-items-center tw-gap-3">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <p>⤑</p>
            <routerLink class="tw-text-blue-600 hover:tw-underline" to="/superAdmin/users">Пользователи</routerLink>
            <p>⤑</p>
            <p class="tw-text-gray-400">Корзина</p>
        </div>
        <div v-if="archiveUsers.length > 0" class="tw-mt-[15px] tw-border-t-[1px]  tw-border-gray-200">
            <table class="tw-min-w-full tw-border tw-mt-[20px] tw-border-gray-300 tw-border-collapse ">
                <thead class="tw-bg-gray-100">
                    <tr>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Код</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Роль</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Телефон</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Фамиля Имя</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Пароль</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Удаление</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in archiveUsers" :key="user.id" class="hover:tw-bg-gray-100">
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w=[20px]">{{ user.id
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
                            <span v-if="user.role === 'superAdmin'">
                                Удалил Super в
                                {{ user.branch }}
                            </span>
                            <span v-else>
                                Удалил Super в
                                {{ formatDate(user.deletedAt!) }}
                            </span>
                        </td>

                        <td class="tw-border tw-border-gray-300 tw-w-[120px]">
                            <div class="tw-flex tw-justify-center tw-items-center tw-gap-1 tw-flex-wrap">
                                <button @click="restoreUser(user.id)"
                                    class="tw-bg-[#0891B2] tw-text-white tw-rounded-md tw-text-[14px] tw-px-2">
                                    восстановить
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="tw-mt-3">
            <p>Нет данных</p>
        </div>

    </div>
</template>
<script setup lang="ts">
import { useToast, POSITION } from 'vue-toastification'
const { $axios } = useNuxtApp()
const token = useCookie('token')
const router = useRouter()
export interface Products {
    id: number
    productId: string
    productName: string
    client_registered: string 
    china_warehouse: string | null
    aicargo: string | null
    given_to_client: string | null
    deletedAt: null | string
}
const toast = useToast()
const products = ref<Products[]>([])
const currentPage = ref(1)
const perPage = 20

const errorMessages = ref<string>('')

const removeSearchButton = ref<boolean>(false)

const searchValue = ref<string>("")


const routeToEdit = (id: number) => {
    router.push(`edit/${id}`)
}

const paginatedUsers = computed(() => {
    if (!products) {
        return []
    }
    const start = (currentPage.value - 1) * perPage
    return products.value.slice(start, start + perPage)
})
const totalPages = computed(() => {
    return Math.ceil(products.value.length / perPage)
})

function changePage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

async function getProducts() {
    try {
        const response = await $axios.get('products', {
            headers: {
                'Authorization': `Bearer ${token.value}`
            }
        })
        products.value = response.data
        searchValue.value = ''
        removeSearchButton.value = false
        errorMessages.value = ''
    } catch (error) {
        console.log(error)
    }
}

const search = async () => {
    try {
        const res = await $axios.get('products/productId', {
            params: { productId: searchValue.value },
            headers: { Authorization: `Bearer ${token.value}` }
        })
        if (res.data.status === 404) {
            products.value = []
            errorMessages.value = 'Товар не найден'
            removeSearchButton.value = true
            return
        }

        products.value = res.data
        removeSearchButton.value = true
    } catch (error) {
        console.log(error)
    }

}
const toIstory = (productId:string)=>{
    router.push(`/superAdmin/track/${productId}`)
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
    getProducts()
})
</script>
<template>
    <div class="tw-pt-7">
        <div class="tw-flex tw-items-center tw-gap-3">
            <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
            <p>⤑</p>
            <p class="tw-text-gray-400">Товары</p>
        </div>
        <div
            class="tw-flex tw-flex-col tw-items-start tw-gap-3 sm:tw-flex-row  tw-justify-between sm:tw-items-center sm:tw-gap-0 tw-mt-4">
            <div class="tw-flex tw-gap-2">
                <input @keyup.enter='search' v-model="searchValue"
                    class="tw-h-[36px] tw-w-[220px] tw-border-[1px] tw-rounded-[8px] tw-border-gray-300 tw-pl-3"
                    placeholder="Пойск" type="text">
                <button @click="search"
                    class="tw-bg-[#0891B2] tw-text-white tw-h-[34px] tw-px-3 tw-rounded-[6px]">Найти</button>
                <button @click="getProducts" v-if="removeSearchButton"
                    class="tw-bg-red-600 tw-text-white tw-h-[34px] tw-px-3 tw-rounded-[6px]">Очистить пойск</button>
            </div>
        </div>

        <div class="tw-mt-[15px] tw-border-t-[1px]  tw-border-gray-200">
            <p class="tw-mt-4 tw-text-gray-500">Показано {{ products.length }} результатов</p>
            <table class="tw-min-w-full tw-border tw-mt-[20px] tw-border-gray-300 tw-border-collapse ">
                <thead class="tw-bg-gray-100">
                    <tr>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">#ID</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Трек</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Состояния</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Дата и время создания</th>
                        <th class="tw-border tw-border-gray-300 tw-px-4 tw-py-2 tw-text-left">Подробнее</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in paginatedUsers" :key="product.id" class="hover:tw-bg-gray-100">
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w-[20px]">{{
                            product.id
                            }}</td>
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w-[200px]">{{
                            product.productId }}</td>
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w-[200px]">
                            <div v-if="product.aicargo || product.china_warehouse || product.given_to_client">
                                Находится в Склад в Китае с
                                {{ product.china_warehouse
                                    ? product.china_warehouse
                                    : product.aicargo
                                        ? product.aicargo
                                        : product.given_to_client
                                }}
                            </div>
                            <div v-else>
                                <p>Продукт не на складе</p>
                            </div>

                        </td>
                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-px-4 tw-py-2 tw-w-[160px]">{{
                            formatData(product.client_registered) }}</td>

                        <td class="tw-border tw-text-[14px] tw-border-gray-300 tw-w-[160px] tw-px-4 tw-py-2">
                            <button class="tw-bg-[#0891B2] tw-text-white tw-p-1 tw-rounded-[4px]" @click="toIstory(product.productId)">История</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p class="tw-text-red-400 tw-mt-3">{{ errorMessages }}</p>
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
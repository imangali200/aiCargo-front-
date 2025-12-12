<template>
  <div class="tw-mt-7">

    <!-- Title -->
    <div class="tw-flex tw-items-center tw-gap-4">
      <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
      <p>⤑</p>
      <p class="tw-text-gray-400">Принять товары</p>
    </div>

    <!-- Input -->
    <div class="tw-mt-3 tw-border-t-[1px] tw-border-b-[1px]">
      <div class="tw-flex tw-gap-2 tw-py-5">
        <input 
          v-model="productId" 
          @keydown.enter="addProduct"
          class="tw-px-3 tw-py-1 tw-rounded-lg tw-border-[2px]"
          placeholder="Введите штрих-код"
          type="text"
        >
        <button 
          @click="addProduct"
          class="tw-bg-green-600 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg"
        >
          Добавить
        </button>
      </div>
    </div>

    <!-- Тізім -->
    <div v-if="addedProducts.length" class="tw-mt-4 tw-bg-white tw-p-4 tw-rounded-xl tw-shadow">
      <p class="tw-text-lg tw-font-semibold tw-mb-3">Добавленные товары:</p>

      <ul class="tw-space-y-2">
        <li 
          v-for="(item, index) in addedProducts" 
          :key="index"
          class="tw-border tw-p-3 tw-rounded-lg tw-bg-gray-50"
        >
          <p><strong>Код:</strong> {{ item.code }}</p>
          <p class="tw-text-green-700"><strong>Статус:</strong> Добавлено</p>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useToast } from "vue-toastification"
const toast = useToast()

const { $axios } = useNuxtApp()
const token = useCookie("token")

const productId = ref("")
const addedProducts = ref<Array<{ code: string }>>([])

const addProduct = async () => {
  if (!productId.value.trim()) {
    toast.error("Поле пустое!")
    return
  }

  try {
    await $axios.post(
      "/admin/tracks",
      { productId: productId.value },
      { headers: { Authorization: `Bearer ${token.value}` } }
    )

    // 🔥 Тізімге қосамыз
    addedProducts.value.push({
      code: productId.value,
    })

    toast.success("Товар добавлен!")

    // Инпутты тазалау
    productId.value = ""

  } catch (error) {
    toast.error("Ошибка при добавлении!")
    console.log(error)
  }
}
</script>

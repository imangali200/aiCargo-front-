<template>
  <div class="tw-mt-7">

    <!-- Навигация -->
    <div class="tw-flex tw-items-center tw-gap-2">
      <router-link class="tw-text-blue-600 hover:tw-underline" to="/superAdmin">Главная</router-link>
      <span>⤑</span>
      <span class="tw-text-gray-400">Импорт трек коды</span>
    </div>

    <!-- Белый блок -->
    <div class="tw-mt-4 tw-bg-white tw-p-6 tw-rounded-2xl tw-shadow-md">

      <!-- Upload -->
      <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-3 tw-items-start md:tw-items-center">

        <input 
          type="file" 
          accept=".xlsx,.txt"
          @change="onFileChange" 
          class="tw-border tw-rounded-lg tw-px-3 tw-py-2 tw-w-full md:tw-w-[350px]"
        >

        <button 
          @click="uploadFile"
          class="tw-bg-green-600 tw-w-full md:tw-w-auto tw-text-white tw-py-2 tw-px-4 tw-rounded-lg"
        >
          Загрузить
        </button>
      </div>

      <p class="tw-text-red-600 tw-mt-2 tw-text-sm">
        * Максимум 900 трек. Если больше — разделите на части и импортируйте заново.
      </p>

      <hr class="tw-my-4">

      <p class="tw-font-semibold">! Пример:</p>
      <p class="tw-text-gray-600 tw-text-sm">
        Трек коды должны быть размещено начиная с первого столбца (A), и файл должен быть в формате .xlsx или .txt
      </p>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()

const { $axios } = useNuxtApp()
const token = useCookie('token')

const selectedFile = ref<File | null>(null)

const onFileChange = (e: any) => {
  selectedFile.value = e.target.files[0]
}

const uploadFile = async () => {
  if (!selectedFile.value) {
    toast.error("Файл не выбран!")
    return
  }

  try {
    const formData = new FormData()
    formData.append("file", selectedFile.value)
    formData.append("time", new Date().toISOString().slice(0, 16).replace("T", " "))

    const res = await $axios.post(
      "/admin/tracks/uploads",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "multipart/form-data"
        }
      }
    )

    toast.success("Файл успешно загружен!")
    console.log(res)

  } catch (err) {
    toast.error("Ошибка при загрузке файла")
    console.log(err)
  }
}
</script>

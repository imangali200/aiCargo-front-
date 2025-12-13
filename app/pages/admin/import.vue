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
      <div class="tw-flex tw-flex-col tw-gap-3">
        
        <!-- File input -->
        <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-3 tw-items-start md:tw-items-center">
          <label class="tw-text-gray-700 tw-font-medium tw-w-[120px]">Файл:</label>
          <div class="tw-flex tw-items-center tw-gap-2 tw-w-full md:tw-w-[350px]">
            <input 
              ref="fileInput"
              type="file" 
              accept=".xlsx,.txt"
              @change="onFileChange" 
              class="tw-hidden"
            >
            <button 
              type="button"
              @click="openFilePicker"
              class="tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-text-sm hover:tw-bg-blue-700"
            >
              Файл таңдау
            </button>
            <span class="tw-text-gray-500 tw-text-sm tw-truncate">{{ selectedFile ? selectedFile.name : 'Файл таңдалмаған' }}</span>
          </div>
        </div>

        <!-- Time input -->
        <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-3 tw-items-start md:tw-items-center">
          <label class="tw-text-gray-700 tw-font-medium tw-w-[120px]">Уақыт:</label>
          <input 
            type="datetime-local"
            v-model="selectedTime"
            class="tw-border tw-rounded-lg tw-px-3 tw-py-2 tw-w-full md:tw-w-[350px]"
          >
        </div>

        <!-- Upload button -->
        <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-3 tw-items-start md:tw-items-center">
          <div class="tw-w-[120px] tw-hidden md:tw-block"></div>
          <button 
            @click="uploadFile"
            :disabled="loading"
            class="tw-bg-green-600 tw-w-full md:tw-w-auto tw-text-white tw-py-2 tw-px-4 tw-rounded-lg disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
          >
            <span v-if="loading">Жүктелуде...</span>
            <span v-else>Загрузить</span>
          </button>
        </div>
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
import { useToast } from '~/composables/useToast'
const toast = useToast()

const { $axios } = useNuxtApp()
const token = useCookie('token')

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const selectedTime = ref<string>(getDefaultTime())
const loading = ref<boolean>(false)

// Қазіргі уақытты datetime-local форматында алу
function getDefaultTime(): string {
  const now = new Date()
  return now.toISOString().slice(0, 16) // "YYYY-MM-DDTHH:mm" форматы
}

// Уақытты API форматына түрлендіру: "YYYY-MM-DD HH:mm"
function formatTimeForApi(datetimeLocal: string): string {
  return datetimeLocal.replace("T", " ")
}

const openFilePicker = () => {
  fileInput.value?.click()
}

const onFileChange = (e: any) => {
  selectedFile.value = e.target.files[0]
}

const uploadFile = async () => {
  if (!selectedFile.value) {
    toast.error("Файл не выбран!")
    return
  }

  if (!selectedTime.value) {
    toast.error("Уақыт таңдалмаған!")
    return
  }

  loading.value = true

  try {
    const formData = new FormData()
    formData.append("file", selectedFile.value)
    formData.append("time", formatTimeForApi(selectedTime.value))

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

    toast.success("Файл сәтті жүктелді!")
    console.log(res)

  } catch (err) {
    toast.error("Файлды жүктеу кезінде қате болды")
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

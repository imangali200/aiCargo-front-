<template>
  <div class="tw-bg-[#E5E7EB] tw-h-[100vh] tw-py-6 tw-px-5">
    <div class="tw-max-w-[670px] tw-mx-auto">
      <img class="logo tw-w-[208px] tw-h-[196] tw-mx-auto" src="https://ai-cargo.kz/images/logo.png" alt="" />
      <div class="tw-bg-white tw-rounded-[10px] tw-p-10 tw-mt-9">
        <form @submit.prevent='postLogin' class="tw-flex tw-flex-col tw-gap-5" action="">
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="phoneNumber">Телефон</label>
            <input v-model="phoneValue" ref="phoneInput" type="text" id="phoneNumber" placeholder="8701 001 0101"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent tw-text-[15px]" />
            <p class="tw-text-[14px] tw-text-red-500">{{ errorPhoneNumber }}</p>
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="password">Пароль</label>
            <input v-model="passwordValue" type="text" id="password" placeholder="Введите пароль"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
            <p class="tw-text-[14px] tw-text-red-500">{{ errorMessage }}</p>
          </div>

          <button type="submit" class="tw-bg-[#0891B2] tw-text-white tw-w-full tw-h-[36px] tw-rounded-md">
            Войти
          </button>
          <p class="tw-border-t-[1px] tw-border-gray-200 tw-pt-3 tw-text-[15px] tw-text-gray-600">
            У вас еще нет аккаунта?
            <RouterLink to="/auth/register" class="tw-text-black tw-font-[400] tw-text-[15px]">Зарегистрироваться
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import IMask from "imask";

const { $axios } = useNuxtApp();

definePageMeta({
  layout: "auth",
});

export interface myJwtPayload {
  exp: number,
  iat: number,
  id: string,
  phoneNumber: string,
  role: string,
  type: string
}

const phoneInput = ref<HTMLInputElement | null>(null);
const phoneValue = ref<string>("");
const passwordValue = ref<string>("");
const errorMessage = ref<string>('')
const errorPhoneNumber = ref<string>('')

async function postLogin() {
  if (!phoneValue.value || !passwordValue.value) {
    errorMessage.value = 'Пожалуйста, заполните все поля'
    return
  }
  try {
    const res = await $axios.post('auth/login', {
      phoneNumber: phoneValue.value.replace(/\s+/g, ''),
      password: passwordValue.value
    })

    if (res.data.accessToken) {
      const token = useCookie('token')
      token.value = res.data.accessToken
      errorMessage.value = ''
      return navigateTo('/')
    } else {
      if (res.data.response.statusCode === 404) {
        errorPhoneNumber.value = 'Неверный номер'
        return
      }
      else if (res.data.response.statusCode === 400) {
        errorMessage.value = 'Неверный пароль'
        errorPhoneNumber.value = ''
        return
      }
    }
  } catch (err: any) {
    errorMessage.value = 'Произошла ошибка при входе'
  }
}
onMounted(() => {
  if (phoneInput.value) {
    IMask(phoneInput.value, {
      mask: "8000 000 00 00",
    });
  }
});
</script>

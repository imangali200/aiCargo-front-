<template>
  <div class="tw-bg-[#E5E7EB] tw-h-full tw-py-6 tw-px-5 tw-pb-[50px]">
    <div class="tw-max-w-[670px] tw-mx-auto">
      <img class="logo tw-w-[208px] tw-h-[196] tw-mx-auto" src="https://ai-cargo.kz/images/logo.png" alt="" />
      <div class="tw-bg-white tw-rounded-[10px] tw-p-10 tw-mt-9">
        <form class="tw-flex tw-flex-col tw-gap-5" @submit.prevent='postRegister' action="">
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="phoneNumber">Телефон</label>
            <input v-model="phoneNumber" ref="phoneInput" type="text" id="phoneNumber" placeholder="8701 001 0101"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent tw-text-[15px]" />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="password">Пароль</label>
            <select id="password" v-model="selectBranch"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-bg-transparent">
              <option value="">Выберите склад</option>
              <option v-for="branch in branches" :key="branch.id" :value="branch.branchName">
                {{ branch.branchName }}
              </option>
            </select>
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="code">Код</label>
            <input type="text" id="code" v-model="codeUser"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="name">Имя на английском</label>
            <input id="name" type="text" v-model="name"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="surname">Фамилия на английском</label>
            <input type="text" id="surname" v-model="surname"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]" for="password">Пароль</label>
            <input type="text" id="password" placeholder="Придумайте пароль" v-model="password"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent" />
            <p class="tw-text-[14px] tw-text-red-500">{{ errorMessage }}</p>
          </div>
          <button type="submit" class="tw-bg-[#0891B2] tw-text-white tw-w-full tw-h-[37px] tw-rounded-md">
            Регистрация
          </button>
          <p class="tw-border-t-[1px] tw-border-gray-200 tw-pt-3 tw-text-[15px] tw-text-gray-600">
            Вы уже зарегистрированы?
            <RouterLink to="login" class="tw-text-black tw-font-[400] tw-text-[15px]">
              Войти</RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import IMask from "imask";

definePageMeta({
  layout: "auth",
});

interface Branch {
  branchName: string,
  deleteAt: string,
  id: number,
  responsibleName: string
}

const phoneNumber = ref<string>('')
const selectBranch = ref<string>('')
const codeUser = ref<string>('')
const name = ref<string>('')
const surname = ref<string>('')
const password = ref<string>('')

const errorMessage = ref<string>('')

const { $axios } = useNuxtApp()
const branches = ref<Branch[]>([])

async function getBranches() {
  const res = await $axios.get('branch')
  const data = res.data
  branches.value = data
}

async function postRegister() {
  if (
    !phoneNumber.value ||
    !codeUser.value ||
    !name.value ||
    !surname.value ||
    !selectBranch.value ||
    !password.value
  ) {
    errorMessage.value = 'Пожалуйста, заполните все поля'
    return
  }
  try {
    const response = await $axios.post('auth/register', {
      phoneNumber: phoneNumber.value,
      code: codeUser.value,
      name: name.value,
      surname: surname.value,
      branch: selectBranch.value,
      password: password.value
    })
    const datas = response.data

    if (datas.accessToken) {
      const token = useCookie('token')
      token.value = datas.accessToken
      return navigateTo('/')
    }
  } catch (error) {
    return error
  }
}

const phoneInput = ref(null);
onMounted(() => {
  if (phoneInput.value) {
    IMask(phoneInput.value, {
      mask: "8000 000 00 00",
    });
  }
  getBranches()
});
</script>
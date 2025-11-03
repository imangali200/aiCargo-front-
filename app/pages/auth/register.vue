<template>
  <div class="tw-bg-[#E5E7EB] tw-h-[100vh] tw-py-6">
    <div class="tw-max-w-[670px] tw-mx-auto">
      <img
        class="logo tw-w-[208px] tw-h-[196] tw-mx-auto"
        src="https://ai-cargo.kz/images/logo.png"
        alt=""
      />
      <div class="tw-bg-white tw-rounded-[10px] tw-p-10 tw-mt-9">
        <form class="tw-flex tw-flex-col tw-gap-5" action="">
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label
              class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]"
              for="phoneNumber"
              >Телефон</label
            >
            <input
              ref="phoneInput"
              type="text"
              id="phoneNumber"
              placeholder="8701 001 0101"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent tw-text-[15px]"
            />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label
              class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]"
              for="password"
              >Пароль</label
            >
            <input
              type="text"
              id="password"
              placeholder="Введите пароль"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent"
            />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label
              class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]"
              for="code"
              >Код</label
            >
            <input
              type="text"
              id="code"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent"
            />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label
              class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]"
              for="name"
              >Имя на английском</label
            >
            <input
              id="name"
              type="text"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent"
            />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label
              class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]"
              for="surname"
              >Фамилия на английском</label
            >
            <input
              type="text"
              id="surname"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent"
            />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-1">
            <label
              class="tw-text-[14px] tw-font-[400] tw-text-[#4B5563]"
              for="password"
              >Пароль</label
            >
            <input
              type="text"
              id="password"
              placeholder="Придумайте пароль"
              class="tw-border-[1px] tw-border-gray-300 tw-rounded-md tw-h-[36px] tw-px-2 tw-bg-transparent"
            />
          </div>
          <button
            class="tw-bg-[#0891B2] tw-text-white tw-w-full tw-h-[37px] tw-rounded-md"
          >
            Регистрация
          </button>
          <p
            class="tw-border-t-[1px] tw-border-gray-200 tw-pt-3 tw-text-[15px] tw-text-gray-600"
          >
            Вы уже зарегистрированы?
            <RouterLink to="login" class="tw-text-black tw-font-[400] tw-text-[16px]">
              Войти</RouterLink
            >
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import IMask from "imask";

definePageMeta({
  layout: "auth",
});
const phoneInput = ref(null);
onMounted(() => {
  if (phoneInput.value) {
    IMask(phoneInput.value, {
      mask: "8000 000 00 00",
    });
  }
});
</script>
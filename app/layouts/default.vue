<script setup lang="ts">
import Header from '~/components/header.vue';
</script>

<template>
  <div class="tw-min-h-screen tw-flex tw-flex-col tw-bg-gradient-to-br tw-from-[#0f172a] tw-via-[#1e293b] tw-to-[#0f172a] tw-font-outfit tw-relative tw-overflow-x-hidden">
    <!-- Animated background -->
    <div class="tw-fixed tw-inset-0 tw-overflow-hidden tw-pointer-events-none tw-z-0">
      <div class="floating-shape tw-absolute tw-w-[500px] tw-h-[500px] tw-rounded-full tw-blur-[100px] tw-opacity-40 tw-bg-gradient-to-br tw-from-cyan-500 tw-to-cyan-600 tw--top-[150px] tw--right-[100px]" style="animation-delay: 0s;"></div>
      <div class="floating-shape tw-absolute tw-w-[400px] tw-h-[400px] tw-rounded-full tw-blur-[100px] tw-opacity-40 tw-bg-gradient-to-br tw-from-violet-500 tw-to-indigo-500 tw--bottom-[100px] tw--left-[100px]" style="animation-delay: -5s;"></div>
      <div class="floating-shape tw-absolute tw-w-[300px] tw-h-[300px] tw-rounded-full tw-blur-[100px] tw-opacity-40 tw-bg-gradient-to-br tw-from-amber-500 tw-to-orange-500 tw-top-1/2 tw-left-[20%]" style="animation-delay: -10s;"></div>
      <div class="floating-shape tw-absolute tw-w-[250px] tw-h-[250px] tw-rounded-full tw-blur-[100px] tw-opacity-40 tw-bg-gradient-to-br tw-from-emerald-500 tw-to-green-600 tw-bottom-[30%] tw-right-[10%]" style="animation-delay: -15s;"></div>
    </div>

    <Header class="tw-w-full" />

    <div class="tw-flex-1 tw-relative tw-z-10">
      <div class="tw-max-w-[1400px] tw-mx-auto tw-px-4 md:tw-px-10 lg:tw-px-16">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.tw-font-outfit {
  font-family: 'Inter', sans-serif;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(40px, -40px) rotate(90deg); }
  50% { transform: translate(-30px, 30px) rotate(180deg); }
  75% { transform: translate(-40px, -30px) rotate(270deg); }
}

.floating-shape {
  animation: float 25s infinite ease-in-out;
}
</style>

<script setup lang="ts">
import Header from '~/components/header.vue';

</script>
<template>
  <div class="tw-flex tw-flex-col tw-min-h-screen">
    <Header class="tw-w-full tw-h-[80px]" />

    <div class="tw-flex-1 tw-w-full tw-bg-[#F3F4F5] ">
      <div class="lg:tw-px-[144px] md:tw-px-[80px] tw-px-[10px]">
        <slot />
      </div>
    </div>
  </div>
</template>
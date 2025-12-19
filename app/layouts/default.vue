<script setup lang="ts">
import Header from '~/components/header.vue'
import BottomNav from '~/components/BottomNav.vue'
</script>

<template>
    <div class="threads-app">
        <Header />
        <main class="threads-main">
            <div class="threads-container">
                <slot />
            </div>
        </main>
        <BottomNav />
    </div>
</template>

<style scoped>
.threads-app { min-height: 100vh; width: 100%; background: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
.threads-main { flex: 1; padding-bottom: 70px; }
.threads-container { max-width: 620px; margin: 0 auto; padding: 0 16px; }
</style>

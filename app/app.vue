<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html, body, #__nuxt {
  background: #0a0a0a !important;
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for iOS */
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

/* PWA Standalone mode - safe area for notched devices */
@supports (padding-top: env(safe-area-inset-top)) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}

/* Hide Safari UI completely in standalone mode */
@media all and (display-mode: standalone) {
  html, body {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
  }
  
  #__nuxt {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: 100%;
  }
}
</style>

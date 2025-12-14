<template>
  <div class="auth-container">
    <!-- Animated background -->
    <div class="bg-pattern">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>

    <div class="auth-card">
      <!-- Logo section -->
      <div class="logo-section">
        <div class="logo-wrapper">
          <img class="logo" src="https://ai-cargo.kz/images/logo.png" alt="AI Cargo" />
        </div>
        <h1 class="welcome-text">Новый аккаунт</h1>
        <p class="subtitle">Заполните данные для регистрации</p>
      </div>

      <!-- Form section -->
      <form @submit.prevent="postRegister" class="auth-form">
        <!-- Phone Number -->
        <div class="input-group">
          <div class="input-wrapper" :class="{ 'focused': phoneFocused }">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <input 
              v-model="phoneNumber" 
              ref="phoneInput" 
              type="text" 
              placeholder="8701 001 0101"
              @focus="phoneFocused = true"
              @blur="phoneFocused = false"
            />
            <label>Номер телефона</label>
          </div>
        </div>

        <!-- Branch Select -->
        <div class="input-group">
          <div class="input-wrapper select-wrapper" :class="{ 'focused': branchFocused }">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <select 
              v-model="selectBranch"
              @focus="branchFocused = true"
              @blur="branchFocused = false"
            >
              <option value="">Выберите склад</option>
              <option v-for="branch in branches" :key="branch.id" :value="branch.branchName">
                {{ branch.branchName }}
              </option>
            </select>
            <label>Склад</label>
            <div class="select-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Two columns for code and name -->
        <div class="input-row">
          <!-- Code -->
          <div class="input-group">
            <div class="input-wrapper" :class="{ 'focused': codeFocused }">
              <div class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <input 
                v-model="codeUser" 
                type="text" 
                placeholder="Ai-000"
                @focus="codeFocused = true"
                @blur="codeFocused = false"
                @input="ensureAiPrefix"
              />
              <label>Код</label>
            </div>
          </div>

          <!-- Name -->
          <div class="input-group">
            <div class="input-wrapper" :class="{ 'focused': nameFocused }">
              <div class="input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input 
                v-model="name" 
                type="text" 
                placeholder="Name"
                @focus="nameFocused = true"
                @blur="nameFocused = false"
              />
              <label>Имя (на английском)</label>
            </div>
          </div>
        </div>

        <!-- Surname -->
        <div class="input-group">
          <div class="input-wrapper" :class="{ 'focused': surnameFocused }">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <input 
              v-model="surname" 
              type="text" 
              placeholder="Surname"
              @focus="surnameFocused = true"
              @blur="surnameFocused = false"
            />
            <label>Фамилия (на английском)</label>
          </div>
        </div>

        <!-- Password -->
        <div class="input-group">
          <div class="input-wrapper" :class="{ 'has-error': errorMessage, 'focused': passwordFocused }">
            <div class="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Придумайте пароль"
              @focus="passwordFocused = true"
              @blur="passwordFocused = false"
            />
            <label>Пароль</label>
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <p class="error-text" v-if="errorMessage">{{ errorMessage }}</p>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Регистрация</span>
          <div v-else class="loader"></div>
        </button>

        <div class="divider">
          <span>или</span>
        </div>

        <div class="register-link">
          <p>Уже есть аккаунт?</p>
          <RouterLink to="/auth/login" class="link-btn">
            Войти
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import IMask from "imask";

definePageMeta({
  layout: "auth",
});

export interface Branch {
  branchName: string;
  deleteAt: string;
  id: number;
  responsibleName: string;
}

const { $axios } = useNuxtApp();

const phoneNumber = ref<string>("");
const selectBranch = ref<string>("");
const codeUser = ref<string>("Ai-");
const name = ref<string>("");
const surname = ref<string>("");
const password = ref<string>("");
const errorMessage = ref<string>("");
const showPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);

// Focus states
const phoneFocused = ref<boolean>(false);
const branchFocused = ref<boolean>(false);
const codeFocused = ref<boolean>(false);
const nameFocused = ref<boolean>(false);
const surnameFocused = ref<boolean>(false);
const passwordFocused = ref<boolean>(false);

const branches = ref<Branch[]>([]);

function ensureAiPrefix() {
  if (!codeUser.value.startsWith("Ai-")) {
    codeUser.value = "Ai-" + codeUser.value.replace(/^Ai-?/i, "");
  }
}

async function getBranches() {
  try {
    const res = await $axios.get("branch");
    const data = res.data;
    branches.value = data;
  } catch (error) {
    console.error("Failed to load branches:", error);
  }
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
    errorMessage.value = "Заполните все поля";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await $axios.post("auth/register", {
      phoneNumber: phoneNumber.value.replace(/\s+/g, ""),
      code: codeUser.value,
      name: name.value,
      surname: surname.value,
      branch: selectBranch.value,
      password: password.value,
    });
    const datas = response.data;

    if (datas.accessToken) {
      const token = useCookie("token");
      token.value = datas.accessToken;
      return navigateTo("/");
    }
  } catch (error) {
    errorMessage.value = "Произошла ошибка при регистрации";
  } finally {
    isLoading.value = false;
  }
}

const phoneInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (phoneInput.value) {
    IMask(phoneInput.value, {
      mask: "8000 000 00 00",
    });
  }
  getBranches();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
}

.bg-pattern {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  bottom: -50px;
  left: -50px;
  animation-delay: -5s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: linear-gradient(135deg, #ec4899, #f43f5e);
  top: 40%;
  left: 15%;
  animation-delay: -10s;
}

.shape-4 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  bottom: 20%;
  right: 20%;
  animation-delay: -15s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(30px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(-20px, 20px) rotate(180deg);
  }
  75% {
    transform: translate(-30px, -20px) rotate(270deg);
  }
}

.auth-card {
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  position: relative;
  z-index: 10;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  width: 90px;
  height: 90px;
  margin: 0 auto 1.25rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
  border-radius: 20px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.welcome-text {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.4rem;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 500px) {
  .input-row {
    grid-template-columns: 1fr;
  }
  
  .auth-card {
    margin: 1.5rem 0;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.input-wrapper:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.07);
}

.input-wrapper.focused {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.input-wrapper.has-error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.input-wrapper label {
  position: absolute;
  top: -9px;
  left: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  background: linear-gradient(180deg, #1e293b 0%, rgba(30, 41, 59, 0.8) 100%);
  padding: 0 6px;
  border-radius: 4px;
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.input-wrapper.focused .input-icon {
  color: #8b5cf6;
}

.input-wrapper input,
.input-wrapper select {
  flex: 1;
  height: 50px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.95rem;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
  padding-right: 1rem;
}

.input-wrapper select {
  cursor: pointer;
  appearance: none;
  padding-right: 2.5rem;
}

.input-wrapper select option {
  background: #1e293b;
  color: #ffffff;
}

.select-wrapper {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 12px;
  color: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.input-wrapper input::placeholder,
.input-wrapper select::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.toggle-password {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #8b5cf6;
}

.error-text {
  font-size: 0.75rem;
  color: #f87171;
  padding-left: 0.5rem;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.submit-btn {
  height: 52px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.submit-btn:hover::before {
  opacity: 1;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.submit-btn span {
  position: relative;
  z-index: 1;
}

.loader {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.25rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.divider span {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 400;
}

.register-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.register-link p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #8b5cf6;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.link-btn:hover {
  color: #a78bfa;
  gap: 0.75rem;
}

.link-btn svg {
  transition: transform 0.2s ease;
}

.link-btn:hover svg {
  transform: translateX(3px);
}

@media (max-width: 480px) {
  .auth-container {
    padding: 2rem 1rem;
    min-height: auto;
  }
  
  .auth-card {
    padding: 1.75rem 1.25rem;
    margin: 2rem 0;
  }
  
  .welcome-text {
    font-size: 1.4rem;
  }
}
</style>

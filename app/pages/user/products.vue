<script setup lang="ts">
definePageMeta({
    layout: 'default'
})

import { useToast } from '~/composables/useToast'

interface Product {
    id: number
    productId: string
    description: string | null
    client_registered: string | null
    china_warehouse: string | null
    aicargo: string | null
    given_to_client: string | null
}

const { $axios } = useNuxtApp()
const token = useCookie('token')
const toast = useToast()
const router = useRouter()

const allProducts = ref<Product[]>([])
const loading = ref(false)
const searchQuery = ref('')
const isSearchMode = ref(false)
const activeTab = ref<'active' | 'archive'>('active')
const isLoggedIn = computed(() => !!token.value)

const showAddModal = ref(false)
const newTrackCode = ref('')
const newDescription = ref('')
const addLoading = ref(false)

const activeProducts = computed(() => allProducts.value.filter(p => !p.aicargo))
const archivedProducts = computed(() => allProducts.value.filter(p => p.aicargo))
const products = computed(() => activeTab.value === 'active' ? activeProducts.value : archivedProducts.value)

async function getProducts() {
    if (!token.value) return
    loading.value = true
    try {
        const response = await $axios.get('products/my', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        allProducts.value = response.data
    } catch {
        allProducts.value = []
    } finally {
        loading.value = false
    }
}

async function addTrack() {
    if (!newTrackCode.value.trim() || !newDescription.value.trim()) return
    
    addLoading.value = true
    try {
        await $axios.post('products', 
            { productId: newTrackCode.value.trim(), productName: newDescription.value.trim() },
            { headers: { 'Authorization': `Bearer ${token.value}` } }
        )
        toast.success('Трек қосылды!', { position: 'top-center' })
        newTrackCode.value = ''
        newDescription.value = ''
        showAddModal.value = false
        await getProducts()
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Қате', { position: 'top-center' })
    } finally {
        addLoading.value = false
    }
}

async function searchTrack() {
    if (!searchQuery.value.trim()) {
        await getProducts()
        isSearchMode.value = false
        return
    }
    
    loading.value = true
    try {
        const response = await $axios.get('products/' + searchQuery.value.trim(), {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        allProducts.value = response.data ? [response.data] : []
        isSearchMode.value = true
    } catch {
        allProducts.value = []
        isSearchMode.value = true
    } finally {
        loading.value = false
    }
}

async function deleteTrack(e: Event, productId: string) {
    e.stopPropagation()
    if (!confirm('Жою: ' + productId + '?')) return
    
    try {
        await $axios.delete('products/' + productId, {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        toast.success('Жойылды', { position: 'top-center' })
        await getProducts()
    } catch {
        toast.error('Қате', { position: 'top-center' })
    }
}

function getProgress(product: Product) {
    return [product.client_registered, product.china_warehouse, product.aicargo].filter(Boolean).length
}

function formatDate(date: string | null) {
    if (!date) return null
    return new Date(date).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

function viewTrack(productId: string) {
    router.push('/user/track/' + productId)
}

function clearSearch() {
    searchQuery.value = ''
    isSearchMode.value = false
    getProducts()
}

function getSteps(product: Product) {
    return [
        { title: 'Тіркелу', date: product.client_registered, step: 1, color: '#ef4444' },
        { title: 'Қытай', date: product.china_warehouse, step: 2, color: '#eab308' },
        { title: 'AIcargo', date: product.aicargo, step: 3, color: '#22c55e' }
    ]
}

function goToLogin() {
    router.push('/auth/login')
}

onMounted(() => {
    if (token.value) {
        getProducts()
    }
})
</script>

<template>
    <!-- Not logged in -->
    <div v-if="!isLoggedIn" class="login-required">
        <div class="login-card">
            <div class="login-icon">📦</div>
            <h2>Менің тауарларым</h2>
            <p>Тауарларды көру үшін жүйеге кіріңіз</p>
            <button class="login-btn" @click="goToLogin">Кіру</button>
        </div>
    </div>

    <!-- Products page -->
    <div v-else class="products-page">
        <!-- Header -->
        <div class="page-header">
            <h1>Менің тауарларым</h1>
            <button @click="showAddModal = true" class="add-btn">+ Қосу</button>
        </div>

        <!-- Tabs -->
        <div class="page-tabs">
            <button class="page-tab" :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'">
                Белсенді <span class="tab-count">{{ activeProducts.length }}</span>
            </button>
            <button class="page-tab" :class="{ active: activeTab === 'archive' }" @click="activeTab = 'archive'">
                Мұрағат <span class="tab-count">{{ archivedProducts.length }}</span>
            </button>
        </div>

        <!-- Search -->
        <div class="search-box">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input v-model="searchQuery" @keyup.enter="searchTrack" type="text" placeholder="Трек-код бойынша іздеу..." />
            <button v-if="isSearchMode" @click="clearSearch" class="search-clear">✕</button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="!products.length" class="empty">
            <div class="empty-icon">{{ activeTab === 'active' ? '📦' : '✅' }}</div>
            <h3>{{ activeTab === 'active' ? 'Белсенді тауарлар жоқ' : 'Мұрағат бос' }}</h3>
            <p>{{ activeTab === 'active' ? 'Бірінші трегіңізді қосыңыз' : 'Алынған тауарлар осы жерде көрінеді' }}</p>
            <button v-if="activeTab === 'active'" @click="showAddModal = true" class="btn-primary">+ Трек қосу</button>
        </div>

        <!-- Products List -->
        <div v-else class="products-list">
            <div v-for="product in products" :key="product.id" class="product-card" @click="viewTrack(product.productId)">
                <div class="card-header" :class="{ archived: activeTab === 'archive' }">
                    <div class="card-header-info">
                        <span class="card-label">Трек-код</span>
                        <h2 class="card-code">{{ product.productId.toUpperCase() }}</h2>
                    </div>
                    <button @click="deleteTrack($event, product.productId)" class="card-delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                    </button>
                </div>
                <div class="card-progress" :class="{ archived: activeTab === 'archive' }">
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: (getProgress(product) / 3 * 100) + '%' }"></div>
                    </div>
                </div>
                <div class="card-desc">
                    <span class="desc-label">Сипаттама</span>
                    <p class="desc-text">{{ product.description || 'Көрсетілмеген' }}</p>
                </div>
                <div class="card-timeline">
                    <div v-for="step in getSteps(product)" :key="step.step" class="timeline-row">
                        <div class="timeline-dot" :class="{ active: step.date }" :style="step.date ? { background: step.color } : {}">
                            <svg v-if="step.date" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                            <span v-else>{{ step.step }}</span>
                        </div>
                        <span class="timeline-title" :class="{ active: step.date }">{{ step.title }}</span>
                        <span class="timeline-date" :style="step.date ? { color: step.color } : {}">
                            {{ step.date ? formatDate(step.date) : '—' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Modal -->
        <Teleport to="body">
            <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
                <div class="modal">
                    <div class="modal-header">
                        <button @click="showAddModal = false" class="modal-cancel">Бас тарту</button>
                        <h3>Жаңа трек</h3>
                        <button @click="addTrack" :disabled="addLoading || !newTrackCode.trim() || !newDescription.trim()" class="modal-submit">{{ addLoading ? '...' : 'Қосу' }}</button>
                    </div>
                    <div class="modal-body">
                        <input v-model="newTrackCode" type="text" placeholder="Трек-код" class="modal-input" />
                        <textarea v-model="newDescription" placeholder="Тауар сипаттамасы..." rows="4" class="modal-textarea"></textarea>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
.login-required { min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.login-card { text-align: center; padding: 40px 24px; border: 1px solid #333; border-radius: 20px; max-width: 320px; }
.login-icon { font-size: 64px; margin-bottom: 16px; }
.login-card h2 { font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 8px; }
.login-card p { font-size: 15px; color: #777; margin: 0 0 24px; }
.login-btn { width: 100%; padding: 14px 24px; background: #fff; color: #000; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; }
.login-btn:hover { background: #eee; }

.products-page { padding: 16px 0; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.page-header h1 { font-size: 24px; font-weight: 700; color: #fff; margin: 0; }
.add-btn { padding: 10px 20px; background: #fff; border: none; border-radius: 20px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; }
.add-btn:hover { background: #e5e5e5; }

.page-tabs { display: flex; gap: 0; margin-bottom: 16px; border-bottom: 1px solid #222; }
.page-tab { flex: 1; padding: 14px 0; background: transparent; border: none; border-bottom: 2px solid transparent; color: #666; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-bottom: -1px; display: flex; align-items: center; justify-content: center; gap: 8px; }
.page-tab.active { color: #fff; border-bottom-color: #fff; }
.tab-count { background: #333; padding: 2px 8px; border-radius: 10px; font-size: 13px; }
.page-tab.active .tab-count { background: #fff; color: #000; }

.search-box { display: flex; align-items: center; gap: 12px; padding: 0 16px; background: #111; border: 1px solid #333; border-radius: 12px; margin-bottom: 20px; }
.search-icon { color: #555; flex-shrink: 0; }
.search-box input { flex: 1; height: 44px; background: transparent; border: none; outline: none; color: #fff; font-size: 15px; }
.search-box input::placeholder { color: #555; }
.search-clear { background: transparent; border: none; color: #555; cursor: pointer; padding: 8px; }

.loading { display: flex; justify-content: center; padding: 60px 0; }
.spinner { width: 24px; height: 24px; border: 2px solid #333; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty { text-align: center; padding: 60px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty h3 { font-size: 18px; font-weight: 600; color: #fff; margin: 0 0 8px; }
.empty p { color: #777; margin: 0 0 20px; }
.btn-primary { padding: 12px 24px; background: #fff; border: none; border-radius: 20px; color: #000; font-size: 15px; font-weight: 600; cursor: pointer; }

.products-list { display: flex; flex-direction: column; gap: 28px; }

.product-card { background: #000; border-radius: 20px; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
.product-card:hover { transform: scale(1.01); }

.card-header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 16px 20px; display: flex; justify-content: space-between; align-items: flex-start; }
.card-header.archived { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }
.card-header-info { display: flex; flex-direction: column; gap: 2px; }
.card-label { font-size: 12px; color: rgba(255,255,255,0.7); }
.card-code { font-size: 22px; font-weight: 800; color: #fff; margin: 0; letter-spacing: 1px; }
.card-delete { width: 36px; height: 36px; background: rgba(255,255,255,0.2); border: none; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; }
.card-delete:hover { background: rgba(255,255,255,0.3); }
.card-progress { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 0 20px 16px; }
.card-progress.archived { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); }
.progress-bar { height: 5px; background: rgba(255,255,255,0.3); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: #fff; border-radius: 3px; }

.card-desc { background: #1a1a1a; padding: 14px 20px; }
.desc-label { font-size: 12px; color: #666; display: block; margin-bottom: 2px; }
.desc-text { font-size: 15px; color: #fff; margin: 0; }

.card-timeline { background: #000; padding: 8px 0; }
.timeline-row { display: flex; align-items: center; padding: 10px 20px; gap: 12px; }
.timeline-dot { width: 26px; height: 26px; border-radius: 50%; background: #333; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #666; flex-shrink: 0; }
.timeline-dot.active { color: #fff; }
.timeline-title { flex: 1; font-size: 15px; color: #555; font-weight: 500; }
.timeline-title.active { color: #fff; }
.timeline-date { font-size: 13px; color: #444; font-weight: 500; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: flex-start; justify-content: center; z-index: 1000; }
.modal { width: 100%; max-width: 600px; background: #000; min-height: 100vh; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #222; }
.modal-header h3 { font-size: 16px; font-weight: 700; color: #fff; margin: 0; }
.modal-cancel { background: transparent; border: none; color: #fff; font-size: 15px; cursor: pointer; padding: 8px; }
.modal-submit { padding: 8px 16px; background: #fff; border: none; border-radius: 20px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; }
.modal-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.modal-body { padding: 20px; display: flex; flex-direction: column; gap: 28px; }
.modal-input, .modal-textarea { width: 100%; padding: 16px; background: #111; border: 1px solid #333; border-radius: 12px; color: #fff; font-size: 16px; outline: none; box-sizing: border-box; }
.modal-input::placeholder, .modal-textarea::placeholder { color: #555; }
.modal-textarea { resize: none; font-family: inherit; }
</style>

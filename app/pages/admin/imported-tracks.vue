<script setup lang="ts">
definePageMeta({
    layout: 'warehouse',
    middleware: 'auth'
})

interface Track {
    id: number
    productId: string
    china_warehouse: string | null
    aicargo: string | null
    given_to_client: string | null
    createdAt: string
    updatedAt: string
}

const { $axios } = useNuxtApp()
const token = useCookie('token')

const tracks = ref<Track[]>([])
const loading = ref(true)
const searchQuery = ref('')
const activeTab = ref('all')

const tabs = [
    { label: 'Все', value: 'all' },
    { label: '🇨🇳 В Китае', value: 'china' },
    { label: '📦 На складе', value: 'warehouse' },
    { label: '✅ Выдано', value: 'completed' }
]

const stats = computed(() => ({
    total: tracks.value.length,
    china: tracks.value.filter(t => t.china_warehouse && !t.aicargo && !t.given_to_client).length,
    warehouse: tracks.value.filter(t => t.aicargo && !t.given_to_client).length,
    completed: tracks.value.filter(t => t.given_to_client).length
}))

const filteredTracks = computed(() => {
    let result = tracks.value

    if (activeTab.value === 'china') {
        result = result.filter(t => t.china_warehouse && !t.aicargo && !t.given_to_client)
    } else if (activeTab.value === 'warehouse') {
        result = result.filter(t => t.aicargo && !t.given_to_client)
    } else if (activeTab.value === 'completed') {
        result = result.filter(t => t.given_to_client)
    }

    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(t => t.productId.toLowerCase().includes(query))
    }

    return result
})

async function getTracks() {
    loading.value = true
    try {
        const response = await $axios.get('admin/imported-tracks', {
            headers: { 'Authorization': `Bearer ${token.value}` }
        })
        tracks.value = Array.isArray(response.data) ? response.data : []
    } catch {
        tracks.value = []
    } finally {
        loading.value = false
    }
}

function formatDate(date: string | null) {
    if (!date) return '—'
    return new Date(date).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function getStatus(track: Track) {
    if (track.given_to_client) return { text: 'Выдан', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' }
    if (track.aicargo) return { text: 'На складе', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' }
    if (track.china_warehouse) return { text: 'В Китае', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' }
    return { text: 'Новый', color: '#888', bg: 'rgba(136, 136, 136, 0.15)' }
}

function getLastUpdate(track: Track) {
    if (track.given_to_client) return track.given_to_client
    if (track.aicargo) return track.aicargo
    if (track.china_warehouse) return track.china_warehouse
    return track.createdAt
}

onMounted(() => {
    getTracks()
})
</script>

<template>
    <div class="page">
        <div class="page-header">
            <div>
                <h1>Импортированные треки</h1>
                <p class="subtitle">Треки загруженные через импорт</p>
            </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-value">{{ stats.total }}</span>
                <span class="stat-label">Всего</span>
            </div>
            <div class="stat-card yellow">
                <span class="stat-value">{{ stats.china }}</span>
                <span class="stat-label">В Китае</span>
            </div>
            <div class="stat-card blue">
                <span class="stat-value">{{ stats.warehouse }}</span>
                <span class="stat-label">На складе</span>
            </div>
            <div class="stat-card green">
                <span class="stat-value">{{ stats.completed }}</span>
                <span class="stat-label">Выдано</span>
            </div>
        </div>

        <!-- Filters -->
        <div class="filters">
            <div class="tabs">
                <button 
                    v-for="tab in tabs" 
                    :key="tab.value"
                    :class="['tab', { active: activeTab === tab.value }]"
                    @click="activeTab = tab.value"
                >
                    {{ tab.label }}
                </button>
            </div>
            <div class="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input v-model="searchQuery" type="text" placeholder="Поиск по трек-коду..." />
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="!filteredTracks.length" class="empty">
            <div class="empty-icon">📦</div>
            <p>Нет импортированных треков</p>
        </div>

        <!-- Table -->
        <div v-else class="table-wrapper">
            <table class="table">
                <thead>
                    <tr>
                        <th>Трек-код</th>
                        <th>Статус</th>
                        <th>В Китае</th>
                        <th>На складе</th>
                        <th>Выдан</th>
                        <th>Добавлен</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="track in filteredTracks" :key="track.id">
                        <td class="track-code">{{ track.productId }}</td>
                        <td>
                            <span class="status" :style="{ background: getStatus(track).bg, color: getStatus(track).color }">
                                {{ getStatus(track).text }}
                            </span>
                        </td>
                        <td>{{ formatDate(track.china_warehouse) }}</td>
                        <td>{{ formatDate(track.aicargo) }}</td>
                        <td>{{ formatDate(track.given_to_client) }}</td>
                        <td class="date">{{ formatDate(track.createdAt) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.page { }

.page-header { margin-bottom: 24px; }
.page-header h1 { font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 4px; }
.subtitle { font-size: 14px; color: #666; margin: 0; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 16px; text-align: center; }
.stat-value { display: block; font-size: 28px; font-weight: 700; color: #fff; }
.stat-label { font-size: 13px; color: #666; }
.stat-card.yellow { background: rgba(234, 179, 8, 0.1); border-color: rgba(234, 179, 8, 0.2); }
.stat-card.yellow .stat-value { color: #eab308; }
.stat-card.yellow .stat-label { color: rgba(234, 179, 8, 0.7); }
.stat-card.blue { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); }
.stat-card.blue .stat-value { color: #3b82f6; }
.stat-card.blue .stat-label { color: rgba(59, 130, 246, 0.7); }
.stat-card.green { background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.2); }
.stat-card.green .stat-value { color: #22c55e; }
.stat-card.green .stat-label { color: rgba(34, 197, 94, 0.7); }

.filters { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.tab { padding: 8px 16px; background: #111; border: 1px solid #222; border-radius: 8px; color: #888; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.tab:hover { background: #1a1a1a; color: #fff; }
.tab.active { background: #fff; border-color: #fff; color: #000; }

.search-box { display: flex; align-items: center; gap: 10px; padding: 0 14px; background: #111; border: 1px solid #222; border-radius: 10px; }
.search-box svg { color: #555; flex-shrink: 0; }
.search-box input { height: 40px; background: transparent; border: none; outline: none; color: #fff; font-size: 14px; min-width: 200px; }
.search-box input::placeholder { color: #555; }

.loading { display: flex; justify-content: center; padding: 60px 0; }
.spinner { width: 32px; height: 32px; border: 3px solid #333; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.empty { text-align: center; padding: 80px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty p { color: #555; font-size: 16px; margin: 0; }

.table-wrapper { overflow-x: auto; background: #0a0a0a; border: 1px solid #222; border-radius: 12px; }

.table { width: 100%; border-collapse: collapse; }
.table th, .table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #1a1a1a; }
.table th { font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; background: #111; }
.table td { font-size: 14px; color: #aaa; }

.track-code { font-weight: 600; color: #fff !important; font-family: monospace; font-size: 15px !important; letter-spacing: 0.5px; }
.date { color: #666 !important; }

.status { display: inline-block; padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }

.table tbody tr:hover { background: #111; }

@media (max-width: 768px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .filters { flex-direction: column; align-items: stretch; }
    .search-box { width: 100%; }
    .search-box input { min-width: 0; flex: 1; }
}
</style>

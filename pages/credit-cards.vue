<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Cartões de Crédito</h1>
            <p class="mt-1 text-sm text-gray-500">
              Gerencie seus cartões de crédito e acompanhe as datas de fechamento e vencimento
            </p>
          </div>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Novo Cartão
          </button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CreditCardIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total de Cartões
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ creditCardStats.total }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Cartões Ativos
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ creditCardStats.active }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <XCircleIcon class="h-6 w-6 text-red-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Cartões Inativos
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ creditCardStats.inactive }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CalendarIcon class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Próximo Vencimento
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ getNextDueDate() }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                v-model="localFilters.search"
                type="text"
                placeholder="Nome do cartão..."
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Close Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Data de Fechamento
              </label>
              <select
                v-model="localFilters.close_date"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Todas as datas</option>
                <option v-for="day in availableDays" :key="day" :value="day">
                  {{ formatDayOfMonth(day) }}
                </option>
              </select>
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Data de Vencimento
              </label>
              <select
                v-model="localFilters.due_date"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Todas as datas</option>
                <option v-for="day in availableDays" :key="day" :value="day">
                  {{ formatDayOfMonth(day) }}
                </option>
              </select>
            </div>

            <!-- Active Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                v-model="localFilters.is_active"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Todos</option>
                <option :value="true">Ativos</option>
                <option :value="false">Inativos</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            <button
              @click="clearFilters"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <XMarkIcon class="h-4 w-4 mr-1" />
              Limpar
            </button>
            <button
              @click="applyFilters"
              class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FunnelIcon class="h-4 w-4 mr-1" />
              Filtrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 m-4">
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Erro ao carregar cartões
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredCreditCards.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="column in tableColumns"
                  :key="column.key"
                  :class="[
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.align === 'right' ? 'text-right' : '',
                    column.align === 'center' ? 'text-center' : ''
                  ]"
                >
                  <button
                    v-if="column.sortable"
                    @click="handleSort(column.key)"
                    class="group inline-flex items-center hover:text-gray-700"
                  >
                    {{ column.label }}
                    <span class="ml-2 flex-none rounded">
                      <ChevronUpIcon
                        v-if="sort.key === column.key && sort.direction === 'asc'"
                        class="h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      />
                      <ChevronDownIcon
                        v-else-if="sort.key === column.key && sort.direction === 'desc'"
                        class="h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      />
                      <ChevronUpIcon
                        v-else
                        class="h-4 w-4 text-gray-300 group-hover:text-gray-400"
                      />
                    </span>
                  </button>
                  <span v-else>{{ column.label }}</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="creditCard in filteredCreditCards" :key="creditCard.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <CreditCardIcon class="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ creditCard.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Cartão de Crédito
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getCloseDateLabel(creditCard.close_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getDueDateLabel(creditCard.due_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      creditCard.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ creditCard.is_active ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(creditCard.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="editCreditCard(creditCard)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="deleteCreditCard(creditCard.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <CreditCardIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Nenhum cartão encontrado
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Comece criando seu primeiro cartão de crédito.
          </p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Novo Cartão
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <CreditCardModal
      v-if="showCreateModal || showEditModal"
      :credit-card="editingCreditCard"
      :is-edit="showEditModal"
      @close="closeModal"
      @saved="handleCreditCardSaved"
    />
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  FunnelIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

import type { CreditCard, CreditCardTableFilters, CreditCardTableSort } from '~/types/creditCards'

// Page metadata
definePageMeta({
  middleware: 'auth'
})

// Composables
const { 
  creditCards,
  loading,
  error,
  filters,
  sort,
  filteredCreditCards,
  creditCardStats,
  loadCreditCards,
  deleteCreditCard: deleteCreditCardApi,
  applyTableFilters,
  applyTableSort,
  formatDate,
  formatDayOfMonth,
  getCloseDateLabel,
  getDueDateLabel,
  getAvailableDays,
  initialize
} = useCreditCards()

// Local state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCreditCard = ref<CreditCard | null>(null)
const localFilters = ref<CreditCardTableFilters>({})

// Table columns configuration
const tableColumns = [
  { key: 'name', label: 'Cartão', sortable: true, width: '300px' },
  { key: 'close_date', label: 'Fechamento', sortable: true, width: '150px' },
  { key: 'due_date', label: 'Vencimento', sortable: true, width: '150px' },
  { key: 'is_active', label: 'Status', sortable: true, width: '100px' },
  { key: 'created_at', label: 'Criado em', sortable: true, width: '120px' },
  { key: 'actions', label: 'Ações', sortable: false, width: '100px', align: 'right' }
]

// Available days for filter options
const availableDays = computed(() => getAvailableDays())

// Methods
const handleSort = (key: string) => {
  const newDirection = sort.value.key === key && sort.value.direction === 'asc' ? 'desc' : 'asc'
  applyTableSort({ key: key as keyof CreditCard, direction: newDirection })
}

const applyFilters = () => {
  applyTableFilters(localFilters.value)
}

const clearFilters = () => {
  localFilters.value = {}
  applyTableFilters({})
}

const editCreditCard = (creditCard: CreditCard) => {
  editingCreditCard.value = creditCard
  showEditModal.value = true
}

const deleteCreditCard = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir este cartão?')) {
    const result = await deleteCreditCardApi(id)
    if (!result.success) {
      alert('Erro ao excluir cartão: ' + result.error?.message)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingCreditCard.value = null
}

const handleCreditCardSaved = () => {
  closeModal()
  // Credit cards will be automatically refreshed by the composable
}

const getNextDueDate = (): string => {
  if (filteredCreditCards.value.length === 0) return 'N/A'
  
  const today = new Date()
  const currentDay = today.getDate()
  
  // Find the next due date
  const nextDueCard = filteredCreditCards.value
    .filter(card => card.is_active)
    .sort((a, b) => {
      // Calculate days until due date
      const aDaysUntil = a.due_date >= currentDay ? a.due_date - currentDay : a.due_date + 30 - currentDay
      const bDaysUntil = b.due_date >= currentDay ? b.due_date - currentDay : b.due_date + 30 - currentDay
      return aDaysUntil - bDaysUntil
    })[0]
  
  if (!nextDueCard) return 'N/A'
  
  const daysUntil = nextDueCard.due_date >= currentDay 
    ? nextDueCard.due_date - currentDay 
    : nextDueCard.due_date + 30 - currentDay
  
  return `${nextDueCard.name} (${daysUntil} dias)`
}

// Initialize data
onMounted(async () => {
  await initialize()
})
</script> 
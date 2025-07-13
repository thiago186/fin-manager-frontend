<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Contas</h1>
            <p class="mt-1 text-sm text-gray-500">
              Gerencie suas contas bancárias e acompanhe seus saldos
            </p>
          </div>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Nova Conta
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
                <BanknotesIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total de Contas
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ accountStats.total }}
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
                    Contas Ativas
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ accountStats.active }}
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
                    Contas Inativas
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ accountStats.inactive }}
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
                <CurrencyDollarIcon class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Saldo Total
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ formatCurrency(accountStats.totalBalance) }}
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
                placeholder="Nome da conta..."
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Account Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Conta
              </label>
              <select
                v-model="localFilters.account_type"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Todos os tipos</option>
                <option value="checking">Conta Corrente</option>
              </select>
            </div>

            <!-- Currency -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Moeda
              </label>
              <select
                v-model="localFilters.currency"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Todas as moedas</option>
                <option value="BRL">Real Brasileiro</option>
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
                <option :value="true">Ativas</option>
                <option :value="false">Inativas</option>
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
                Erro ao carregar contas
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ error }}
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredAccounts.length > 0" class="overflow-x-auto">
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
              <tr v-for="account in filteredAccounts" :key="account.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <BanknotesIcon class="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ account.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ getAccountTypeLabel(account.account_type) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(account.current_balance) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getCurrencyLabel(account.currency) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      account.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ account.is_active ? 'Ativa' : 'Inativa' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(account.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="editAccount(account)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="deleteAccount(account.id)"
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
          <BanknotesIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Nenhuma conta encontrada
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Comece criando sua primeira conta.
          </p>
          <div class="mt-6">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Nova Conta
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <AccountModal
      v-if="showCreateModal || showEditModal"
      :account="editingAccount"
      :is-edit="showEditModal"
      @close="closeModal"
      @saved="handleAccountSaved"
    />
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

import type { Account, AccountTableFilters, AccountTableSort } from '~/types/accounts'

// Page metadata
definePageMeta({
  middleware: 'auth'
})

// Composables
const { 
  accounts,
  loading,
  error,
  filters,
  sort,
  filteredAccounts,
  accountStats,
  loadAccounts,
  deleteAccount: deleteAccountApi,
  applyTableFilters,
  applyTableSort,
  formatCurrency,
  formatDate,
  getAccountTypeLabel,
  getCurrencyLabel,
  initialize
} = useAccounts()

// Local state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingAccount = ref<Account | null>(null)
const localFilters = ref<AccountTableFilters>({})

// Table columns configuration
const tableColumns = [
  { key: 'name', label: 'Conta', sortable: true, width: '300px' },
  { key: 'current_balance', label: 'Saldo', sortable: true, width: '150px', align: 'right' },
  { key: 'currency', label: 'Moeda', sortable: true, width: '120px' },
  { key: 'is_active', label: 'Status', sortable: true, width: '100px' },
  { key: 'created_at', label: 'Criada em', sortable: true, width: '120px' },
  { key: 'actions', label: 'Ações', sortable: false, width: '100px', align: 'right' }
]

// Methods
const handleSort = (key: string) => {
  const newDirection = sort.value.key === key && sort.value.direction === 'asc' ? 'desc' : 'asc'
  applyTableSort({ key: key as keyof Account, direction: newDirection })
}

const applyFilters = () => {
  applyTableFilters(localFilters.value)
}

const clearFilters = () => {
  localFilters.value = {}
  applyTableFilters({})
}

const editAccount = (account: Account) => {
  editingAccount.value = account
  showEditModal.value = true
}

const deleteAccount = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir esta conta?')) {
    const result = await deleteAccountApi(id)
    if (!result.success) {
      alert('Erro ao excluir conta: ' + result.error?.message)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingAccount.value = null
}

const handleAccountSaved = () => {
  closeModal()
  // Accounts will be automatically refreshed by the composable
}

// Initialize data
onMounted(async () => {
  await initialize()
})
</script> 
<template>
  <div class="py-8">
    <!-- Page Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Transações</h1>
          <p class="mt-1 text-sm text-gray-500">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Nova Transação
        </button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <!-- Total Transactions -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <DocumentTextIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total de Transações
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ transactionStats.total_transactions }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Income -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ArrowUpIcon class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Receitas
                  </dt>
                  <dd class="text-lg font-medium text-green-600">
                    {{ formatCurrency(transactionStats.total_income) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Expenses -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ArrowDownIcon class="h-6 w-6 text-red-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Despesas
                  </dt>
                  <dd class="text-lg font-medium text-red-600">
                    {{ formatCurrency(transactionStats.total_expenses) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Transfers -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ArrowsRightLeftIcon class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Transferências
                  </dt>
                  <dd class="text-lg font-medium text-blue-600">
                    {{ formatCurrency(transactionStats.total_transfers) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            Filtros
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                v-model="localFilters.search"
                type="text"
                placeholder="Descrição, categoria..."
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Transaction Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                v-model="localFilters.transaction_type"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Todos</option>
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
                <option value="TRANSFER">Transferência</option>
              </select>
            </div>

            <!-- Date From -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Data Início
              </label>
              <input
                v-model="localFilters.date_from"
                type="date"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Date To -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Data Fim
              </label>
              <input
                v-model="localFilters.date_to"
                type="date"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Amount Min -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Valor Mín
              </label>
              <input
                v-model="localFilters.amount_min"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <!-- Amount Max -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Valor Máx
              </label>
              <input
                v-model="localFilters.amount_max"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="mt-4 flex justify-between">
            <button
              @click="applyFilters"
              class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FunnelIcon class="h-4 w-4 mr-2" />
              Aplicar Filtros
            </button>
            <button
              @click="clearFilters"
              class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <XMarkIcon class="h-4 w-4 mr-2" />
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Lista de Transações
          </h3>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            {{ filteredTransactions.length }} transações encontradas
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span class="ml-2">Loading transactions...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="px-4 py-5 sm:px-6">
          <div class="bg-red-50 border border-red-200 rounded-md p-4">
            <div class="flex">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Erro ao carregar transações
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="column in tableColumns"
                  :key="column.key"
                  :class="[
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer',
                    column.sortable ? 'hover:bg-gray-100' : '',
                    column.align === 'right' ? 'text-right' : 'text-left'
                  ]"
                  @click="column.sortable ? handleSort(column.key) : null"
                >
                  <div class="flex items-center space-x-1">
                    <span>{{ column.label }}</span>
                    <div v-if="column.sortable" class="flex flex-col">
                      <ChevronUpIcon
                        :class="[
                          'h-3 w-3',
                          sort.key === column.key && sort.direction === 'asc'
                            ? 'text-indigo-600'
                            : 'text-gray-400'
                        ]"
                      />
                      <ChevronDownIcon
                        :class="[
                          'h-3 w-3 -mt-1',
                          sort.key === column.key && sort.direction === 'desc'
                            ? 'text-indigo-600'
                            : 'text-gray-400'
                        ]"
                      />
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="transaction in filteredTransactions"
                :key="transaction.id"
                class="hover:bg-gray-50"
              >
                <!-- Date -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(transaction.occurred_at) }}
                </td>

                <!-- Type -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      getTransactionTypeColor(transaction.transaction_type)
                    ]"
                  >
                    {{ getTransactionTypeLabel(transaction.transaction_type) }}
                  </span>
                </td>

                <!-- Description -->
                <td class="px-6 py-4 text-sm text-gray-900">
                  <div class="max-w-xs truncate">
                    {{ transaction.description || 'Sem descrição' }}
                  </div>
                </td>

                <!-- Category -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transaction.category?.name || '-' }}
                </td>

                <!-- Subcategory -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transaction.subcategory?.name || '-' }}
                </td>

                <!-- Account/Credit Card -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 mr-2">
                      <BanknotesIcon v-if="transaction.account" class="h-4 w-4 text-indigo-600" />
                      <CreditCardIcon v-else-if="transaction.credit_card" class="h-4 w-4 text-blue-600" />
                    </div>
                    <span>{{ transaction.account?.name || transaction.credit_card?.name || '-' }}</span>
                  </div>
                </td>

                <!-- Amount -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                  <span
                    :class="[
                      getTransactionTypeColor(transaction.transaction_type)
                    ]"
                  >
                    {{ formatCurrency(transaction.amount) }}
                  </span>
                </td>

                <!-- Installments -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  <span v-if="transaction.installments_total > 1">
                    {{ transaction.installment_number }}/{{ transaction.installments_total }}
                  </span>
                  <span v-else>-</span>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="editTransaction(transaction)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="deleteTransaction(transaction.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty State -->
          <div
            v-if="filteredTransactions.length === 0 && !loading"
            class="text-center py-12"
          >
            <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              Nenhuma transação encontrada
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Comece criando sua primeira transação.
            </p>
            <div class="mt-6">
              <button
                @click="showCreateModal = true"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon class="h-4 w-4 mr-2" />
                Nova Transação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <TransactionModal
      v-if="showCreateModal || showEditModal"
      :transaction="editingTransaction"
      :is-edit="showEditModal"
      @close="closeModal"
      @saved="handleTransactionSaved"
    />
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  DocumentTextIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsRightLeftIcon,
  FunnelIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  BanknotesIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'

import type { Transaction, TransactionTableFilters, TransactionTableSort } from '~/types/transactions'

// Page metadata
definePageMeta({
  middleware: 'auth'
})

// Composables
const { 
  transactions,
  loading,
  error,
  filters,
  sort,
  filteredTransactions,
  transactionStats,
  loadTransactions,
  deleteTransaction: deleteTransactionApi,
  applyTableFilters,
  applyTableSort,
  formatCurrency,
  formatDate,
  getTransactionTypeColor,
  getTransactionTypeLabel,
  initialize
} = useTransactions()

// Local state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const localFilters = ref<TransactionTableFilters>({})

// Table columns configuration
const tableColumns = [
  { key: 'occurred_at', label: 'Data', sortable: true, width: '120px' },
  { key: 'transaction_type', label: 'Tipo', sortable: true, width: '100px' },
  { key: 'description', label: 'Descrição', sortable: false, width: '200px' },
  { key: 'category', label: 'Categoria', sortable: false, width: '120px' },
  { key: 'subcategory', label: 'Subcategoria', sortable: false, width: '120px' },
  { key: 'account', label: 'Conta/Cartão', sortable: false, width: '150px' },
  { key: 'amount', label: 'Valor', sortable: true, width: '120px', align: 'right' },
  { key: 'installments', label: 'Parcelas', sortable: false, width: '80px', align: 'center' },
  { key: 'actions', label: 'Ações', sortable: false, width: '100px', align: 'right' }
]

// Methods
const handleSort = (key: string) => {
  const newDirection = sort.value.key === key && sort.value.direction === 'asc' ? 'desc' : 'asc'
  applyTableSort({ key: key as keyof Transaction, direction: newDirection })
}

const applyFilters = () => {
  applyTableFilters(localFilters.value)
}

const clearFilters = () => {
  localFilters.value = {}
  applyTableFilters({})
}

const editTransaction = (transaction: Transaction) => {
  editingTransaction.value = transaction
  showEditModal.value = true
}

const deleteTransaction = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    const result = await deleteTransactionApi(id)
    if (!result.success) {
      alert('Erro ao excluir transação: ' + result.error?.message)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTransaction.value = null
}

const handleTransactionSaved = () => {
  closeModal()
  // Transactions will be automatically refreshed by the composable
}

// Initialize data
onMounted(async () => {
  await initialize()
})
</script> 
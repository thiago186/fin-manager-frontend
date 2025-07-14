<template>
  <div class="py-8">
    <!-- Page Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Fluxo de Caixa</h1>
          <p class="mt-1 text-sm text-gray-500">
            Visualize suas receitas e despesas organizadas por categoria
          </p>
        </div>
        <div class="flex space-x-3">
          <!-- Month Selector -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Mês:</label>
            <input
              v-model="selectedMonth"
              type="month"
              class="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            @click="refreshData"
            class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon class="h-4 w-4 mr-2" />
            Atualizar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <span class="ml-2">Carregando dados...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Erro ao carregar dados
            </h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cash Flow Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <dd class="text-2xl font-bold text-green-600">
                    {{ formatCurrency(cashFlowData.totalIncome.toString()) }}
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
                  <dd class="text-2xl font-bold text-red-600">
                    {{ formatCurrency(cashFlowData.totalExpenses.toString()) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <!-- Net Cash Flow -->
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <BanknotesIcon class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Saldo do Mês
                  </dt>
                  <dd 
                    :class="[
                      'text-2xl font-bold',
                      cashFlowData.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                    ]"
                  >
                    {{ formatCurrency(cashFlowData.netCashFlow.toString()) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Income Section -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <ArrowUpIcon class="h-5 w-5 text-green-500 mr-2" />
              <h2 class="text-lg font-medium text-gray-900">Receitas</h2>
              <span class="ml-2 text-sm text-gray-500">
                ({{ cashFlowData.incomeByCategory.length }} categorias)
              </span>
            </div>
            <button
              @click="toggleIncomeSection"
              class="text-gray-400 hover:text-gray-600"
            >
              <ChevronDownIcon 
                v-if="!incomeCollapsed" 
                class="h-5 w-5" 
              />
              <ChevronRightIcon 
                v-else 
                class="h-5 w-5" 
              />
            </button>
          </div>
        </div>

        <div v-if="!incomeCollapsed" class="divide-y divide-gray-200">
          <!-- Income Categories -->
          <div
            v-for="category in cashFlowData.incomeByCategory"
            :key="category.id"
            class="px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div 
                  class="w-3 h-3 rounded-full mr-3"
                  :style="{ backgroundColor: category.color || '#10B981' }"
                ></div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ category.name }}
                  </h3>
                  <p class="text-xs text-gray-500">
                    {{ category.transactionCount }} transação{{ category.transactionCount !== 1 ? 'es' : '' }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-green-600">
                  {{ formatCurrency(category.totalAmount.toString()) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ ((category.totalAmount / cashFlowData.totalIncome) * 100).toFixed(1) }}%
                </div>
              </div>
            </div>

            <!-- Category Transactions (Collapsible) -->
            <div v-if="category.transactions && category.transactions.length > 0" class="mt-3">
              <button
                @click="toggleCategoryTransactions(category.id)"
                class="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <ChevronDownIcon 
                  v-if="!collapsedCategories.includes(category.id)" 
                  class="h-3 w-3 mr-1" 
                />
                <ChevronRightIcon 
                  v-else 
                  class="h-3 w-3 mr-1" 
                />
                Ver transações
              </button>

              <div 
                v-if="!collapsedCategories.includes(category.id)"
                class="mt-2 ml-4 space-y-2"
              >
                <div
                  v-for="transaction in category.transactions"
                  :key="transaction.id"
                  class="flex items-center justify-between text-xs text-gray-600 py-1"
                >
                  <div class="flex-1">
                    <div class="font-medium">{{ transaction.description || 'Sem descrição' }}</div>
                    <div class="text-gray-400">{{ formatDate(transaction.occurred_at) }}</div>
                  </div>
                  <div class="text-green-600 font-medium">
                    {{ formatCurrency(transaction.amount) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Income Message -->
          <div v-if="cashFlowData.incomeByCategory.length === 0" class="px-6 py-8 text-center">
            <ArrowUpIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              Nenhuma receita encontrada
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Não há receitas registradas para este mês.
            </p>
          </div>
        </div>
      </div>

      <!-- Expenses Section -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <ArrowDownIcon class="h-5 w-5 text-red-500 mr-2" />
              <h2 class="text-lg font-medium text-gray-900">Despesas</h2>
              <span class="ml-2 text-sm text-gray-500">
                ({{ cashFlowData.expensesByCategory.length }} categorias)
              </span>
            </div>
            <button
              @click="toggleExpensesSection"
              class="text-gray-400 hover:text-gray-600"
            >
              <ChevronDownIcon 
                v-if="!expensesCollapsed" 
                class="h-5 w-5" 
              />
              <ChevronRightIcon 
                v-else 
                class="h-5 w-5" 
              />
            </button>
          </div>
        </div>

        <div v-if="!expensesCollapsed" class="divide-y divide-gray-200">
          <!-- Expense Categories -->
          <div
            v-for="category in cashFlowData.expensesByCategory"
            :key="category.id"
            class="px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div 
                  class="w-3 h-3 rounded-full mr-3"
                  :style="{ backgroundColor: category.color || '#EF4444' }"
                ></div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ category.name }}
                  </h3>
                  <p class="text-xs text-gray-500">
                    {{ category.transactionCount }} transação{{ category.transactionCount !== 1 ? 'es' : '' }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-red-600">
                  {{ formatCurrency(category.totalAmount.toString()) }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ ((category.totalAmount / cashFlowData.totalExpenses) * 100).toFixed(1) }}%
                </div>
              </div>
            </div>

            <!-- Category Transactions (Collapsible) -->
            <div v-if="category.transactions && category.transactions.length > 0" class="mt-3">
              <button
                @click="toggleCategoryTransactions(category.id)"
                class="text-xs text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <ChevronDownIcon 
                  v-if="!collapsedCategories.includes(category.id)" 
                  class="h-3 w-3 mr-1" 
                />
                <ChevronRightIcon 
                  v-else 
                  class="h-3 w-3 mr-1" 
                />
                Ver transações
              </button>

              <div 
                v-if="!collapsedCategories.includes(category.id)"
                class="mt-2 ml-4 space-y-2"
              >
                <div
                  v-for="transaction in category.transactions"
                  :key="transaction.id"
                  class="flex items-center justify-between text-xs text-gray-600 py-1"
                >
                  <div class="flex-1">
                    <div class="font-medium">{{ transaction.description || 'Sem descrição' }}</div>
                    <div class="text-gray-400">{{ formatDate(transaction.occurred_at) }}</div>
                  </div>
                  <div class="text-red-600 font-medium">
                    {{ formatCurrency(transaction.amount) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Expenses Message -->
          <div v-if="cashFlowData.expensesByCategory.length === 0" class="px-6 py-8 text-center">
            <ArrowDownIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              Nenhuma despesa encontrada
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Não há despesas registradas para este mês.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

import type { Transaction } from '~/types/transactions'

// Page metadata
definePageMeta({
  middleware: 'auth'
})

// Types
interface CategorySummary {
  id: number
  name: string
  color?: string
  totalAmount: number
  transactionCount: number
  transactions?: Transaction[]
}

interface CashFlowData {
  totalIncome: number
  totalExpenses: number
  netCashFlow: number
  incomeByCategory: CategorySummary[]
  expensesByCategory: CategorySummary[]
}

// Composables
const { 
  transactions,
  loading,
  error,
  formatCurrency,
  formatDate,
  loadTransactions
} = useTransactions()

// Local state
const selectedMonth = ref(new Date().toISOString().slice(0, 7)) // YYYY-MM format
const incomeCollapsed = ref(false)
const expensesCollapsed = ref(false)
const collapsedCategories = ref<number[]>([])

// Computed
const cashFlowData = computed<CashFlowData>(() => {
  if (!transactions.value) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netCashFlow: 0,
      incomeByCategory: [],
      expensesByCategory: []
    }
  }

  // Filter transactions for selected month
  const [year, month] = selectedMonth.value.split('-').map(Number)
  const filteredTransactions = transactions.value.filter(transaction => {
    const transactionDate = new Date(transaction.occurred_at)
    return transactionDate.getFullYear() === year && 
           transactionDate.getMonth() === month - 1 &&
           transaction.transaction_type !== 'TRANSFER'
  })

  // Separate income and expenses
  const incomeTransactions = filteredTransactions.filter(t => t.transaction_type === 'INCOME')
  const expenseTransactions = filteredTransactions.filter(t => t.transaction_type === 'EXPENSE')

  // Calculate totals
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0)
  const netCashFlow = totalIncome - totalExpenses

  // Group by category
  const incomeByCategory = groupTransactionsByCategory(incomeTransactions as Transaction[])
  const expensesByCategory = groupTransactionsByCategory(expenseTransactions as Transaction[])

  return {
    totalIncome,
    totalExpenses,
    netCashFlow,
    incomeByCategory,
    expensesByCategory
  }
})

// Methods
const groupTransactionsByCategory = (transactions: Transaction[]): CategorySummary[] => {
  const categoryMap = new Map<number, CategorySummary>()

  transactions.forEach(transaction => {
    const categoryId = transaction.category?.id || 0
    const categoryName = transaction.category?.name || 'Sem categoria'
    const categoryColor = (transaction.category as any)?.color

    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        id: categoryId,
        name: categoryName,
        color: categoryColor,
        totalAmount: 0,
        transactionCount: 0,
        transactions: []
      })
    }

    const category = categoryMap.get(categoryId)!
    category.totalAmount += Number(transaction.amount)
    category.transactionCount += 1
    category.transactions!.push(transaction)
  })

  // Sort by total amount (descending)
  return Array.from(categoryMap.values()).sort((a, b) => b.totalAmount - a.totalAmount)
}

const toggleIncomeSection = () => {
  incomeCollapsed.value = !incomeCollapsed.value
}

const toggleExpensesSection = () => {
  expensesCollapsed.value = !expensesCollapsed.value
}

const toggleCategoryTransactions = (categoryId: number) => {
  const index = collapsedCategories.value.indexOf(categoryId)
  if (index > -1) {
    collapsedCategories.value.splice(index, 1)
  } else {
    collapsedCategories.value.push(categoryId)
  }
}

const refreshData = async () => {
  await loadTransactions()
}

// Watch for month changes
watch(selectedMonth, () => {
  // Reset collapsed states when month changes
  collapsedCategories.value = []
})

// Initialize data
onMounted(async () => {
  await loadTransactions()
})
</script> 
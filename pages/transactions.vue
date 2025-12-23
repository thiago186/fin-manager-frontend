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
        <div class="flex space-x-3">
          <Button as-child variant="outline">
            <NuxtLink to="/imports" class="inline-flex items-center">
              <ClockIcon class="h-4 w-4 mr-2" />
              Histórico de Importações
            </NuxtLink>
          </Button>
          <Button variant="outline" @click="showImportModal = true">
            <ArrowUpTrayIcon class="h-4 w-4 mr-2" />
            Importar CSV
          </Button>
          <Button @click="showCreateModal = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total de Transações</CardTitle>
            <DocumentTextIcon class="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-lg font-semibold text-gray-900">{{ transactionStats.total_transactions }}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Receitas</CardTitle>
            <ArrowUpIcon class="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div class="text-lg font-semibold text-green-600">{{ formatCurrency(transactionStats.total_income) }}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Despesas</CardTitle>
            <ArrowDownIcon class="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div class="text-lg font-semibold text-red-600">{{ formatCurrency(transactionStats.total_expenses) }}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium">Total Transferências</CardTitle>
            <ArrowsRightLeftIcon class="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div class="text-lg font-semibold text-blue-600">{{ formatCurrency(transactionStats.total_transfers) }}</div>
          </CardContent>
        </Card>
      </div>

      <!-- Filters -->
      <Card class="mb-6">
        <CardHeader>
          <CardTitle class="text-lg">Filtros</CardTitle>
          <CardDescription>Refine os resultados de transações.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <div class="space-y-2">
              <Label>Buscar</Label>
              <Input
                v-model="localFilters.search"
                type="text"
                placeholder="Descrição, categoria..."
              />
            </div>

            <div class="space-y-2">
              <Label>Tipo</Label>
              <Select v-model="localFilters.transaction_type">
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="null">Todos</SelectItem>
                  <SelectItem value="INCOME">Receita</SelectItem>
                  <SelectItem value="EXPENSE">Despesa</SelectItem>
                  <SelectItem value="TRANSFER">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Cartão de Crédito</Label>
              <Select v-model="localFilters.credit_card_id">
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="null">Todos</SelectItem>
                  <SelectItem
                    v-for="creditCard in creditCards"
                    :key="creditCard.id"
                    :value="creditCard.id"
                  >
                    {{ creditCard.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Data Início</Label>
              <Input v-model="localFilters.date_from" type="date" />
            </div>

            <div class="space-y-2">
              <Label>Data Fim</Label>
              <Input v-model="localFilters.date_to" type="date" />
            </div>

            <div class="space-y-2">
              <Label>Valor Mín</Label>
              <Input
                v-model="localFilters.amount_min"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div class="space-y-2">
              <Label>Valor Máx</Label>
              <Input
                v-model="localFilters.amount_max"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          <div class="flex justify-between">
            <Button variant="outline" @click="clearFilters">
              <XMarkIcon class="h-4 w-4 mr-2" />
              Limpar Filtros
            </Button>
            <Button @click="applyFilters">
              <FunnelIcon class="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Transactions Table -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle class="text-lg">Lista de Transações</CardTitle>
              <CardDescription>{{ filteredTransactions.length }} transações encontradas</CardDescription>
            </div>
            <Button
              v-if="hasPendingChanges"
              @click="handleSaveChanges"
              :disabled="savingChanges"
            >
              <CheckIcon v-if="!savingChanges" class="h-4 w-4 mr-2" />
              <svg v-else class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ savingChanges ? 'Salvando...' : 'Salvar Alterações' }}
            </Button>
          </div>
        </CardHeader>

        <!-- Loading State -->
        <CardContent v-if="loading">
          <div class="space-y-2">
            <Skeleton class="h-8 w-full" />
            <Skeleton class="h-8 w-full" />
            <Skeleton class="h-8 w-full" />
          </div>
        </CardContent>

        <!-- Error State -->
        <CardContent v-else-if="error">
          <Alert variant="destructive">
            <AlertTitle>Erro ao carregar transações</AlertTitle>
            <AlertDescription>{{ error }}</AlertDescription>
          </Alert>
        </CardContent>

        <!-- Table -->
        <CardContent v-else class="p-0">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    v-for="column in tableColumns"
                    :key="column.key"
                    :class="[
                      column.align === 'right' ? 'text-right' : '',
                      column.align === 'center' ? 'text-center' : ''
                    ]"
                    @click="column.sortable ? handleSort(column.key) : null"
                  >
                    <div class="flex items-center space-x-1 cursor-pointer" v-if="column.sortable">
                      <span>{{ column.label }}</span>
                      <div class="flex flex-col">
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
                    <span v-else>{{ column.label }}</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <template v-if="filteredTransactions.length > 0">
                  <TableRow
                    v-for="transaction in filteredTransactions"
                    :key="transaction.id"
                    class="hover:bg-muted/40"
                  >
                    <TableCell class="whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(transaction.occurred_at) }}
                    </TableCell>
                    <TableCell class="whitespace-nowrap">
                      <Badge :variant="transaction.transaction_type === 'INCOME' ? 'secondary' : transaction.transaction_type === 'EXPENSE' ? 'destructive' : 'outline'">
                        {{ getTransactionTypeLabel(transaction.transaction_type) }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-sm text-gray-900">
                      <div class="max-w-xs truncate">
                        {{ transaction.description || 'Sem descrição' }}
                      </div>
                    </TableCell>
                    <TableCell class="whitespace-nowrap text-sm text-gray-900">
                      {{ transaction.category?.name || '-' }}
                    </TableCell>
                    <TableCell class="whitespace-nowrap text-sm text-gray-900">
                      {{ transaction.subcategory?.name || '-' }}
                    </TableCell>
                    <TableCell 
                      class="whitespace-nowrap text-sm text-gray-900"
                      :class="{ 'ring-2 ring-blue-500': pendingChanges.has(transaction.id) }"
                    >
                      <Select 
                        :model-value="getCurrentAccountCardValue(transaction)"
                        @update:model-value="(value) => handleAccountCardChange(transaction, value as string)"
                        @open-change="(open: boolean) => { 
                          if (open) {
                            editingCellId = transaction.id
                          } else {
                            editingCellId = null
                          }
                        }"
                      >
                        <SelectTrigger 
                          class="w-full border-none shadow-none hover:bg-muted/50 p-1 h-auto data-[state=open]:bg-muted/50 focus-visible:ring-0 focus-visible:ring-offset-0 justify-start"
                          :class="{ 'ring-2 ring-blue-500': pendingChanges.has(transaction.id) }"
                        >
                          <div class="flex items-center w-full cursor-pointer">
                            <div class="flex-shrink-0 mr-2">
                              <BanknotesIcon 
                                v-if="getDisplayAccountCardIcon(transaction) === 'account'" 
                                class="h-4 w-4 text-indigo-600" 
                              />
                              <CreditCardIcon 
                                v-else-if="getDisplayAccountCardIcon(transaction) === 'credit_card'" 
                                class="h-4 w-4 text-blue-600" 
                              />
                            </div>
                            <SelectValue class="flex-1 text-left text-sm text-gray-900">
                              {{ getDisplayAccountCardName(transaction) }}
                            </SelectValue>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          <SelectGroup v-if="accounts.length > 0">
                            <SelectLabel>Contas</SelectLabel>
                            <SelectItem
                              v-for="account in accounts"
                              :key="`account_${account.id}`"
                              :value="`account_${account.id}`"
                            >
                              <div class="flex items-center">
                                <BanknotesIcon class="h-4 w-4 mr-2 text-indigo-600" />
                                {{ account.name }}
                              </div>
                            </SelectItem>
                          </SelectGroup>
                          <SelectGroup v-if="creditCards.length > 0">
                            <SelectLabel>Cartões de Crédito</SelectLabel>
                            <SelectItem
                              v-for="creditCard in creditCards"
                              :key="`credit_card_${creditCard.id}`"
                              :value="`credit_card_${creditCard.id}`"
                            >
                              <div class="flex items-center">
                                <CreditCardIcon class="h-4 w-4 mr-2 text-blue-600" />
                                {{ creditCard.name }}
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell class="whitespace-nowrap text-sm font-medium text-right">
                      <span :class="[getTransactionTypeColor(transaction.transaction_type)]">
                        {{ formatCurrency(transaction.amount) }}
                      </span>
                    </TableCell>
                    <TableCell class="whitespace-nowrap text-sm text-gray-900 text-center">
                      <span v-if="transaction.installments_total > 1">
                        {{ transaction.installment_number }}/{{ transaction.installments_total }}
                      </span>
                      <span v-else>-</span>
                    </TableCell>
                    <TableCell class="whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" @click="editTransaction(transaction)">
                          <PencilIcon class="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" @click="deleteTransaction(transaction.id)">
                          <TrashIcon class="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </template>
                <TableEmpty
                  v-else-if="!loading"
                  :colspan="tableColumns.length"
                >
                  <div class="text-center py-12">
                    <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">
                      Nenhuma transação encontrada
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                      Comece criando sua primeira transação.
                    </p>
                    <div class="mt-6">
                      <Button @click="showCreateModal = true">
                        <PlusIcon class="h-4 w-4 mr-2" />
                        Nova Transação
                      </Button>
                    </div>
                  </div>
                </TableEmpty>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Create/Edit Modal -->
    <TransactionModal
      v-if="showCreateModal || showEditModal"
      :transaction="editingTransaction"
      :is-edit="showEditModal"
      @close="closeModal"
      @saved="handleTransactionSaved"
    />

    <!-- CSV Import Modal -->
    <CsvImportModal
      v-if="showImportModal"
      @close="showImportModal = false"
      @imported="handleImportComplete"
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
  CreditCardIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

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
  bulkUpdateTransactions,
  applyTableFilters,
  applyTableSort,
  formatCurrency,
  formatDate,
  getTransactionTypeColor,
  getTransactionTypeLabel,
  initialize
} = useTransactions()

const { creditCards, initialize: initializeCreditCards } = useCreditCards()
const { accounts, initialize: initializeAccounts } = useAccounts()

// Local state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showImportModal = ref(false)
const editingTransaction = ref<Transaction | null>(null)
const localFilters = ref<TransactionTableFilters>({})
const pendingChanges = ref<Map<number, { account_id?: number | null, credit_card_id?: number | null }>>(new Map())
const editingCellId = ref<number | null>(null)
const savingChanges = ref(false)

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

// Computed
const hasPendingChanges = computed(() => pendingChanges.value.size > 0)

// Methods
const handleSort = (key: string) => {
  const newDirection = sort.value.key === key && sort.value.direction === 'asc' ? 'desc' : 'asc'
  applyTableSort({ key: key as keyof Transaction, direction: newDirection })
}

const applyFilters = () => {
  let creditCardId: number | null = null
  const creditCardIdValue = localFilters.value.credit_card_id
  
  if (creditCardIdValue !== null && creditCardIdValue !== undefined) {
    const numValue = typeof creditCardIdValue === 'string' 
      ? (creditCardIdValue === '' ? null : Number(creditCardIdValue))
      : creditCardIdValue
    
    if (numValue !== null && !isNaN(numValue) && numValue > 0) {
      creditCardId = numValue
    }
  }
  
  const filtersToApply: TransactionTableFilters = {
    ...localFilters.value,
    credit_card_id: creditCardId
  }
  
  console.log('Applying filters:', filtersToApply)
  applyTableFilters(filtersToApply)
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

const handleImportComplete = async () => {
  showImportModal.value = false
  // Refresh transactions after successful import
  await loadTransactions()
}

// Account/Credit Card editing methods
const getCurrentAccountCardValue = (transaction: Transaction): string => {
  // Get effective current values (pending change or original)
  const pendingChange = pendingChanges.value.get(transaction.id)
  const accountId = pendingChange?.account_id ?? transaction.account?.id ?? null
  const creditCardId = pendingChange?.credit_card_id ?? transaction.credit_card?.id ?? null
  
  if (accountId !== null) {
    return `account_${accountId}`
  }
  if (creditCardId !== null) {
    return `credit_card_${creditCardId}`
  }
  return 'none'
}

const getDisplayAccountCardName = (transaction: Transaction): string => {
  // Get effective current values (pending change or original)
  const pendingChange = pendingChanges.value.get(transaction.id)
  
  if (pendingChange) {
    if (pendingChange.account_id !== null && pendingChange.account_id !== undefined) {
      const account = accounts.value.find(a => a.id === pendingChange.account_id)
      return account?.name || '-'
    }
    if (pendingChange.credit_card_id !== null && pendingChange.credit_card_id !== undefined) {
      const creditCard = creditCards.value.find(c => c.id === pendingChange.credit_card_id)
      return creditCard?.name || '-'
    }
    return '-'
  }
  
  // Show original value
  return transaction.account?.name || transaction.credit_card?.name || '-'
}

const getDisplayAccountCardIcon = (transaction: Transaction) => {
  // Get effective current values (pending change or original)
  const pendingChange = pendingChanges.value.get(transaction.id)
  
  if (pendingChange) {
    if (pendingChange.account_id !== null && pendingChange.account_id !== undefined) {
      return 'account'
    }
    if (pendingChange.credit_card_id !== null && pendingChange.credit_card_id !== undefined) {
      return 'credit_card'
    }
    return null
  }
  
  // Show original value
  if (transaction.account) return 'account'
  if (transaction.credit_card) return 'credit_card'
  return null
}

const handleAccountCardChange = (transaction: Transaction, value: string) => {
  const transactionId = transaction.id
  
  // Get effective current values (pending change or original)
  const pendingChange = pendingChanges.value.get(transactionId)
  const currentAccountId = pendingChange?.account_id ?? transaction.account?.id ?? null
  const currentCreditCardId = pendingChange?.credit_card_id ?? transaction.credit_card?.id ?? null
  
  // Get original values from transaction
  const originalAccountId = transaction.account?.id ?? null
  const originalCreditCardId = transaction.credit_card?.id ?? null
  
  let newAccountId: number | null = null
  let newCreditCardId: number | null = null
  
  if (value === 'none') {
    newAccountId = null
    newCreditCardId = null
  } else if (value.startsWith('account_')) {
    newAccountId = Number(value.replace('account_', ''))
    newCreditCardId = null
  } else if (value.startsWith('credit_card_')) {
    newAccountId = null
    newCreditCardId = Number(value.replace('credit_card_', ''))
  }
  
  // Only track if value actually changed from original
  if (newAccountId !== originalAccountId || newCreditCardId !== originalCreditCardId) {
    pendingChanges.value.set(transactionId, {
      account_id: newAccountId,
      credit_card_id: newCreditCardId
    })
  } else {
    // Remove from pending changes if reverted to original
    pendingChanges.value.delete(transactionId)
  }
  
  editingCellId.value = null
}

const handleSaveChanges = async () => {
  if (pendingChanges.value.size === 0) return
  
  savingChanges.value = true
  
  try {
    const updates = Array.from(pendingChanges.value.entries()).map(([id, changes]) => ({
      id,
      ...changes
    }))
    
    const result = await bulkUpdateTransactions({ transactions: updates })
    
    if (result.success) {
      pendingChanges.value.clear()
      editingCellId.value = null
      // Transactions will be automatically refreshed by the composable
    } else {
      alert('Erro ao salvar alterações: ' + (result.error?.message || 'Erro desconhecido'))
    }
  } catch (err: any) {
    alert('Erro ao salvar alterações: ' + (err?.message || 'Erro desconhecido'))
  } finally {
    savingChanges.value = false
  }
}

// Initialize data
onMounted(async () => {
  await Promise.all([
    initialize(),
    initializeCreditCards(),
    initializeAccounts()
  ])
})
</script> 
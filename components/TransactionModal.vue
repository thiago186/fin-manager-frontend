<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ isEdit ? 'Editar Transação' : 'Nova Transação' }}
              </h3>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Transaction Type -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Transação *
                  </label>
                  <select
                    v-model="form.transaction_type"
                    required
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="INCOME">Receita</option>
                    <option value="EXPENSE">Despesa</option>
                    <option value="TRANSFER">Transferência</option>
                  </select>
                </div>

                <!-- Amount -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Valor *
                  </label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      v-model="form.amount"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0,00"
                      class="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <input
                    v-model="form.description"
                    type="text"
                    placeholder="Descrição da transação"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <!-- Occurred At -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Data da Transação *
                  </label>
                  <input
                    v-model="form.occurred_at"
                    type="date"
                    required
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <!-- Account -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Conta
                  </label>
                  <select
                    v-model="form.account_id"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione uma conta</option>
                    <option v-for="account in accounts.filter(a => a.is_active)" :key="account.id" :value="account.id">
                      {{ account.name }} - {{ formatCurrency(account.current_balance) }}
                    </option>
                  </select>
                </div>

                <!-- Credit Card -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Cartão de Crédito
                  </label>
                  <select
                    v-model="form.credit_card_id"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione um cartão</option>
                    <option v-for="card in creditCards.filter(c => c.is_active)" :key="card.id" :value="card.id">
                      {{ card.name }}
                    </option>
                  </select>
                </div>

                <!-- Category -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    v-model="form.category_id"
                    @change="loadSubcategories"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option 
                      v-for="category in availableCategories" 
                      :key="category.id" 
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <!-- Subcategory -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoria
                  </label>
                  <select
                    v-model="form.subcategory_id"
                    :disabled="!form.category_id"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione uma subcategoria</option>
                    <option 
                      v-for="subcategory in availableSubcategories" 
                      :key="subcategory.id" 
                      :value="subcategory.id"
                    >
                      {{ subcategory.name }}
                    </option>
                  </select>
                </div>

                <!-- Installments -->
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Total de Parcelas
                    </label>
                    <input
                      v-model="form.installments_total"
                      type="number"
                      min="1"
                      placeholder="1"
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Parcela Atual
                    </label>
                    <input
                      v-model="form.installment_number"
                      type="number"
                      min="1"
                      placeholder="1"
                      class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <!-- Charge at Card Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Data de Cobrança no Cartão
                  </label>
                  <input
                    v-model="form.charge_at_card"
                    type="date"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <!-- Error Display -->
                <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
                  <div class="flex">
                    <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">
                        Erro ao salvar transação
                      </h3>
                      <div class="mt-2 text-sm text-red-700">
                        {{ error }}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {{ isSubmitting ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar') }}
          </button>
          <button
            type="button"
            @click="$emit('close')"
            :disabled="isSubmitting"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { Transaction, TransactionForm } from '~/types/transactions'
import type { CategoryList } from '~/types/categories'

// Props
interface Props {
  transaction?: Transaction | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  transaction: null,
  isEdit: false
})

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// Composables
const { 
  createTransaction, 
  updateTransaction, 
  formatTransactionData,
  formatCurrency,
  clearError
} = useTransactions()

const { categories, loadCategories } = useCategories()

// Local state
const isSubmitting = ref(false)
const error = ref<string | null>(null)

// Get accounts from the accounts composable
const { accounts, loadAccounts } = useAccounts()

// Get credit cards from the credit cards composable
const { creditCards, loadCreditCards } = useCreditCards()

// Form state
const form = ref<TransactionForm>({
  transaction_type: '',
  amount: '',
  description: '',
  occurred_at: new Date().toISOString().split('T')[0],
  charge_at_card: '',
  installments_total: '1',
  installment_number: '1',
  account_id: null,
  credit_card_id: null,
  category_id: null,
  subcategory_id: null,
  tag_ids: []
})

// Available categories and subcategories
const availableCategories = computed(() => {
  if (!form.value.transaction_type) return []
  return categories.value.filter(cat => 
    cat.transaction_type === (form.value.transaction_type === 'INCOME' ? 'income' : 'expense') &&
    cat.is_active
  )
})

const availableSubcategories = ref<CategoryList[]>([])

// Methods
const loadSubcategories = async () => {
  if (!form.value.category_id) {
    availableSubcategories.value = []
    form.value.subcategory_id = null
    return
  }

  try {
    // This would need to be implemented in the categories composable
    // For now, we'll use a mock implementation
    availableSubcategories.value = categories.value.filter(cat => 
      cat.parent === form.value.category_id && cat.is_active
    )
  } catch (err) {
    console.error('Error loading subcategories:', err)
  }
}

const initializeForm = () => {
  if (props.transaction && props.isEdit) {
    form.value = {
      transaction_type: props.transaction.transaction_type,
      amount: props.transaction.amount,
      description: props.transaction.description || '',
      occurred_at: props.transaction.occurred_at,
      charge_at_card: props.transaction.charge_at_card || '',
      installments_total: String(props.transaction.installments_total),
      installment_number: String(props.transaction.installment_number),
      account_id: props.transaction.account_id ?? null,
      credit_card_id: props.transaction.credit_card_id ?? null,
      category_id: props.transaction.category_id ?? null,
      subcategory_id: props.transaction.subcategory_id ?? null,
      tag_ids: props.transaction.tag_ids || []
    }
  } else {
    form.value = {
      transaction_type: '',
      amount: '',
      description: '',
      occurred_at: new Date().toISOString().split('T')[0],
      charge_at_card: '',
      installments_total: '1',
      installment_number: '1',
      account_id: null,
      credit_card_id: null,
      category_id: null,
      subcategory_id: null,
      tag_ids: []
    }
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  error.value = null

  try {
    const transactionData = formatTransactionData(form.value)
    
    if (props.isEdit && props.transaction) {
      const result = await updateTransaction(props.transaction.id, transactionData)
      if (!result.success) {
        error.value = result.error?.message || 'Erro ao atualizar transação'
        return
      }
    } else {
      const result = await createTransaction(transactionData)
      if (!result.success) {
        error.value = result.error?.message || 'Erro ao criar transação'
        return
      }
    }

    emit('saved')
  } catch (err: any) {
    error.value = err?.message || 'Erro desconhecido'
  } finally {
    isSubmitting.value = false
  }
}

// Initialize
onMounted(async () => {
  await Promise.all([loadCategories(), loadAccounts(), loadCreditCards()])
  initializeForm()
})

// Watch for transaction type changes to reset category selection
watch(() => form.value.transaction_type, () => {
  form.value.category_id = null
  form.value.subcategory_id = null
  availableSubcategories.value = []
})

// Watch for category changes to load subcategories
watch(() => form.value.category_id, () => {
  loadSubcategories()
})
</script> 
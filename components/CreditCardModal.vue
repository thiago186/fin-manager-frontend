<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                {{ isEdit ? 'Editar Cartão de Crédito' : 'Novo Cartão de Crédito' }}
              </h3>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Credit Card Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cartão *
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Ex: Nubank Credit Card"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <!-- Close Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Data de Fechamento *
                  </label>
                  <select
                    v-model="form.close_date"
                    required
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione o dia</option>
                    <option v-for="day in availableDays" :key="day" :value="day">
                      {{ formatDayOfMonth(day) }}
                    </option>
                  </select>
                  <p class="mt-1 text-sm text-gray-500">
                    Dia do mês em que o ciclo de faturamento fecha
                  </p>
                </div>

                <!-- Due Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Data de Vencimento *
                  </label>
                  <select
                    v-model="form.due_date"
                    required
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione o dia</option>
                    <option v-for="day in availableDays" :key="day" :value="day">
                      {{ formatDayOfMonth(day) }}
                    </option>
                  </select>
                  <p class="mt-1 text-sm text-gray-500">
                    Dia do mês em que o pagamento é devido
                  </p>
                </div>

                <!-- Active Status -->
                <div class="flex items-center">
                  <input
                    v-model="form.is_active"
                    type="checkbox"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900">
                    Cartão ativo
                  </label>
                </div>

                <!-- Error Display -->
                <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
                  <div class="flex">
                    <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-red-800">
                        Erro ao salvar cartão
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
import type { CreditCard, CreditCardForm } from '~/types/creditCards'

// Props
interface Props {
  creditCard?: CreditCard | null
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  creditCard: null,
  isEdit: false
})

// Emits
const emit = defineEmits<{
  close: []
  saved: []
}>()

// Composables
const { 
  createCreditCard, 
  updateCreditCard, 
  formatCreditCardData,
  formatDayOfMonth,
  getAvailableDays,
  clearError
} = useCreditCards()

// Local state
const isSubmitting = ref(false)
const error = ref<string | null>(null)

// Form state
const form = ref<CreditCardForm>({
  name: '',
  close_date: 15,
  due_date: 20,
  is_active: true
})

// Available days for select options
const availableDays = computed(() => getAvailableDays())

// Methods
const initializeForm = () => {
  if (props.creditCard && props.isEdit) {
    form.value = {
      name: props.creditCard.name,
      close_date: props.creditCard.close_date,
      due_date: props.creditCard.due_date,
      is_active: props.creditCard.is_active
    }
  } else {
    form.value = {
      name: '',
      close_date: 15,
      due_date: 20,
      is_active: true
    }
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  error.value = null

  try {
    const creditCardData = formatCreditCardData(form.value)
    
    if (props.isEdit && props.creditCard) {
      const result = await updateCreditCard(props.creditCard.id, creditCardData)
      if (!result.success) {
        error.value = result.error?.message || 'Erro ao atualizar cartão'
        return
      }
    } else {
      const result = await createCreditCard(creditCardData)
      if (!result.success) {
        error.value = result.error?.message || 'Erro ao criar cartão'
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
onMounted(() => {
  initializeForm()
})
</script> 
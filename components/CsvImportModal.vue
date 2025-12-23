<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="handleClose"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                Importar Transações CSV
              </h3>

              <!-- File Upload Area -->
              <div v-if="!selectedFile && !currentReport" class="mb-6">
                <div
                  @drop.prevent="handleDrop"
                  @dragover.prevent="isDragging = true"
                  @dragleave.prevent="isDragging = false"
                  :class="[
                    'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                    isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
                  ]"
                >
                  <CloudArrowUpIcon class="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p class="text-sm text-gray-600 mb-2">
                    Arraste e solte um arquivo CSV aqui, ou
                  </p>
                  <label class="cursor-pointer">
                    <span class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      Selecionar arquivo
                    </span>
                    <input
                      ref="fileInput"
                      type="file"
                      accept=".csv"
                      class="hidden"
                      @change="handleFileSelect"
                    />
                  </label>
                  <p class="text-xs text-gray-500 mt-2">
                    Apenas arquivos .csv são aceitos
                  </p>
                </div>
              </div>

              <!-- Selected File Preview -->
              <div v-if="selectedFile && !isUploading && !currentReport" class="mb-6">
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <DocumentIcon class="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</p>
                        <p class="text-xs text-gray-500">
                          {{ formatFileSize(selectedFile.size) }}
                        </p>
                      </div>
                    </div>
                    <button
                      @click="clearFile"
                      class="text-gray-400 hover:text-gray-600"
                      :disabled="isUploading"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Account/Credit Card Selection -->
              <div v-if="selectedFile && !isUploading && !currentReport" class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Associar a conta ou cartão de crédito <span class="text-red-500">*</span>
                </label>
                <div v-if="accounts.length === 0 && creditCards.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p class="text-sm text-yellow-800">
                    Você precisa criar pelo menos uma conta bancária ou cartão de crédito antes de importar transações.
                  </p>
                </div>
                <select
                  v-else
                  v-model="selectedAccountOrCard"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  :class="{
                    'border-red-300': !selectedAccountOrCard && showValidationError
                  }"
                >
                  <option value="">Selecione uma conta ou cartão de crédito</option>
                  <optgroup v-if="accounts.length > 0" label="Contas Bancárias">
                    <option
                      v-for="account in accounts"
                      :key="`account-${account.id}`"
                      :value="`account-${account.id}`"
                    >
                      {{ account.name }}
                    </option>
                  </optgroup>
                  <optgroup v-if="creditCards.length > 0" label="Cartões de Crédito">
                    <option
                      v-for="creditCard in creditCards"
                      :key="`credit-card-${creditCard.id}`"
                      :value="`credit-card-${creditCard.id}`"
                    >
                      {{ creditCard.name }}
                    </option>
                  </optgroup>
                </select>
                <p
                  v-if="!selectedAccountOrCard && showValidationError"
                  class="mt-1 text-sm text-red-600"
                >
                  É necessário selecionar uma conta ou cartão de crédito
                </p>
              </div>

              <!-- Upload Status Display -->
              <div v-if="isUploading || currentReport" class="mb-6">
                <!-- SENT Status -->
                <div v-if="currentReport?.status === 'SENT'" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-center">
                    <ClockIcon class="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <p class="text-sm font-medium text-blue-800">
                        Arquivo enviado. Processamento iniciará em breve...
                      </p>
                    </div>
                  </div>
                </div>

                <!-- PROCESSING Status -->
                <div v-if="currentReport?.status === 'PROCESSING'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div class="flex items-center">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600 mr-3"></div>
                    <div>
                      <p class="text-sm font-medium text-yellow-800">
                        Importando transações... Aguarde.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- IMPORTED Status -->
                <div v-if="currentReport?.status === 'IMPORTED'" class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-start">
                    <CheckCircleIcon class="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-green-800 mb-2">
                        Importação concluída com sucesso!
                      </p>
                      <div class="text-sm text-green-700 space-y-1">
                        <p>✓ {{ currentReport.success_count }} transações importadas</p>
                        <p v-if="currentReport.error_count > 0" class="text-yellow-700">
                          ⚠ {{ currentReport.error_count }} transações falharam
                        </p>
                      </div>
                      <div v-if="currentReport.errors && currentReport.errors.length > 0" class="mt-3">
                        <button
                          @click="showErrors = !showErrors"
                          class="text-sm text-green-700 hover:text-green-800 underline"
                        >
                          {{ showErrors ? 'Ocultar' : 'Mostrar' }} erros ({{ currentReport.errors.length }})
                        </button>
                        <div v-if="showErrors" class="mt-2 bg-white rounded border border-green-200 p-3 max-h-48 overflow-y-auto">
                          <ul class="text-xs text-gray-700 space-y-1">
                            <li v-for="(error, index) in currentReport.errors" :key="index" class="flex items-start">
                              <ExclamationCircleIcon class="h-4 w-4 text-red-400 mr-1 mt-0.5 flex-shrink-0" />
                              <span>{{ error }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- FAILED Status -->
                <div v-if="currentReport?.status === 'FAILED'" class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div class="flex items-start">
                    <XCircleIcon class="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-red-800 mb-2">
                        Importação falhou
                      </p>
                      <p v-if="currentReport.failed_reason" class="text-sm text-red-700">
                        {{ currentReport.failed_reason }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Upload Progress -->
              <div v-if="isUploading" class="mb-6">
                <div class="flex items-center justify-center py-4">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span class="ml-3 text-sm text-gray-600">Enviando arquivo...</span>
                </div>
              </div>

              <!-- Error Display -->
              <div v-if="uploadError" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div class="flex">
                  <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      Erro ao fazer upload
                    </h3>
                    <div class="mt-2 text-sm text-red-700">
                      {{ uploadError }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            v-if="selectedFile && !isUploading && !currentReport"
            type="button"
            @click="handleUpload"
            :disabled="!selectedAccountOrCard"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Importar
          </button>
          <button
            type="button"
            @click="handleClose"
            :disabled="!!(isUploading || (currentReport && currentReport.status !== 'IMPORTED' && currentReport.status !== 'FAILED'))"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ currentReport?.status === 'IMPORTED' || currentReport?.status === 'FAILED' ? 'Fechar' : 'Cancelar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'
import type { ImportReport } from '~/types/importReports'

// Emits
const emit = defineEmits<{
  close: []
  imported: []
}>()

// Composables
const {
  uploadCSV,
  pollImportStatus,
  stopPolling,
  clearError
} = useImportReports()

const { loadTransactions } = useTransactions()
const { accounts, loadAccounts } = useAccounts()
const { creditCards, loadCreditCards } = useCreditCards()

// Local state
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const selectedAccountOrCard = ref<string>('')
const showValidationError = ref(false)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadError = ref<string | null>(null)
const currentReport = ref<ImportReport | null>(null)
const showErrors = ref(false)
const stopPollingFn = ref<(() => void) | null>(null)

// Methods
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    if (file.name.toLowerCase().endsWith('.csv')) {
      selectedFile.value = file
      uploadError.value = null
    } else {
      uploadError.value = 'Por favor, selecione um arquivo CSV (.csv)'
    }
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (file.name.toLowerCase().endsWith('.csv')) {
      selectedFile.value = file
      uploadError.value = null
    } else {
      uploadError.value = 'Por favor, selecione um arquivo CSV (.csv)'
    }
  }
}

const clearFile = () => {
  selectedFile.value = null
  selectedAccountOrCard.value = ''
  showValidationError.value = false
  uploadError.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  // Validate account/card selection
  if (!selectedAccountOrCard.value) {
    showValidationError.value = true
    return
  }

  showValidationError.value = false
  isUploading.value = true
  uploadError.value = null
  clearError()

  // Parse selected account or card
  const isAccount = selectedAccountOrCard.value.startsWith('account-')
  const id = parseInt(selectedAccountOrCard.value.split('-')[1])

  const uploadOptions = isAccount
    ? { account_id: id }
    : { credit_card_id: id }

  try {
    const result = await uploadCSV(selectedFile.value, uploadOptions)

    if (!result.success || !result.data) {
      uploadError.value = result.error?.message || 'Falha ao fazer upload do arquivo'
      isUploading.value = false
      return
    }

    const reportId = result.data.report_id
    isUploading.value = false

    // Start polling for status updates
    stopPollingFn.value = pollImportStatus(
      reportId,
      (report) => {
        // Update UI with current status
        currentReport.value = report
      },
      (finalReport) => {
        // Import complete
        currentReport.value = finalReport
        
        // Refresh transactions if import was successful
        if (finalReport.status === 'IMPORTED') {
          loadTransactions()
          emit('imported')
        }
      }
    )
  } catch (err: any) {
    uploadError.value = err?.message || 'Erro desconhecido ao fazer upload'
    isUploading.value = false
  }
}

const handleClose = () => {
  // Only allow closing if not uploading and status is final
  if (isUploading.value) return
  if (currentReport.value && 
      currentReport.value.status !== 'IMPORTED' && 
      currentReport.value.status !== 'FAILED') {
    return
  }

  // Stop polling if active
  if (stopPollingFn.value) {
    stopPollingFn.value()
    stopPollingFn.value = null
  }

  // Reset state
  selectedFile.value = null
  selectedAccountOrCard.value = ''
  showValidationError.value = false
  currentReport.value = null
  uploadError.value = null
  showErrors.value = false
  isDragging.value = false
  clearFile()

  emit('close')
}

// Load accounts and credit cards when modal opens
onMounted(async () => {
  await Promise.all([
    loadAccounts(),
    loadCreditCards()
  ])
})

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Cleanup on unmount
onUnmounted(() => {
  if (stopPollingFn.value) {
    stopPollingFn.value()
  }
})
</script>


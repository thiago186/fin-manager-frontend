<template>
  <Dialog :open="true">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{{ isEdit ? 'Editar Cartão de Crédito' : 'Novo Cartão de Crédito' }}</DialogTitle>
        <DialogDescription>
          Configure as datas de fechamento e vencimento do cartão.
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-2">
          <Label>Nome do Cartão *</Label>
          <Input
            v-model="form.name"
            type="text"
            required
            placeholder="Ex: Nubank Credit Card"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Data de Fechamento *</Label>
            <Select v-model="form.close_date" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="day in availableDays"
                  :key="day"
                  :value="day"
                >
                  {{ formatDayOfMonth(day) }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p class="text-sm text-muted-foreground">
              Dia do mês em que o ciclo de faturamento fecha
            </p>
          </div>

          <div class="space-y-2">
            <Label>Data de Vencimento *</Label>
            <Select v-model="form.due_date" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="day in availableDays"
                  :key="day"
                  :value="day"
                >
                  {{ formatDayOfMonth(day) }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p class="text-sm text-muted-foreground">
              Dia do mês em que o pagamento é devido
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Checkbox v-model:checked="form.is_active" />
          <Label class="text-sm">Cartão ativo</Label>
        </div>

        <Alert v-if="error" variant="destructive">
          <ExclamationTriangleIcon class="h-4 w-4" />
          <AlertTitle>Erro ao salvar cartão</AlertTitle>
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>

        <DialogFooter class="gap-2">
          <Button type="button" variant="outline" :disabled="isSubmitting" @click="$emit('close')">
            Cancelar
          </Button>
          <Button type="submit" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
            {{ isSubmitting ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar') }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { CreditCard, CreditCardForm } from '~/types/creditCards'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
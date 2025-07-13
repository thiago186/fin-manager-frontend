import type { 
  CreditCard, 
  CreditCardForm, 
  CreditCardFilters, 
  CreateCreditCardRequest, 
  UpdateCreditCardRequest,
  CreditCardApiResult,
  CreditCardTableFilters,
  CreditCardTableSort
} from '~/types/creditCards'

export const useCreditCards = () => {
  const config = useRuntimeConfig()
  
  // State
  const creditCards = ref<CreditCard[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<CreditCardTableFilters>({})
  const sort = ref<CreditCardTableSort>({ key: 'name', direction: 'asc' })

  // Load credit cards with optional filters
  const loadCreditCards = async (apiFilters?: CreditCardFilters): Promise<CreditCardApiResult<CreditCard[]>> => {
    loading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams()
      
      // Add API filters
      if (apiFilters?.close_date) {
        params.append('close_date', String(apiFilters.close_date))
      }
      if (apiFilters?.due_date) {
        params.append('due_date', String(apiFilters.due_date))
      }
      if (apiFilters?.is_active !== undefined) {
        params.append('is_active', String(apiFilters.is_active))
      }

      const response = await $fetch<CreditCard[]>(`/finance/credit-cards/?${params}`, {
        baseURL: config.public.apiBase,
        credentials: 'include'
      })
      
      creditCards.value = response
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to load credit cards'
      error.value = errorMessage
      console.error('Error loading credit cards:', err)
      return { 
        success: false, 
        error: { message: errorMessage, code: err?.status?.toString() } 
      }
    } finally {
      loading.value = false
    }
  }

  // Create a new credit card
  const createCreditCard = async (creditCardData: CreateCreditCardRequest): Promise<CreditCardApiResult<CreditCard>> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<CreditCard>('/finance/credit-cards/', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: creditCardData,
        credentials: 'include'
      })

      // Refresh credit cards after creation
      await loadCreditCards()
      
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to create credit card'
      error.value = errorMessage
      console.error('Error creating credit card:', err)
      return { 
        success: false, 
        error: { message: errorMessage, code: err?.status?.toString() } 
      }
    } finally {
      loading.value = false
    }
  }

  // Update an existing credit card
  const updateCreditCard = async (id: number, creditCardData: UpdateCreditCardRequest): Promise<CreditCardApiResult<CreditCard>> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<CreditCard>(`/finance/credit-cards/${id}/`, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        body: creditCardData,
        credentials: 'include'
      })

      // Refresh credit cards after update
      await loadCreditCards()
      
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to update credit card'
      error.value = errorMessage
      console.error('Error updating credit card:', err)
      return { 
        success: false, 
        error: { message: errorMessage, code: err?.status?.toString() } 
      }
    } finally {
      loading.value = false
    }
  }

  // Delete a credit card
  const deleteCreditCard = async (id: number): Promise<CreditCardApiResult<void>> => {
    loading.value = true
    error.value = null
    
    try {
      await $fetch(`/finance/credit-cards/${id}/`, {
        baseURL: config.public.apiBase,
        method: 'DELETE',
        credentials: 'include'
      })

      // Refresh credit cards after deletion
      await loadCreditCards()
      
      return { success: true }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to delete credit card'
      error.value = errorMessage
      console.error('Error deleting credit card:', err)
      return { 
        success: false, 
        error: { message: errorMessage, code: err?.status?.toString() } 
      }
    } finally {
      loading.value = false
    }
  }

  // Get credit card by ID
  const getCreditCard = async (id: number): Promise<CreditCardApiResult<CreditCard>> => {
    try {
      const response = await $fetch<CreditCard>(`/finance/credit-cards/${id}/`, {
        baseURL: config.public.apiBase,
        credentials: 'include'
      })
      
      return { success: true, data: response }
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to get credit card'
      error.value = errorMessage
      console.error('Error getting credit card:', err)
      return { 
        success: false, 
        error: { message: errorMessage, code: err?.status?.toString() } 
      }
    }
  }

  // Format credit card form data for API
  const formatCreditCardData = (form: CreditCardForm): CreateCreditCardRequest | UpdateCreditCardRequest => {
    return {
      name: form.name,
      close_date: form.close_date,
      due_date: form.due_date,
      is_active: form.is_active
    }
  }

  // Apply table filters and sorting
  const applyTableFilters = (newFilters: CreditCardTableFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const applyTableSort = (newSort: CreditCardTableSort) => {
    sort.value = newSort
  }

  // Get filtered and sorted credit cards
  const getFilteredCreditCards = computed(() => {
    let filtered = [...creditCards.value]

    // Apply search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(creditCard => 
        creditCard.name.toLowerCase().includes(searchTerm)
      )
    }

    // Apply close date filter
    if (filters.value.close_date) {
      filtered = filtered.filter(creditCard => 
        creditCard.close_date === filters.value.close_date
      )
    }

    // Apply due date filter
    if (filters.value.due_date) {
      filtered = filtered.filter(creditCard => 
        creditCard.due_date === filters.value.due_date
      )
    }

    // Apply active status filter
    if (filters.value.is_active !== undefined) {
      filtered = filtered.filter(creditCard => 
        creditCard.is_active === filters.value.is_active
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sort.value.key]
      const bValue = b[sort.value.key]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.value.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.value.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
      
      return 0
    })

    return filtered
  })

  // Get credit card statistics
  const getCreditCardStats = computed(() => {
    const total = creditCards.value.length
    const active = creditCards.value.filter(creditCard => creditCard.is_active).length
    const inactive = total - active
    
    // Group by close dates
    const closeDateGroups = creditCards.value.reduce((acc, card) => {
      acc[card.close_date] = (acc[card.close_date] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    // Group by due dates
    const dueDateGroups = creditCards.value.reduce((acc, card) => {
      acc[card.due_date] = (acc[card.due_date] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    return {
      total,
      active,
      inactive,
      closeDateGroups,
      dueDateGroups
    }
  })

  // Utility functions
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatDayOfMonth = (day: number): string => {
    return `${day}º`
  }

  const getCloseDateLabel = (day: number): string => {
    return `Fecha no dia ${formatDayOfMonth(day)}`
  }

  const getDueDateLabel = (day: number): string => {
    return `Vence no dia ${formatDayOfMonth(day)}`
  }

  // Get available days for select options
  const getAvailableDays = (): number[] => {
    return Array.from({ length: 31 }, (_, i) => i + 1)
  }

  // Initialize credit cards data
  const initialize = async (): Promise<void> => {
    await loadCreditCards()
  }

  return {
    // State
    creditCards: readonly(creditCards),
    loading: readonly(loading),
    error: readonly(error),
    filters: readonly(filters),
    sort: readonly(sort),
    
    // Computed
    filteredCreditCards: getFilteredCreditCards,
    creditCardStats: getCreditCardStats,
    
    // Methods
    loadCreditCards,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    getCreditCard,
    formatCreditCardData,
    applyTableFilters,
    applyTableSort,
    formatDate,
    formatDayOfMonth,
    getCloseDateLabel,
    getDueDateLabel,
    getAvailableDays,
    initialize,
    
    // Clear error
    clearError: () => { error.value = null }
  }
} 
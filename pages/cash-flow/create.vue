<template>
  <div class="py-8">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Create Cash Flow View</h1>
          <p class="mt-1 text-sm text-gray-500">
            Define groups and results to build your financial report
          </p>
        </div>
        <Button variant="outline" @click="goBack">
          Back to List
        </Button>
      </div>

      <!-- Error Alert -->
      <Alert v-if="viewsError" variant="destructive" class="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription class="break-words">{{ viewsError }}</AlertDescription>
      </Alert>

      <!-- Form -->
      <Card>
        <CardHeader>
          <CardTitle>View Details</CardTitle>
          <CardDescription>Enter a name for your cash flow view</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- View Name -->
          <div class="space-y-2">
            <Label>View Name *</Label>
            <Input
              v-model="viewForm.name"
              type="text"
              required
              placeholder="e.g., Monthly P&L"
            />
          </div>

          <!-- Groups Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">Groups</h3>
                <p class="text-sm text-gray-500">Group categories together</p>
              </div>
              <Button type="button" variant="outline" size="sm" @click="addGroup">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Group
              </Button>
            </div>

            <div v-if="viewForm.groups.length === 0" class="text-center py-8 text-gray-500 text-sm">
              No groups added yet. Click "Add Group" to get started.
            </div>

            <div
              v-for="(groupItem, index) in sortedItems.filter(item => item.type === 'group')"
              :key="`group-${groupItem.id || index}`"
              class="border rounded-lg p-4 space-y-3"
              :draggable="true"
              @dragstart="handleDragStart($event, index, 'group')"
              @dragover.prevent="handleDragOver($event, index, 'group')"
              @drop="handleDrop($event, index, 'group')"
              @dragend="handleDragEnd"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="cursor-move text-gray-400 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                    </svg>
                  </div>
                  <Badge variant="outline">Position {{ groupItem.position }}</Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="removeGroupByItem(groupItem)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </Button>
              </div>

              <div class="space-y-2">
                <Label>Group Name *</Label>
                <Input
                  :model-value="groupItem.name"
                  @update:model-value="(value: string | number) => updateGroupName(groupItem, String(value))"
                  type="text"
                  required
                  placeholder="e.g., Revenue"
                />
              </div>

              <div class="space-y-2">
                <Label>Categories</Label>
                <div class="border rounded-md p-3 max-h-48 overflow-y-auto">
                  <div v-if="availableCategories.length === 0" class="text-sm text-gray-500">
                    No categories available. Create categories first.
                  </div>
                  <div v-else class="space-y-2">
                    <div
                      v-for="category in availableCategories"
                      :key="category.id"
                      class="flex items-center space-x-2"
                    >
                      <Checkbox
                        :checked="(groupItem.category_ids || []).includes(category.id)"
                        @update:checked="(checked: boolean) => toggleCategory(groupItem, category.id, checked)"
                        :id="`group-${index}-cat-${category.id}`"
                      />
                      <Label
                        :for="`group-${index}-cat-${category.id}`"
                        class="text-sm font-normal cursor-pointer flex items-center gap-2"
                      >
                        {{ category.name }}
                        <Badge
                          :variant="category.transaction_type === 'income' ? 'secondary' : 'destructive'"
                          class="text-xs"
                        >
                          {{ category.transaction_type }}
                        </Badge>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Section -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold">Results</h3>
                <p class="text-sm text-gray-500">Add intermediate calculation lines</p>
              </div>
              <Button type="button" variant="outline" size="sm" @click="addResult">
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Add Result
              </Button>
            </div>

            <div v-if="viewForm.results.length === 0" class="text-center py-8 text-gray-500 text-sm">
              No results added yet. Click "Add Result" to add calculation lines.
            </div>

            <div
              v-for="(resultItem, index) in sortedItems.filter(item => item.type === 'result')"
              :key="`result-${resultItem.id || index}`"
              class="border rounded-lg p-4 space-y-3"
              :draggable="true"
              @dragstart="handleDragStart($event, index, 'result')"
              @dragover.prevent="handleDragOver($event, index, 'result')"
              @drop="handleDrop($event, index, 'result')"
              @dragend="handleDragEnd"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="cursor-move text-gray-400 hover:text-gray-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                    </svg>
                  </div>
                  <Badge variant="outline">Position {{ resultItem.position }}</Badge>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  @click="removeResultByItem(resultItem)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </Button>
              </div>

              <div class="space-y-2">
                <Label>Result Name *</Label>
                <Input
                  :model-value="resultItem.name"
                  @update:model-value="(value: string | number) => updateResultName(resultItem, String(value))"
                  type="text"
                  required
                  placeholder="e.g., Gross Margin"
                />
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" @click="goBack" :disabled="isSubmitting">
              Cancel
            </Button>
            <Button type="button" @click="handleSave" :disabled="isSubmitting || !isFormValid">
              <span v-if="isSubmitting" class="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
              {{ isSubmitting ? 'Saving...' : 'Save' }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import type {
  CashFlowViewForm,
  CashFlowGroupForm,
  CashFlowResultForm
} from '~/types/cashFlowViews'

// Page metadata
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()

// Composables
const {
  loading: viewsLoading,
  error: viewsError,
  createCashFlowView,
  formatViewData,
  clearError: clearViewsError
} = useCashFlowViews()

const { categories, loadCategories } = useCategories()

// Form state
const viewForm = ref<CashFlowViewForm>({
  name: '',
  groups: [],
  results: []
})

const isSubmitting = ref(false)

// Drag and drop state
const draggedItem = ref<{ index: number; type: 'group' | 'result' } | null>(null)
const dragOverIndex = ref<number | null>(null)

// Computed
const availableCategories = computed(() => {
  return categories.value.filter(cat => cat.is_active)
})

// Combined sorted items for drag and drop
const sortedItems = computed(() => {
  const items: Array<{ type: 'group' | 'result'; id?: number; position: number; name: string; category_ids?: number[] }> = []
  
  viewForm.value.groups.forEach(group => {
    items.push({
      type: 'group',
      id: group.id,
      position: group.position,
      name: group.name,
      category_ids: group.category_ids || []
    })
  })
  
  viewForm.value.results.forEach(result => {
    items.push({
      type: 'result',
      id: result.id,
      position: result.position,
      name: result.name
    })
  })
  
  return items.sort((a, b) => a.position - b.position)
})

const isFormValid = computed(() => {
  if (!viewForm.value.name.trim()) return false
  
  const allPositions = [
    ...viewForm.value.groups.map(g => g.position),
    ...viewForm.value.results.map(r => r.position)
  ]
  
  // Check for duplicate positions
  const uniquePositions = new Set(allPositions)
  if (uniquePositions.size !== allPositions.length) return false
  
  // Check that all groups and results have names
  const allHaveNames = 
    viewForm.value.groups.every(g => g.name.trim()) &&
    viewForm.value.results.every(r => r.name.trim())
  
  return allHaveNames && (viewForm.value.groups.length > 0 || viewForm.value.results.length > 0)
})

// Methods
const goBack = () => {
  router.push('/cash-flow')
}

const addGroup = () => {
  const maxPosition = Math.max(
    0,
    ...viewForm.value.groups.map(g => g.position),
    ...viewForm.value.results.map(r => r.position)
  )
  
  viewForm.value.groups.push({
    name: '',
    position: maxPosition + 1,
    category_ids: []
  })
  
  renumberPositions()
}

const removeGroupByItem = (groupItem: any) => {
  const groupIndex = viewForm.value.groups.findIndex(g => 
    groupItem.id ? g.id === groupItem.id : g.position === groupItem.position
  )
  
  if (groupIndex > -1) {
    viewForm.value.groups.splice(groupIndex, 1)
    renumberPositions()
  }
}

const addResult = () => {
  const maxPosition = Math.max(
    0,
    ...viewForm.value.groups.map(g => g.position),
    ...viewForm.value.results.map(r => r.position)
  )
  
  viewForm.value.results.push({
    name: '',
    position: maxPosition + 1
  })
  
  renumberPositions()
}

const removeResultByItem = (resultItem: any) => {
  const resultIndex = viewForm.value.results.findIndex(r => 
    resultItem.id ? r.id === resultItem.id : r.position === resultItem.position
  )
  
  if (resultIndex > -1) {
    viewForm.value.results.splice(resultIndex, 1)
    renumberPositions()
  }
}

const updateGroupName = (groupItem: any, value: string) => {
  const groupIndex = viewForm.value.groups.findIndex(g => 
    groupItem.id ? g.id === groupItem.id : g.position === groupItem.position
  )
  
  if (groupIndex > -1) {
    viewForm.value.groups[groupIndex].name = value
  }
}

const updateResultName = (resultItem: any, value: string) => {
  const resultIndex = viewForm.value.results.findIndex(r => 
    resultItem.id ? r.id === resultItem.id : r.position === resultItem.position
  )
  
  if (resultIndex > -1) {
    viewForm.value.results[resultIndex].name = value
  }
}

const toggleCategory = (groupItem: any, categoryId: number, checked: boolean) => {
  const groupIndex = viewForm.value.groups.findIndex(g => 
    groupItem.id ? g.id === groupItem.id : g.position === groupItem.position
  )
  
  if (groupIndex > -1) {
    if (checked) {
      if (!viewForm.value.groups[groupIndex].category_ids.includes(categoryId)) {
        viewForm.value.groups[groupIndex].category_ids.push(categoryId)
      }
    } else {
      viewForm.value.groups[groupIndex].category_ids = 
        viewForm.value.groups[groupIndex].category_ids.filter(id => id !== categoryId)
    }
  }
}

const renumberPositions = () => {
  const allItems = sortedItems.value
  allItems.forEach((item, index) => {
    const newPosition = index + 1
    
    if (item.type === 'group') {
      const groupIndex = viewForm.value.groups.findIndex(g => 
        g.id === item.id ? g.id === item.id : g.position === item.position
      )
      if (groupIndex > -1) {
        viewForm.value.groups[groupIndex].position = newPosition
      }
    } else {
      const resultIndex = viewForm.value.results.findIndex(r => 
        r.id === item.id ? r.id === item.id : r.position === item.position
      )
      if (resultIndex > -1) {
        viewForm.value.results[resultIndex].position = newPosition
      }
    }
  })
}

const handleDragStart = (event: DragEvent, index: number, type: 'group' | 'result') => {
  draggedItem.value = { index, type }
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const handleDragOver = (event: DragEvent, index: number, type: 'group' | 'result') => {
  if (!draggedItem.value) return
  
  if (draggedItem.value.type !== type) return
  
  dragOverIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDrop = (event: DragEvent, dropIndex: number, type: 'group' | 'result') => {
  event.preventDefault()
  
  if (!draggedItem.value || draggedItem.value.type !== type) return
  
  const dragIndex = draggedItem.value.index
  
  if (dragIndex === dropIndex) {
    dragOverIndex.value = null
    draggedItem.value = null
    return
  }
  
  // Reorder items by working with sorted items and then updating positions
  if (type === 'group') {
    const groups = sortedItems.value.filter(item => item.type === 'group')
    const draggedGroup = groups[dragIndex]
    const dropGroup = groups[dropIndex]
    
    // Find actual indices in viewForm
    const draggedIndex = viewForm.value.groups.findIndex(g => 
      draggedGroup.id ? g.id === draggedGroup.id : g.position === draggedGroup.position
    )
    const dropIndexActual = viewForm.value.groups.findIndex(g => 
      dropGroup.id ? g.id === dropGroup.id : g.position === dropGroup.position
    )
    
    if (draggedIndex > -1 && dropIndexActual > -1) {
      const [group] = viewForm.value.groups.splice(draggedIndex, 1)
      viewForm.value.groups.splice(dropIndexActual, 0, group)
    }
  } else {
    const results = sortedItems.value.filter(item => item.type === 'result')
    const draggedResult = results[dragIndex]
    const dropResult = results[dropIndex]
    
    // Find actual indices in viewForm
    const draggedIndex = viewForm.value.results.findIndex(r => 
      draggedResult.id ? r.id === draggedResult.id : r.position === draggedResult.position
    )
    const dropIndexActual = viewForm.value.results.findIndex(r => 
      dropResult.id ? r.id === dropResult.id : r.position === dropResult.position
    )
    
    if (draggedIndex > -1 && dropIndexActual > -1) {
      const [result] = viewForm.value.results.splice(draggedIndex, 1)
      viewForm.value.results.splice(dropIndexActual, 0, result)
    }
  }
  
  renumberPositions()
  dragOverIndex.value = null
  draggedItem.value = null
}

const handleDragEnd = () => {
  dragOverIndex.value = null
  draggedItem.value = null
}

const handleSave = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  clearViewsError()
  
  try {
    const viewData = formatViewData(viewForm.value)
    const result = await createCashFlowView(viewData)
    
    if (result.success) {
      router.push('/cash-flow')
    } else {
      console.error('Failed to save view:', result.error)
    }
  } catch (error: any) {
    console.error('Unexpected error saving view:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Initialize
onMounted(async () => {
  await loadCategories()
})
</script>


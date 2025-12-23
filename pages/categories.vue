<template>
  <div class="py-8">
    <!-- Page Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
          <p class="mt-1 text-sm text-gray-500">Manage your income and expense categories</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Category
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
            <select
              v-model="filters.transaction_type"
              @change="handleLoadCategories"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
            <select
              v-model="filters.parent"
              @change="handleLoadCategories"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="null">Top Level Only</option>
              <option v-for="category in parentCategories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="handleLoadCategories"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Categories Grid -->
      <div v-else-if="categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in categories"
          :key="category.id"
          class="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      category.transaction_type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ category.transaction_type }}
                  </span>
                  <span
                    v-if="!category.is_active"
                    class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                  >
                    Inactive
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editCategory(category)"
                  class="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit category"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="handleDeleteCategory(category)"
                  class="text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete category"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="category.parent" class="text-sm text-gray-500 mb-2">
              Parent: {{ getParentName(category.parent) }}
            </div>
            <div class="text-sm text-gray-600">
              Created: {{ formatDate(category.created_at) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="mx-auto h-12 w-12 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new category.</p>
        <div class="mt-6">
          <button
            @click="showCreateModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Edit Category' : 'Create Category' }}
          </h3>
          <form @submit.prevent="showEditModal ? handleUpdateCategory() : handleCreateCategory()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  maxlength="100"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category name"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                <select
                  v-model="form.transaction_type"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Parent Category (Optional)</label>
                <select
                  v-model="form.parent"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No parent (top-level)</option>
                  <option v-for="category in availableParents" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category description"
                ></textarea>
              </div>

              <div class="flex items-center">
                <input
                  v-model="form.is_active"
                  type="checkbox"
                  id="is_active"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="is_active" class="ml-2 block text-sm text-gray-900">
                  Active (can be used for transactions)
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {{ submitting ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define page metadata
definePageMeta({
  middleware: 'auth'
})

// Use the categories composable
const {
  categories,
  parentCategories,
  loading,
  error,
  loadCategories,
  loadParentCategories,
  createCategory: createCategoryApi,
  updateCategory: updateCategoryApi,
  deleteCategory: deleteCategoryApi,
  getAvailableParents,
  getParentName,
  formatCategoryData,
  initialize,
  clearError
} = useCategories()

// Local state
const submitting = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref(null)

const filters = ref({
  transaction_type: '',
  parent: ''
})

const form = ref({
  name: '',
  transaction_type: '',
  description: '',
  parent: '',
  is_active: true
})

// Computed properties
const availableParents = computed(() => {
  return getAvailableParents(form.value.transaction_type, editingCategory.value?.id)
})

// Methods
const handleLoadCategories = async () => {
  const filtersData = {
    transaction_type: filters.value.transaction_type || null,
    parent: filters.value.parent === 'null' ? null : (filters.value.parent || null)
  }
  
  const result = await loadCategories(filtersData)
  if (!result.success) {
    // You might want to show a toast notification here
    console.error('Failed to load categories:', result.error?.message)
  }
}

const handleCreateCategory = async () => {
  submitting.value = true
  try {
    const categoryData = formatCategoryData(form.value)
    const result = await createCategoryApi(categoryData)
    
    if (result.success) {
      closeModal()
    } else {
      // You might want to show a toast notification here
      console.error('Failed to create category:', result.error?.message)
    }
  } catch (error) {
    console.error('Error creating category:', error)
  } finally {
    submitting.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    transaction_type: category.transaction_type,
    description: category.description || '',
    parent: category.parent || '',
    is_active: category.is_active
  }
  showEditModal.value = true
}

const handleUpdateCategory = async () => {
  submitting.value = true
  try {
    const categoryData = formatCategoryData(form.value)
    const result = await updateCategoryApi(editingCategory.value.id, categoryData)
    
    if (result.success) {
      closeModal()
    } else {
      // You might want to show a toast notification here
      console.error('Failed to update category:', result.error?.message)
    }
  } catch (error) {
    console.error('Error updating category:', error)
  } finally {
    submitting.value = false
  }
}

const handleDeleteCategory = async (category) => {
  if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
    return
  }

  const result = await deleteCategoryApi(category.id)
  if (!result.success) {
    // You might want to show a toast notification here
    console.error('Failed to delete category:', result.error?.message)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  form.value = {
    name: '',
    transaction_type: '',
    description: '',
    parent: '',
    is_active: true
  }
  clearError()
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return 'N/A'
    }
    return date.toLocaleDateString()
  } catch (error) {
    console.warn('Error parsing date:', dateString, error)
    return 'N/A'
  }
}

// Load data on mount
onMounted(async () => {
  await initialize()
})
</script> 
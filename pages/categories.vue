<template>
  <div class="py-8">
    <!-- Categories Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <!-- Section Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
          <p class="mt-1 text-sm text-gray-500">Manage your income and expense categories</p>
        </div>
        <button
          @click="showCreateCategoryModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Category
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
            <select
              v-model="categoryFilters.transaction_type"
              @change="handleLoadCategories"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
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
      <div v-if="categoriesLoading" class="flex justify-center items-center py-12">
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
            @click="showCreateCategoryModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>

    <!-- Subcategories Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Subcategories</h2>
          <p class="mt-1 text-sm text-gray-500">Manage subcategories for your categories</p>
        </div>
        <button
          @click="showCreateSubcategoryModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Subcategory
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-48">
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              v-model="subcategoryFilters.category"
              @change="handleLoadSubcategories"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="handleLoadSubcategories"
              class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="subcategoriesLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Subcategories Grid -->
      <div v-else-if="subcategories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="subcategory in subcategories"
          :key="subcategory.id"
          class="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ subcategory.name }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      subcategory.transaction_type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ subcategory.transaction_type }}
                  </span>
                  <span
                    v-if="!subcategory.is_active"
                    class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                  >
                    Inactive
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  @click="editSubcategory(subcategory)"
                  class="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit subcategory"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="handleDeleteSubcategory(subcategory)"
                  class="text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete subcategory"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="text-sm text-gray-500 mb-2">
              Category: {{ getCategoryName(subcategory.category) }}
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">No subcategories found</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new subcategory.</p>
        <div class="mt-6">
          <button
            @click="showCreateSubcategoryModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Subcategory
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Category Modal -->
    <div v-if="showCreateCategoryModal || showEditCategoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditCategoryModal ? 'Edit Category' : 'Create Category' }}
          </h3>
          <form @submit.prevent="showEditCategoryModal ? handleUpdateCategory() : handleCreateCategory()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  v-model="categoryForm.name"
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
                  v-model="categoryForm.transaction_type"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  v-model="categoryForm.description"
                  rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category description"
                ></textarea>
              </div>

              <div class="flex items-center">
                <input
                  v-model="categoryForm.is_active"
                  type="checkbox"
                  id="category_is_active"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="category_is_active" class="ml-2 block text-sm text-gray-900">
                  Active (can be used for transactions)
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closeCategoryModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="categorySubmitting"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {{ categorySubmitting ? 'Saving...' : (showEditCategoryModal ? 'Update' : 'Create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Create/Edit Subcategory Modal -->
    <div v-if="showCreateSubcategoryModal || showEditSubcategoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditSubcategoryModal ? 'Edit Subcategory' : 'Create Subcategory' }}
          </h3>
          <form @submit.prevent="showEditSubcategoryModal ? handleUpdateSubcategory() : handleCreateSubcategory()">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  v-model="subcategoryForm.name"
                  type="text"
                  required
                  maxlength="100"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Subcategory name"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  v-model="subcategoryForm.category"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  v-model="subcategoryForm.description"
                  rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Subcategory description"
                ></textarea>
              </div>

              <div class="flex items-center">
                <input
                  v-model="subcategoryForm.is_active"
                  type="checkbox"
                  id="subcategory_is_active"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="subcategory_is_active" class="ml-2 block text-sm text-gray-900">
                  Active (can be used for transactions)
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closeSubcategoryModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="subcategorySubmitting"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {{ subcategorySubmitting ? 'Saving...' : (showEditSubcategoryModal ? 'Update' : 'Create') }}
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
  loading: categoriesLoading,
  error: categoriesError,
  loadCategories,
  createCategory: createCategoryApi,
  updateCategory: updateCategoryApi,
  deleteCategory: deleteCategoryApi,
  formatCategoryData,
  initialize: initializeCategories,
  clearError: clearCategoriesError
} = useCategories()

// Use the subcategories composable
const {
  subcategories,
  loading: subcategoriesLoading,
  error: subcategoriesError,
  loadSubcategories,
  createSubcategory: createSubcategoryApi,
  updateSubcategory: updateSubcategoryApi,
  deleteSubcategory: deleteSubcategoryApi,
  formatSubcategoryData,
  initialize: initializeSubcategories,
  clearError: clearSubcategoriesError
} = useSubcategories()

// Category state
const categorySubmitting = ref(false)
const showCreateCategoryModal = ref(false)
const showEditCategoryModal = ref(false)
const editingCategory = ref(null)

const categoryFilters = ref({
  transaction_type: ''
})

const categoryForm = ref({
  name: '',
  transaction_type: '',
  description: '',
  is_active: true
})

// Subcategory state
const subcategorySubmitting = ref(false)
const showCreateSubcategoryModal = ref(false)
const showEditSubcategoryModal = ref(false)
const editingSubcategory = ref(null)

const subcategoryFilters = ref({
  category: ''
})

const subcategoryForm = ref({
  name: '',
  category: '',
  description: '',
  is_active: true
})

// Methods
const handleLoadCategories = async () => {
  const filtersData = {
    transaction_type: categoryFilters.value.transaction_type || null
  }
  
  const result = await loadCategories(filtersData)
  if (!result.success) {
    console.error('Failed to load categories:', result.error?.message)
  }
}

const handleCreateCategory = async () => {
  categorySubmitting.value = true
  try {
    const categoryData = formatCategoryData(categoryForm.value)
    const result = await createCategoryApi(categoryData)
    
    if (result.success) {
      closeCategoryModal()
      // Reload subcategories to refresh category dropdown
      await handleLoadSubcategories()
    } else {
      console.error('Failed to create category:', result.error?.message)
    }
  } catch (error) {
    console.error('Error creating category:', error)
  } finally {
    categorySubmitting.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    transaction_type: category.transaction_type,
    description: category.description || '',
    is_active: category.is_active
  }
  showEditCategoryModal.value = true
}

const handleUpdateCategory = async () => {
  categorySubmitting.value = true
  try {
    const categoryData = formatCategoryData(categoryForm.value)
    const result = await updateCategoryApi(editingCategory.value.id, categoryData)
    
    if (result.success) {
      closeCategoryModal()
      // Reload subcategories to refresh category dropdown
      await handleLoadSubcategories()
    } else {
      console.error('Failed to update category:', result.error?.message)
    }
  } catch (error) {
    console.error('Error updating category:', error)
  } finally {
    categorySubmitting.value = false
  }
}

const handleDeleteCategory = async (category) => {
  if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
    return
  }

  const result = await deleteCategoryApi(category.id)
  if (!result.success) {
    console.error('Failed to delete category:', result.error?.message)
  } else {
    // Reload subcategories to refresh category dropdown
    await handleLoadSubcategories()
  }
}

const closeCategoryModal = () => {
  showCreateCategoryModal.value = false
  showEditCategoryModal.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    transaction_type: '',
    description: '',
    is_active: true
  }
  clearCategoriesError()
}

const handleLoadSubcategories = async () => {
  const filtersData = {
    category: subcategoryFilters.value.category ? Number(subcategoryFilters.value.category) : null
  }
  
  const result = await loadSubcategories(filtersData)
  if (!result.success) {
    console.error('Failed to load subcategories:', result.error?.message)
  }
}

const handleCreateSubcategory = async () => {
  subcategorySubmitting.value = true
  try {
    const subcategoryData = formatSubcategoryData(subcategoryForm.value)
    const result = await createSubcategoryApi(subcategoryData)
    
    if (result.success) {
      closeSubcategoryModal()
    } else {
      console.error('Failed to create subcategory:', result.error?.message)
    }
  } catch (error) {
    console.error('Error creating subcategory:', error)
  } finally {
    subcategorySubmitting.value = false
  }
}

const editSubcategory = (subcategory) => {
  editingSubcategory.value = subcategory
  subcategoryForm.value = {
    name: subcategory.name,
    category: String(subcategory.category),
    description: subcategory.description || '',
    is_active: subcategory.is_active
  }
  showEditSubcategoryModal.value = true
}

const handleUpdateSubcategory = async () => {
  subcategorySubmitting.value = true
  try {
    const subcategoryData = formatSubcategoryData(subcategoryForm.value)
    const result = await updateSubcategoryApi(editingSubcategory.value.id, subcategoryData)
    
    if (result.success) {
      closeSubcategoryModal()
    } else {
      console.error('Failed to update subcategory:', result.error?.message)
    }
  } catch (error) {
    console.error('Error updating subcategory:', error)
  } finally {
    subcategorySubmitting.value = false
  }
}

const handleDeleteSubcategory = async (subcategory) => {
  if (!confirm(`Are you sure you want to delete "${subcategory.name}"?`)) {
    return
  }

  const result = await deleteSubcategoryApi(subcategory.id)
  if (!result.success) {
    console.error('Failed to delete subcategory:', result.error?.message)
  }
}

const closeSubcategoryModal = () => {
  showCreateSubcategoryModal.value = false
  showEditSubcategoryModal.value = false
  editingSubcategory.value = null
  subcategoryForm.value = {
    name: '',
    category: '',
    description: '',
    is_active: true
  }
  clearSubcategoriesError()
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : 'Unknown'
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
  await Promise.all([initializeCategories(), initializeSubcategories()])
})
</script>

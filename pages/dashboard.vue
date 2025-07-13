<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-gray-600 mt-2">Welcome to your personal finance dashboard</p>
          </div>
          <button
            @click="logout"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- User Info Card -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <p class="mt-1 text-sm text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <p class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Username</label>
            <p class="mt-1 text-sm text-gray-900">{{ user?.username }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Member Since</label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDate(user?.date_joined) }}</p>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Quick Stats -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Total Balance</span>
              <span class="font-semibold text-green-600">$0.00</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">This Month</span>
              <span class="font-semibold text-blue-600">$0.00</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Transactions</span>
              <span class="font-semibold">0</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div class="text-center text-gray-500 py-8">
            <p>No recent activity</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div class="space-y-3">
            <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
              Add Transaction
            </button>
            <button class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
              Add Income
            </button>
            <NuxtLink
              to="/categories"
              class="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors inline-block text-center"
            >
              Manage Categories
            </NuxtLink>
            <button class="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
              View Reports
            </button>
          </div>
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

const { user, logout } = useAuth()

// Format date helper function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 
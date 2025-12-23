<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle class="text-3xl">Dashboard</CardTitle>
          <CardDescription>Welcome to your personal finance dashboard</CardDescription>
        </CardHeader>
      </Card>

      <!-- User Info Card -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label class="text-sm text-muted-foreground">Name</Label>
            <p class="mt-1 text-sm text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</p>
          </div>
          <div>
            <Label class="text-sm text-muted-foreground">Email</Label>
            <p class="mt-1 text-sm text-gray-900">{{ user?.email }}</p>
          </div>
          <div>
            <Label class="text-sm text-muted-foreground">Username</Label>
            <p class="mt-1 text-sm text-gray-900">{{ user?.username }}</p>
          </div>
          <div>
            <Label class="text-sm text-muted-foreground">Member Since</Label>
            <p class="mt-1 text-sm text-gray-900">{{ formatDate(user?.date_joined) }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Dashboard Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Quick Stats -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
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
          </CardContent>
        </Card>

        <!-- Recent Activity -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent class="text-center text-gray-500 py-8">
            <p>No recent activity</p>
          </CardContent>
        </Card>

        <!-- Quick Actions -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <Button as-child class="w-full">
              <NuxtLink to="/transactions">Add Transaction</NuxtLink>
            </Button>
            <Button class="w-full" variant="secondary">
              Add Income
            </Button>
            <Button as-child class="w-full" variant="secondary">
              <NuxtLink to="/categories">Manage Categories</NuxtLink>
            </Button>
            <Button as-child class="w-full">
              <NuxtLink to="/transactions">View Transactions</NuxtLink>
            </Button>
            <Button class="w-full" variant="outline">
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

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
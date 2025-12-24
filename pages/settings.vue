<template>
  <div class="py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <Card class="mb-8">
        <CardHeader>
          <CardTitle class="text-3xl">Settings</CardTitle>
          <CardDescription>Manage your application settings and preferences</CardDescription>
        </CardHeader>
      </Card>

      <!-- Cashflows Section -->
      <Card class="mb-8">
        <CardHeader>
          <div class="flex justify-between items-center">
            <div>
              <CardTitle>Cashflows</CardTitle>
              <CardDescription>Manage your cash flow views and configurations</CardDescription>
            </div>
            <Button @click="handleCreateCashflow">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Create Cashflow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-500">Cashflow management options will be available here.</p>
        </CardContent>
      </Card>
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

// Define page metadata
definePageMeta({
  middleware: 'auth'
})

const handleCreateCashflow = () => {
  // TODO: Implement create cashflow functionality
  console.log('Create cashflow clicked')
}
</script>


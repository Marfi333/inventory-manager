<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Overview of your inventory system</p>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <i class="text-4xl text-indigo-600 pi pi-spinner pi-spin dark:text-indigo-400"></i>
    </div>

    <!-- Statistics Cards -->
    <div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div class="p-6 transition-colors duration-200 bg-white border rounded-lg shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg dark:bg-indigo-900/50">
              <i class="text-xl text-indigo-600 pi pi-folder dark:text-indigo-400"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Categories</p>
            <p class="text-2xl font-semibold text-slate-900 dark:text-white">{{ stats.totalCategories }}</p>
          </div>
        </div>
      </div>

      <div class="p-6 transition-colors duration-200 bg-white border rounded-lg shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
              <i class="text-xl pi pi-box text-emerald-600 dark:text-emerald-400"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Items</p>
            <p class="text-2xl font-semibold text-slate-900 dark:text-white">{{ stats.totalItems }}</p>
          </div>
        </div>
      </div>

      <div class="p-6 transition-colors duration-200 bg-white border rounded-lg shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-900/50">
              <i class="text-xl text-purple-600 pi pi-chart-line dark:text-purple-400"></i>
            </div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">Total Stock</p>
            <p class="text-2xl font-semibold text-slate-900 dark:text-white">{{ stats.totalStock }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="transition-colors duration-200 bg-white border rounded-lg shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-medium text-slate-900 dark:text-white">Recent Items</h3>
      </div>
      <div class="p-6">
        <div v-if="recentItems.length === 0" class="py-12 text-center">
          <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700">
            <i class="text-2xl pi pi-inbox text-slate-400 dark:text-slate-500"></i>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400">No items found</p>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="item in recentItems"
            :key="item.id"
            class="flex items-center justify-between p-4 transition-colors duration-200 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <div class="flex items-center space-x-4">
              <div class="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg dark:bg-indigo-900/50">
                <i class="text-indigo-600 pi pi-box dark:text-indigo-400"></i>
              </div>
              <div>
                <p class="font-medium text-slate-900 dark:text-white">{{ item.name }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ item.description || 'No description' }}</p>
              </div>
            </div>
            <div class="text-right">
              <div class="flex items-center mb-1 text-sm font-medium text-slate-900 dark:text-white">
                <i class="mr-1 text-xs pi pi-hashtag"></i>
                <span>{{ item.quantity }}</span>
              </div>
              <div class="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <i class="mr-1 text-xs pi pi-qrcode"></i>
                <span>{{ item.skus.length > 0 ? item.skus.join(', ') : 'No SKUs' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { apiService } from '../services/api';
import type { Category, Item } from '../types';

const loading = ref(true);
const categories = ref<Category[]>([]);
const items = ref<Item[]>([]);

const stats = computed(() => ({
  totalCategories: categories.value.length,
  totalItems: items.value.length,
  totalStock: items.value.reduce((sum, item) => sum + item.quantity, 0),
}));

const recentItems = computed(() => 
  items.value
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
);

const loadData = async () => {
  try {
    loading.value = true;
    const [categoriesData, itemsData] = await Promise.all([
      apiService.getCategories(),
      apiService.getItems(),
    ]);
    categories.value = categoriesData;
    items.value = itemsData;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script> 
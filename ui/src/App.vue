<script setup lang="ts">
import { ref } from 'vue';
import Toast from 'primevue/toast';
import Sidebar from './components/Sidebar.vue';

const sidebarRef = ref();

const toggleMobileMenu = () => {
  sidebarRef.value?.toggleMobileMenu();
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
    <!-- Sidebar -->
    <Sidebar ref="sidebarRef" />

    <!-- Mobile header -->
    <div class="lg:hidden bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div class="flex items-center justify-between px-4 py-3">
        <button 
          @click="toggleMobileMenu"
          class="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white p-2 rounded transition-colors duration-200"
        >
          <i class="pi pi-bars text-xl"></i>
        </button>
        <div class="flex items-center">
          <i class="pi pi-warehouse text-indigo-600 dark:text-indigo-400 text-xl mr-2"></i>
          <span class="font-semibold text-slate-900 dark:text-white">Inventory</span>
        </div>
        <div class="w-10"></div> <!-- Spacer for centering -->
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:ml-60">
      <main class="p-4 lg:p-6">
        <router-view />
      </main>
    </div>

    <!-- Toast for notifications -->
    <Toast position="bottom-right" />
  </div>
</template>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.dark ::-webkit-scrollbar-track {
  background: #1e293b;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>

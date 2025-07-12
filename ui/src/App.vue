<script setup lang="ts">
import { ref } from 'vue'
import Toast from 'primevue/toast'
import Sidebar from './components/Sidebar.vue'

const sidebarRef = ref()

const toggleMobileMenu = () => {
  sidebarRef.value?.toggleMobileMenu()
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-200 bg-slate-50 dark:bg-slate-900">
    <Sidebar ref="sidebarRef" />

    <div
      class="transition-colors duration-200 bg-white border-b shadow-sm lg:hidden dark:bg-slate-800 border-slate-200 dark:border-slate-700"
    >
      <div class="flex items-center justify-between px-4 py-3">
        <button
          @click="toggleMobileMenu"
          class="p-2 transition-colors duration-200 rounded text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <i class="text-xl pi pi-bars"></i>
        </button>
        <div class="flex items-center">
          <i class="mr-2 text-xl text-indigo-600 pi pi-warehouse dark:text-indigo-400"></i>
          <span class="font-semibold text-slate-900 dark:text-white">Inventory</span>
        </div>
        <div class="w-10"></div>
      </div>
    </div>

    <div class="lg:ml-60">
      <main class="p-4 lg:p-6">
        <router-view />
      </main>
    </div>

    <Toast position="bottom-right" />
  </div>
</template>

<style scoped>
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

<style>
.p-toast.p-toast-bottom-right {
  position: fixed !important;
  bottom: 1rem !important;
  right: 1rem !important;
  z-index: 9999 !important;
  width: auto !important;
  max-width: 400px !important;
}

.p-toast .p-toast-message {
  position: relative !important;
  background: white !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  overflow: hidden !important;
  transition: all 0.3s ease !important;
  transform: translateY(0) scale(1) !important;
  opacity: 1 !important;
  min-height: 60px !important;
  cursor: pointer !important;
  margin-bottom: 0.5rem !important;
}

.dark .p-toast .p-toast-message {
  background: #1e293b !important;
  border-color: #334155 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2) !important;
}

.p-toast .p-toast-message:not(:last-child) {
  position: absolute !important;
  bottom: 0 !important;
  right: 0 !important;
  left: 0 !important;
  margin-bottom: 0 !important;
}

.p-toast .p-toast-message:nth-last-child(2) {
  transform: translateY(-12px) scale(0.98) !important;
  opacity: 0.9 !important;
  z-index: -1 !important;
}

.p-toast .p-toast-message:nth-last-child(3) {
  transform: translateY(-24px) scale(0.96) !important;
  opacity: 0.8 !important;
  z-index: -2 !important;
}

.p-toast .p-toast-message:nth-last-child(4) {
  transform: translateY(-36px) scale(0.94) !important;
  opacity: 0.7 !important;
  z-index: -3 !important;
}

.p-toast .p-toast-message:nth-last-child(5) {
  transform: translateY(-48px) scale(0.92) !important;
  opacity: 0.6 !important;
  z-index: -4 !important;
}

.p-toast .p-toast-message:nth-last-child(n + 6) {
  display: none !important;
}

.p-toast:hover .p-toast-message:not(:last-child) {
  position: relative !important;
  transform: translateY(0) scale(1) !important;
  opacity: 1 !important;
  z-index: auto !important;
  margin-bottom: 0.5rem !important;
}

.p-toast:hover .p-toast-message:nth-last-child(n + 6) {
  display: block !important;
  transform: translateY(0) scale(1) !important;
  opacity: 1 !important;
  margin-bottom: 0.5rem !important;
}

.p-toast-message-content {
  display: flex !important;
  align-items: center !important;
  padding: 1rem !important;
  gap: 0.75rem !important;
  height: 100% !important;
}

.p-toast-message-icon {
  flex-shrink: 0 !important;
  font-size: 1.25rem !important;
}

.p-toast-message-text {
  flex: 1 !important;
  min-width: 0 !important;
}

.p-toast-summary {
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: #1f2937 !important;
  margin: 0 !important;
}

.dark .p-toast-summary {
  color: #f9fafb !important;
}

.p-toast-detail {
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
  color: #6b7280 !important;
  margin: 0 !important;
  margin-top: 0.25rem !important;
}

.dark .p-toast-detail {
  color: #9ca3af !important;
}

.p-toast-message-button {
  background: transparent !important;
  border: none !important;
  color: #6b7280 !important;
  cursor: pointer !important;
  padding: 0.25rem !important;
  border-radius: 0.25rem !important;
  transition: all 0.2s ease !important;
}

.dark .p-toast-message-button {
  color: #9ca3af !important;
}

.p-toast-message-button:hover {
  background: #f3f4f6 !important;
  color: #374151 !important;
}

.dark .p-toast-message-button:hover {
  background: #374151 !important;
  color: #d1d5db !important;
}

.p-toast-message-success {
  border-left: 4px solid #10b981 !important;
}

.p-toast-message-success .p-toast-message-icon {
  color: #10b981 !important;
}

.p-toast-message-error {
  border-left: 4px solid #ef4444 !important;
}

.p-toast-message-error .p-toast-message-icon {
  color: #ef4444 !important;
}

.p-toast-message-warn {
  border-left: 4px solid #f59e0b !important;
}

.p-toast-message-warn .p-toast-message-icon {
  color: #3b82f6 !important;
}

.p-toast-message-info {
  border-left: 4px solid #3b82f6 !important;
}

.p-toast-message-info .p-toast-message-icon {
  color: #3b82f6 !important;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.p-toast-message {
  animation: slideInRight 0.3s ease-out !important;
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.p-toast-message-exit {
  animation: slideOutRight 0.3s ease-in !important;
}

@media (max-width: 640px) {
  .p-toast.p-toast-bottom-right {
    bottom: 0.5rem !important;
    right: 0.5rem !important;
    left: 0.5rem !important;
    max-width: none !important;
  }

  .p-toast .p-toast-message {
    min-height: 50px !important;
  }

  .p-toast-message-content {
    padding: 0.75rem !important;
  }

  .p-toast-summary,
  .p-toast-detail {
    font-size: 0.8125rem !important;
  }

  .p-toast .p-toast-message:nth-last-child(2) {
    transform: translateY(-10px) scale(0.98) !important;
  }

  .p-toast .p-toast-message:nth-last-child(3) {
    transform: translateY(-20px) scale(0.96) !important;
  }

  .p-toast .p-toast-message:nth-last-child(4) {
    transform: translateY(-30px) scale(0.94) !important;
  }

  .p-toast .p-toast-message:nth-last-child(5) {
    transform: translateY(-40px) scale(0.92) !important;
  }
}
</style>

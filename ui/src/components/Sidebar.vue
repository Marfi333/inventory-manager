<template>
  <div>
    <!-- Mobile overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      @click="closeMobileMenu"
    ></div>

    <!-- Sidebar -->
    <div 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-60 bg-slate-800  transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-slate-700 ">
        <div class="flex items-center">
          <i class="mr-3 text-2xl text-white pi pi-warehouse"></i>
          <span class="text-lg font-semibold text-white">Inventory</span>
        </div>
        <button 
          @click="closeMobileMenu"
          class="p-1 transition-colors duration-200 rounded lg:hidden text-slate-400 hover:text-white"
        >
          <i class="text-xl pi pi-times"></i>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-6">
        <div class="px-3 space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            :class="[
              'group flex items-center px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200',
              $route.path === item.path
                ? 'bg-slate-700  text-white border-l-4 border-indigo-500 '
                : 'text-slate-300 hover:bg-slate-700  hover:text-white'
            ]"
            @click="closeMobileMenu"
          >
            <i :class="[item.icon, 'mr-3 text-lg']"></i>
            {{ item.name }}
          </router-link>
        </div>
      </nav>

      <!-- Dark Mode Toggle -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 ">
        <button
          @click="toggleDarkMode"
          class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          <div class="flex items-center">
            <i :class="[isDarkMode ? 'pi pi-sun' : 'pi pi-moon', 'mr-3 text-lg']"></i>
            <span>Dark mode</span>
          </div>
          <div class="relative">
            <div :class="[
              'w-10 h-6 rounded-full transition-colors duration-200',
              isDarkMode ? 'bg-indigo-600' : 'bg-slate-600'
            ]">
              <div 
                :class="[
                  'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200',
                  isDarkMode ? 'translate-x-5' : 'translate-x-1'
                ]"
              ></div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useDarkMode } from '../composables/useDarkMode';

const isMobileMenuOpen = ref(false);
const { isDarkMode, toggleDarkMode, initializeDarkMode } = useDarkMode();

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'pi pi-chart-line'
  },
  {
    name: 'Categories',
    path: '/categories',
    icon: 'pi pi-folder'
  },
  {
    name: 'Items',
    path: '/items',
    icon: 'pi pi-box'
  }
];

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isMobileMenuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  initializeDarkMode();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Expose method to parent component
defineExpose({
  toggleMobileMenu: () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  }
});
</script> 
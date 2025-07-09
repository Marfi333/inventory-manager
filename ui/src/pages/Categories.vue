<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Categories</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage your inventory categories</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button
          label="Add Category"
          icon="pi pi-plus"
          @click="showCreateDialog"
        />
      </div>
    </div>

    <!-- Categories Table -->
    <div class="overflow-hidden transition-colors duration-200 bg-white border rounded-lg shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <div class="overflow-x-auto">
        <DataTable
          :value="categories"
          :loading="loading"
          paginator
          :rows="10"
          :rowsPerPageOptions="[5, 10, 25]"
          class="w-full"
          tableStyle="min-width: 50rem"
          :pt="{
            root: { class: 'bg-white dark:bg-slate-800' },
            header: { class: 'bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600' },
            table: { class: 'bg-white dark:bg-slate-800' },
            thead: { class: 'bg-slate-50 dark:bg-slate-700/50' },
            tbody: { class: 'bg-white dark:bg-slate-800' },
            headerRow: { class: 'bg-slate-50 dark:bg-slate-700/50' },
            headerCell: { class: 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-medium text-sm border-b border-slate-200 dark:border-slate-600 px-6 py-4' },
            bodyRow: { class: 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-600 last:border-b-0' },
            bodyCell: { class: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-6 py-4 border-b border-slate-100 dark:border-slate-600 last:border-b-0' },
            footer: { class: 'bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-600' },
            paginator: { class: 'bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-600' },
            paginatorPage: { class: 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700' },
            paginatorPageSelected: { class: 'bg-indigo-600 dark:bg-indigo-500 text-white' },
          }"
        >
          <template #loading>
            <div class="flex items-center justify-center py-12">
              <i class="text-2xl text-indigo-600 pi pi-spinner pi-spin dark:text-indigo-400"></i>
            </div>
          </template>
          
          <Column field="name" header="Name" sortable class="px-6 py-4">
            <template #body="{ data }">
              <div class="flex items-center">
                <div class="flex items-center justify-center w-8 h-8 mr-3 bg-indigo-100 rounded-full dark:bg-indigo-900/50">
                  <i class="text-sm text-indigo-600 pi pi-folder dark:text-indigo-400"></i>
                </div>
                <span class="font-medium text-slate-900 dark:text-white">{{ data.name }}</span>
              </div>
            </template>
          </Column>
          
          <Column field="description" header="Description" class="px-6 py-4">
            <template #body="{ data }">
              <span class="text-slate-600 dark:text-slate-400">{{ data.description || 'No description' }}</span>
            </template>
          </Column>
          
          <Column field="createdAt" header="Created" sortable class="px-6 py-4">
            <template #body="{ data }">
              <span class="text-sm text-slate-500 dark:text-slate-400">
                {{ new Date(data.createdAt).toLocaleDateString() }}
              </span>
            </template>
          </Column>
          
          <Column header="Actions" :exportable="false" class="px-6 py-4" style="min-width: 8rem">
            <template #body="{ data }">
              <div class="flex items-center space-x-2">
                <Button
                  icon="pi pi-pencil"
                  @click="editCategory(data)"
                  text
                  rounded
                  severity="info"
                  v-tooltip="'Edit'"
                />
                <Button
                  icon="pi pi-trash"
                  @click="confirmDelete(data)"
                  text
                  rounded
                  severity="danger"
                  v-tooltip="'Delete'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog
      v-model:visible="dialogVisible"
      :header="dialogMode === 'create' ? 'Create Category' : 'Edit Category'"
      :style="{ width: '90vw', maxWidth: '450px' }"
      :modal="true"
      class="p-fluid"
      :pt="{
        root: 'bg-white dark:bg-slate-800',
        header: 'bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
        content: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
        footer: 'bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700'
      }"
    >
      <form @submit.prevent="saveCategory" class="space-y-4">
        <div>
          <label for="name" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
          <InputText
            id="name"
            v-model="categoryForm.name"
            :invalid="!!errors.name"
            placeholder="Enter category name"
            autofocus
            class="w-full"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <div>
          <label for="description" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <Textarea
            id="description"
            v-model="categoryForm.description"
            rows="3"
            placeholder="Enter category description"
            class="w-full"
          />
        </div>

        <div class="flex justify-end pt-4 space-x-3">
          <Button
            label="Cancel"
            icon="pi pi-times"
            @click="dialogVisible = false"
            text
          />
          <Button
            :label="dialogMode === 'create' ? 'Create' : 'Update'"
            icon="pi pi-check"
            type="submit"
            :loading="saving"
          />
        </div>
      </form>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="deleteDialogVisible"
      header="Confirm Delete"
      :style="{ width: '90vw', maxWidth: '450px' }"
      :modal="true"
      :pt="{
        root: 'bg-white dark:bg-slate-800',
        header: 'bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
        content: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
        footer: 'bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700'
      }"
    >
      <div class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full dark:bg-red-900/50">
          <i class="text-red-600 pi pi-exclamation-triangle dark:text-red-400"></i>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-900 dark:text-white">Delete Category</p>
          <p class="text-sm text-slate-600 dark:text-slate-400" v-if="categoryToDelete">
            Are you sure you want to delete <strong>{{ categoryToDelete.name }}</strong>?
          </p>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-3">
          <Button
            label="Cancel"
            icon="pi pi-times"
            @click="deleteDialogVisible = false"
            text
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            @click="deleteCategory"
            :loading="deleting"
            severity="danger"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { apiService } from '../services/api';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types';

const toast = useToast();

const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const categories = ref<Category[]>([]);
const dialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const categoryToDelete = ref<Category | null>(null);
const selectedCategory = ref<Category | null>(null);

const categoryForm = reactive({
  name: '',
  description: '',
});

const errors = reactive({
  name: '',
});

const loadCategories = async () => {
  try {
    loading.value = true;
    categories.value = await apiService.getCategories();
  } catch (error) {
    console.error('Error loading categories:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load categories',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const showCreateDialog = () => {
  dialogMode.value = 'create';
  categoryForm.name = '';
  categoryForm.description = '';
  errors.name = '';
  dialogVisible.value = true;
};

const editCategory = (category: Category) => {
  dialogMode.value = 'edit';
  selectedCategory.value = category;
  categoryForm.name = category.name;
  categoryForm.description = category.description || '';
  errors.name = '';
  dialogVisible.value = true;
};

const validateForm = () => {
  errors.name = '';
  
  if (!categoryForm.name.trim()) {
    errors.name = 'Name is required';
    return false;
  }
  
  if (categoryForm.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
    return false;
  }
  
  return true;
};

const saveCategory = async () => {
  if (!validateForm()) return;

  try {
    saving.value = true;
    
    if (dialogMode.value === 'create') {
      const data: CreateCategoryRequest = {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
      };
      
      await apiService.createCategory(data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Category created successfully',
        life: 3000,
      });
    } else {
      const data: UpdateCategoryRequest = {
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
      };
      
      await apiService.updateCategory(selectedCategory.value!.id, data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Category updated successfully',
        life: 3000,
      });
    }
    
    dialogVisible.value = false;
    await loadCategories();
  } catch (error) {
    console.error('Error saving category:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Failed to save category',
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (category: Category) => {
  categoryToDelete.value = category;
  deleteDialogVisible.value = true;
};

const deleteCategory = async () => {
  if (!categoryToDelete.value) return;

  try {
    deleting.value = true;
    await apiService.deleteCategory(categoryToDelete.value.id);
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Category deleted successfully',
      life: 3000,
    });
    
    deleteDialogVisible.value = false;
    await loadCategories();
  } catch (error) {
    console.error('Error deleting category:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Failed to delete category',
      life: 3000,
    });
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  loadCategories();
});
</script> 

<style>
.p-datatable-header-cell {
  @apply dark:bg-slate-700/50 dark:text-slate-200;
}

.p-paginator {
  @apply dark:bg-slate-800 dark:border-slate-600;
}
</style>
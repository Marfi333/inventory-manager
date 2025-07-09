<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Items</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage your inventory items</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button
          label="Add Item"
          icon="pi pi-plus"
          @click="showCreateDialog"
        />
      </div>
    </div>

    <!-- Items Table -->
    <div class="overflow-hidden transition-colors duration-200 bg-white border rounded-lg shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <div class="overflow-x-auto">
        <DataTable
          :value="items"
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
            paginatorPageSelected: { class: 'bg-indigo-600 dark:bg-indigo-500 text-white' }
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
                <div class="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <i class="text-sm pi pi-box text-emerald-600 dark:text-emerald-400"></i>
                </div>
                <div>
                  <span class="font-medium text-slate-900 dark:text-white">{{ data.name }}</span>
                  <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {{ getCategoryName(data.categoryId) }}
                  </div>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="description" header="Description" class="px-6 py-4">
            <template #body="{ data }">
              <span class="text-slate-600 dark:text-slate-400">{{ data.description || 'No description' }}</span>
            </template>
          </Column>
          
          <Column field="skus" header="SKUs" class="px-6 py-4">
            <template #body="{ data }">
              <div class="flex items-center">
                <i class="mr-2 text-xs pi pi-qrcode text-slate-400 dark:text-slate-500"></i>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="sku in data.skus"
                    :key="sku"
                    class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900/50 dark:text-blue-200"
                  >
                    {{ sku }}
                  </span>
                  <span v-if="data.skus.length === 0" class="text-sm text-slate-500 dark:text-slate-400">
                    No SKUs
                  </span>
                </div>
              </div>
            </template>
          </Column>
          
          <Column field="quantity" header="Quantity" sortable class="px-6 py-4">
            <template #body="{ data }">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <i class="mr-2 text-xs pi pi-hashtag text-slate-400 dark:text-slate-500"></i>
                  <span class="font-medium text-slate-900 dark:text-white">{{ data.quantity }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <Button
                    icon="pi pi-minus"
                    @click="updateQuantity(data, 'subtract', 1)"
                    text
                    rounded
                    size="small"
                    severity="secondary"
                    :disabled="data.quantity <= 0"
                    v-tooltip="'Decrease quantity'"
                  />
                  <Button
                    icon="pi pi-plus"
                    @click="updateQuantity(data, 'add', 1)"
                    text
                    rounded
                    size="small"
                    severity="secondary"
                    v-tooltip="'Increase quantity'"
                  />
                </div>
              </div>
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
                  @click="editItem(data)"
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
      :header="dialogMode === 'create' ? 'Create Item' : 'Edit Item'"
      :style="{ width: '90vw', maxWidth: '600px' }"
      :modal="true"
      class="p-fluid"
      :pt="{
        root: 'bg-white dark:bg-slate-800',
        header: 'bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
        content: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
        footer: 'bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700'
      }"
    >
      <form @submit.prevent="saveItem" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Name *</label>
            <InputText
              id="name"
              v-model="itemForm.name"
              :invalid="!!errors.name"
              placeholder="Enter item name"
              autofocus
              class="w-full"
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <div>
            <label for="category" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
            <Dropdown
              id="category"
              v-model="itemForm.categoryId"
              :options="categories"
              optionLabel="name"
              optionValue="id"
              placeholder="Select a category"
              :invalid="!!errors.categoryId"
              class="w-full"
            />
            <small v-if="errors.categoryId" class="p-error">{{ errors.categoryId }}</small>
          </div>
        </div>

        <div>
          <label for="description" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <Textarea
            id="description"
            v-model="itemForm.description"
            rows="3"
            placeholder="Enter item description"
            class="w-full"
          />
        </div>

        <div>
          <label for="quantity" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Quantity *</label>
          <InputNumber
            id="quantity"
            v-model="itemForm.quantity"
            :invalid="!!errors.quantity"
            :min="0"
            placeholder="Enter quantity"
            class="w-full"
          />
          <small v-if="errors.quantity" class="p-error">{{ errors.quantity }}</small>
        </div>

        <div>
          <label class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">SKUs</label>
          <div class="space-y-2">
            <div
              v-for="(_, index) in itemForm.skus"
              :key="index"
              class="flex items-center space-x-2"
            >
              <InputText
                v-model="itemForm.skus[index]"
                placeholder="Enter SKU"
                class="flex-1"
              />
              <Button
                icon="pi pi-trash"
                @click="removeSku(index)"
                text
                rounded
                severity="danger"
                size="small"
                v-tooltip="'Remove SKU'"
              />
            </div>
            <Button
              label="Add SKU"
              icon="pi pi-plus"
              @click="addSku"
              text
              size="small"
              class="mt-2"
            />
          </div>
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
          <p class="text-sm font-medium text-slate-900 dark:text-white">Delete Item</p>
          <p class="text-sm text-slate-600 dark:text-slate-400" v-if="itemToDelete">
            Are you sure you want to delete <strong>{{ itemToDelete.name }}</strong>?
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
            @click="deleteItem"
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
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import { apiService } from '../services/api';
import type { Item, Category, CreateItemRequest, UpdateItemRequest, UpdateQuantityRequest } from '../types';

const toast = useToast();

const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const items = ref<Item[]>([]);
const categories = ref<Category[]>([]);
const dialogVisible = ref(false);
const deleteDialogVisible = ref(false);
const dialogMode = ref<'create' | 'edit'>('create');
const itemToDelete = ref<Item | null>(null);
const selectedItem = ref<Item | null>(null);

const itemForm = reactive({
  name: '',
  description: '',
  categoryId: '',
  quantity: 0,
  skus: [''],
});

const errors = reactive({
  name: '',
  categoryId: '',
  quantity: '',
});

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown';
};

const loadData = async () => {
  try {
    loading.value = true;
    const [itemsData, categoriesData] = await Promise.all([
      apiService.getItems(),
      apiService.getCategories(),
    ]);
    items.value = itemsData;
    categories.value = categoriesData;
  } catch (error) {
    console.error('Error loading data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load data',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const showCreateDialog = () => {
  dialogMode.value = 'create';
  itemForm.name = '';
  itemForm.description = '';
  itemForm.categoryId = '';
  itemForm.quantity = 0;
  itemForm.skus = [''];
  clearErrors();
  dialogVisible.value = true;
};

const editItem = (item: Item) => {
  dialogMode.value = 'edit';
  selectedItem.value = item;
  itemForm.name = item.name;
  itemForm.description = item.description || '';
  itemForm.categoryId = item.categoryId;
  itemForm.quantity = item.quantity;
  itemForm.skus = item.skus.length > 0 ? [...item.skus] : [''];
  clearErrors();
  dialogVisible.value = true;
};

const clearErrors = () => {
  errors.name = '';
  errors.categoryId = '';
  errors.quantity = '';
};

const validateForm = () => {
  clearErrors();
  let isValid = true;
  
  if (!itemForm.name.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  }
  
  if (!itemForm.categoryId) {
    errors.categoryId = 'Category is required';
    isValid = false;
  }
  
  if (itemForm.quantity < 0) {
    errors.quantity = 'Quantity must be non-negative';
    isValid = false;
  }
  
  return isValid;
};

const addSku = () => {
  itemForm.skus.push('');
};

const removeSku = (index: number) => {
  itemForm.skus.splice(index, 1);
  if (itemForm.skus.length === 0) {
    itemForm.skus.push('');
  }
};

const saveItem = async () => {
  if (!validateForm()) return;

  try {
    saving.value = true;
    
    const filteredSkus = itemForm.skus.filter(sku => sku.trim() !== '');
    
    if (dialogMode.value === 'create') {
      const data: CreateItemRequest = {
        name: itemForm.name.trim(),
        description: itemForm.description.trim() || undefined,
        categoryId: itemForm.categoryId,
        quantity: itemForm.quantity,
        skus: filteredSkus,
      };
      
      await apiService.createItem(data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item created successfully',
        life: 3000,
      });
    } else {
      const data: UpdateItemRequest = {
        name: itemForm.name.trim(),
        description: itemForm.description.trim() || undefined,
        categoryId: itemForm.categoryId,
        quantity: itemForm.quantity,
        skus: filteredSkus,
      };
      
      await apiService.updateItem(selectedItem.value!.id, data);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item updated successfully',
        life: 3000,
      });
    }
    
    dialogVisible.value = false;
    await loadData();
  } catch (error) {
    console.error('Error saving item:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Failed to save item',
      life: 3000,
    });
  } finally {
    saving.value = false;
  }
};

const updateQuantity = async (item: Item, operation: 'set' | 'add' | 'subtract', amount: number) => {
  try {
    const data: UpdateQuantityRequest = {
      operation,
      quantity: amount,
    };
    
    await apiService.updateItemQuantity(item.id, data);
    
    // Update local state
    const index = items.value.findIndex(i => i.id === item.id);
    if (index !== -1) {
      switch (operation) {
        case 'set':
          items.value[index].quantity = amount;
          break;
        case 'add':
          items.value[index].quantity += amount;
          break;
        case 'subtract':
          items.value[index].quantity = Math.max(0, items.value[index].quantity - amount);
          break;
      }
    }
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Quantity updated successfully',
      life: 2000,
    });
  } catch (error) {
    console.error('Error updating quantity:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Failed to update quantity',
      life: 3000,
    });
  }
};

const confirmDelete = (item: Item) => {
  itemToDelete.value = item;
  deleteDialogVisible.value = true;
};

const deleteItem = async () => {
  if (!itemToDelete.value) return;

  try {
    deleting.value = true;
    await apiService.deleteItem(itemToDelete.value.id);
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item deleted successfully',
      life: 3000,
    });
    
    deleteDialogVisible.value = false;
    await loadData();
  } catch (error) {
    console.error('Error deleting item:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Failed to delete item',
      life: 3000,
    });
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script> 
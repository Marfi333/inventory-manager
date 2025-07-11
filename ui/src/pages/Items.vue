<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Items</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">Manage your inventory items</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <Button label="Add Item" icon="pi pi-plus" @click="showCreateDialog" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <i class="text-4xl text-indigo-600 pi pi-spinner pi-spin dark:text-indigo-400"></i>
    </div>

    <!-- Mobile Cards (< 768px) -->
    <div v-else>
      <div class="md:hidden">
        <div class="space-y-4">
          <div
            v-for="item in paginatedItems"
            :key="item.id"
            class="transition-all duration-200 bg-white border rounded-lg shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md"
          >
            <div class="p-4">
              <!-- Item Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center flex-1">
                  <div
                    class="flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/50"
                  >
                    <i class="text-emerald-600 pi pi-box dark:text-emerald-400"></i>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-slate-900 dark:text-white">{{ item.name }}</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                      {{ getCategoryName(item.categoryId) }}
                    </p>
                  </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex items-center space-x-2">
                  <Button
                    icon="pi pi-pencil"
                    severity="secondary"
                    size="small"
                    @click="editItem(item)"
                    class="!w-8 !h-8 !p-0"
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    @click="confirmDelete(item)"
                    class="!w-8 !h-8 !p-0"
                  />
                </div>
              </div>

              <!-- Item Details -->
              <div class="space-y-3">
                <!-- Description -->
                <div>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    {{ item.description || 'No description' }}
                  </p>
                </div>

                <!-- Quantity and SKUs -->
                <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div class="flex items-center space-x-4">
                    <!-- Quantity -->
                    <div class="flex items-center space-x-2">
                      <Button
                        icon="pi pi-minus"
                        severity="secondary"
                        size="small"
                        @click="adjustQuantity(item, -1)"
                        :disabled="item.quantity <= 0"
                        class="!w-8 !h-8 !p-0"
                      />
                      <span class="font-medium text-slate-900 dark:text-white min-w-[2rem] text-center">
                        {{ item.quantity }}
                      </span>
                      <Button
                        icon="pi pi-plus"
                        severity="secondary"
                        size="small"
                        @click="adjustQuantity(item, 1)"
                        class="!w-8 !h-8 !p-0"
                      />
                    </div>

                    <!-- SKUs -->
                    <div class="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <i class="mr-2 pi pi-tag"></i>
                      <span>{{ item.skus.length > 0 ? item.skus.join(', ') : 'No SKUs' }}</span>
                    </div>
                  </div>

                  <!-- Quantity Button -->
                  <Button
                    label="Qty"
                    icon="pi pi-hashtag"
                    severity="secondary"
                    size="small"
                    @click="showQuantityDialog(item)"
                    class="!text-xs !px-2 !py-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Pagination -->
        <div class="flex items-center justify-between px-4 mt-6">
          <div class="text-sm text-slate-500 dark:text-slate-400">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, items.length) }} of {{ items.length }} items
          </div>
          <div class="flex items-center space-x-2">
            <Button
              icon="pi pi-chevron-left"
              severity="secondary"
              size="small"
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="!w-8 !h-8 !p-0"
            />
            <span class="text-sm font-medium text-slate-900 dark:text-white">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <Button
              icon="pi pi-chevron-right"
              severity="secondary"
              size="small"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="!w-8 !h-8 !p-0"
            />
          </div>
        </div>
      </div>

      <!-- Desktop Table (>= 768px) -->
      <div class="hidden md:block">
        <div
          class="overflow-hidden transition-colors duration-200 bg-white border rounded-lg shadow-sm dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        >
          <div class="overflow-x-auto">
            <DataTable
              :value="items"
              :loading="loading"
              paginator
              :rows="10"
              :rowsPerPageOptions="[5, 10, 25]"
              tableStyle="min-width: 50rem"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
              :globalFilterFields="['name', 'description']"
              responsiveLayout="scroll"
              :pageLinkSize="5"
              :alwaysShowPaginator="false"
              :rowHover="true"
              class="w-full custom-datatable"
            >
              <template #loading>
                <div class="flex items-center justify-center py-12">
                  <i class="text-2xl text-indigo-600 pi pi-spinner pi-spin dark:text-indigo-400"></i>
                </div>
              </template>

              <Column field="name" header="Name" sortable class="px-6 py-4">
                <template #body="{ data }">
                  <div class="flex items-center">
                    <div
                      class="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-emerald-100 dark:bg-emerald-900/50"
                    >
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

              <Column field="quantity" header="Quantity" sortable class="px-6 py-4">
                <template #body="{ data }">
                  <div class="flex items-center space-x-2">
                    <Button
                      icon="pi pi-minus"
                      @click="adjustQuantity(data, -1)"
                      :disabled="data.quantity <= 0"
                      text
                      rounded
                      size="small"
                      severity="secondary"
                      class="!w-6 !h-6"
                    />
                    <span class="font-medium text-slate-900 dark:text-white min-w-[2rem] text-center">
                      {{ data.quantity }}
                    </span>
                    <Button
                      icon="pi pi-plus"
                      @click="adjustQuantity(data, 1)"
                      text
                      rounded
                      size="small"
                      severity="secondary"
                      class="!w-6 !h-6"
                    />
                  </div>
                </template>
              </Column>

              <Column field="skus" header="SKUs" class="px-6 py-4">
                <template #body="{ data }">
                  <div class="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <i class="mr-2 text-xs pi pi-tag"></i>
                    <span>{{ data.skus.length > 0 ? data.skus.join(', ') : 'No SKUs' }}</span>
                  </div>
                </template>
              </Column>

              <Column header="Actions" class="px-6 py-4">
                <template #body="{ data }">
                  <div class="flex items-center space-x-2">
                    <Button
                      icon="pi pi-hashtag"
                      @click="showQuantityDialog(data)"
                      severity="secondary"
                      size="small"
                      v-tooltip.top="'Manage quantity'"
                    />
                    <Button
                      icon="pi pi-pencil"
                      @click="editItem(data)"
                      severity="secondary"
                      size="small"
                      v-tooltip.top="'Edit item'"
                    />
                    <Button
                      icon="pi pi-trash"
                      @click="confirmDelete(data)"
                      severity="danger"
                      size="small"
                      v-tooltip.top="'Delete item'"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
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
        header:
          'bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
        content: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
        footer: 'bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700',
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
            <label for="category" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
              >Category *</label
            >
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
          <label for="description" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >Description</label
          >
          <Textarea
            id="description"
            v-model="itemForm.description"
            rows="3"
            placeholder="Enter item description"
            class="w-full"
          />
        </div>

        <div>
          <label for="quantity" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >Quantity *</label
          >
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
            <div v-for="(_, index) in itemForm.skus" :key="index" class="flex items-center space-x-2">
              <InputText v-model="itemForm.skus[index]" placeholder="Enter SKU" class="flex-1" />
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
            <Button label="Add SKU" icon="pi pi-plus" @click="addSku" text size="small" class="mt-2" />
          </div>
        </div>

        <div class="flex justify-end pt-4 space-x-3">
          <Button label="Cancel" icon="pi pi-times" @click="dialogVisible = false" text />
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
        header:
          'bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
        content: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
        footer: 'bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700',
      }"
    >
      <div class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full dark:bg-red-900/50">
          <i class="text-red-600 pi pi-exclamation-triangle dark:text-red-400"></i>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-900 dark:text-white">Delete Item</p>
          <p class="text-sm text-slate-600 dark:text-slate-400" v-if="itemToDelete">
            Are you sure you want to delete <strong>{{ itemToDelete.name }}</strong
            >?
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <Button label="Cancel" icon="pi pi-times" @click="deleteDialogVisible = false" text />
          <Button label="Delete" icon="pi pi-trash" @click="deleteItem" :loading="deleting" severity="danger" />
        </div>
      </template>
    </Dialog>

    <!-- Quantity Dialog -->
    <Dialog
      v-model:visible="quantityDialogVisible"
      header="Manage Quantity"
      :style="{ width: '90vw', maxWidth: '400px' }"
      :modal="true"
      class="p-fluid"
      :pt="{
        root: 'bg-white dark:bg-slate-800',
        header:
          'bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white',
        content: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
        footer: 'bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700',
      }"
    >
      <div class="flex items-center space-x-3">
        <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full dark:bg-blue-900/50">
          <i class="text-blue-600 pi pi-hashtag dark:text-blue-400"></i>
        </div>
        <div>
          <p class="text-sm font-medium text-slate-900 dark:text-white">Manage Quantity for {{ selectedItem?.name }}</p>
          <p class="text-sm text-slate-600 dark:text-slate-400">Current Quantity: {{ selectedItem?.quantity }}</p>
        </div>
      </div>

      <form
        @submit.prevent="updateQuantity(selectedItem!, quantityForm.operation, quantityForm.quantity)"
        class="space-y-4"
      >
        <div>
          <label for="quantity-operation" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >Operation</label
          >
          <Dropdown
            id="quantity-operation"
            v-model="quantityForm.operation"
            :options="[
              { label: 'Set', value: 'set' },
              { label: 'Add', value: 'add' },
              { label: 'Subtract', value: 'subtract' },
            ]"
            optionLabel="label"
            optionValue="value"
            placeholder="Select operation"
            class="w-full"
          />
        </div>

        <div>
          <label for="quantity-amount" class="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300"
            >Amount</label
          >
          <InputNumber
            id="quantity-amount"
            v-model="quantityForm.quantity"
            :min="1"
            placeholder="Enter amount"
            class="w-full"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <Button label="Cancel" icon="pi pi-times" @click="quantityDialogVisible = false" text />
          <Button label="Update" icon="pi pi-check" type="submit" :loading="saving" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import { apiService } from '../services/api'
import type { Item, Category, CreateItemRequest, UpdateItemRequest, UpdateQuantityRequest } from '../types'

const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const items = ref<Item[]>([])
const categories = ref<Category[]>([])
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const quantityDialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const itemToDelete = ref<Item | null>(null)
const selectedItem = ref<Item | null>(null)

// Mobile pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

const itemForm = reactive({
  name: '',
  description: '',
  categoryId: '',
  quantity: 0,
  skus: [''],
})

const quantityForm = reactive({
  operation: 'set' as 'set' | 'add' | 'subtract',
  quantity: 0,
})

const errors = reactive({
  name: '',
  categoryId: '',
  quantity: '',
})

// Mobile pagination computed properties
const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage.value))
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return items.value.slice(start, end)
})

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find((c) => c.id === categoryId)
  return category ? category.name : 'Unknown'
}

const loadData = async () => {
  try {
    loading.value = true
    const [itemsData, categoriesData] = await Promise.all([apiService.getItems(), apiService.getCategories()])
    items.value = itemsData
    categories.value = categoriesData
  } catch (error) {
    console.error('Error loading data:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load data',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const showCreateDialog = () => {
  dialogMode.value = 'create'
  itemForm.name = ''
  itemForm.description = ''
  itemForm.categoryId = ''
  itemForm.quantity = 0
  itemForm.skus = ['']
  clearErrors()
  dialogVisible.value = true
}

const editItem = (item: Item) => {
  dialogMode.value = 'edit'
  selectedItem.value = item
  itemForm.name = item.name
  itemForm.description = item.description || ''
  itemForm.categoryId = item.categoryId
  itemForm.quantity = item.quantity
  itemForm.skus = item.skus.length > 0 ? [...item.skus] : ['']
  clearErrors()
  dialogVisible.value = true
}

const clearErrors = () => {
  errors.name = ''
  errors.categoryId = ''
  errors.quantity = ''
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!itemForm.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  if (!itemForm.categoryId) {
    errors.categoryId = 'Category is required'
    isValid = false
  }

  if (itemForm.quantity < 0) {
    errors.quantity = 'Quantity must be non-negative'
    isValid = false
  }

  return isValid
}

const addSku = () => {
  itemForm.skus.push('')
}

const removeSku = (index: number) => {
  itemForm.skus.splice(index, 1)
  if (itemForm.skus.length === 0) {
    itemForm.skus.push('')
  }
}

const saveItem = async () => {
  if (!validateForm()) return

  try {
    saving.value = true

    const filteredSkus = itemForm.skus.filter((sku) => sku.trim() !== '')

    if (dialogMode.value === 'create') {
      const data: CreateItemRequest = {
        name: itemForm.name.trim(),
        description: itemForm.description.trim() || undefined,
        categoryId: itemForm.categoryId,
        quantity: itemForm.quantity,
        skus: filteredSkus,
      }

      await apiService.createItem(data)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item created successfully',
        life: 3000,
      })
    } else {
      const data: UpdateItemRequest = {
        name: itemForm.name.trim(),
        description: itemForm.description.trim() || undefined,
        categoryId: itemForm.categoryId,
        quantity: itemForm.quantity,
        skus: filteredSkus,
      }

      await apiService.updateItem(selectedItem.value!.id, data)
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Item updated successfully',
        life: 3000,
      })
    }

    dialogVisible.value = false
    await loadData()
  } catch (error) {
    console.error('Error saving item:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Failed to save item',
      life: 3000,
    })
  } finally {
    saving.value = false
  }
}

const adjustQuantity = async (item: Item, change: number) => {
  try {
    const newQuantity = Math.max(0, item.quantity + change)
    const request: UpdateQuantityRequest = {
      operation: 'set',
      quantity: newQuantity,
    }

    await apiService.updateItemQuantity(item.id, request)
    item.quantity = newQuantity

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Quantity updated successfully',
      life: 3000,
    })
  } catch (error) {
    console.error('Error updating quantity:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update quantity',
      life: 3000,
    })
  }
}

const updateQuantity = async (item: Item, operation: 'set' | 'add' | 'subtract', amount: number) => {
  try {
    const data: UpdateQuantityRequest = {
      operation,
      quantity: amount,
    }

    await apiService.updateItemQuantity(item.id, data)

    // Update local state
    const index = items.value.findIndex((i) => i.id === item.id)
    if (index !== -1) {
      switch (operation) {
        case 'set':
          items.value[index].quantity = amount
          break
        case 'add':
          items.value[index].quantity += amount
          break
        case 'subtract':
          items.value[index].quantity = Math.max(0, items.value[index].quantity - amount)
          break
      }
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Quantity updated successfully',
      life: 2000,
    })
  } catch (error) {
    console.error('Error updating quantity:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Failed to update quantity',
      life: 3000,
    })
  }
}

const confirmDelete = (item: Item) => {
  itemToDelete.value = item
  deleteDialogVisible.value = true
}

const deleteItem = async () => {
  if (!itemToDelete.value) return

  try {
    deleting.value = true
    await apiService.deleteItem(itemToDelete.value.id)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Item deleted successfully',
      life: 3000,
    })

    deleteDialogVisible.value = false
    await loadData()
  } catch (error) {
    console.error('Error deleting item:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Failed to delete item',
      life: 3000,
    })
  } finally {
    deleting.value = false
  }
}

const showQuantityDialog = (item: Item) => {
  selectedItem.value = item
  quantityDialogVisible.value = true
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Custom styles for mobile cards following Design.json */
.custom-datatable :deep(.p-datatable) {
  border-radius: 8px;
  overflow: hidden;
}

.custom-datatable :deep(.p-datatable-header) {
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 16px;
}

.custom-datatable :deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid #f1f5f9;
}

.custom-datatable :deep(.p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

.custom-datatable :deep(.p-datatable-tbody > tr > td) {
  padding: 16px;
  vertical-align: middle;
}

.custom-datatable :deep(.p-paginator) {
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 16px;
}

/* Dark mode adjustments */
.dark .custom-datatable :deep(.p-datatable-header) {
  background-color: #1e293b;
  border-bottom: 1px solid #334155;
}

.dark .custom-datatable :deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid #334155;
}

.dark .custom-datatable :deep(.p-datatable-tbody > tr:hover) {
  background-color: #1e293b;
}

.dark .custom-datatable :deep(.p-paginator) {
  background-color: #1e293b;
  border-top: 1px solid #334155;
}
</style>

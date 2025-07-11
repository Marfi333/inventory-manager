import type {
  Category,
  Item,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateItemRequest,
  UpdateItemRequest,
  UpdateQuantityRequest,
  ApiResponse,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(url, { ...defaultOptions, ...options })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.request<Category[]>('/categories')
    return response.data || []
  }

  async getCategory(id: string): Promise<Category> {
    const response = await this.request<Category>(`/categories/${id}`)
    if (!response.data) {
      throw new Error('Category not found')
    }
    return response.data
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.data) {
      throw new Error('Failed to create category')
    }
    return response.data
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    const response = await this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (!response.data) {
      throw new Error('Failed to update category')
    }
    return response.data
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request(`/categories/${id}`, {
      method: 'DELETE',
    })
  }

  async getItems(): Promise<Item[]> {
    const response = await this.request<Item[]>('/items')
    return response.data || []
  }

  async getItem(id: string): Promise<Item> {
    const response = await this.request<Item>(`/items/${id}`)
    if (!response.data) {
      throw new Error('Item not found')
    }
    return response.data
  }

  async getItemsByCategory(categoryId: string): Promise<Item[]> {
    const response = await this.request<Item[]>(`/items/category/${categoryId}`)
    return response.data || []
  }

  async createItem(data: CreateItemRequest): Promise<Item> {
    const response = await this.request<Item>('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    if (!response.data) {
      throw new Error('Failed to create item')
    }
    return response.data
  }

  async updateItem(id: string, data: UpdateItemRequest): Promise<Item> {
    const response = await this.request<Item>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    if (!response.data) {
      throw new Error('Failed to update item')
    }
    return response.data
  }

  async updateItemQuantity(id: string, data: UpdateQuantityRequest): Promise<Item> {
    const response = await this.request<Item>(`/items/${id}/quantity`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    if (!response.data) {
      throw new Error('Failed to update item quantity')
    }
    return response.data
  }

  async deleteItem(id: string): Promise<void> {
    await this.request(`/items/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()

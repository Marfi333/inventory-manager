export type Category = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

export type Item = {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  quantity: number;
  skus: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryRequest = {
  name: string;
  description?: string;
};

export type UpdateCategoryRequest = {
  name?: string;
  description?: string;
};

export type CreateItemRequest = {
  name: string;
  description?: string;
  categoryId: string;
  quantity: number;
  skus: string[];
};

export type UpdateItemRequest = {
  name?: string;
  description?: string;
  categoryId?: string;
  quantity?: number;
  skus?: string[];
};

export type UpdateQuantityRequest = {
  quantity: number;
  operation: 'set' | 'add' | 'subtract';
}; 
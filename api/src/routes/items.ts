import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { itemDb } from '../database';
import { createItemSchema, updateItemSchema, updateQuantitySchema, idParamSchema, categoryIdParamSchema } from '../validation';

const items = new Hono();

// GET /items
items.get('/', (c) => {
  try {
    const itemsData = itemDb.getAll();
    return c.json({
      success: true,
      data: itemsData
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch items'
    }, 500);
  }
});

// GET /items/:id
items.get('/:id', zValidator('param', idParamSchema), (c) => {
  try {
    const { id } = c.req.valid('param');
    const item = itemDb.getById(id);
    
    if (!item) {
      return c.json({
        success: false,
        error: 'Item not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch item'
    }, 500);
  }
});

// GET /items/category/:categoryId
items.get('/category/:categoryId', zValidator('param', categoryIdParamSchema), (c) => {
  try {
    const { categoryId } = c.req.valid('param');
    const itemsData = itemDb.getByCategoryId(categoryId);
    
    return c.json({
      success: true,
      data: itemsData
    });
  } catch (error) {
    console.error('Error fetching items by category:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch items'
    }, 500);
  }
});

// POST /items
items.post('/', zValidator('json', createItemSchema), (c) => {
  try {
    const data = c.req.valid('json');
    const item = itemDb.create(data);
    
    return c.json({
      success: true,
      data: item
    }, 201);
  } catch (error) {
    console.error('Error creating item:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create item'
    }, 500);
  }
});

// PUT /items/:id
items.put('/:id', zValidator('param', idParamSchema), zValidator('json', updateItemSchema), (c) => {
  try {
    const { id } = c.req.valid('param');
    const data = c.req.valid('json');
    
    const item = itemDb.update(id, data);
    
    if (!item) {
      return c.json({
        success: false,
        error: 'Item not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update item'
    }, 500);
  }
});

// PATCH /items/:id/quantity
items.patch('/:id/quantity', zValidator('param', idParamSchema), zValidator('json', updateQuantitySchema), (c) => {
  try {
    const { id } = c.req.valid('param');
    const { operation, quantity } = c.req.valid('json');
    
    const item = itemDb.updateQuantity(id, quantity, operation);
    
    if (!item) {
      return c.json({
        success: false,
        error: 'Item not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return c.json({
      success: false,
      error: 'Failed to update item quantity'
    }, 500);
  }
});

// DELETE /items/:id
items.delete('/:id', zValidator('param', idParamSchema), (c) => {
  try {
    const { id } = c.req.valid('param');
    const deleted = itemDb.delete(id);
    
    if (!deleted) {
      return c.json({
        success: false,
        error: 'Item not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return c.json({
      success: false,
      error: 'Failed to delete item'
    }, 500);
  }
});

export default items; 
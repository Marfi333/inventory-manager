import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { categoryDb } from '../database';
import { createCategorySchema, updateCategorySchema, idParamSchema } from '../validation';

const categories = new Hono();

// GET /categories
categories.get('/', (c) => {
  try {
    const categoriesData = categoryDb.getAll();
    return c.json({
      success: true,
      data: categoriesData
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch categories'
    }, 500);
  }
});

// GET /categories/:id
categories.get('/:id', zValidator('param', idParamSchema), (c) => {
  try {
    const { id } = c.req.valid('param');
    const category = categoryDb.getById(id);
    
    if (!category) {
      return c.json({
        success: false,
        error: 'Category not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch category'
    }, 500);
  }
});

// POST /categories
categories.post('/', zValidator('json', createCategorySchema), (c) => {
  try {
    const data = c.req.valid('json');
    const category = categoryDb.create(data);
    
    return c.json({
      success: true,
      data: category
    }, 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category'
    }, 500);
  }
});

// PUT /categories/:id
categories.put('/:id', zValidator('param', idParamSchema), zValidator('json', updateCategorySchema), (c) => {
  try {
    const { id } = c.req.valid('param');
    const data = c.req.valid('json');
    
    const category = categoryDb.update(id, data);
    
    if (!category) {
      return c.json({
        success: false,
        error: 'Category not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category'
    }, 500);
  }
});

// DELETE /categories/:id
categories.delete('/:id', zValidator('param', idParamSchema), (c) => {
  try {
    const { id } = c.req.valid('param');
    const deleted = categoryDb.delete(id);
    
    if (!deleted) {
      return c.json({
        success: false,
        error: 'Category not found'
      }, 404);
    }
    
    return c.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json({
      success: false,
      error: 'Failed to delete category'
    }, 500);
  }
});

export default categories; 
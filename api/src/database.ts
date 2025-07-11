// @ts-nocheck
import Database from 'better-sqlite3'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import type {
  Category,
  Item,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateItemRequest,
  UpdateItemRequest,
} from './types'

const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'inventory.db')

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

const db = new Database(DB_PATH)

export const initializeDatabase = (): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      skus TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    )
  `)

  console.log(`Database initialized at: ${DB_PATH}`)
}

export const categoryDb = {
  getAll: (): Category[] => {
    const stmt = db.prepare('SELECT * FROM categories ORDER BY name')
    const rows = stmt.all()
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  },

  getById: (id: string): Category | null => {
    const stmt = db.prepare('SELECT * FROM categories WHERE id = ?')
    const row = stmt.get(id)
    if (!row) return null
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  },

  create: (data: CreateCategoryRequest): Category => {
    const id = uuidv4()
    const now = new Date().toISOString()

    const stmt = db.prepare(
      'INSERT INTO categories (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    )
    stmt.run(id, data.name, data.description || null, now, now)

    return {
      id,
      name: data.name,
      description: data.description,
      createdAt: now,
      updatedAt: now,
    }
  },

  update: (id: string, data: UpdateCategoryRequest): Category | null => {
    const now = new Date().toISOString()
    const updates: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.description !== undefined) {
      updates.push('description = ?')
      values.push(data.description)
    }

    if (updates.length === 0) {
      return categoryDb.getById(id)
    }

    updates.push('updated_at = ?')
    values.push(now)
    values.push(id)

    const stmt = db.prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`)
    const result = stmt.run(...values)

    if (result.changes === 0) return null
    return categoryDb.getById(id)
  },

  delete: (id: string): boolean => {
    const stmt = db.prepare('DELETE FROM categories WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  },
}

export const itemDb = {
  getAll: (): Item[] => {
    const stmt = db.prepare('SELECT * FROM items ORDER BY name')
    const rows = stmt.all()
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      categoryId: row.category_id,
      quantity: row.quantity,
      skus: JSON.parse(row.skus || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  },

  getById: (id: string): Item | null => {
    const stmt = db.prepare('SELECT * FROM items WHERE id = ?')
    const row = stmt.get(id)
    if (!row) return null
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      categoryId: row.category_id,
      quantity: row.quantity,
      skus: JSON.parse(row.skus || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  },

  getByCategoryId: (categoryId: string): Item[] => {
    const stmt = db.prepare('SELECT * FROM items WHERE category_id = ? ORDER BY name')
    const rows = stmt.all(categoryId)
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      categoryId: row.category_id,
      quantity: row.quantity,
      skus: JSON.parse(row.skus || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  },

  create: (data: CreateItemRequest): Item => {
    const id = uuidv4()
    const now = new Date().toISOString()

    const stmt = db.prepare(
      'INSERT INTO items (id, name, description, category_id, quantity, skus, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    stmt.run(
      id,
      data.name,
      data.description || null,
      data.categoryId,
      data.quantity,
      JSON.stringify(data.skus || []),
      now,
      now
    )

    return {
      id,
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      quantity: data.quantity,
      skus: data.skus || [],
      createdAt: now,
      updatedAt: now,
    }
  },

  update: (id: string, data: UpdateItemRequest): Item | null => {
    const now = new Date().toISOString()
    const updates: string[] = []
    const values: any[] = []

    if (data.name !== undefined) {
      updates.push('name = ?')
      values.push(data.name)
    }
    if (data.description !== undefined) {
      updates.push('description = ?')
      values.push(data.description)
    }
    if (data.categoryId !== undefined) {
      updates.push('category_id = ?')
      values.push(data.categoryId)
    }
    if (data.quantity !== undefined) {
      updates.push('quantity = ?')
      values.push(data.quantity)
    }
    if (data.skus !== undefined) {
      updates.push('skus = ?')
      values.push(JSON.stringify(data.skus))
    }

    if (updates.length === 0) {
      return itemDb.getById(id)
    }

    updates.push('updated_at = ?')
    values.push(now)
    values.push(id)

    const stmt = db.prepare(`UPDATE items SET ${updates.join(', ')} WHERE id = ?`)
    const result = stmt.run(...values)

    if (result.changes === 0) return null
    return itemDb.getById(id)
  },

  updateQuantity: (id: string, quantity: number, operation: 'set' | 'add' | 'subtract'): Item | null => {
    const now = new Date().toISOString()
    let sql: string

    switch (operation) {
      case 'set':
        sql = 'UPDATE items SET quantity = ?, updated_at = ? WHERE id = ?'
        break
      case 'add':
        sql = 'UPDATE items SET quantity = quantity + ?, updated_at = ? WHERE id = ?'
        break
      case 'subtract':
        sql = 'UPDATE items SET quantity = MAX(0, quantity - ?), updated_at = ? WHERE id = ?'
        break
    }

    const stmt = db.prepare(sql)
    const result = stmt.run(quantity, now, id)

    if (result.changes === 0) return null
    return itemDb.getById(id)
  },

  delete: (id: string): boolean => {
    const stmt = db.prepare('DELETE FROM items WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  },
}

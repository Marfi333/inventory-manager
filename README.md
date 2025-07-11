# Inventory Management System

A full-stack inventory management system built with **Hono** and **Vue 3** with **PrimeVue** (frontend).

## Features

### Backend (API)

- **RESTful API** built with Hono framework
- **SQLite database** for data persistence
- **Zod validation** for request validation
- **CORS support** for frontend communication

### Frontend (UI)

- **Vue 3** with Composition API
- **PrimeVue** UI library with Aura theme
- **Tailwind CSS** for styling

### Core Functionality

- **Category Management**: Create, read, update, and delete categories
- **Item Management**: Full CRUD operations for inventory items
- **Quantity Management**: Add, subtract, or set item quantities
- **Low Stock Alerts**: Visual indicators for items below minimum quantity
- **Dashboard**: Overview with statistics and recent activity
- **Professional UI**: Clean, modern interface with data tables and forms

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd inventory-system
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   pnpm dev:api
   ```

   The API will be available at `http://localhost:3001`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   pnpm dev:ui
   ```
   The UI will be available at `http://localhost:5173`

### Building for Production

1. **Build the backend**

   ```bash
   pnpm build:api
   ```

2. **Build the frontend**
   ```bash
   pnpm build:ui
   ```

## API Endpoints

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Items

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `GET /api/items/category/:categoryId` - Get items by category
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `PATCH /api/items/:id/quantity` - Update item quantity
- `DELETE /api/items/:id` - Delete item

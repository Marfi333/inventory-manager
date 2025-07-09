# Inventory Management System

A modern, full-stack inventory management system built with **Hono** (backend) and **Vue 3** with **PrimeVue** (frontend).

## Features

### Backend (API)
- **RESTful API** built with Hono framework
- **SQLite database** for data persistence
- **TypeScript** for type safety
- **Zod validation** for request validation
- **CORS support** for frontend communication
- **Full CRUD operations** for categories and items

### Frontend (UI)
- **Vue 3** with Composition API and `<script setup>` syntax
- **PrimeVue** UI library with Aura theme
- **Tailwind CSS** for styling
- **Vue Router** for navigation
- **TypeScript** for type safety
- **Responsive design** with modern UX

### Core Functionality
- **Category Management**: Create, read, update, and delete categories
- **Item Management**: Full CRUD operations for inventory items
- **Quantity Management**: Add, subtract, or set item quantities
- **Low Stock Alerts**: Visual indicators for items below minimum quantity
- **Dashboard**: Overview with statistics and recent activity
- **Professional UI**: Clean, modern interface with data tables and forms

## Project Structure

```
inventory-system/
├── api/                    # Backend (Hono)
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── database.ts    # Database operations
│   │   ├── validation.ts  # Zod schemas
│   │   ├── types.ts       # TypeScript types
│   │   └── index.ts       # Main server file
│   └── package.json
├── ui/                     # Frontend (Vue 3)
│   ├── src/
│   │   ├── pages/         # Vue pages/components
│   │   ├── services/      # API service
│   │   ├── types/         # TypeScript types
│   │   ├── router/        # Vue Router config
│   │   └── main.ts        # Main app file
│   └── package.json
└── package.json           # Workspace root
```

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
   cd api
   pnpm dev
   ```
   The API will be available at `http://localhost:3001`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd ui
   pnpm dev
   ```
   The UI will be available at `http://localhost:5173`

### Building for Production

1. **Build the backend**
   ```bash
   cd api
   pnpm build
   pnpm start
   ```

2. **Build the frontend**
   ```bash
   cd ui
   pnpm build
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

## Technologies Used

### Backend
- **Hono** - Fast, lightweight web framework
- **TypeScript** - Type-safe JavaScript
- **SQLite3** - Embedded database
- **Zod** - TypeScript-first schema validation
- **UUID** - Unique identifier generation

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **PrimeVue** - Rich UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Router** - Official router for Vue.js
- **TypeScript** - Type-safe JavaScript

## Features in Detail

### Dashboard
- Overview statistics (total categories, items, stock, low stock alerts)
- Low stock item alerts with visual indicators
- Recent items display
- Responsive card layout

### Category Management
- Data table with sorting and pagination
- Create/edit modal dialogs
- Form validation
- Delete confirmation dialogs
- Toast notifications for user feedback

### Item Management
- Comprehensive data table with all item details
- Advanced form with dropdowns, number inputs, and validation
- Quick quantity adjustment buttons (+/- directly in table)
- Dedicated quantity management dialog
- Category association with dropdown selection
- SKU management
- Price formatting
- Low stock visual indicators

### Quantity Management
- Set absolute quantity
- Add to existing quantity
- Subtract from existing quantity
- Prevents negative quantities
- Real-time updates

## Development

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Composition API** with `<script setup>` syntax
- **Clean architecture** with separation of concerns

### Best Practices
- **Type-safe API** with shared TypeScript types
- **Proper error handling** with try-catch blocks
- **Loading states** for better UX
- **Form validation** with user-friendly error messages
- **Responsive design** for mobile and desktop
- **Accessibility** considerations with proper ARIA labels

## License

This project is licensed under the ISC License. 
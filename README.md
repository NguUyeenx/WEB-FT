# ShoeParadise 👟 - Modern E-Commerce Platform

A production-grade, full-stack e-commerce platform for selling shoes, built as a pnpm monorepo with modern technologies.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![pnpm](https://img.shields.io/badge/pnpm-%3E%3D8.0.0-orange.svg)

## 🌟 Features

- **Modern Tech Stack**: TypeScript, Next.js 14 (App Router), Fastify, Prisma, PostgreSQL
- **Real-Time Shopping Experience**: Browse products, add to cart, checkout with Stripe
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: Full CRUD operations for products, variants, and inventory
- **Advanced Features**: 
  - Product filtering and search
  - User reviews and ratings
  - Wishlist functionality
  - Order tracking
  - Admin dashboard
- **Security First**: CSRF protection, XSS mitigation, rate limiting, secure headers
- **Performance Optimized**: Server-side rendering, caching, code splitting
- **Accessible**: WCAG compliant with keyboard navigation and screen reader support
- **Internationalization Ready**: Support for en-US and vi-VN locales

## 📁 Project Structure

```
.
├── apps/
│   ├── api/              # Fastify backend API
│   │   ├── prisma/       # Database schema and migrations
│   │   └── src/          # API source code
│   └── web/              # Next.js frontend application
│       └── src/          # Web source code
├── packages/
│   ├── shared/           # Shared Zod schemas and utilities
│   └── ui/               # Reusable UI components (Radix + Tailwind)
└── .github/
    └── workflows/        # CI/CD pipelines

```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 15

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WEB-FT
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET` and `JWT_REFRESH_SECRET`: Strong random secrets
   - `STRIPE_SECRET_KEY`: Your Stripe test key
   - Other variables as needed

4. **Set up the database**
   ```bash
   cd apps/api
   pnpm db:push
   pnpm db:seed
   ```

5. **Start development servers**
   ```bash
   # From the root directory
   pnpm dev
   ```

   This starts:
   - Backend API on http://localhost:4000
   - Frontend web on http://localhost:3000

## 📝 Available Scripts

### Root Level
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm test` - Run all tests
- `pnpm test:ci` - Run tests with coverage
- `pnpm typecheck` - Type check all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier

### Backend API (apps/api)
- `pnpm dev` - Start API in watch mode
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio

### Frontend Web (apps/web)
- `pnpm dev` - Start Next.js dev server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

## 🔐 Demo Accounts

After running the seed script, you can use these accounts:

**Admin Account**
- Email: `admin@shoestore.com`
- Password: `admin123`
- Access: Full admin dashboard and order management

**User Account**
- Email: `user@example.com`
- Password: `password123`
- Access: Standard user features

## 🏗️ Architecture

### Backend (apps/api)

- **Framework**: Fastify with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT access tokens (short-lived) + refresh tokens (httpOnly cookies)
- **Validation**: Zod schemas for all endpoints
- **Security**: Helmet, CORS, rate limiting, CSRF protection
- **Payment**: Stripe integration with webhook handling

### Frontend (apps/web)

- **Framework**: Next.js 14 with App Router
- **State Management**: 
  - React Query for server state
  - Zustand for UI state
- **Styling**: Tailwind CSS
- **UI Components**: Custom Radix-based component library
- **Animations**: Framer Motion with `prefers-reduced-motion` support
- **3D Graphics**: react-three-fiber (placeholder for 3D shoe viewer)

### Shared Packages

- **packages/shared**: Zod schemas, types, and utilities
- **packages/ui**: Themeable UI component library

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:ci

# Run tests for specific package
cd apps/api && pnpm test
cd apps/web && pnpm test
```

## 🔒 Security Features

- XSS mitigation through input sanitization
- CSRF protection with double-submit pattern
- Content Security Policy (CSP) headers
- Rate limiting and IP throttling
- JWT with short-lived access tokens
- Secure httpOnly cookies for refresh tokens
- Parameterized queries via Prisma
- Zod validation on all inputs

## 📊 API Documentation

### Key Endpoints

**Authentication**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

**Products**
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured/list` - Get featured products

**Cart**
- `GET /api/carts` - Get user cart
- `POST /api/carts/items` - Add item to cart
- `PATCH /api/carts/items/:id` - Update cart item
- `DELETE /api/carts` - Clear cart

**Orders**
- `GET /api/orders` - List user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order (with Stripe PaymentIntent)
- `POST /api/orders/webhook` - Stripe webhook

**Admin** (requires ADMIN role)
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/:id` - Update product

## 🌐 Deployment

### Backend
- Deploy to any Node.js hosting (Render, Railway, Heroku, etc.)
- Ensure PostgreSQL database is accessible
- Set all environment variables
- Run database migrations: `pnpm db:push`
- Run seed (optional): `pnpm db:seed`

### Frontend
- Deploy to Vercel, Netlify, or similar
- Set `NEXT_PUBLIC_API_URL` to your backend URL
- Build command: `pnpm build`
- Start command: `pnpm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspiration from modern e-commerce platforms
- UI components based on shadcn/ui principles
- Icons from Radix UI

---

**Note**: This is a demo e-commerce platform. For production use, ensure all security best practices are followed, including:
- Proper secret management
- SSL/TLS certificates
- Database backups
- Error monitoring
- Performance monitoring
- Security audits

# GitHub Copilot Instructions for "Modern Shoe Store" Project

## 1. Project Overview & Goal

This is a modern, visually-rich e-commerce website for selling shoes. The primary goal is to create an impressive user experience with 3D elements, smooth animations, and top-tier performance. The project is a monorepo managed with `pnpm`.

- **Frontend App (`apps/web`):** A server-rendered Next.js application for the customer-facing storefront.
- **Backend API (`apps/api`):** A high-performance Fastify API server handling business logic and data.
- **Shared Packages:** Code shared between the `web` and `api` apps, such as types and UI components.

## 2. Core Technologies & Architecture

### Frontend (`apps/web`)

- **Framework:** Next.js 14 (App Router) with React 18 and TypeScript.
- **Styling:** Tailwind CSS. Do not write custom CSS files; use Tailwind utility classes exclusively.
- **UI Components:** Build reusable components in `packages/ui` using Radix UI primitives for accessibility. Components should be themeable.
- **State Management:**
  - **Server State:** Use **React Query (`@tanstack/react-query`)** for all data fetching, caching, and mutation.
  - **Client/UI State:** Use **Zustand** for simple global UI state (e.g., modal open/closed, cart drawer visibility).
- **Animations:** Use **Framer Motion** for all UI animations (page transitions, hover effects, etc.). Ensure `prefers-reduced-motion` is respected.
- **3D Graphics:** Use **`react-three-fiber`** and **`@react-three/drei`** for 3D shoe models on the homepage and Product Detail Pages (PDP).
- **SEO:** Use `next-seo` for managing metadata.

### Backend (`apps/api`)

- **Framework:** Fastify with TypeScript. Leverage its plugin-based architecture for organizing routes and services.
- **Database ORM:** **Prisma** is the single source of truth for database interaction with PostgreSQL. Always use Prisma Client for queries to prevent SQL injection.
- **Validation:** Use **Zod** to validate all incoming request bodies, query parameters, and URL params.
- **Authentication:**
  - Stateless authentication using JWTs.
  - Access tokens are short-lived and stored in memory.
  - Refresh tokens are long-lived and stored in `httpOnly`, `Secure`, `SameSite=Lax` cookies.
- **Security:** Implement CSRF protection using the double-submit cookie pattern for sensitive actions.

## 3. Monorepo Structure & Key Packages

- **`apps/web`:** The Next.js storefront.
- **`apps/api`:** The Fastify API.
- **`packages/shared`:**
  - Contains **Zod schemas** that are shared between the frontend and backend for validation and type inference. This is the single source of truth for data shapes.
  - Contains shared TypeScript `types` and utility functions.
- **`packages/ui`:**
  - A library of React components (Button, Card, Input, etc.) built with Tailwind CSS and Radix UI.
  - These components are imported into `apps/web`.

## 4. Coding Conventions & Best Practices

- **Code Style:** Adhere strictly to the rules defined in `.eslintrc.js` and `.prettierrc`. Code is automatically formatted on commit using Husky and lint-staged.
- **Commit Messages:** Follow the **Conventional Commits** specification (e.g., `feat: add product filtering`, `fix: correct checkout calculation`). Commitlint enforces this.
- **TypeScript:** Use strict mode. Infer types from Zod schemas whenever possible.

  ```typescript
  // Correct way in packages/shared/src/schemas.ts
  import { z } from "zod";

  export const ProductSchema = z.object({
    id: z.string().cuid(),
    name: z.string().min(3),
    description: z.string(),
    price: z.number().positive(),
  });

  export type Product = z.infer<typeof ProductSchema>;

  // Use this type in both frontend and backend
  ```

- **API Development (`apps/api`):** Follow a `domain -> service -> repository` pattern for separation of concerns.
- **Frontend Development (`apps/web`):**
  - Break down complex components into smaller, single-responsibility components.
  - Create custom hooks (`use...`) to encapsulate logic (e.g., `useCart`, `useProductFilters`).
  - Prioritize **Accessibility (a11y)**: Use semantic HTML, ensure keyboard navigability, and meet WCAG contrast ratios.
- **Testing:**
  - Frontend: Use Vitest and React Testing Library for component and integration tests.
  - Backend: Use Vitest and `supertest` for API endpoint testing.

## 5. Important Data Models

The core of the application revolves around Products and their Variants.

**Prisma Schema (`apps/api/prisma/schema.prisma`):**

```prisma
model Product {
  id          String    @id @default(cuid())
  name        String
  description String
  // ... other fields
  variants    Variant[]
}

model Variant {
  id        String    @id @default(cuid())
  productId String
  product   Product   @relation(fields: [productId], references: [id])
  color     String
  size      String
  sku       String    @unique
  // ... inventory relation
}
```

**Zod Schema (`packages/shared/src/schemas.ts`):**

```typescript
import { z } from "zod";

export const VariantSchema = z.object({
  id: z.string().cuid(),
  color: z.string(),
  size: z.string(),
  sku: z.string(),
});

export const ProductSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string(),
  variants: z.array(VariantSchema),
});
```

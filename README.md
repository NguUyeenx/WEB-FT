# ShoeParadise E-Commerce

Development workspace for the full-stack shoe store project with modern 3D experiences.

## 🏗️ Monorepo Structure

This is a monorepo managed with `pnpm`:

- **`apps/web`**: Next.js 14 storefront with App Router
- **`apps/api`**: Fastify API server with PostgreSQL
- **`packages/shared`**: Shared types and Zod schemas
- **`packages/ui`**: Reusable React UI components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev

# Start development servers
pnpm dev
```

The API will run on `http://localhost:4000` and the web app on `http://localhost:3000`.

## 🏗️ Building

```bash
# Build all apps
pnpm -w build

# Build specific app
cd apps/web
pnpm build
```

## ☁️ Deployment

### API Deployment on Render

The API is deployed on Render using the `render.yaml` Blueprint.

#### Setup Steps:

1. **Connect Repository**: In Render dashboard, create a new Blueprint and connect this repository
2. **Configure Secrets**: Set the following environment variables in Render:
   - `JWT_SECRET` - Secret for signing access tokens
   - `JWT_REFRESH_SECRET` - Secret for signing refresh tokens
   - `COOKIE_SECRET` - Secret for signed cookies
   - `CSRF_SECRET` - Secret for CSRF tokens
   - `STRIPE_SECRET_KEY` - Stripe secret key for payments
   - `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
3. **Database**: The Blueprint automatically provisions a PostgreSQL database
4. **Health Check**: Render pings `/health` endpoint to verify service health
5. **PR Previews**: Enable preview environments for pull requests in Render settings
   - Preview URLs: `https://shoestore-api-pr-<number>.onrender.com`
   - Automatically created for each PR
   - Expire after 7 days of inactivity

#### Environment Variables:

The render.yaml configures:

- `PORT=10000` (Render default)
- `CORS_ALLOWLIST=http://localhost:3000,https://*.vercel.app` (supports wildcard patterns)
- `IMAGE_DOMAIN_ALLOWLIST` for allowed image sources
- Auto-generated secrets for JWT, cookies, and CSRF

### Web Deployment on Vercel

The Next.js web app is deployed on Vercel.

#### Setup Steps:

1. **Import Project**: In Vercel dashboard, import this repository
2. **Configure Project**:

   - **Root Directory**: `apps/web`
   - **Framework Preset**: Next.js
   - **Build Command**: `cd ../.. && pnpm install && cd apps/web && pnpm build`
   - **Install Command**: `pnpm install`

3. **Environment Variables**: Add in Vercel project settings:

   ```
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   BACKEND_URL=https://shoestore-api.onrender.com
   IMAGE_DOMAIN_ALLOWLIST=cdn.example.com,images.unsplash.com
   ```

4. **API Proxy**: Next.js rewrites proxy `/api/*` requests to the Render API:

   - Local: Proxies to `http://localhost:4000`
   - Preview/Production: Proxies to `BACKEND_URL` (Render API)

5. **Preview Deployments**:
   - Vercel automatically creates preview URLs for each PR
   - Preview URL format: `https://<branch>-<project>.vercel.app`
   - Vercel bot comments the preview URL on each PR
   - CORS on API allows `https://*.vercel.app` wildcard

#### Vercel Bot Integration:

The Vercel GitHub bot automatically:

- Builds and deploys preview environments for PRs
- Posts preview URLs as PR comments
- Updates deployment status on commits

### CORS Configuration

The API supports wildcard patterns in `CORS_ALLOWLIST` for Vercel preview domains:

```bash
# .env or Render environment variable
CORS_ALLOWLIST="http://localhost:3000,https://*.vercel.app,https://yourdomain.com"
```

The wildcard `https://*.vercel.app` matches all Vercel preview and production URLs.

### Security Headers

Both API and Web apps include security hardening:

**API (Fastify + Helmet)**:

- Content Security Policy (CSP)
- Rate limiting (100 requests per 15 min)
- Secure cookie configuration

**Web (Next.js headers)**:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

## 📝 Environment Variables

See `.env.example` for all required environment variables with descriptions.

Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `BACKEND_URL` - API URL for Next.js proxy (used in rewrites)
- `CORS_ALLOWLIST` - Allowed origins for API (supports wildcards)
- `NEXT_PUBLIC_SITE_URL` - Public web app URL

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in specific app
cd apps/api
pnpm test
```

## 📚 Documentation

See `.github/copilot/instructions.md` for detailed architecture and coding conventions.

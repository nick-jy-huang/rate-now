# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
pnpm dev              # Start development server with Turbopack
pnpm build            # Production build (includes Prisma generate/migrate)
pnpm start            # Start production server
pnpm lint             # Run Next.js linting
pnpm test             # Run tests with coverage using Vitest
pnpm prettier         # Format code with Prettier + Tailwind plugin
```

### Database Operations
```bash
pnpm prisma migrate dev --name init    # Initialize database
pnpm prisma generate                   # Generate Prisma client
pnpm postinstall                       # Auto-runs after package install
```

**Important**: This project uses **pnpm** as the package manager, not npm or yarn.

## Architecture Overview

**Rate Now** is a real-time currency exchange rate converter built with Next.js 15 App Router, React 19, TypeScript, and PostgreSQL via Prisma ORM. The application supports 10 major currencies with Chinese localization.

### Core Data Flow
1. Frontend requests rates via `/api/rates` (GET for queries, POST for updates)
2. API checks PostgreSQL database cache first via Prisma
3. If data missing, external RTER API fetches fresh rates
4. GitHub Actions can trigger automated updates via POST endpoints
5. Database stores rates with unique constraint on `[date, from, to]`

### Key Directories

**`/app`** - Next.js App Router
- `page.tsx`: Main currency converter (client component)
- `api/rates/route.ts`: Primary API for rate queries/updates
- `api/rates-db/route.ts`: Direct database operations

**`/components`** - React components for UI (AmountInput, CurrencySelect, etc.)

**`/constants/index.ts`** - Currency definitions
- `CURRENCY_NAME_MAP`: Chinese currency names
- `SYMBOLS`: Currency symbols  
- `CURRENCIES`: Supported currencies (USD, EUR, JPY, TWD, HKD, GBP, AUD, CAD, SGD, CNY)

**`/utils`** - Business logic
- `dateUtils.ts`: Date formatting with dayjs
- `rateUtils.ts`: Exchange rate calculations and external API integration

**`/prisma`** - Database layer
- `schema.prisma`: Rate model with unique constraint
- `lib/prisma.ts`: Configured client with dev optimizations

### Database Schema
```prisma
model Rate {
  id        Int      @id @default(autoincrement())
  date      String   // Format: 'YYYY-MM-DD'
  from      String   // Currency code (e.g., 'USD')
  to        String   // Currency code (e.g., 'TWD')
  rate      Float    // Exchange rate
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([date, from, to])
}
```

## Development Guidelines

### External API Integration
- Uses RTER API via `RTER_API_URL` environment variable
- TWD (Taiwan Dollar) serves as the base currency for calculations
- Rate updates can be triggered manually via UI or automated via GitHub Actions

### Code Patterns
- TypeScript strict mode enforced
- Component-based architecture with clear separation
- Database operations through Prisma ORM with proper error handling
- RESTful API design with appropriate HTTP status codes

### Testing & Quality
- Vitest for testing with React Testing Library
- Coverage reports generated in `/coverage` directory
- Prettier formatting with Tailwind plugin for consistent styling
- Next.js built-in ESLint configuration

### Styling
- Tailwind CSS v4 with custom animations in `styles/globals.css`
- Lime green theme (#bfed55) with animated background
- Font Awesome icons via CDN, Geist fonts from Google Fonts

### Performance Considerations
- Database caching minimizes external API calls
- Prisma connection pooling optimized for development
- Turbopack for faster development builds
- Same-currency comparisons return rate of 1 without database lookup
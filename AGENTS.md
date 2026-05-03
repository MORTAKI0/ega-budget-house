# EGA BUDGET HOUSE — Agent Guide

## Product focus

EGA BUDGET HOUSE is a personal monthly budget web app + PWA built around one loop:

**Add transaction → Review month → Understand spending → Protect safe balance**

When making product decisions, optimize this loop first. Prefer fast real usage over decorative UI.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Convex
- Recharts
- Zod
- Vercel
- PWA manifest/icons

## Commands

Use npm.

```bash
npm run dev
npm run lint
npm run build
npx convex dev
```

Run `npm run lint` and `npm run build` before reporting done.

Never commit `.env.local`.

## Route and shell rules

Public routes:

- `/`
- `/login`
- `/signup`

Protected app routes:

- `/add`
- `/review`
- `/stats`
- `/settings`

Default after login is `/add`.

Use one shared app shell for protected routes. Bottom nav after login:

- Add
- Review
- Stats
- Settings

Do not create parallel layouts unless requested. Do not add visible UI that is not wired to real behavior.

## Architecture rules

Keep routing thin.

```txt
src/app/                 routes only
src/components/ui/       shadcn components only
src/components/app-shell/ layout, nav, shell
src/components/forms/    form components
src/components/charts/   chart components
src/lib/                 shared helpers
src/hooks/               client hooks
convex/                  backend schema, queries, mutations
public/                  static assets and PWA icons
```

Rules:

- `src/app/**/page.tsx` composes components only.
- Put reusable UI in `src/components`.
- Put calculations, dates, currency, and validation in `src/lib`.
- Put Convex database logic only in `convex/`.
- Use `@/` imports.
- Prefer small reviewable files.

## Convex rules

Existing backend files:

- `convex/schema.ts`
- `convex/categories.ts`
- `convex/transactions.ts`
- `convex/monthlySettings.ts`
- `convex/monthlySummary.ts`

Do not rename Convex functions without updating every caller. Validate inputs in mutations. Prefer Convex queries/mutations over extra API routes.

Default categories:

- Transport
- WiFi
- Abonnement
- Home Stuff
- Coffee Outside
- Food
- Income
- Other

## Data rules

Expenses subtract. Income adds.

```txt
monthlyIncome = sum(income)
monthlyExpenses = sum(expense)
currentBalance = startingBalance + monthlyIncome - monthlyExpenses
availableToSpend = currentBalance - safeBalanceGoal
```

Use `monthKey` format: `YYYY-MM`.

Store amounts as numbers for release 1.

## UI rules

Design style:

- clean
- minimal
- mobile-first
- green/white finance theme
- rounded cards
- soft shadows
- large tap targets

Build every screen for:

- desktop web
- mobile browser
- installed PWA

Use shadcn/ui primitives where possible. Use lucide-react icons. Use Recharts only for charts. Include loading, empty, validation, and success/error states for real flows.

## PWA rules

Existing PWA files:

- `src/app/manifest.ts`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `public/apple-touch-icon.png`

Do not add service workers, push notifications, or offline sync unless explicitly requested.

## Delivery bias

Prefer:

- faster transaction capture
- clearer monthly review
- useful spending stats
- safe-balance clarity
- one complete flow over many partial screens
- replacing placeholders with working behavior

## Boundaries

Do not:

- add Drizzle
- add a separate backend API unless requested
- add native mobile app code
- add bank integrations
- add receipt scanning
- add category editing in release 1
- add unrelated dependencies
- refactor unrelated files
- change routes unless requested
- commit secrets or `.env.local`

## Done report

When finished, report:

- changed files
- commands run
- validation result
- notes or follow-ups

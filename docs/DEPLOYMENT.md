# Deployment

## Production Convex and Vercel

Vercel Production must run the repo build command:

```bash
npm run vercel-build
```

`vercel.json` sets this explicitly. The script deploys Convex schema/functions, runs Convex codegen, then builds Next.js:

```bash
convex deploy --cmd "npm run codegen && npm run build"
```

## Required Production Environment

- `CONVEX_DEPLOY_KEY` must exist in Vercel Production.
- `NEXT_PUBLIC_CONVEX_URL`, if set, must point to the production Convex URL.
- After changing build scripts, redeploy Vercel Production with the build cache cleared.

## Production Release Checklist

1. Deploy Production in Vercel.
2. Seed required default categories:

   ```bash
   npm run convex:seed:prod
   ```

3. Verify the production Convex `categories` table contains:

   - Transport
   - WiFi
   - Abonnement
   - Home Stuff
   - Coffee Outside
   - Food
   - Income
   - Other

`categories.seedDefaults` is idempotent. It inserts missing defaults and patches existing defaults to the expected kind, sort order, and `isDefault: true`. It does not delete transaction data or require database resets.

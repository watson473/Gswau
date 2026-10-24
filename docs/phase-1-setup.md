# Phase 1 setup and testing

## 1. Database

Run `drizzle/migrations/0002_phase1_membership.sql` once in Supabase → SQL Editor.

It converts every product to an access tier (the free chapter becomes **Free**, everything else
**Members**), switches buy links to `gswau.gumroad.com`, and adds memberships, purchase-by-email,
the Gumroad notification log, settings, analytics and the public `previews` bucket.

## 2. Hosting (Vercel)

1. Sign in at vercel.com with GitHub and import `watson473/Gswau`.
2. Framework preset: **Other**. Build command `npm run build`. Leave the output directory empty.
3. Add these environment variables (Settings → Environment Variables), for Production and Preview:

| Name | Value | Secret? |
| --- | --- | --- |
| `NITRO_PRESET` | `vercel` | no |
| `SUPABASE_URL` / `VITE_SUPABASE_URL` | from `.env` | no |
| `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY` | from `.env` | no |
| `SUPABASE_PROJECT_ID` / `VITE_SUPABASE_PROJECT_ID` | from `.env` | no |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API keys → secret key | **yes** |
| `GUMROAD_ACCESS_TOKEN` | Gumroad → Settings → Advanced → Applications → your app → access token | **yes** |
| `GUMROAD_WEBHOOK_SECRET` | any long random string (e.g. 40 letters and numbers) | **yes** |

Never put the three secret values in `.env`, the code, or chat.

Every branch gets its own preview address on Vercel, so payments can be tested before merging.

## 3. Gumroad

1. Create one **Membership** product with two prices: Monthly $19.99 and Yearly $199.
2. Admin → Settings: paste the checkout links (monthly and annual), and the membership's short
   link (the part after `/l/`).
3. Admin → Gumroad: check all three server settings show ✓, then click
   **Connect Gumroad notifications**.
4. Click **Import past buyers** once.

## 4. Testing each part

| Part | How to test |
| --- | --- |
| Access rules | `npm test` (runs the real database rules in an in-memory Postgres) |
| Logo | Replace `src/assets/brand/logo.png`, run `npm run brand`, check header, footer and browser tab |
| Gumroad notifications | Gumroad → Settings → Advanced → Ping → **Send test ping** to `https://<site>/api/gumroad/<secret>`; Admin → Gumroad lists it as a test |
| Single purchase | Buy a cheap book with a test discount code; Admin → Access shows it; My library shows it after signing up with that email |
| Membership | Join monthly; My library shows plan, status and renewal date; cancel on Gumroad and the card shows "Cancelled" with an end date |
| Previews | Admin → Products → upload a book PDF; the product page shows "Read a free preview" while signed out |
| Pricing and home page | Open `/` and `/pricing` on a phone; Lighthouse (Chrome DevTools) on mobile |
| Analytics | Sign up, open a preview, join the newsletter; Admin → Analytics shows the counts |

## Limits to know

- Supabase's free plan limits each uploaded file to 50 MB. Several audiobooks are bigger
  (up to 231 MB), so audio uploads need the Pro plan or smaller files.

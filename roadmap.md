# GSWAU roadmap

- [x] Real gswau.com catalog (25 products), database, sign in, My library, admin
- [x] New Supabase project, products, Gumroad details and covers loaded

## Phase 1 — membership (branch feat/phase-1-membership)
- [x] Access tiers per product (free / members / premium) and access-rule tests
- [x] Gumroad notifications: purchases, renewals, cancellations, refunds, failed payments
- [x] Past-buyer import, purchases granted by email before signup
- [x] Free 10-page previews (made automatically from the uploaded PDF)
- [x] New homepage, pricing page, membership card in My library
- [x] Swappable logo, translation files (English), analytics events
- [ ] Run migration 0002 — owner
- [ ] Create the Gumroad membership product and paste its links in Admin → Settings — owner
- [ ] Deploy on Vercel with the server secrets (docs/phase-1-setup.md) — owner
- [ ] Send the logo PNG — owner
- [ ] Upload book PDFs and MP3s (audio over 50 MB needs Supabase Pro) — owner
- [ ] Confirm Gumroad fields with a real test purchase (cancellation, manage link)

## Later
- Phase 2: Calendly coaching, podcast page + RSS, newsletter storage and email service
- Phase 3: course certificates, premium course purchases, admin improvements
- Phase 4: Spanish and French, podcast/clip automation
- Phase 5: mobile app
- Upgrade zod to v4 (new security advisory; breaking change)

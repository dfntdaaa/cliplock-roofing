
# Cliplock Roofing — Whop Integration Starter

A responsive React/Vite version of the Cliplock Roofing website, using a dark charcoal, orange, and white theme.

The starter includes roofing services, a service-area section, financing information, a reviews placeholder, an estimate form, three payment-plan cards, Whop Elements scaffolding, tracking events, a server-side lead route, and an admin-only invoice route.

## Run locally

1. Install Node.js (current LTS).
2. Open this folder in a terminal.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Add the IDs after setting up your Whop products.
6. Run `npm run dev` to start the website.
7. In a second terminal, run `npm run server` to start the API.

The Vite development server proxies `/api` requests to `http://localhost:8787`.

The server requires a private `WHOP_API_KEY` and `WHOP_ACCOUNT_ID`. Never put the secret in a `VITE_` variable.

## Whop products to create

Create three one-time plans in the Whop dashboard:

- Roof Inspection — $149 one-time
- Project Deposit — $500 one-time
- Roofing Service — the actual flat rate you decide to charge

Put the relevant plan and product IDs in `.env`.

The flat-rate checkout is intentionally disabled until you confirm its amount. Update the amount in `src/main.jsx` before enabling that checkout.

## Important integration notes

- The checkout uses Whop Elements imports, including `WhopElements`, `Payments`, `ExpressCheckoutElement`, `PaymentElement`, and `BrandingElement`.
- Verify the current Whop Elements version's props and payment-confirmation flow before production.
- Apple Pay and Google Pay availability depends on the environment, browser, device, and merchant configuration.
- The estimate route posts to `POST /api/leads`. Whop's Leads API may require additional fields, such as a Whop user ID or product ID. Verify the current API schema before launch.
- The invoice route is admin-only and is not called by the public website. Set a strong `INVOICE_ADMIN_SECRET` and use a secure admin tool to call it.
- Card-on-file setup and final-balance billing are not automatically completed by this starter. Implement Whop's currently supported setup-intent/payment-method flow and obtain explicit customer consent before saving or charging a payment method.
- Never charge a final balance without an agreed invoice and authorization.
- The website fires custom events named `estimate_requested`, `service_viewed`, and `deposit_started`.
- Replace the service-area text with the actual US cities and states served.
- Add real contact details and verified customer reviews before launch.
- The images are remote Unsplash examples. Replace them with licensed business photos when available.

## Deployment

This is source code, not a deployed website. It has not been connected to your Whop account or sandbox-tested.

Follow the current Whop Websites quickstart to initialize or migrate the project and deploy through your account. Do not assume a `whop.app` address until Whop confirms the assigned domain.

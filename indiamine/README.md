<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/11d11b82-2b9b-4315-b05c-af3e8fd8eb18

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Local setup (Windows / PowerShell)

1. Install Node.js LTS.
2. In this project folder run `npm install` (or `npm.cmd install` if PowerShell blocks scripts).
3. Copy `.env.example` to `.env.local` and set your Supabase project URL and publishable/anon key:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Run `npm run dev` (or `npm.cmd run dev`).

### Authentication setup

- In Supabase Dashboard → Authentication → Providers, enable Email.
- For Google sign-in, enable Google and add the Google OAuth Client ID/Secret. Configure the Supabase callback URL in Google Cloud, then add your local/deployed site URL under Supabase Authentication URL Configuration.
- Configure email confirmation and password reset redirect URLs in Supabase.
- The app uses Supabase Auth for email signup/sign-in, Google OAuth, password-reset requests, session restore, and sign-out when credentials are configured. Without credentials, demo profiles are only local UI previews.
- Premium checkout is intentionally not activated: a verified payment provider/webhook must be added before granting paid access.
- Roles currently default to `viewer` for real Supabase users. Creator/admin access must be enforced with trusted database policies/server-side checks, not by client-side UI state.

### Validation

`npm run lint` runs the TypeScript check. Run `npm run build` after a fresh `npm install` on your own OS. A build from the uploaded ZIP environment could not be verified because the included `node_modules` was platform-specific and lacked the Linux Rollup optional binary.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase setup

Without Supabase settings the app uses the local data in `data/landmarks.ts`, so it runs as is. To load landmarks from Supabase:

1. Create a project at [supabase.com](https://supabase.com).
2. Create the tables and policies, either with the Supabase CLI (installed as a dev dependency): `npx supabase login`, `npx supabase link --project-ref <your-project-ref>`, then `npx supabase db push`; or by running every file in `supabase/migrations/` in the SQL editor, in name order (oldest first). Each new feature adds a file; run only the ones you haven't run yet.
3. Run `supabase/seed.sql` in the SQL editor to load all 63 landmarks. It is safe to run again: existing rows are updated. (`npx supabase db reset` runs it automatically against a local database started with `npx supabase start`.)
4. Copy `.env.example` to `.env.local` and fill in the project URL and anon key from Project Settings → API. Newer projects call the anon key the "publishable" key; either works. Add the same two variables to the Vercel project.
5. Put the service role key (the "secret" key on newer projects) in `.env.local` only, then run `npm run test:rls`. It creates two test users, checks that each can only read and change their own profile and completions and that nobody can change landmarks, and deletes the users at the end. Every line should show ✓.

After editing `data/landmarks.ts`, run `npm run db:seed:sql` to regenerate `supabase/seed.sql` and run it again in the SQL editor. The seed adds and updates landmarks but never deletes them: remove a dropped landmark in the Supabase table editor.

Pages are rebuilt at most once an hour, so a change in the database shows up on the site within an hour. Builds reuse the cached database response for the same hour, so redeploying right after a change can still show the old data.

## Sign-in setup

Accounts use Supabase Auth: email and password (with email confirmation), Google, and password reset. Without the Supabase settings above, the sign-in pages say sign-in isn't set up and the rest of the site works as usual. In the Supabase dashboard:

1. **Authentication → URL Configuration**
   - **Site URL:** your production address, e.g. `https://your-app.vercel.app`.
   - **Redirect URLs:** add `http://localhost:3000/**`, `https://your-app.vercel.app/**` and, for Vercel previews, `https://*-your-team.vercel.app/**`. Email links and the Google return go back to whichever of these the visitor started on.
2. **Authentication → Emails → Templates.** Change the link in two templates so it goes through the app (this lets the link work in any browser):
   - **Confirm signup:** `<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email&next=/account">Confirm your email</a>`
   - **Reset password:** `<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password">Choose a new password</a>`
3. **Authentication → Sign In / Providers → Email:** keep "Confirm email" on and set the minimum password length to 8.
4. **Google:**
   1. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an OAuth client ID of type "Web application". Under "Authorized redirect URIs" add `https://<your-project-ref>.supabase.co/auth/v1/callback`.
   2. In Supabase, open **Authentication → Sign In / Providers → Google**, turn it on and paste the client ID and secret.
5. **Email sending:** Supabase's built-in email sends only a few messages an hour and is meant for testing. Before real users sign up, set up your own SMTP under **Authentication → Emails → SMTP Settings** (for example with Resend).

Then try it: sign up with a real email and open the confirmation link, log in with Google, and use "Forgot password?". Each new account gets a row in the `profiles` table.

**Profiles and avatars.** `…000400_profile_page.sql` adds a username, bio and avatar to profiles and creates the `avatars` Storage bucket with its policies: people can upload, replace and delete pictures only in their own folder, and only JPEG, PNG or WebP up to 1 MB (the app shrinks pictures to 256×256 before uploading). The bucket is public to read, so an avatar's address works for anyone who has it; profiles themselves stay private. After running it, `npm run test:rls` also checks usernames and avatar storage.

Signed-in visitors' ticks are saved to the `completions` table, so they follow them across devices. Anything ticked in a browser while signed out is copied into the account the next time someone logs in there, after which that browser's own list is cleared. To check: tick a few landmarks while signed out, log in, and look for "Added … landmarks from this browser to your account"; the rows appear in **Table Editor → completions**.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

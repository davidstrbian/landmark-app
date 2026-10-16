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
2. Create the tables and policies, either with the Supabase CLI (installed as a dev dependency): `npx supabase login`, `npx supabase link --project-ref <your-project-ref>`, then `npx supabase db push`; or by running `supabase/migrations/20261016000000_init.sql` and then `supabase/migrations/20261016000100_rls.sql` in the SQL editor.
3. Run `supabase/seed.sql` in the SQL editor to load all 63 landmarks. It is safe to run again: existing rows are updated. (`npx supabase db reset` runs it automatically against a local database started with `npx supabase start`.)
4. Copy `.env.example` to `.env.local` and fill in the project URL and anon key from Project Settings → API. Newer projects call the anon key the "publishable" key; either works. Add the same two variables to the Vercel project.
5. Put the service role key (the "secret" key on newer projects) in `.env.local` only, then run `npm run test:rls`. It creates two test users, checks that each can only read and change their own profile and completions and that nobody can change landmarks, and deletes the users at the end. Every line should show ✓.

After editing `data/landmarks.ts`, run `npm run db:seed:sql` to regenerate `supabase/seed.sql` and run it again in the SQL editor. The seed adds and updates landmarks but never deletes them: remove a dropped landmark in the Supabase table editor.

Pages are rebuilt at most once an hour, so a change in the database shows up on the site within an hour. Builds reuse the cached database response for the same hour, so redeploying right after a change can still show the old data.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

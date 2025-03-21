This project contains the following technologies

Authentication and User Management:
- Clerk (Authentication and User Management)

Core Technologies:
- React 19
- TypeScript
- Next 15 (framework)

Data Fetching and State Management:
- Prisma 6 (ORM for DB)

Form and Validation:
- Zod (first schema validation)

Image Handling and Optimization:
- Next Cloudinary (optimize images)
- Sharp (image optimizer)

Middleware and Server Utilities:
- Concurrently (all projects are running in tandem)

Styling and UI Frameworks:
- Tailwind CSS (stylization)

Utilities and Libraries:
- PostCSS (transforms CSS code to AST)

Webhooks:
- Svix (sending webhooks)


To run the client and server via concurrently:
npm run all
npm run lint (loading ESLint checker)
npm run knip

npx prisma generate
npx prisma db push
npx prisma db pull
npx prisma migrate reset

npx next telemetry status (check if Next.js telemetry is enabled)
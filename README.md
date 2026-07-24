# Dejabooom

Dejabooom is a Next.js MVP for AI-personalized surprise trip planning.

The product currently sells the planning experience, not travel inventory. Users create a trip profile with their dates, budget, preferences, restrictions, and surprise reveal style. Flights, hotels, and activities are booked directly with external providers.

This repository does not include a database, OpenAI integration, authentication, payment processing, or reservation system yet.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

The recommended Node version is declared in `.nvmrc`.

## Setup

```bash
git clone https://github.com/edisra10/dejabooom.git
cd dejabooom
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 after the dev server starts.

## Environment

`NEXT_PUBLIC_SITE_URL` is used as the canonical metadata base URL.

```bash
NEXT_PUBLIC_SITE_URL=https://dejabooom.com
```

## Product Flow

1. The landing page presents Surprise Trip as the only primary product.
2. The primary CTA opens the trip profile questionnaire.
3. The questionnaire collects departure details, destination scope, dates, duration, travelers, budget, interests, travel style, restrictions, and surprise level.
4. Draft profile data is stored locally in an isolated storage layer.
5. The final review screen summarizes the profile.
6. `Generate My Surprise Match` opens a placeholder results page for the future recommendation engine.

The questionnaire does not request or persist card details, CVV, passport numbers, or sensitive identity documents.

## Project Structure

```text
src/
  app/                         Next.js app router pages
  components/landing/          Landing page visual components
  components/ui/               Reusable UI primitives
  features/trip-profile/
    components/                Questionnaire steps and controls
    constants/                 Options and step metadata
    schemas/                   Zod validation
    storage/                   Local draft persistence adapter
    types/                     Shared TypeScript types
  hooks/                       Shared React hooks
  lib/                         Utility functions
```

## Validation

Run these before opening a pull request:

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run check` runs lint, TypeScript, tests, and the production build in sequence.

GitHub Actions runs the same validation on pull requests and pushes to `main`.

## Available Scripts

- `npm run dev` - Start the local Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript without emitting files
- `npm run test` - Run Vitest unit tests
- `npm run check` - Run all local validation commands

# Simple Admin System (Figma + GitHub + AWS)

A lightweight admin management system built with React, wired to a serverless API, and deployed to AWS via GitHub Actions.

## Features

- Admin dashboard with overview cards
- User management table (add + toggle status)
- Order management table
- Serverless backend API (Lambda + API Gateway)
- Frontend hosting on S3 Website
- CI/CD deployment with GitHub Actions + AWS OIDC

## Project Structure

- `src/pages/AdminDashboard.tsx`: frontend admin page
- `backend/lambda/index.mjs`: backend API handler
- `infra/`: AWS CDK infrastructure project
- `.github/workflows/deploy-aws.yml`: CI/CD deployment workflow
- `docs/FIGMA_GITHUB_AWS.md`: design-to-deploy workflow notes

## Local Development

1. Install dependencies

```bash
npm i
```

2. Start frontend

```bash
npm run dev
```

By default frontend calls `/api`. For local mock or custom backend URL, set:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

You can copy from `.env.example`.

## AWS Deploy (Manual)

1. Install infra dependencies

```bash
cd infra
npm i
```

2. Bootstrap CDK (first time per account/region)

```bash
npx cdk bootstrap
```

3. Build frontend in project root and deploy stack

```bash
cd ..
npm run build
cd infra
npx cdk deploy --require-approval never
```

## GitHub Actions Deploy

Workflow file: `.github/workflows/deploy-aws.yml`

Set these in GitHub repository settings:

- Repository secret: `AWS_ROLE_ARN`
- Repository variable: `AWS_REGION`

When code is pushed to `main`, deployment runs automatically.

## Figma Integration

Use Figma MCP to pull design context for your admin frame, then update the UI in `src/pages/AdminDashboard.tsx`.
Detailed workflow: `docs/FIGMA_GITHUB_AWS.md`

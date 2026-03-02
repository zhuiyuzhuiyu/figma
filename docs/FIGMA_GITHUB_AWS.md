# Figma -> GitHub -> AWS Workflow

## 1) Figma Design to Code

1. Keep your Figma frame focused on the admin page components (summary cards, user table, order table).
2. In Codex, call Figma MCP on the target node and extract design context.
3. Implement or refine UI in `src/pages/AdminDashboard.tsx` based on the design context.
4. Commit each design iteration with clear messages (`feat(ui): align admin cards with Figma node ...`).

## 2) GitHub Integration

1. Ensure `GITHUB_PAT_TOKEN` is configured locally.
2. Push code to your repository's `main` branch.
3. Use PRs for larger visual or API changes and run local build before merge.

## 3) AWS Deployment

This project deploys with CDK using:

- S3 static website hosting (frontend)
- API Gateway HTTP API + Lambda (backend API)

GitHub Actions workflow file: `.github/workflows/deploy-aws.yml`

Required repository configuration:

- Secret: `AWS_ROLE_ARN` (OIDC role with deployment permissions)
- Variable: `AWS_REGION` (e.g. `us-east-2`)

After push to `main`, workflow will build frontend and deploy infrastructure automatically.

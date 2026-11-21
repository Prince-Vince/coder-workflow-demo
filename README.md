# Coder workflow demo

A small browser checklist used to verify a complete plan, implementation, test, review and release workflow.

## Run

Requires Node 24 or later. No npm packages are needed.

```sh
npm test
npm run build
npm start
```

Open http://localhost:8080. The app stores tasks in this browser only. It has no account system, backend, analytics or shared task database.

GitHub Actions checks tests and the static build on pull requests. The Pages workflow deploys the verified main branch and can also be triggered manually.

Acceptance criteria: [docs/acceptance.md](docs/acceptance.md).

Verification and review scope: [docs/verification.md](docs/verification.md).

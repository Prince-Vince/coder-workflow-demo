# Verification

This demo exercises a coordinator → coding worker → tests → independent review → pull request → CI → deployment workflow.

## Implementation and checks

Codex implemented the task operations and browser controls from written acceptance criteria. The original scaffold failed its acceptance tests because the exports were absent. The implementation passes the tests and static build. The coordinator also runs the same checks inside a non-root, read-only, network-disabled Docker container.

Chromium browser checks cover Enter submission, keyboard checkbox operation, progress, reload persistence, clearing completed rows, literal rendering of HTML-shaped labels, storage-failure warnings with in-memory operation, and desktop/390px layout. These are coordinator-run browser checks, not automated browser tests in CI. CI gates the Node tests and static build.

## Independent reviews

Claude reviewed repository files with read-only tools. Gemini reviewed an explicit source packet through the official Antigravity CLI after an initial tool-based review was denied. An empty CLI report was not counted as a completed review.

Review fixes include a task-ID fallback for HTTP previews, input error association and feedback, stronger muted-text/focus contrast, scoped text-field CSS, and Pages concurrency that lets an active deployment finish. Regression tests cover UUID fallback and validation boundaries.

## Scope and limitations

- Native coordinator and subscription CLI processes run on the host. Docker isolates test/build/preview jobs only.
- The Docker preview port is bound to loopback. The underlying Node server listens on all container interfaces so that port publishing works.
- The build expects a clean workspace in CI. A local `dist` directory can retain obsolete files after an asset is removed; deploy only the clean CI artifact.
- Automated browser coverage and a complete accessibility audit are outside this demo. Browser and visual checks are not user acceptance validation.
- No TestSprite service or paid model API keys are required by this example.

The pull request and Actions history contain the exact CI and deployment results.

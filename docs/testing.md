# Testing Notes

## Emulator-backed tests
Integration and system tests will run against **Firebase Emulators** (Auth + Firestore) to keep tests deterministic and CI-friendly.

The running application may use production Firebase configuration. Integration tests set their own emulator host and project values in Jest setup, so production credentials in the ignored repo-root `.env` are never used for test data.

Run integration tests and their emulators together from the repository root:
```bash
npm run emulators:exec:integration
```

## Test isolation strategy
- Each test suite will sign up/sign in using a unique email (e.g., `test+<runId>@example.com`) to get a unique `uid`.
- All task documents are stored under `users/{uid}/tasks/{taskId}`, so each test user is isolated by design.

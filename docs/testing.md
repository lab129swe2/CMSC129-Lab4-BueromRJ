# Testing Notes

## Emulator-backed tests
Integration and system tests will run against **Firebase Emulators** (Auth + Firestore) to keep tests deterministic and CI-friendly.

## Test isolation strategy
- Each test suite will sign up/sign in using a unique email (e.g., `test+<runId>@example.com`) to get a unique `uid`.
- All task documents are stored under `users/{uid}/tasks/{taskId}`, so each test user is isolated by design.


# 🧾 Project Specification: `monolith-frontend`

## 🚀 Overview

Create a **Turborepo monorepo** housing two frontend applications:

- `web`: A React app for browser access
- `mobile`: A React Native (Expo) app for mobile access

Both apps allow users to **log in to a family monolith backend** via a GraphQL API. Initially, they will contain only a **login screen** that displays a **success or failure message** upon credential submission.

---

## 📁 Monorepo Structure

```
monolith-frontend/
├── apps/
│   ├── web/             # React + Tailwind
│   └── mobile/          # React Native (Expo)
├── packages/
│   ├── auth/            # Shared React auth context and token storage logic
│   ├── graphql/         # Apollo Client config, GraphQL queries/mutations
│   └── ui/              # Placeholder for future shared UI components
├── .github/workflows/ci.yml  # CI: lint, typecheck, test on push/PR
├── .husky/              # Git hooks via Husky
├── package.json         # Workspace config, scripts
├── turbo.json           # Task pipeline config
└── tsconfig.base.json   # Shared TypeScript config
```

---

## 🔧 Tooling & Tech Stack

| Category          | Tooling                            |
|------------------|------------------------------------|
| Monorepo         | Turborepo + `pnpm`                 |
| Language         | TypeScript                         |
| Web Framework    | React + React Router               |
| Mobile Framework | Expo + expo-router                 |
| Styling (Web)    | Tailwind CSS                       |
| Styling (Mobile) | nativewind                         |
| State Management | React Context + `useReducer`       |
| GraphQL Client   | Apollo Client                      |
| Testing (Web)    | Jest + React Testing Library       |
| Testing (Mobile) | Jest + React Native Testing Library|
| CI/CD            | GitHub Actions                     |
| Linting          | ESLint                             |
| Formatting       | Prettier                           |
| Git Hooks        | Husky + lint-staged + commitlint   |

---

## 🔐 Authentication

### Backend Endpoint

- **Web**: `/graphql` (relative path)
- **Mobile**: `https://blobfishapp.duckdns.org/graphql` (absolute URL)

### Login Mutation

```graphql
mutation Login($username: String!, $password: String!) {
  login(input: { username: $username, password: $password }) {
    success
    token
    refreshToken
    errors
  }
}
```

### Token Handling

| Platform | Token Storage      | Notes                                   |
|----------|--------------------|-----------------------------------------|
| Web      | `localStorage`     | Persists across sessions                |
| Mobile   | `AsyncStorage`     | Persists across app restarts            |

### Post-login Behavior

- On success:
  - Store `token` and `refreshToken`
  - Display message: `"Login successful!"`
- On failure:
  - Display message: `"Invalid credentials. Please try again."`
- **No redirect** after login
- **Remember me** behavior is always on (no checkbox)

---

## 🧠 State Management

Located in `packages/auth/`:

- `AuthContext` using React Context API
- `useReducer` to manage:
  - Auth state (`token`, `refreshToken`)
  - Login and logout actions
- Provides:
  - `login(username, password)`
  - `logout()`
  - `authState`

---

## 🌐 Apollo Client

Located in `packages/graphql/`:

- Shared Apollo Client with:
  - Dynamic `Authorization: Bearer <token>` header from auth context
  - GraphQL endpoint switching (web vs. mobile)
  - Retry + error handling logic (for future token refresh)
- Exports:
  - `login`, `refreshToken`, `logout` mutations
  - Preconfigured `ApolloProvider`

---

## 🎨 UI Design

### Login Screen

- Centered form with:
  - Title (`"Login"`)
  - `username` input
  - `password` input with **visibility toggle**
  - Submit button
  - Message box (green/red for success/failure)
- No logo, no images, no navigation
- Styled with Tailwind (web) and nativewind (mobile)

---

## ❗ Error Handling Strategy

- Network/API errors and invalid responses:
  - Shown as: `"Something went wrong. Please try again."`
- Backend `errors` array:
  - Display first error message if available
- Form validation:
  - Username/password required before enabling submit

---

## ✅ Testing Plan

### Unit Tests
- All business logic (auth context, token handling, GraphQL helpers)

### Component Tests
- Login screen (happy path + failure)
- Message rendering

### Integration Tests
- Full login flow mocking GraphQL response

### Tools
- Web: Jest + React Testing Library
- Mobile: Jest + React Native Testing Library
- CI: GitHub Actions workflow (`.github/workflows/ci.yml`)

---

## 🧼 Git Hygiene

### Pre-configured Tools

| Tool         | Purpose                            |
|--------------|------------------------------------|
| Prettier     | Formatting                         |
| ESLint       | Linting rules for TS + React       |
| Husky        | Git hook runner                    |
| lint-staged  | Lint only staged files             |
| Commitlint   | Enforces Conventional Commit format|

### Git Hook Behavior

- On `pre-commit`:
  - Run Prettier + ESLint on staged files
- On `commit-msg`:
  - Enforce Conventional Commits (e.g. `feat:`, `fix:`)

---

## 🧪 Continuous Integration (CI)

### GitHub Actions (`ci.yml`)
Triggered on:
- `push`
- `pull_request`

Runs:
- `pnpm install`
- `eslint .`
- `tsc --noEmit`
- `jest` in each `apps/` folder

---

## 📦 Developer Tasks (First Steps)

Once scaffolded, developers should:

1. Run `pnpm install`
2. Run `pnpm dev --filter=web` or `--filter=mobile`
3. Create `.env` files if needed for environment switching
4. Add any backend user accounts to test login
5. Push code and open PRs with Conventional Commits
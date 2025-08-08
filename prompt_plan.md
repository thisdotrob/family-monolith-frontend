
# prompt_plan.md

> **Generated:** 2025-08-08  
> Source: _monolith-frontend-spec.md_  

This document collapses the project from **vision ➜ prompts** in four layers:

1. **Blueprint** – phased roadmap  
2. **Iterative Chunks** – vertical slices that ship value  
3. **Micro‑steps** – ultra‑granular tasks (example)  
4. **LLM Prompts** – copy‑paste, test‑first instructions  

---

## 1 · Blueprint — Phased Roadmap

| Phase | Goal | Key Artifacts |
|-------|------|---------------|
| **0. Bootstrap** | Skeleton monorepo, quality gates | `turbo.json`, `tsconfig.base.json`, CI, Husky, commitlint |
| **1. Shared Packages** | Auth & GraphQL libraries ready | `packages/auth`, `packages/graphql` |
| **2. Web MVP** | React + React Router login works | `apps/web` login flow w/ tests |
| **3. Mobile MVP** | Expo + expo-router login works | `apps/mobile` login flow w/ tests |
| **4. Token Lifecycle** | Secure persistence & header injection | Token storage (Web `localStorage`, Mobile `AsyncStorage`) |
| **5. Hardening & Docs** | E2E, edge‑cases, contributor guide | Playwright, Detox, `CONTRIBUTING.md` |

---

## 2 · Iterative Chunks (vertical slices)

Each chunk delivers a **user‑visible increment**, merged sequentially into `main`.

| Chunk | Increment | Definition of Done |
|-------|-----------|--------------------|
| **A – Repo Bootstrap** | Monorepo + CI green | `pnpm test` passes locally & on CI |
| **B – Auth Package Skeleton** | `AuthContext` + reducer | Reducer & hook unit‑tested |
| **C – GraphQL Client Package** | ApolloProvider w/ mocked endpoint | Header injection unit‑tested |
| **D – Web Login UI (static)** | Tailwind form renders, validation | Component tests green |
| **E – Web Login Integration** | Mutation + messages | MSW integration tests green |
| **F – Mobile Login UI (static)** | Expo screen renders, validation | Component tests green |
| **G – Mobile Login Integration** | Mutation + messages | Integration tests with mocks green |
| **H – Token Storage & Header** | Persistence & auto‑header | Storage + header unit tests |
| **I – End‑to‑End & Docs** | Playwright & Detox happy paths | CI runs e2e suites |

---

## 3 · Micro‑steps Example (Chunk B – Auth Package)

| Step | Task | Safety Net |
|------|------|-----------|
| **B1** | Scaffold `packages/auth` with `AuthContext.tsx` | Jest render‑without‑crash test |
| **B2** | Implement `authReducer` with `LOGIN_SUCCESS`, `LOGOUT` | Reducer transition tests |
| **B3** | Add `useAuth()` hook | Hook shape test |
| **B4** | Export `<AuthProvider>` | RTL provider wrapper test |

*Repeat similar micro‑steps for every chunk.*

---

## 4 · LLM Prompts (Test‑First)

> **Usage:** Feed each prompt to your code‑gen LLM **in order**.  
> Each prompt includes **Context → Task → Tests → Next Steps**.  
> Tests are written **first** (TDD) and must pass before moving on.  
> No orphaned code – each step integrates with the previous one.

---

### Prompt 0 – Create Turborepo Workspace

**Context**  
Empty Git repo for *monolith‑frontend*.

**Task**  
- Initialise Git & first commit  
- `pnpm init` with workspaces `["apps/*","packages/*"]` (private)  
- Add `turbo.json` with pipelines `build`, `dev`, `lint`, `test`  
- Add root `tsconfig.base.json` extending React & React Native configs  
- Create placeholder `README.md` showing monorepo layout

**Tests (write first)**  
```ts
import fs from 'fs';
test('turbo config exists', () => {
  expect(fs.existsSync('turbo.json')).toBe(true);
});
```

**Next Steps**  
Add ESLint, Prettier, Husky, commitlint, and CI workflow.

---

### Prompt 1 – Quality Gates

**Context**  
Repo from Prompt 0 exists.

**Task**  
- Configure ESLint (`@typescript-eslint`, React, React Native, Tailwind)  
- Configure Prettier  
- Setup Husky `pre-commit` (`pnpm lint && pnpm test`) and commitlint `commit-msg`  
- Add `.github/workflows/ci.yml` running `pnpm install`, `pnpm lint`, `pnpm test` on push/PR

**Tests**  
- Add file `bad.ts` violating lint; Jest test programmatically runs ESLint expecting exactly **1** error

**Next Steps**  
Scaffold shared authentication package.

---

### Prompt 2 – Auth Package Skeleton

**Context**  
Quality gates pass.

**Task**  
- Generate `packages/auth` with `AuthContext.tsx`, `authReducer.ts`, `useAuth.ts`  
- Reducer handles `LOGIN_SUCCESS`, `LOGOUT`  
- `<AuthProvider>` exposes `login`, `logout` (dispatch only)

**Tests**  
- Reducer unit tests  
- Hook returns initial `{token:null}`

**Next Steps**  
Create GraphQL client package.

---

### Prompt 3 – GraphQL Client Package

**Context**  
`packages/auth` exists.

**Task**  
- Generate `packages/graphql` exporting `createApolloClient()` reading token via `useAuth()`  
- Provide mocked login mutation via Apollo Link Schema  
- Export `<GraphQLProvider>` wrapper

**Tests**  
- Header injection test: when `authState.token = "abc"`, request has `Authorization: Bearer abc`  
- Mutation test returns `{success:true}`

**Next Steps**  
Scaffold web app skeleton.

---

### Prompt 4 – Web App Skeleton

**Context**  
Shared packages compile.

**Task**  
- `apps/web` via Vite + React + Tailwind + React Router (`/login`)  
- Alias paths to shared packages  
- Render `/` route “Hello web”

**Tests**  
- Smoke test: render `<App/>` and expect “Hello web”

**Next Steps**  
Add static login UI.

---

### Prompt 5 – Web Login UI (static)

**Context**  
Web skeleton runs.

**Task**  
- Build `Login.tsx` Tailwind form (username, password with toggle)  
- Disable submit until fields non‑empty, real‑time validation

**Tests**  
- Component test: validation error on empty submit

**Next Steps**  
Wire login mutation.

---

### Prompt 6 – Web Login Integration

**Context**  
Static UI exists.

**Task**  
- Wrap app with `<GraphQLProvider>` & `<AuthProvider>`  
- On submit call `login` mutation; display green `"Login successful!"` or red `"Invalid credentials. Please try again."`  
- Store `token` & `refreshToken` on success (Web `localStorage`)

**Tests**  
- Integration test with MSW mocking success & failure

**Next Steps**  
Persist token on mobile.

---

### Prompt 7 – Mobile App Skeleton

**Context**  
Shared packages stable.

**Task**  
- `apps/mobile` via Expo + TypeScript + `expo-router`  
- Metro alias to shared packages  
- Render “Hello mobile”

**Tests**  
- Smoke test: render `<RootLayout/>` and expect text

**Next Steps**  
Add static login UI.

---

### Prompt 8 – Mobile Login UI (static)

**Context**  
Expo app runs.

**Task**  
- Create `Login.tsx` screen styled with `nativewind`  
- Same validation rules as web

**Tests**  
- Component test: submit disabled when inputs empty

**Next Steps**  
Wire mobile login flow.

---

### Prompt 9 – Mobile Login Integration

**Context**  
Static screen ready.

**Task**  
- Use GraphQL login mutation; store tokens in `AsyncStorage`  
- Messages identical to web

**Tests**  
- Integration test mocking Apollo & AsyncStorage

**Next Steps**  
Token lifecycle hardening.

---

### Prompt 10 – Token Lifecycle

**Context**  
Login persists tokens.

**Task**  
- Enhance `packages/auth` to rehydrate token on load (Web/localStorage; Mobile/AsyncStorage)  
- Ensure every Apollo request auto‑attaches header  

**Tests**  
- Unit test mocking storage round‑trip  
- Header injection test

**Next Steps**  
End‑to‑end tests & docs.

---

### Prompt 11 – End‑to‑End & Documentation

**Context**  
Both apps log in.

**Task**  
- Add Playwright happy‑path test for web  
- Add Detox happy‑path test (or placeholder) for mobile  
- Write `CONTRIBUTING.md` with setup, branching, commits, CI

**Tests**  
- CI runs e2e suites and passes

**Next Steps**  
Celebrate 🚀

---

### How to Use

1. Start with **Prompt 0**; ensure tests pass.  
2. Proceed sequentially; each prompt integrates fully with previous work.  
3. By **Prompt 11** the project is production‑ready, fully tested, and documented.

_No orphaned code. Incremental. Test‑driven. Safe._  

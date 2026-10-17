# Frontend Structure and API Guide

This guide explains how the Recipe Book frontend is organized and how it communicates with `appsdev-api-tutorial`. It assumes you already know how to create and run a React project. There are no installation steps here.

## 1. Understand the folders

```text
src/
├── assets/                 # Images and other files imported by the UI
├── components/
│   ├── common/             # Shared application UI
│   ├── context/            # Shared global state through context api - meaning the state will live anywhere not just in 1 file.
│   ├── features/
│   │   ├── admin/          # All-recipes request, refresh controls, and table
│   │   ├── auth/           # Login/signup forms and auth headings
│   │   └── recipe/         # Recipe collection, details, cards, and forms
│   └── ui/                 # Small building blocks: Button, Input, Modal, etc.
├── lib/                    # Shared helpers and configured Axios client
├── pages/
│   ├── admin/              # Admin page composition
│   ├── auth/               # Auth layout, login page, and signup page
│   └── user/               # Personal collection and recipe detail pages
├── services/               # API endpoints, payloads, and response handling
├── styles/                 # Global styles and Tailwind entry point
├── types/                  # Shared TypeScript declarations
└── main.tsx                # App entry point, providers, and routes
```

### Pages: arrange the screen

A page represents a route. It arranges headings, navigation links, account actions, and feature components. Avoid putting the entire screen into one large component, but keep enough composition in the page to see its structure.

For example, [the login page](../src/pages/auth/login/index.tsx) uses `Card`, `AuthFormHeader`, `LoginForm`, and a link to signup. [The user home page](../src/pages/user/home/index.tsx) uses `PageHeader` and `RecipeCollection`.

### Features: handle a specific task

A feature component understands a particular part of the application:

- `LoginForm` owns its input values, submission, errors, and navigation after login.
- `RecipeCollection` fetches personal recipes and handles the add dialog and deletion.
- `RecipeDetails` fetches one recipe and handles its update dialog.
- `AdminRecipes` fetches everyone's recipes and provides Refresh.
- `AdminRecipesTable` displays the rows it receives through props.

Use meaningful names and ordinary named functions such as `async function handleSubmit()` so classmates can follow the flow.

### Common: share application UI

Put UI here when it is useful across different features. [PageHeader](../src/components/common/page-header.tsx) accepts a title, an optional description, and optional action elements. It also draws the app name and the towel stripe above the title. `RecipeMeta` displays the recipe facts used by both cards and details.

Auth-only headings stay in `components/features/auth`, because their purpose is specific to authentication.

### UI: reuse the building blocks

Before creating a button, input, select, modal, or table, check `components/ui`. Use the existing primitive if it fits. Add a new one there when the application needs a reusable control that does not exist yet.

UI primitives use named exports:

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
```

The `@/` alias points to `src/`. Primitives receive props and render UI; they should not know recipe endpoints or perform login requests.

## 2. Follow the request flow

```text
Page -> Feature component -> Service function -> Shared Axios client -> API
                          <- Returned data or error                 <-
```

The feature decides when to request data and how to display it. The service knows the endpoint, method, request body, and response shape. The Axios client handles connection settings, cookies, CSRF headers, and automatic refresh.

For signing in, the form asks the app's shared sign-in manager to do the work. That manager uses the auth service to contact the API. Section 5 explains this shared manager, called Context, step by step.

## 3. Connect the frontend to your API

The frontend `.env` file belongs in `react-recipe-book/`, beside `vite.config.ts`:

```env
VITE_API_BASE_URL=http://localhost:7000/api
```

[lib/axios.ts](../src/lib/axios.ts) reads this value using `import.meta.env.VITE_API_BASE_URL`. There is no hardcoded fallback: a missing value produces a clear error. Restart Vite after changing `.env`.

A service request to `/recipes/v1/get-recipes` therefore calls:

```text
http://localhost:7000/api/recipes/v1/get-recipes
```

The API must be reachable, with its database configured and migrated. Its `FRONTEND_URL` must match the actual browser origin, usually `http://localhost:5173`, because the API allows credentialed requests from that origin. Use the same hostname consistently; `localhost` and `127.0.0.1` are different hosts.

Variables beginning with `VITE_` are available to browser code. Only put public configuration such as the API URL there. Database credentials, JWT secrets, and the CSRF secret belong in the backend environment.

## 4. Keep endpoint code in services

Read [recipe-service.ts](../src/services/recipe-service.ts) and [auth-service.ts](../src/services/auth-service.ts). Service function names end in `Service`.

```ts
import { http } from "@/lib/axios";

export async function getRecipesService() {
  const response = await http.get("/recipes/v1/get-recipes");
  return response.data.data.recipes;
}
```

The two `.data` properties mean different things. Axios puts the HTTP response body in `response.data`. The API body itself contains a `data` property:

```json
{
  "code": 200,
  "status": "success",
  "data": {
    "recipes": []
  }
}
```

The service unwraps that body so components receive the recipes directly. Axios rejects unsuccessful HTTP statuses; callers handle those errors with `try/catch`.

TypeScript types describe the expected data. A cast such as `as Recipe[]` does not validate the actual server response at runtime.

### Recipe endpoints used by this project

Paths below are relative to the configured base URL, which already includes `/api`.

| Service | Method | Endpoint | Access |
| --- | --- | --- | --- |
| `getRecipesService` | GET | `/recipes/v1/get-recipes` | USER: own recipes |
| `getRecipeService` | GET | `/recipes/v1/get-recipe/:id` | USER: own recipe |
| `createRecipeService` | POST | `/recipes/v1/create-recipe` | USER |
| `updateRecipeService` | POST | `/recipes/v1/update-recipe/:id` | USER: own recipe |
| `deleteRecipeService` | POST | `/recipes/v1/delete-recipe/:id` | USER: own recipe |
| `getAllRecipesService` | GET | `/recipes/v1/get-all-recipes` | ADMIN |

The update and delete endpoints use POST in this API. Follow the backend contract instead of assuming every update uses PUT or every deletion uses DELETE. IDs are UUID strings.

### Manage request state in the feature

This pattern is adapted from `AdminRecipes`. Declare it inside the component:

```tsx
useEffect(function fetchRecipes() {
  let active = true;

  async function loadRecipes() {
    try {
      const recipes = await getAllRecipesService();
      if (active) {
        setRecipes(recipes);
      }
    } catch {
      if (active) {
        setError("Unable to load recipes. Please try again.");
      }
    }
  }

  loadRecipes();

  function cleanup() {
    active = false;
  }

  return cleanup;
}, []);
```

State declarations and imports are omitted here; see [AdminRecipes](../src/components/features/admin/admin-recipes.tsx) for the full component. The effect itself stays synchronous and calls a named async function. Cleanup ignores late responses after the feature is removed; it does not cancel the network request.

After a successful create, update, or delete, update React state or refetch the list. A successful API response alone does not change what React displays. In this project, forms call `onSuccess` so their parent feature can update its data and close the modal.

## 5. Understand authentication

### What is Context? Think of a classroom noticeboard

Imagine a classroom with one noticeboard showing who is currently signed in. Instead of each student keeping a separate copy, everyone checks the same board. When the information changes, everyone sees the update.

React Context gives different parts of an app access to shared information. In our Recipe Book, that information answers these questions:

- Has someone signed in?
- What is their name?
- Are they a regular user or an admin?
- Has the app finished checking their previous sign-in?

The header needs the name, the login page needs to know when sign-in succeeds, and the page access check needs the account's role. Context lets them use the same information. We call information that can change while the app is open **state**.

Context is stored in the running app's memory. Refreshing the browser clears that memory, so the app asks the API who is signed in again. Context is not the database and does not store the user's password or read the HttpOnly token cookies.

### The three names you will see in the code

| Name | Plain-language meaning | Where to find it |
| --- | --- | --- |
| `AuthContext` | The shared place for the current sign-in information | `components/context/auth-state.ts` |
| `AuthProvider` | The component that looks after that information and makes it available to the app inside it | Used around the app in `main.tsx` |
| `useAuth()` | The function a component calls to read that information or request sign-in/sign-out | `components/context/use-auth.ts` |

A **component** is a piece of the screen, such as a form or heading. A component can contain other components. In `main.tsx`, the app's pages are placed inside `AuthProvider`, so they can all use `useAuth()`.

```tsx
<AuthProvider>
  {/* The app's router and pages are placed here. */}
</AuthProvider>
```

This is a shortened illustration. See [main.tsx](../src/main.tsx) for the actual structure.

### Reading the shared information

```tsx
const { user, ready } = useAuth();
```

Read this as: “Ask the shared sign-in manager for the current user and whether it has finished checking.” The braces pick out the two values we need.

- `user` is an object containing account details, such as a name and role. If nobody is signed in, it is `null`, which means “no value.”
- `ready` is either `true` or `false`. `false` means the initial check is still happening. It does not mean sign-in failed. Once the check finishes, `ready` becomes `true`, even if nobody is signed in.

For example, `user.name` reads the name from the user object. Code must first check that a user exists before reading its details.

### Asking the manager to sign someone in

```tsx
const { login } = useAuth();

async function handleSubmit() {
  const signedInUser = await login(email, password);
  // signedInUser now contains the account details returned by the API.
}
```

This illustrates the main step; the actual [LoginForm](../src/components/features/auth/login-form.tsx) also handles form submission and errors. `await` means “wait for this operation to finish before continuing.” `async` allows a function to use `await`.

The form does not update every page separately. The manager stores the returned user once, and React updates the components that read that shared information.

### What the manager provides

[AuthProvider](../src/components/context/auth-context.tsx) shares these values and actions through `useAuth()`:

| Value | Meaning |
| --- | --- |
| `user` | The signed-in account, or `null` |
| `ready` | Whether the initial session check has finished |
| `login` / `signup` | Call the service, store the returned user, and return it to the form |
| `logout` | Ask the API to revoke/clear authentication, then clear the local user |

### Login and signup

1. The form keeps input values in state and prevents normal browser form submission.
2. The auth service gets a CSRF token, then posts the credentials.
3. Successful login sets access-token and refresh-token HttpOnly cookies in the browser.
4. The service fetches a CSRF token for the new cookie session, then requests `/auth/v1/session` for account details.
5. The shared sign-in manager (Context) stores the user. The form navigates to `/user` or `/admin` according to the role.

Signup creates an account and then calls the login service. Public signup creates USER accounts; the frontend does not offer a role selector.

### Cookies, CSRF, and rotation

The shared Axios client sets `withCredentials: true` so browser requests include cookies. Frontend JavaScript does not read the HttpOnly tokens or save them in local storage.

The CSRF token is a separate value kept in memory. The request interceptor attaches it as `x-csrf-token` for POST, PUT, PATCH, and DELETE. Successful authentication operations clear the cached token, since login, rotation, or logout can change its cookie binding.

On startup, `restoreSessionService` attempts to refresh the cookie session and fetch the current user. For a normal protected request that returns 401, the response interceptor attempts refresh, obtains a fresh CSRF token, and retries the original request once. Concurrent failed requests share one refresh operation because the API consumes the old refresh token during rotation.

Authentication endpoints are excluded from automatic retries to avoid refresh loops. If automatic refresh fails, the client emits `auth:expired`; the context clears the user. The API remains responsible for validating every request.

## 6. Understand routes and roles

Routes are declared in [main.tsx](../src/main.tsx).

| URL | Page / behavior |
| --- | --- |
| `/auth/login` | Login page |
| `/auth/signup` | Signup page |
| `/auth` | Redirects to login |
| `/user` | USER recipe collection |
| `/recipe/:id` | USER recipe details |
| `/admin` | ADMIN all-recipes table |
| `/` and unknown paths | Redirect based on the current session |

`pages/auth/layout.tsx` supplies shared branding and background through `AuthHeader`, and renders child pages through `Outlet`. Signed-in visitors are redirected to their role's home page.

[ProtectedRoute](../src/components/context/protected-route.tsx) waits for the initial session check, sends signed-out visitors to login, and checks the required role before rendering its child route. These checks control navigation only. The backend authentication, role middleware, and ownership filters secure the data.

## 7. Add a feature using the same approach

1. Check the backend route, HTTP method, request schema, response envelope, and required role.
2. Add a named function ending in `Service` under `src/services`. Reuse `http` from `lib/axios.ts`.
3. Add the feature component under `components/features/<feature>`. Keep its state, request handling, and feature-specific UI together.
4. Reuse primitives from `components/ui`. Put application UI shared across features in `components/common`.
5. Compose the feature inside a page. Register the URL in `main.tsx`, inside the appropriate route guard.
6. Check success, empty results, API errors, signed-out access, and the wrong role. For mutations, confirm the visible data updates afterward.

## 8. Trace problems with browser tools

Use the browser Network panel to inspect the request URL, method, payload, response status, and returned JSON. Use the Console for JavaScript errors.

| Symptom | What to check |
| --- | --- |
| Missing API URL error | Frontend `.env` has `VITE_API_BASE_URL`; restart Vite |
| Network error / connection refused | API is running and the URL/port is correct |
| CORS error | API `FRONTEND_URL` exactly matches the browser origin |
| 401 after refresh | Session is missing, expired, consumed, or revoked; sign in again |
| 403 | Check the API response: role denial and invalid CSRF are different causes |
| 404 for a recipe | Check its UUID and ownership |
| Changes saved but UI unchanged | Check the success callback and React state update |

Do not put Axios requests directly into UI primitives or duplicate base URLs and auth headers in each component. Keep request behavior in the shared client and endpoint operations in services.

# MyShop

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

Note: if port `4200` is in use the CLI will ask to use a different port (for example `4201`). You can also run `ng serve --port 4201` to force a specific port.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Project-specific routes & useful notes

The app exposes the following app routes under the `/app` prefix (these are protected by the app's simple auth guard where noted):

- `/app` — Landing page (public). The landing page `Shop Products` button will redirect to `/app/login` when the user is not authenticated and to `/app/shop/products` when they are.
- `/app/login` — Login page (public).
- `/app/shop/products` — Products listing (requires login).
- `/app/shop/products/:id` — Product details page (requires login).
- `/app/shop/cart` — Cart page (requires login).
- `/app/shop/checkout` — Checkout flow (requires login).
- `/app/shop/wishlist` — Wishlist page (requires login).

Routing notes

- The app uses an `AuthGuard` to protect shop routes. Attempting to visit a protected route while unauthenticated will redirect to `/app/login`.
- The landing page `Shop Products` button intentionally checks auth state and navigates to `/app/login` if necessary.

State & persistence

- Cart and wishlist state are persisted to `localStorage` under the keys `cart_state` and `wishlist_state` respectively. Cart updates and validations use mocked APIs (MSW) during development.

Storybook

- This project includes lightweight Storybook components in `src/stories/` for quick visual testing. New stories added include `Cart/Cart Item`, `Cart/Summary`, `Products/Product Details`, and `Wishlist/Page`.

Dev server (non-interactive)

- To avoid the interactive `port in use` prompt when starting the dev server in scripts or CI, pass a port argument:

```bash
npm run start -- --port 4201
```

If you prefer Storybook to preview components independently, run Storybook in the project if configured (check `package.json` scripts).

If you want me to add a short troubleshooting section (common build/runtime errors and fixes), tell me which errors you've seen and I'll add targeted guidance.

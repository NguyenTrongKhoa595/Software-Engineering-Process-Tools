# RentMate Frontend Architecture

This document outlines the folder structure and architectural conventions for the RentMate frontend application. The goal of this structure is to be clean, scalable, and easy for developers to navigate.

## Root Directory

The root directory contains configuration files and the `pages` and `public` directories, as required by Next.js.

- **`/pages`**: Contains all page components, which are mapped to routes. The file system is the router.
- **`/public`**: For static assets like images and fonts.
- **`/src`**: The heart of our application. All reusable code, logic, and assets live here.
- **`jsconfig.json`**: Configures path aliases (e.g., `@/components`) for clean, absolute-like imports.

## The `src` Directory

All application code resides within the `src` directory, organized by function.

- **`src/components/`**: Contains all reusable React components.
  - **`src/components/ui/`**: For small, generic UI primitives like `Card`, `Button`, `PageContainer`, etc. These are the building blocks of our design system.
  - **`src/components/common/`**: For more complex, application-wide components like the `Navbar` and `Footer`.
  - Other components are organized by feature (e.g., `src/components/property/`).

- **`src/constants/`**: For static data and configuration that is shared across the application. Example: `nav.js` which defines the navigation links for different user roles.

- **`src/hooks/`**: For custom React hooks. This is the place for reusable stateful logic. Example: `useAuth.js`.

- **`src/store/`**: Contains all global state management logic, implemented with Zustand. Example: `authStore.js`.

- **`src/styles/`**: For all styling-related code. Example: `theme.js`, which defines the custom Chakra UI theme (colors, fonts, component styles).

- **`src/utils/`**: For utility functions and helpers that don't fit anywhere else. Example: `apiClient.js` for making API calls.

## Key Principles

1.  **Absolute Imports**: Always use the `@/` path aliases defined in `jsconfig.json` for imports from the `src` directory. Avoid long relative paths (`../../`).
2.  **Component Granularity**: Keep components small and focused. Use the `ui` folder for highly reusable, generic components.
3.  **Separation of Concerns**: Logic (hooks), state (store), UI (components), and static data (constants) are kept in their respective folders.


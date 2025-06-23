# Agent Instructions for Art Design Pro Vue Project

This document provides instructions for AI agents working on this Vue 3 + Vite + Element Plus project, which emulates features from "Art Design Pro".

## Project Overview

- **Framework**: Vue 3
- **Build Tool**: Vite
- **UI Library**: Element Plus
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Internationalization**: vue-i18n
- **Styling**: SCSS, with CSS variables for theming (light/dark modes)

## Development Setup

1.  **Install Dependencies**:
    If you haven't already, or if `package.json` has changed, run:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    To start the Vite development server (defaults to port 53000 as configured):
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:53000` (or the host IP if accessing from network).

3.  **Build for Production**:
    To create a production build in the `dist/` directory:
    ```bash
    npm run build
    ```

4.  **Preview Production Build**:
    To preview the production build locally (after running `npm run build`):
    ```bash
    npm run preview
    ```

## Key Project Structure

- `src/main.js`: Main entry point, initializes Vue, plugins, global styles, directives.
- `src/App.vue`: Root Vue component.
- `src/router/index.js`: Vue Router configuration.
- `src/store/`: Pinia store modules (`app.js`, `user.js`).
- `src/layout/index.vue`: Main application layout (sidebar, navbar, content).
- `src/views/`: Page components.
- `src/components/`: Reusable UI components (e.g., `HttpBinForm.vue`).
- `src/styles/`: Global SCSS files (`index.scss`, `theme.scss`).
- `src/lang/`: vue-i18n language files.
- `src/plugins/`: Custom plugins (e.g., `axios.js`, `i18n.js`).
- `src/utils/`: Utility functions.
- `vite.config.js`: Vite configuration file.
- `index.html`: Main HTML entry point.

## Coding Conventions & Guidelines

- **ESM**: Use ES Modules syntax (`import`/`export`).
- **Composition API**: Prefer Vue 3 Composition API for components.
- **Element Plus**: Utilize Element Plus components for UI elements. Auto-import is configured.
- **Pinia**: Use Pinia for state management. Follow Pinia best practices for defining stores, actions, and getters.
- **Theming**:
    - Theme switching (light/dark) is managed by `appStore` and CSS variables defined in `src/styles/theme.scss`.
    - Ensure new components respect these theme variables for consistent look and feel.
- **Internationalization (i18n)**:
    - Text displayed to users should generally be managed via `vue-i18n`.
    - Add new translations to `src/lang/en.js` and `src/lang/zh.js`.
    - Use `$t('key')` in templates or `t('key')` in Composition API scripts.
- **Comments**: Add comments to explain complex logic or non-obvious code sections.
- **Commits**: Follow conventional commit message standards if possible (e.g., `feat: ...`, `fix: ...`, `chore: ...`). (Though for this environment, a descriptive message is sufficient).

## Working with Features

- **Demo Page (`src/views/DemoPage.vue`)**: This page serves as a showcase for many of the application's features. When adding or modifying global features, consider how they are demonstrated here.
- **HttpBin Integration**: The `HttpBinForm.vue` component demonstrates external API calls using Axios. Network error handling is managed globally by Axios interceptors.

## Important Notes for Agents

- **Environment Variables**: If new environment variables are needed (e.g., for API keys or different base URLs), they should be managed via Vite's `.env` file system (`.env`, `.env.development`, `.env.production`). Remember to document them. (Currently, no specific `.env` files are used beyond Vite defaults).
- **Art Design Pro Specifics**: While this project is based on "Art Design Pro", it's a fresh build. Exact replication of all visual details or internal logic of the original template might not be feasible or required unless specified. Focus on implementing the *features* with production-grade choices.

This document should help you navigate and contribute to the project effectively. If you have questions about specific implementations, refer to the relevant files or ask for clarification.

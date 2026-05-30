# Rick and Morty Character Search

A React + TypeScript application for searching, browsing, selecting, and managing Rick and Morty characters using the public Rick and Morty API.

The project was developed as part of the Rolling Scopes School React course. It started as a class-components application and was gradually extended with routing, hooks, state management, API querying, caching, and tests.

## Deployment

[Open App](https://aleks-panda-rm-search.netlify.app/)

## API

The application uses the public [Rick and Morty API](https://rickandmortyapi.com/).

## Features

### Search and Results

- Search characters by name
- Trim search input before sending a request
- Prevent duplicate requests for the same search term
- Save and restore the latest search term with `localStorage`
- Display character cards with name, status, species, location, and image
- Show loading and error states for API requests
- Responsive layout for desktop and mobile screens

### Routing and Navigation

- URL-based pagination with the `page` search parameter
- Search results page synchronized with the current URL
- Master-detail view for selected characters
- Character details panel reflected in the URL with the `details` search parameter
- About page with project and author information
- 404 page for unknown routes

### State Management

- Zustand store for selected characters
- Character selection with checkboxes
- Selection persists across page navigation during the current session
- Selected items flyout with sticky positioning
- "Unselect all" action
- CSV download for selected characters using native browser APIs

### Theme Management

- Light and dark theme support
- Theme state managed with React Context API
- Theme switcher available in the app header

### API Querying and Caching

- TanStack Query is used for API data fetching
- Character list data is cached by search term and page
- Character details are cached by character ID
- Cache TTL is configurable via the `VITE_CACHE_TTL` environment variable
- Manual cache invalidation with refresh controls
- React Query Devtools can be used during development

### Error Handling

- API errors are shown as clear, human-readable messages
- Application-level errors are handled with an Error Boundary
- Test button for triggering the Error Boundary fallback UI

### Testing

- Unit and integration tests with Vitest and React Testing Library
- Tests cover rendering, search behavior, routing, state management, theme behavior, and query-related states
- Coverage command is available via npm scripts

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- Context API
- Sass
- Vitest
- React Testing Library
- ESLint
- Prettier
- Husky
- Netlify

## Environment Variables

Create a `.env` file based on `.env.example` if you want to customize query cache freshness time.

```env
VITE_CACHE_TTL=300000
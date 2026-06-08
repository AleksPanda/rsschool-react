
# React Forms

A React application demonstrating different approaches to form handling: an uncontrolled form and a React Hook Form implementation.

The project was created as part of the Rolling Scopes School React course.

## Task

Detailed task description:
[React Forms task](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/forms.md)

## Features

* Modal window implemented with React Portals
* Focus management, closing by `Esc` and outside click
* Two form implementations:

  * Uncontrolled Form
  * React Hook Form
* Basic form fields:

  * name
  * age
  * email
  * gender
  * terms and conditions
* Advanced form fields:

  * image upload with type and size validation
  * image conversion to base64
  * password and confirm password fields
  * password strength indicator
  * country autocomplete
* Schema-based form validation
* Submitted form data is stored in Zustand
* Submitted data is displayed on the main page
* Newly submitted data is visually highlighted

## Tech Stack

* React
* TypeScript
* Vite
* Zustand
* React Hook Form
* SCSS
* Vitest
* React Testing Library

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Run test coverage:

```bash
npm run test:coverage
```

## Notes

The application focuses on comparing form handling approaches in React and implementing accessible modal behavior, validation, state management, and form submission feedback.

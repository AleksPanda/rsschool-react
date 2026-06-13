# React Performance Optimization

This project is a React performance optimization task based on the RS School React course assignment.

## Task

The goal of the task is to profile an intentionally unoptimized React application, identify rendering bottlenecks, apply React performance optimization techniques, and compare the results before and after optimization.

Detailed task description: [React: Performance](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/performance/performance.md)

## Implemented Workflow

### Phase 1: Initial Profiling

The application was profiled with React DevTools Profiler before applying optimizations.

The following interactions were measured:

- Sorting countries
- Searching for a country
- Selecting a different year
- Toggling columns

Baseline measurements and screenshots are documented in `PERFORMANCE.md`.

### Phase 2: Performance Optimizations

The following React performance optimizations were applied:

- `useMemo` for computed values
- `useCallback` for event handlers
- `React.memo` to prevent unnecessary component re-renders
- Stable `key` props for lists and tables
- Virtualization for the large country list

### Phase 3: Final Profiling

After applying optimizations, the same interactions were profiled again.

The final results, screenshots, and before/after comparison are documented in `PERFORMANCE.md`.

## Performance Report

Detailed profiling results are available in:

```txt
PERFORMANCE.md
```

## Technologies

* React
* TypeScript
* Vite
* React DevTools Profiler
* CSS Modules
* react-window

## Getting Started

Install dependencies:

```bash
npm install
```

Run the project:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

## Results Summary

The average render duration decreased from 357.9 ms to 58.5 ms, which is an 83.7% improvement.

Detailed measurements and screenshots are available in `PERFORMANCE.md`.

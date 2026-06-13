# Performance Optimization Report

## Baseline Measurements
- **Commit duration**: N/A — React DevTools Profiler does not show a separate commit phase duration. `Committed at` is a timestamp from the start of recording, not a duration. See the RSS Mentor clarification in [Discord](https://discord.com/channels/794806036506607647/1333748258098380820/1515111545905090610).

### Interaction A: Sort countries

- **Render duration**: 409.6 ms
- **Layout effects duration**: < 0.1 ms
- **Passive effects duration**: < 0.1 ms
- **Screenshot**: ![screenshot](screenshots/baseline/sort-countries-baseline.png)

### Interaction B: Search countries

- **Render duration**: 192.4 ms
- **Layout effects duration**: < 0.1 ms
- **Passive effects duration**: < 0.1 ms
- **Screenshot**: ![screenshot](screenshots/baseline/search-countries-baseline.png)

### Interaction C: Change year

- **Render duration**: 419.9 ms
- **Layout effects duration**: < 0.1 ms
- **Passive effects duration**: < 0.1 ms
- **Screenshot**: ![screenshot](screenshots/baseline/change-year-baseline.png)

### Interaction D: Toggle column

- **Render duration**: 409.6 ms
- **Layout effects duration**: < 0.1 ms
- **Passive effects duration**: < 0.1 ms
- **Screenshot**: ![screenshot](screenshots/baseline/toggle-column-baseline.png)

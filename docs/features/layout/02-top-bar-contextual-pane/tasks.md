# Top Bar & Contextual Pane

**Epic**: [#13](https://github.com/sameera/ripples/issues/13)

## Tasks

### Phase 1: Infrastructure + Core UI

- [#14](https://github.com/sameera/ripples/issues/14) - TASK-13.01: Implement TopBar with SearchPlaceholder and ScopeIndicator
- [#15](https://github.com/sameera/ripples/issues/15) - TASK-13.02: Implement UserMenu with ThemeToggle

### Phase 2: Core Logic

- [#16](https://github.com/sameera/ripples/issues/16) - TASK-13.03: Implement ContextualPane with PaneToggleButton

### Phase 3: Integration

- [#17](https://github.com/sameera/ripples/issues/17) - TASK-13.04: Refactor AppShell to 2-Row × 3-Column Grid and Integrate All Components

### Phase 4: Polish

- [#18](https://github.com/sameera/ripples/issues/18) - TASK-13.05: Add E2E Tests and Accessibility Audit

## Task Dependency Graph

```mermaid
graph TB
    T1["#14 TASK-13.01: TopBar + Infrastructure<br/>S: 4-8h"]
    T2["#15 TASK-13.02: UserMenu + ThemeToggle<br/>S: 4-8h"]
    T3["#16 TASK-13.03: ContextualPane<br/>+ PaneToggleButton<br/>M: 1-2d"]
    T4["#17 TASK-13.04: AppShell Grid Refactor<br/>+ Integration<br/>M: 1-2d"]
    T5["#18 TASK-13.05: E2E Tests<br/>+ Accessibility Audit<br/>M: 1-2d"]

    T1 --> T2
    T1 --> T3
    T2 --> T3
    T3 --> T4
    T4 --> T5

    style T1 fill:#e1f5ff
    style T2 fill:#fff4e1
    style T3 fill:#ffe1f5
    style T4 fill:#e1ffe1
    style T5 fill:#f5e1ff
```

## Parallelization Opportunities

- **TASK-13.01** and **TASK-13.02** can be developed in parallel after the infrastructure setup portion of TASK-13.01 is complete (shadcn/ui installation and state atoms). However, since TASK-13.01 now includes the infrastructure setup, TASK-13.02 depends on it.
- **TASK-13.03** through **TASK-13.05** must be sequential.

## Effort Estimate

| Task | Effort | Estimate |
|------|--------|----------|
| TASK-13.01 | S | 4-8 hours |
| TASK-13.02 | S | 4-8 hours |
| TASK-13.03 | M | 1-2 days |
| TASK-13.04 | M | 1-2 days |
| TASK-13.05 | M | 1-2 days |
| **Total** | | **~1.5-2 days** (with parallelization) |

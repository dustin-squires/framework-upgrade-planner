# Plan

## User problem

An owner of a Framework Laptop 13 may not know which parts of their current machine can change, which replacement is compatible, or what remains reusable after an upgrade.

## Product hypothesis

Once the owner’s machine is identified, showing several configuration-aware upgrade opportunities together will help them compare what can change and why without clicking through a catalog or being handed an opaque ranking.

## Success / validation signals

- A user can identify a partial Laptop 13 configuration in under two minutes.
- A user can reach a machine view without knowing every component.
- Given the same configuration, the same compatible upgrade opportunities are shown every time.
- In a walkthrough, a user can explain what changes and what stays reusable for at least one opportunity.

## First vertical slice

This prototype assumes configuration detection has already identified one Framework Laptop 13 with a curated current configuration. It shows four upgrade opportunities on the same screen:

1. 16GB → 32GB memory.
2. 256GB → 1TB storage.
3. A different Expansion Card port mix.
4. A different keyboard language or layout.

Each opportunity shows its benefit, the characteristic that changes, and a source link. The prototype does not rank the paths.

## Explicitly out of scope

- Accounts, authentication, purchasing, checkout, and inventory.
- Automatic hardware detection.
- Workload diagnosis, bottleneck inference, ranking, confidence scoring, or AI recommendations.
- A complete Framework catalog or exhaustive cross-generation compatibility engine.
- Automatic hardware detection; the prototype starts after identification.
- Detail pages or click-through flows for individual upgrade opportunities.
- Prices, benchmarks, performance predictions, or unsupported experiential claims.
- Bespoke 3D or exploded-laptop visualization.

## Data / state model

The API exposes one curated machine configuration and four `UpgradeOpportunity` records. Each opportunity declares its component category, current state, proposed state, benefit, change description, reusable components, and source. The client renders all four opportunities together.

## Frontend architecture

React and TypeScript are built with Vite in `frontend/`. The app fetches the identified configuration and curated opportunities from Rails. It has one meaningful UI state after loading: the machine and its upgrade overview. No state library is needed for this slice.

## Backend / API architecture

Rails runs as a small JSON API backed by SQLite. The first endpoints expose the Laptop 13 model data and derive upgrade opportunities from explicit Ruby rules. The backend remains the source of deterministic compatibility behavior so it can later be tested independently of the UI.

## Important UX states

- Initial setup with one meaningful choice at a time.
- A loading and API error state.
- A machine view that shows the identified configuration.
- Four upgrade cards with benefits and explicit change descriptions.

## Key technical decisions

- Use Rails API mode and SQLite to keep local setup small and reviewable.
- Keep product records in a curated Ruby data layer for the first slice rather than introducing a database schema before the data shape is understood.
- Make compatibility rules named, direct, and testable.
- Keep the React client separate from Rails so the frontend boundary is visible and TypeScript remains first class.

## Tradeoffs

This slice favors traceability over catalog breadth. The data is intentionally small and some records are clearly sample data until generation-specific compatibility is verified. A separate Vite client adds one development process, but it demonstrates the Rails/React boundary directly and avoids hiding the workflow inside Rails view conventions.

## Unknowns / questions

- How these opportunities should be represented across every Laptop 13 generation.
- Whether owners understand the benefit language without benchmark claims.
- Which additional component states would be necessary before this could represent a real identified machine.

## Testing strategy

Test the curated opportunity set, benefit presence, and API response shape. Avoid tests that only mirror component markup.

## Demo path

Open the already-identified Framework Laptop 13 view, scan the four upgrade opportunities, and compare the benefit language across memory, storage, Expansion Cards, and keyboard.

# Plan

## User problem

An owner of a Framework Laptop 13 may not know which parts of their current machine can change, which replacement is compatible, or what remains reusable after an upgrade.

## Product hypothesis

An intentionally short identification flow followed by a persistent “Your Framework” component view will help owners explore deterministic upgrade paths with more confidence and less catalog knowledge.

## Success / validation signals

- A user can identify a partial Laptop 13 configuration in under two minutes.
- A user can reach a machine view without knowing every component.
- Given the same configuration, the same compatible upgrade opportunities are shown every time.
- In a walkthrough, a user can explain what changes and what stays reusable for at least one opportunity.

## First vertical slice

This prototype intentionally follows one branch:

1. Choose Framework Laptop 13.
2. Identify a 16GB memory configuration.
3. Show a persistent machine view made of modular component cards.
4. Open the Memory component.
5. Show one deterministic 16GB → 32GB upgrade path.
6. Show the characteristic that changes and the parts that remain reusable.

## Explicitly out of scope

- Accounts, authentication, purchasing, checkout, and inventory.
- Automatic hardware detection.
- Workload diagnosis, bottleneck inference, ranking, confidence scoring, or AI recommendations.
- A complete Framework catalog or exhaustive cross-generation compatibility engine.
- Additional interactive upgrade branches beyond the curated memory path.
- Prices, benchmarks, performance predictions, or unsupported experiential claims.
- Expansion Card configuration in the first slice.
- Bespoke 3D or exploded-laptop visualization.

## Data / state model

The client owns a small `MachineConfiguration` state containing the selected model and 16GB memory configuration. The API exposes one curated machine and one `UpgradeOpportunity` record. The opportunity declares its component category, required model family, current capacity, resulting capacity, supported impact statement, and reusable components.

## Frontend architecture

React and TypeScript are built with Vite in `frontend/`. The app uses local component state and fetches the curated API data from Rails. It has three meaningful UI states: setup, machine view, and component exploration. No state library is needed for this slice.

## Backend / API architecture

Rails runs as a small JSON API backed by SQLite. The first endpoints expose the Laptop 13 model data and derive upgrade opportunities from explicit Ruby rules. The backend remains the source of deterministic compatibility behavior so it can later be tested independently of the UI.

## Important UX states

- Initial setup with one meaningful choice at a time.
- A loading and API error state.
- A machine view that makes the selected component feel explorable.
- A detail state that separates what changes from what stays reusable.

## Key technical decisions

- Use Rails API mode and SQLite to keep local setup small and reviewable.
- Keep product records in a curated Ruby data layer for the first slice rather than introducing a database schema before the data shape is understood.
- Make compatibility rules named, direct, and testable.
- Keep the React client separate from Rails so the frontend boundary is visible and TypeScript remains first class.

## Tradeoffs

This slice favors traceability over catalog breadth. The data is intentionally small and some records are clearly sample data until generation-specific compatibility is verified. A separate Vite client adds one development process, but it demonstrates the Rails/React boundary directly and avoids hiding the workflow inside Rails view conventions.

## Unknowns / questions

- How this memory path should be represented across every Laptop 13 generation.
- Whether owners understand this guided branch without needing a system scan or purchase history.
- Whether the next useful branch is storage or mainboard upgrades.

## Testing strategy

Test the compatibility rules and API response shape, plus the main setup transition and unknown-state behavior in the React client. Avoid tests that only mirror component markup.

## Demo path

Choose Framework Laptop 13, select 16GB memory, enter “Your Framework,” open Memory, select the 32GB capacity increase, and point out the explicit “what changes” and “what stays reusable” sections.

# Framework Upgrade Planner

This is a small product-engineering prototype for Framework. It explores one question: can an owner understand a useful upgrade path for the Framework Laptop 13 they already have without learning the whole product catalog first?

The demo follows one deliberately narrow branch:

`Framework Laptop 13 → 16GB memory → Your Framework → 32GB memory path`

The final screen separates what changes from what stays reusable. The surrounding component cards make the machine feel like a collection of parts, while only Memory is interactive in this slice.

## Run it locally

Requirements:

- Ruby 3.3.12
- Rails 8.1.3.1
- Node.js and npm

Install dependencies and start both servers:

```sh
bundle install
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite client proxies `/api` requests to Rails on port 3000.

## Technical approach

Rails runs as a small JSON API backed by SQLite. The curated data and compatibility rule live in [`app/services/prototype_catalog.rb`](app/services/prototype_catalog.rb), where the rule is directly inspectable:

- the demo model is Framework Laptop 13 with AMD Ryzen AI 300 Series;
- a known 16GB memory configuration returns one 16GB → 32GB path;
- any other memory capacity returns no path.

React and TypeScript provide the setup, machine view, and upgrade detail states. The client keeps only the current screen in local state; there is no account, persistence, recommendation score, or generic rules engine.

The product facts shown here are limited to the current Framework Laptop 13 specifications and are linked to the source in the interface. The prototype does not claim prices, availability, benchmarks, or performance predictions.

## Verification

```sh
bin/rails test
npm run build
npm run test
```

Rails tests cover the deterministic rule and API response. The frontend build verifies the TypeScript/React bundle; the frontend test command is present for the next interaction test and currently permits an empty test set because this prototype does not add a browser-test dependency.

## Product context

The reasoning behind the scope, observations, assumptions, and next questions is in [`PRODUCT_NOTES.md`](PRODUCT_NOTES.md) and [`PLAN.md`](PLAN.md).

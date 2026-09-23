# Telemetry Monitor

A Windows desktop telemetry dashboard built with Angular, Electron, and an Express simulation backend.

## Requirements covered

- Live velocity, pressure, and temperature monitoring.
- Circular gauges, current values, units, status, and last successful update time.
- One-second polling with loading, connection, and error states.
- Real-time line charts with 100 samples, timestamps, tooltips, zoom, and pan.
- Runtime unit conversion without another backend request.
- Light and dark themes.
- CSV and Excel export of collected telemetry.
- Electron desktop window for the Angular application.

## Prerequisites

- Node.js 20 or newer
- npm

Install dependencies in all workspaces:

```powershell
npm install
npm --prefix frontend install
npm --prefix backend install
```

## Development

Start Angular, the backend, and Electron together:

```powershell
npm run dev
```

The Angular browser app is available at `http://localhost:4200` and the telemetry API is available at `http://localhost:3000/api/dashboard`.

To run individual processes:

```powershell
npm run frontend
npm run backend
npm run start:electron
```

The Electron command expects the Angular development server to be running. The backend must also be running for live telemetry.

## Production build

Build the Angular application:

```powershell
npm run build
```

The output is written to `frontend/dist/frontend/browser`. The packaged Electron window loads that output when Electron is started in a packaged environment.

## Tests

Run all frontend and backend tests from the repository root:

```powershell
npm test
```

Run the Angular unit tests:

```powershell
npm --prefix frontend test
```

Run the backend unit tests:

```powershell
npm --prefix backend test
```

The backend simulation keeps a maximum of 100 samples per parameter, changes values by approximately 10%, and moves values toward their baselines on every fifth update cycle.

## Architecture

- `backend/src/services/telemetry.service.ts` owns telemetry simulation and history limits.
- `backend/src/routes/dashboard.routes.ts` exposes `GET /api/dashboard`.
- `frontend/src/app/core/services/dashboard.service.ts` polls the API.
- `frontend/src/app/core/services/unit-conversion.service.ts` converts display values and chart histories locally.
- `frontend/src/app/features/dashboard/dashboard.ts` owns dashboard state, status evaluation, and export actions.
- `frontend/src/app/shared/gauge` provides the reusable circular gauge.
- `electron/main.js` creates the desktop window with context isolation enabled.

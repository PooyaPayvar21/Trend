## Goals
- Make `/admin` feel like a modern, productive admin panel: clear IA, responsive, accessible, fast.
- Keep existing server APIs and data flows; no new dependencies.
- Improve discoverability (deep links), consistency (tables, filters), and feedback (loading, errors, toasts).

## Information Architecture
1. Replace tab-only view with a 2-panel layout: collapsible sidebar + content.
2. Sections: Overview, Users, Auctions, Tenders, Bids, Notifications, Currencies, Settings.
3. Use nested routes for deep-linking: `/admin/users`, `/admin/auctions?...` with query params for state.
4. Keep unauthorized guard; show a friendlier access denied screen with actions.

## Navigation & Shell
1. `AdminLayout`: sticky top bar (title, breadcrumbs, theme toggle), left sidebar (section links), responsive collapse.
2. Sidebar with `@heroicons/react` icons; active state reflects current route.
3. Keyboard shortcuts: `g u` to Users, `g a` to Auctions, `?` opens shortcuts modal.

## Reusable Components
- `KpiCard`: title, value, delta badge, icon.
- `ChartCard`: wraps `react-chartjs-2` line/bar charts with time range and MA toggle.
- `ResourceTable`: generic table with column config; sorting, selection, pagination, row actions.
- `FilterBar`: search box, filter dropdowns, page size selector.
- `BulkActionsBar`: shows selected count; bulk actions with confirm dialog (Headless UI `Dialog`).
- `EmptyState`, `ErrorState`, `SkeletonList`: standardized feedback components.
- `ExportMenu`: server export (JSON) + current view export.

## Data & URL State
1. Keep current API layer in `api/admin.js`; extend calls to accept `{ page, pageSize, sort, q, filter }` where applicable.
2. Use `react-router-dom` `useSearchParams` per section to persist sort/page/filter/search in URL.
3. Maintain selection and table state per-route key to avoid cross-section interference.

## Overview Enhancements
1. KPI grid: Users, Auctions, Bids, Notifications with consistent color palette.
2. Line chart: multi-series with tooltips; time range (7/30/90); moving average overlay.
3. Bar chart: aggregate counts; responsive.
4. Quick actions: refresh, export, link to sections.

## Tables & Actions
1. Users: search, active/subscribed filters; actions: activate/deactivate, delete, make premium.
2. Auctions/Tenders: status filter; actions: approve/reject, mark premium, delete.
3. Bids: sortable columns; actions: refund/void.
4. Notifications: read/unread filter; actions: mark read/unread, delete.
5. Currencies: sortable, editable via inline modal.
6. Selection helpers: select all/page/invert; disabled bulk actions when none selected.

## Feedback & Accessibility
1. Loading skeletons and progress indicators.
2. Error banners with retry.
3. Toasts for success/failure via `react-hot-toast`.
4. ARIA roles/labels; focus management for dialogs/menus; keyboard navigation.

## Styling & Theme
1. Use existing Tailwind CSS v4 utility classes; dark mode via `useTheme().isDarkMode`.
2. Shared color tokens for charts (dark/light grid/text).
3. Consistent spacing, typography, and card elevation across sections.

## File Changes
- Update: `src/pages/AdminDashboard.jsx` to use `AdminLayout` and route-aware content.
- Add (small, focused): `src/components/admin/AdminLayout.jsx`, `SidebarNav.jsx`, `HeaderBar.jsx`, `KpiCard.jsx`, `ChartCard.jsx`, `ResourceTable.jsx`, `FilterBar.jsx`, `BulkActionsBar.jsx`, `EmptyState.jsx`, `ErrorState.jsx`, `ExportMenu.jsx`.
- No new third-party packages.

## Implementation Steps
1. Create `AdminLayout` shell and sidebar; wire `/admin/*` nested routes in `App.jsx`.
2. Refactor AdminDashboard to render `Overview` route; move per-section UIs into route components.
3. Build `KpiCard`, `ChartCard` using current data (`dashboardData`, `daily_stats`).
4. Implement `ResourceTable` + `FilterBar` and migrate Users to it (search/sort/pagination URL state).
5. Add `BulkActionsBar` and unify bulk/single action handlers, confirm dialogs.
6. Migrate Auctions, Tenders, Bids, Notifications, Currencies onto `ResourceTable`.
7. Add feedback states (loading, error, empty), improve toasts.
8. Polish theming, accessibility, keyboard shortcuts.

## Verification
- Run dev server and navigate `/admin` as admin; verify:
  - Sidebar nav, deep-linking, URL-persisted filters.
  - Sorting/pagination, selection counts and bulk actions.
  - Exports (server and current view) download files.
  - Charts render correctly in light/dark.
  - Error and loading states behave as expected.

## Rollback Plan
- Keep old tab logic behind a flag during refactor; if issues arise, switch to the previous rendering path.

Please confirm and I will implement the changes end-to-end.
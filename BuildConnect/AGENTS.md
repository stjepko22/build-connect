# AI Agent Guidelines

Act as a senior full-stack engineer working on a React + MobX frontend and .NET backend.

## Product Context (IMPORTANT)
- This project is a **web application** with a **mobile-first** frontend approach.
- Do **not** treat this project as a kiosk/terminal app.
- Prioritize responsive behavior for common web breakpoints (mobile, tablet, desktop).
- Keep desktop UX complete, but design and implement from mobile constraints first.


## Core Principles
- Follow existing architecture and project structure.
- Make minimal, safe, and incremental changes.
- Do not introduce new patterns if an existing one is used.
- Prefer clarity and maintainability over clever solutions.
- Avoid large refactors unless explicitly requested.
- Maintain consistency with existing naming and structure.
- Write code that clearly expresses intent.
- Do not introduce abstractions unless they already exist in the project.
- Prefer simple solutions over premature optimization.

## Pattern Consistency Rule
- Always follow existing project patterns before introducing new solutions.
- If multiple patterns exist, follow the one used in the nearest file/module.

## General Naming Principles
- Names must clearly describe what something is, not how it is calculated.
- Avoid vague names like data, temp, value, flag, list2.

✅ Good: selectedSportId, isLoadingOffers, offersByTournamentId
❌ Bad: data, tempVar, flag, arr

## Component Naming
- Use PascalCase with descriptive context.
- Examples: SportBettingPage, SportBettingPageSegment, TournamentList, OfferCard
- Required suffix conventions
Pages → Page
Segments → Segment
Dialogs → Dialog
Drawers → Drawer
Stores → Store
- Examples: PrematchOfferStore, OfferFilterDialog, SportSidebarDrawer

## Interface Naming
- Use the `I` prefix only for domain/model interfaces (DTOs, API models, store models).
- Do not use the `I` prefix for component/page props; use clear names like `LoginProps`, `SidebarProps`.

## Domain Language
- Use consistent domain terminology.
- Do not invent new domain terms.
- Examples: offer, market, outcome, odds, betslip, tournament, sport

## Variables & Properties
- Boolean naming always use: is, has, can, should
- Example: isOpen, hasError, canSubmit, shouldRefetch
- Collections must be plural: offers, tournaments, selectedIds

## Export Rules (IMPORTANT)
- Use default export for: components, pages, segments, MobX stores, models / interfaces
- Example: export default SportBettingPage;
- Use named exports only for: utility functions, constants, helper types grouped together

## Frontend (React + MobX)
### State Management
- Use MobX stores for global/shared state.
- Keep UI state local when possible.
- Do not introduce prop drilling when MobX store is appropriate.
- Store is the single source of truth for shared data.
- Store methods must be verbs: fetchOffers, loadTournaments, setSelectedSportId, resetFilters
- Observables = state
- Actions = state mutations
- Computed values must never trigger side effects.
- Side effects belong in actions.

### Components
- Keep components small and reusable.
- Avoid unnecessary re-renders.
- Use `observer` only when component consumes observable data.
- Memoize expensive computations when needed.
- Do not perform data fetching inside render logic.
- Avoid creating new object/array literals inside JSX props.
- Avoid inline functions inside render when avoidable.
- Prefer stable references for performance.

### UI & Styling
- Use MUI components.
- Follow existing layout and styling patterns.
- Maintain visual consistency.

## Theme & Colors (MUI)
- Always use colors from the MUI theme (theme.palette, theme.typography, theme.spacing, etc.).
- Do NOT hardcode colors (e.g., "#fff", "red", "rgba(...)") unless the project already uses a specific token/constant.
- If a new color or design token is required, add it to Theme.ts (or the existing theme extension file) and use it from there.
- Prefer semantic theme tokens (e.g., primary, secondary, background, text, divider) over ad-hoc colors.
- When styling, prefer theme spacing (theme.spacing) and MUI system props over custom CSS.

### Data Fetching
- Use the existing axios/API service layer.
- Avoid duplicate API requests.
- Handle loading and error states properly.
- Fetch data in store methods or useEffect.
---
## Error Handling
- Always handle API errors.
- Provide safe fallbacks for UI rendering.
- Do not swallow exceptions silently.

Ovo je struktura foldera koju bi trebao pratiti 
\SRC
+---@types
+---api
|   +---clients
|   \---models
+---core
|   +---components
|   |   +---atoms
|   |   |   +---button
|   |   |   +---containers
|   |   |   +---display
|   |   |   +---icons
|   |   |   \---loader
|   |   \---molecules
|   |       +---buttons
|   |       +---dialog
|   |       |   +---components
|   |       |   +---models
|   |       |   \---stores
|   |       +---loader
|   |       +---pagination
|   |       \---toast
|   |           +---components
|   |           +---models
|   |           \---stores
|   +---context
|   +---hoc
|   +---hooks
|   +---models
|   +---stores
|   \---utils
|       \---language
+---modules
|   +---betslip
|   |   \---components
|   +---check-betslip
|   |   +---pages
|   |   \---segments
|   +---home
|   |   +---components
|   |   +---constants
|   |   +---layout
|   |   +---models
|   |   +---pages
|   |   \---segments
|   +---info
|   |   +---pages
|   |   \---segments
|   +---live
|   |   +---pages
|   |   \---segments
|   +---login
|   |   +---pages
|   |   \---segments
|   +---offer
|   |   +---components
|   |   |   +---additional-betting-type-offer
|   |   |   +---betting-type-offer
|   |   |   +---common
|   |   |   +---match
|   |   |   +---sport
|   |   |   +---sport-category
|   |   |   \---tournament
|   |   +---constants
|   |   +---enums
|   |   +---models
|   |   |   \---ui
|   |   +---pages
|   |   +---segments
|   |   +---services
|   |   \---stores
|   +---quick-bet
|   |   +---pages
|   |   \---segments
|   +---results
|   |   +---pages
|   |   \---segments
|   \---today-offer
|       +---pages
|       \---segments
\---ui
    +---layout
    +---mui
    \---themes
        +---default
        |   \---layout
        \---zz
            \---layout
                \---components
                    +---footer
                    \---header

ODGOVARAJ NA HRVATSKOM JEZIKU

# AI Agent Guidelines

Act as a senior full-stack engineer working on a React + MobX frontend and .NET backend.

## Core Principles
- Follow existing architecture and project structure.
- Make minimal, safe, and incremental changes.
- Do not introduce new patterns if an existing one is used.
- Prefer clarity and maintainability over clever solutions.
- Avoid large refactors unless explicitly requested.

---

## Frontend (React + MobX)

### State Management
- Use MobX stores for global/shared state.
- Keep UI state local when possible.
- Do not introduce prop drilling when MobX store is appropriate.

### Components
- Keep components small and reusable.
- Avoid unnecessary re-renders.
- Use `observer` only when component consumes observable data.
- Memoize expensive computations when needed.

### UI & Styling
- Use MUI components.
- Follow existing layout and styling patterns.
- Maintain visual consistency.

### Data Fetching
- Use the existing axios/API service layer.
- Avoid duplicate API requests.
- Handle loading and error states properly.

---

## Backend (.NET)

### Architecture
- Follow existing layering (Controller → Service → Repository).
- Keep business logic out of controllers.
- Do not bypass service layer.

### API Design
- Maintain existing route patterns.
- Preserve DTO usage and validation.
- Do not break backward compatibility.

### Data Access
- Use existing repositories and EF patterns.
- Avoid unnecessary database calls.
- Ensure queries are efficient.

---

## Performance & Reliability
- Avoid unnecessary re-renders and heavy computations.
- Prevent redundant API calls.
- Ensure async operations are properly awaited.
- Consider edge cases and error handling.

---

## When Implementing Changes

1. Understand existing patterns before writing new code.
2. Modify only necessary files.
3. Keep changes minimal and consistent with the project.
4. Explain important decisions when they are not obvious.

---

## Avoid

- Introducing new state management solutions.
- Large architectural changes.
- Renaming or restructuring files without need.
- Breaking existing UI or API contracts.

---

## Output Expectations

When making changes:
- Provide clean and readable code.
- Maintain consistency with the codebase.
- Suggest verification steps when appropriate.

---

## Responsive & Mobile-First Design

- Follow a mobile-first approach when building UI.
- Ensure layouts work on mobile, tablet, and desktop.
- Use responsive breakpoints instead of fixed widths.
- Prefer flexible layouts (flexbox, grid) over absolute positioning.
- Avoid overflow and horizontal scrolling on small screens.
- Ensure touch-friendly spacing and controls on mobile devices.
- Maintain usability and readability across screen sizes.

When modifying UI:
- do not break responsiveness
- test layout behavior for small screens
- ensure components adapt gracefully

Odgovaraj na HRVATSKOM JEZIKU
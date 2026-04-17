# Frontend UI System Guide

This document captures the shared frontend UI system used in this project so the same patterns can be reused in other applications.

It is based on the current implementation in:

- `src/styles/theme.ts`
- `src/App.css`
- `src/components/PageHeader/*`
- `src/components/Header/*`
- `src/components/Sidebar/*`
- `src/components/FilterModal/*`
- `src/components/ChecklistModal/*`
- `src/components/AttachmentModal/*`
- `src/pages/Dashboard/Dashboard.css`
- `src/pages/Notifications/NotificationsPage.css`
- `src/pages/ProjectDetail/ProjectDetail.css`

## 1. Stack and UI approach

The frontend is built with:

- React + TypeScript
- Ant Design as the base component library
- Font Awesome as the primary icon system
- CSS files for page-level and component-level overrides
- Shared theme tokens from `src/styles/theme.ts`

The project does not use a strict utility-first system. The styling approach is:

1. Use Ant Design for structure and behavior.
2. Override Ant Design with scoped CSS classes.
3. Use shared tokens for colors, spacing, radius, shadows, and typography.
4. Add page-specific layout CSS where needed.

## 2. Core design tokens

## Typography

Primary font:

- `IBM Plex Sans`

Monospace font:

- `IBM Plex Mono`

Type scale:

- `xs`: `12px`
- `sm`: `14px`
- `base`: `16px`
- `lg`: `18px`
- `xl`: `20px`
- `2xl`: `24px`
- `3xl`: `30px`
- `4xl`: `36px`

Font weights:

- `regular`: `400`
- `medium`: `500`
- `semibold`: `600`
- `bold`: `700`

Line heights:

- `tight`: `1.2`
- `normal`: `1.5`
- `relaxed`: `1.75`

Usage rule:

- Use `IBM Plex Sans` for body text, forms, table content, cards, and labels.
- Use stronger weights rather than oversized typography.
- Use mono sparingly for technical data, ids, or fixed-width readouts.

## Brand and semantic colors

Primary brand:

- Main: `#E23151`
- Hover: `#F04161`
- Active: `#D12141`
- Light: `#FFE6E9`
- Dark: `#B81F3A`

Neutrals:

- Backgrounds mostly use `#FAFAFA`, `#F5F5F5`, and white
- Text mostly uses `#333333`, `#666666`, `#999999`
- Borders mostly use `#E5E5E5` or `#F0F0F0`

Semantic colors:

- Success: `#36B37E`
- Warning: `#FFAB00`
- Error: `#FF5630`
- Info: `#0065FF`

Status chip tokens:

- Completed: blue on light blue
- On track: green on light green
- At risk: yellow on pale yellow
- Delayed: orange/red on pale red
- N/A: gray on light gray

Usage rule:

- Use primary red only for primary actions, active states, and key emphasis.
- Use semantic colors for statuses and progress signals.
- Keep surfaces neutral and let status/brand colors carry the emphasis.

## Spacing

Base spacing scale:

- `4px`
- `8px`
- `16px`
- `24px`
- `32px`
- `48px`
- `64px`
- `96px`

Most repeated spacing patterns in the UI:

- `8px` for tight gaps
- `12px` for row/action alignment
- `16px` for card padding or section spacing
- `24px` for page-level separation

## Radius

Shared radius scale:

- `4px`
- `8px`
- `16px`
- `24px`
- `9999px` for pills

Actual usage:

- Inputs and buttons: mostly `8px`
- Cards: `6px` to `8px`
- Tags and chips: `4px`
- Pills and counters: fully rounded

## Shadows

Shared shadows:

- Small: `0 2px 8px rgba(0, 0, 0, 0.15)`
- Medium: `0 4px 16px rgba(0, 0, 0, 0.15)`
- Large: `0 8px 24px rgba(0, 0, 0, 0.15)`

Common real usage:

- Cards: softer shadow around `0 2px 8px rgba(0, 0, 0, 0.06)`
- Hover states: stronger but still soft
- Popovers and floating overlays: medium shadow

## Breakpoints

Defined breakpoints:

- `sm`: `600px`
- `md`: `960px`
- `lg`: `1280px`
- `xl`: `1920px`

Practical responsive breakpoints used in CSS:

- `576px`
- `768px`
- `820px`
- `900px`
- `1024px`

## 3. Global application shell

## Root variables and base styles

Global values are declared in `src/App.css`.

Key shell variables:

- `--primary-color: #E23151`
- `--background-color: #F5F5F5`
- `--text-color: #333333`
- `--border-color: #E5E5E5`

Global body behavior:

- Zero margin and padding
- Sans font stack
- Antialiased rendering
- Light neutral page background

## App layout structure

The application shell follows this structure:

1. Fixed left sidebar
2. Fixed top header
3. Main content area with top padding to clear the header

Main layout values:

- Sidebar expanded width: `240px`
- Sidebar collapsed width: `60px`
- Header height: `64px`
- Content padding: `88px 24px 24px`

Mobile content padding reduces to:

- `88px 16px 16px`
- `80px 12px 12px` on smaller screens

## Sidebar pattern

The sidebar is a fixed vertical navigation rail with a brand gradient:

- Top to bottom gradient: red to orange
- Expanded width: `240px`
- Collapsed width: `60px`
- Fixed position from top to bottom

Sidebar rules:

- Use Font Awesome icons
- Use compact menu items with `40px` height
- Selected item uses translucent white background
- Footer contains logout action
- Keep labels hidden in collapsed mode

Reuse guidance:

- This pattern fits dashboard apps with many primary modules
- Keep icon sizes around `16px` to `18px`
- Keep the sidebar fixed and let only the content scroll

## Header pattern

The header uses a glassmorphism treatment:

- Semi-transparent white background
- Blur effect
- Soft border and shadow
- Fixed positioning aligned to sidebar width

Header zones:

- Left: logo
- Right: search trigger/input, notifications popover, user avatar, user identity

Notable behavior:

- Search expands inline
- Notifications open in a grouped popover
- Header shifts left offset when sidebar collapses

Recommended reuse:

- Use fixed headers only in app-shell pages
- Keep header height consistent at `64px`
- Use blurred translucent background only when the rest of the app is light

## 4. Shared page composition

## Page header

Use the shared `PageHeader` component for consistent page introductions.

It includes:

- Breadcrumb row
- Main title
- Optional back button
- Optional center content
- Optional action area

Standard page header behavior:

- Title size: `24px`
- Breadcrumb size: `14px`
- Action buttons: `40px` height
- Input/select controls inside the header also normalize to `40px`

Recommended structure:

```tsx
<PageHeader
  title="Work Management"
  breadcrumbs={[{ title: 'Operations', href: '/dashboard' }]}
>
  <Button type="primary">Create</Button>
  <Button>Export</Button>
</PageHeader>
```

## Page body

Most pages follow this sequence:

1. Page header
2. Filter or toolbar card
3. KPI or summary cards if needed
4. Main data card, table, board, chart, or inbox list
5. Modals for detail/edit interactions

## Surface model

The UI generally uses three surface levels:

1. App background: light gray
2. Main cards: white
3. Active, hover, or grouped sub-surfaces: very light gray or tinted status background

Common card styling:

- Radius: `8px`
- Border: `1px solid #f0f0f0`
- Shadow: soft low-elevation shadow

## 5. Layout and grid system

## Ant Design grid usage

Use `Row` and `Col` for:

- dashboard KPI blocks
- responsive metric cards
- multi-column page sections

Use Ant Grid when:

- the content is card-based
- the layout should collapse by breakpoints
- the page already uses Ant components heavily

## CSS Grid usage

Use CSS Grid for denser app layouts:

- kanban boards
- multi-column filter sections
- equal-width module layouts
- structured detail groups

Common patterns in the repo:

- `repeat(5, minmax(0, 1fr))` for board/status columns
- `repeat(3, minmax(0, 1fr))` for medium data blocks
- `1fr 1fr` for paired form sections
- explicit mixed-width column definitions for advanced data rows

Use CSS Grid when:

- the number of columns is controlled
- alignment must stay exact
- each column has a consistent role

## Responsive layout rules

Main conventions:

- collapse multi-column layouts to single-column under `768px`
- reduce action density before reducing information density
- keep content scrollable horizontally only for board-like UIs
- fixed shell remains, but content padding reduces

Kanban and board layouts:

- desktop: multi-column grid
- tablet: reduce visible columns or allow horizontal scroll
- mobile: single-column stack with horizontal overflow when needed

## 6. Component usage patterns

## Buttons

Primary buttons:

- use brand red background
- white text
- hover to lighter red
- active to darker red

Secondary buttons:

- white background
- border visible
- text can remain neutral or brand-colored based on context

Shared examples from theme:

- Primary buttons are typically `40px` high in headers/toolbars
- Secondary compact buttons often use `32px` height

Usage rule:

- only one strong primary action per local section
- use subtle buttons for row actions, filters, and utility controls

## Inputs, selects, and date pickers

Input behavior is normalized heavily across the app:

- default global input height: `32px`
- page header inputs/selects: `40px`
- border radius: `8px`
- focus/hover color: brand red

Use these controls for:

- quick filtering
- header search
- date range selection
- modal forms

Guideline:

- keep search/filter inputs compact
- use inline filters for fast operations
- use modals for complex multi-field forms

## Cards

Cards are the dominant layout primitive.

Common card types:

- filter bar card
- dashboard metric card
- list container card
- chart card
- detail section card

Repeated card traits:

- white background
- subtle border
- soft shadow
- rounded corners
- clean padded body

Examples:

- `filters-bar` in dashboard pages
- `notifications-list-card` in inbox-style pages
- `dashboard-card` in analytical pages

## Tags, pills, badges, and chips

Use small shaped tokens for:

- statuses
- module labels
- counts
- state filters

Common traits:

- radius `4px` for tags
- full pill for count bubbles
- strong foreground/background contrast for statuses
- lighter tinted backgrounds for semantic state

Examples:

- notification module tags
- status chips in project detail
- sidebar/header badge counts

## Tables

Table rules visible in dashboard and data pages:

- sticky table headers
- light gray header background
- `12px` header font
- `600` weight for headers
- tighter vertical spacing than default Ant tables

Recommended usage:

- use tables for dense operational data
- keep row actions minimal
- use cards around tables when the page needs section separation

## Tabs

Tabs are used for:

- view switching
- dashboard segmentation
- detail sections

Pattern:

- card-style tabs in project detail
- active tab highlighted with brand red
- no heavy visual decoration

## Modals

The project uses modals extensively for:

- checklist editing
- attachments
- date confirmations
- create/edit flows
- workflow actions

Modal rules:

- keep title row actionable
- use icons in the title when the modal has a strong identity
- avoid over-nesting modal content
- use `destroyOnClose` when modal state should reset

## Popovers and dropdown panels

Used for:

- header notifications
- filter panel
- lightweight action menus

Common visual treatment:

- tighter width than full modal
- medium shadow
- `8px` radius
- grouped content with dividers or section headers

## 7. High-value shared components

## `PageHeader`

Use for all major pages that need:

- breadcrumbs
- title
- top-level actions

Why:

- keeps spacing and action sizing consistent
- removes page-by-page header drift

## `FilterModal`

Use when inline filter density is too high or when multi-select filtering is needed.

Characteristics:

- fixed overlay panel
- sticky panel header
- search plus grouped checkbox sections
- immediate local filter sync

Recommended use:

- large tables
- kanban/list views with multiple dimensions

## `ChecklistModal`

This is one of the more advanced reusable patterns in the repo.

It combines:

- form editing
- attachments
- comments/activity
- assignees/approvers
- date-range handling
- read-only and approval states

Use this as a reference for:

- multi-mode modal design
- operational workflows
- task detail editing

## `AttachmentModal`

Use for:

- image/document/video previews
- task-linked files
- gallery-style browsing

Pattern:

- icon in title
- optional task tag
- large-width modal
- delegated content renderer through `AttachmentGallery`

## 8. Repeated page patterns

## Filter toolbar card

Seen across dashboard-style and data-heavy pages.

Pattern:

- white card
- sticky when needed
- subtle border and shadow
- compact control spacing
- brand-colored Apply button

Use this when:

- filters drive the whole page
- users need persistent access while scrolling

## Inbox/list pattern

Seen in the notifications module.

Pattern:

- top toolbar with chips and filters
- outer list card
- each row is its own mini-surface
- actions stay compact and aligned right
- hover highlights without strong borders

Use this for:

- notifications
- alerts
- message centers
- review queues

## Kanban/board pattern

Seen in project detail and work-detail style views.

Pattern:

- status headers across the top
- stages grouped below
- inner grid for status lanes
- cards are compact and data-rich
- drag/drop is handled from a visible control, not the full card

Rules:

- keep each lane visually light
- maintain lane borders and soft backgrounds
- allow horizontal overflow for smaller screens

## Dashboard card pattern

Pattern:

- fixed-height cards
- card header separated by bottom border
- centered placeholder/chart content
- hover shadow increase

Use for:

- KPIs
- small charts
- operational summaries

## 9. Icons and visual language

Primary icon system:

- Font Awesome solid icons

Secondary icon system:

- Ant Design icons

Usage guidance:

- Prefer Font Awesome for page actions, nav, status affordances, and richer UI controls
- Use Ant icons where Ant component APIs already expect them or where the project already uses them
- Keep icon sizes small and functional:
  - `12px` to `14px` in dense lists
  - `16px` to `18px` in nav or toolbars

## 10. CSS and implementation conventions

## Scoping

Use page-level wrapper classes:

- `.dashboard-page`
- `.notifications-page`
- `.project-detail`

This prevents Ant overrides from leaking across the app.

## Naming style

The codebase uses plain descriptive class names rather than BEM-heavy naming.

Pattern examples:

- `page-header-*`
- `header-notification-*`
- `notifications-row-*`
- `dashboard-card`
- `filters-bar`

Recommendation:

- keep classes feature-based
- prefix deeply nested structures with the parent component name

## Ant Design overrides

Override Ant components through local wrappers whenever possible.

Examples:

- `.page-header .ant-btn`
- `.notifications-page .ant-input-affix-wrapper`
- `.project-detail .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab`

Rule:

- avoid unscoped global overrides unless the whole app truly needs them

## Inline styles vs CSS files

Current codebase uses both.

Recommended reuse rule:

- use CSS files for stable visual systems and responsive logic
- use inline styles only for:
  - dynamic state colors
  - conditionally computed layout values
  - per-row or per-card runtime values

## 11. Responsive behavior guidelines

Apply these rules consistently in new projects:

- Keep page headers flexible and wrap actions
- Reduce control widths before removing controls
- Move complex filter sets into a modal on smaller screens
- Collapse grids from 5 -> 3 -> 1 columns as the viewport shrinks
- Keep fixed shell widths predictable
- Let data-heavy modules scroll horizontally rather than overflow visually

## 12. Recommended reuse blueprint

If you want to reuse this UI system in another project, bring these pieces first:

1. `src/styles/theme.ts`
2. the root variables from `src/App.css`
3. the app shell pattern from header + sidebar
4. `PageHeader`
5. filter toolbar card pattern
6. card, tag, button, and form-control sizing conventions

After that, add page-specific modules:

- inbox/list module
- kanban module
- dashboard card module
- modal workflows

## 13. Reference implementation snippets

## Importing the theme

```ts
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';
```

## Primary action usage

```tsx
<Button
  type="primary"
  style={{
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
    borderRadius: 8
  }}
>
  Save
</Button>
```

## Two-column detail grid

```tsx
<div
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  }}
>
  <Card />
  <Card />
</div>
```

## Five-column board layout

```tsx
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
    gap: '8px'
  }}
>
  {columns}
</div>
```

## Sticky filter bar

```tsx
<Card className="filters-bar">
  <Space wrap size={12}>
    <Input placeholder="Search" />
    <Select />
    <DatePicker.RangePicker />
    <Button type="primary">Apply Filters</Button>
  </Space>
</Card>
```

## 14. Do and do not

Do:

- keep all main screens inside the same shell spacing system
- use shared tokens for brand color, spacing, and radius
- reuse `PageHeader` instead of rebuilding page tops
- prefer soft shadows and subtle borders over heavy outlines
- keep forms and toolbar controls compact and consistent

Do not:

- use page-specific random colors for primary actions
- mix too many different border radii on the same page
- override Ant styles globally unless absolutely necessary
- make cards visually heavy with large shadows and thick borders
- create new spacing scales when the existing one already fits

## 15. Practical migration checklist for other projects

When applying this system in a new frontend:

1. Set root CSS variables for color, background, text, and fonts.
2. Add the shared theme token file.
3. Build the shell first: sidebar, header, content container.
4. Standardize all buttons, inputs, selects, and cards.
5. Add `PageHeader` and the filter toolbar pattern.
6. Introduce page modules like dashboard, inbox, kanban, and detail modal patterns.
7. Add responsive rules after the desktop shell is stable.

## 16. Summary

This frontend system is a light enterprise dashboard design system built on top of Ant Design with:

- IBM Plex typography
- a red brand accent
- neutral surfaces
- compact operational controls
- strong use of cards and modals
- fixed shell navigation
- reusable page headers
- grid-based dense data layouts

If you keep the shell, tokens, control sizing, and card patterns intact, the same visual system can be reused cleanly in other products.

# News Page Design

## Summary

Add a new first-class `news.html` page to the static site and expose it in the top navigation and footer navigation across all existing pages. The page will adapt the content from `https://thepalateglobal.com/news.html` into this project's established visual system, while preserving the source page's stacked editorial layout and inline click-to-expand detail behavior.

This is an integration task, not a pixel-identical brand clone. The result should feel native to the existing `THE PALATE` site while keeping the source page's content structure and reading flow.

## Goals

- Add a new `news.html` page that visually matches the current project style.
- Show `News` in the top tabbar/navigation across all site pages.
- Show `News` in the footer navigation across all site pages.
- Give each of the four news items its own dedicated local background image.
- Preserve the source page's content hierarchy:
  - intro or hero area
  - four editorial content blocks
  - short summary visible by default
  - click action to reveal more details inline
- Preserve the project's current `EN/PT` language toggle pattern.
- Make `news.html` adapt cleanly to tablet and mobile layouts.
- Keep the implementation compatible with the site's current static HTML + inline CSS + shared `js/i18n.js` approach.

## Non-Goals

- Do not rebuild the source site's original branding, footer, or contact section.
- Do not add a backend, CMS, or dynamic news feed.
- Do not introduce frameworks, bundlers, or external libraries.
- Do not change the site's existing language system architecture.

## Existing Project Constraints

- The project is a static multi-page site:
  - `index.html`
  - `brands.html`
  - `gastronomy.html`
  - `inquiry.html`
- Each page contains:
  - inline page-specific CSS
  - a shared visual language
  - the same fixed top nav
  - the same dark footer structure
  - `EN/PT` toggles powered by `js/i18n.js`
- The established design language uses:
  - white background
  - dark text `#111111`
  - green brand accent `#149C3D`
  - gold highlight `#E5BA73`
  - spacious editorial padding
  - premium, minimal, static HTML composition

## Source Content Model

The source page contains four stacked editorial topics:

1. `Our Mission`
2. `Global Strategy`
3. `Social Responsibility`
4. `Future Outlook`

Each topic has:

- a small section label
- a title
- a short visible teaser or summary
- a click action such as `View more` or `Read more`
- a longer body of supporting content revealed after interaction
- a dedicated local image treatment tied to that topic

This structure maps naturally to an editorial accordion-style page in this project.

## Chosen Approach

Use a native-styled editorial accordion page.

Why:

- It keeps the source page's stacked reading flow.
- It preserves the required click-expand logic.
- It fits the current site's static HTML architecture.
- It avoids forcing a card grid or unrelated redesign that would drift away from the source page's layout.

## Information Architecture

### New page

- Add `news.html`

### Navigation order

Insert `News` into the top nav and footer nav after `Home`.

Target top nav order:

1. `Home`
2. `News`
3. `For Brands`
4. `For Gastronomy`
5. `Inquiry`

Target footer nav order:

1. `Home`
2. `News`
3. `For Brands`
4. `For Gastronomy`
5. `Inquiry`

### Active state

- `news.html` must mark the `News` nav item as active.
- Existing pages must include `News` as a normal inactive nav item.

## Page Layout Design

### Hero section

The new page should open with an inner-page hero consistent with `brands.html` and `gastronomy.html`.

Recommended structure:

- page indicator: `Global News & Insights`
- H1: brand-aligned editorial headline for the news page
- supporting paragraph introducing the role of TPG news, mission, and global perspective

The hero should use an existing brand-compatible visual treatment:

- a soft light or green-tinted overlay
- a premium editorial atmosphere
- reuse an existing image asset if no dedicated news hero is added in this phase

### Editorial section stack

Below the hero, render four vertically stacked news sections.

Each section should include:

- a section label
- a section title
- a dedicated local image panel
- a short visible summary
- an action button or text link
- a hidden detail body

### Section presentation

The sections should use the project's existing visual vocabulary:

- subtle borders
- green accent line or border marker
- white or pale background blocks
- generous spacing
- typography consistent with existing inner pages
- premium editorial image treatments aligned with the brand palette

Recommended pattern:

- one section per row
- on desktop, each section is a split card with image and text areas
- section rhythm alternates image-left/text-right, then image-right/text-left
- detail content expands below the teaser inside the same container
- the expanded body is visually separated by spacing, divider, or inset panel

### Dedicated item imagery

Each news item should use a different local placeholder image during this phase.

Recommended filenames:

1. `images/news-mission.png`
2. `images/news-strategy.png`
3. `images/news-responsibility.png`
4. `images/news-outlook.png`

Placeholder style direction:

- brand-consistent editorial gradients
- green and gold accent cues
- distinct tone per topic
- polished enough to look intentional until final assets are supplied

## Interaction Design

### Expand/collapse behavior

Each content block gets its own inline expand/collapse behavior.

Default state:

- collapsed
- summary visible
- full detail hidden

Expanded state:

- full detail content becomes visible inline beneath the summary
- control text changes from `View more` or `Read more` to `Show less`

### State model

Use multi-open behavior.

Meaning:

- opening one section does not close others
- users can expand multiple sections at the same time

Why:

- this is more natural for editorial reading
- it reduces friction when comparing sections
- it is simpler and more transparent in a static HTML page

### Motion

Use lightweight native transitions only:

- opacity
- max-height
- spacing

Do not add complex animation libraries.

## Responsive Strategy

The page should remain editorial and readable across desktop, tablet, and mobile.

### Desktop

- use split-card sections with image and text side by side
- preserve alternating layout for visual rhythm
- keep generous spacing consistent with existing inner pages

### Tablet

- at `<= 960px`, switch each news item from side-by-side panels to a vertical stack
- image moves above text
- reduce horizontal padding to preserve comfortable reading width

### Mobile

- at `<= 720px`, use image-on-top and text-below for every news item
- reduce hero headline and section title sizes
- tighten card padding and section spacing
- keep expand/collapse controls easy to tap
- avoid text overlays on top of images for long editorial copy

## Language Strategy

The existing site uses `EN/PT` pairs throughout the DOM and a shared toggle in `js/i18n.js`.

To keep the site behavior consistent, `news.html` should follow the same pattern:

- every translatable text block will include `.lang-en`
- every translatable text block will include `.lang-pt`
- English content mirrors the source content
- Portuguese content will be provided as localized page copy, not left blank

This keeps the new page behavior aligned with all existing pages.

## Content Adaptation Rules

- Preserve the source page's four main content sections and their detail text.
- Keep the meaning and hierarchy intact.
- Adapt headings slightly only where needed to fit the current site voice and hero/title conventions.
- Keep the long-form expanded text faithful to the source content.
- Do not introduce unrelated marketing claims that are not present on the source page.

## Styling Rules

The new page should inherit the site's unified style through duplication of the existing inline-CSS pattern, adapted for the new page's needs.

Key styling requirements:

- fixed white nav matching the rest of the site
- footer matching the rest of the site
- primary accent green `#149C3D`
- secondary highlight gold `#E5BA73`
- dark text `#111111`
- premium whitespace and readable line-height
- desktop split-card layout with explicit tablet/mobile stacking behavior
- one distinct image treatment per news item
- mobile-safe tap targets and spacing for expand controls

Avoid:

- introducing a new color system
- using a visually noisy newsroom aesthetic
- making the page look like a separate product brand
- using text-on-image overlays for dense long-form mobile reading

## Files To Change

### Create

- `news.html`
- optional spec-time content notes only if needed during implementation

### Update

- `index.html`
- `brands.html`
- `gastronomy.html`
- `inquiry.html`

These existing pages need nav and footer updates to expose the `News` entry consistently.

## Suggested Internal Structure For `news.html`

Recommended top-level blocks:

1. fixed nav
2. news hero
3. editorial section list
4. optional closing CTA band linking to `inquiry.html`
5. shared footer
6. `js/i18n.js`
7. page-local script for expand/collapse
8. page-local responsive CSS for split-card to stacked-card transitions

## Accessibility Requirements

- Expand/collapse controls should be keyboard reachable.
- Controls should communicate state using `aria-expanded`.
- Hidden panels should be associated with their toggle control.
- Section headings should remain semantic and readable without interaction.
- Hover should not be the only interaction signal.
- Decorative news images should not carry critical text that would be lost to assistive technologies.
- Mobile controls should remain comfortably tappable without relying on hover.

## Verification Plan

Implementation is only complete when all of the following are true:

- `news.html` renders correctly as a standalone page.
- `News` appears in the top nav on all pages.
- `News` appears in the footer nav on all pages.
- Active nav highlighting is correct on `news.html`.
- Expand/collapse works for all four sections.
- Multiple sections can remain open simultaneously.
- `EN/PT` toggle works correctly on the new page.
- Each news item loads its own local placeholder image without broken references.
- Desktop layout alternates image and text panels as specified.
- Tablet and mobile layouts stack image above text cleanly.
- The page remains readable and tappable on narrow screens.
- Existing pages still render and navigate correctly after nav/footer updates.
- No broken image or script references are introduced.

## Risks And Mitigations

### Risk: visual drift from the unified site style

Mitigation:

- copy structural patterns from existing inner pages
- keep colors, spacing, nav, footer, and button/link treatments aligned with the current project

### Risk: inconsistent language toggle behavior

Mitigation:

- use the exact `.lang-en` and `.lang-pt` DOM structure already used elsewhere
- keep `switchLang()` and `js/i18n.js` unchanged

### Risk: interaction feels bolted on

Mitigation:

- design each editorial section as a first-class content block with a clear teaser and detail region
- keep the reveal inline rather than opening a modal or redirecting

### Risk: images overpower content or drift from brand tone

Mitigation:

- use restrained placeholder visuals with the existing green/gold palette
- keep images supportive rather than dominant
- avoid highly saturated or generic stock-like treatments

### Risk: mobile layout becomes cramped

Mitigation:

- switch to image-top/text-bottom stacking below defined breakpoints
- reduce typography and spacing progressively instead of shrinking everything at once
- keep controls full-width or comfortably tappable on smaller screens

## Implementation Recommendation

When implementation starts, do the work in this order:

1. create `news.html` shell with nav, hero, footer, and image placeholder hooks
2. add the four local placeholder image assets
3. build the four editorial split-card sections and expand/collapse behavior
4. wire `EN/PT` content blocks
5. add responsive breakpoints for tablet and mobile stacking
6. update nav and footer links on existing pages
7. run a manual browser check across desktop and mobile widths

## Spec Review

Self-review completed:

- no placeholders remain
- navigation placement is explicit
- interaction model is explicit
- language behavior is explicit
- scope is limited to one page plus shared nav/footer updates
- dedicated per-item imagery is explicit
- mobile adaptation rules and breakpoints are explicit

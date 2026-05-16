---
name: Zenith Flow
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c8c5d0'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#928f9a'
  outline-variant: '#47464f'
  surface-tint: '#c4c1fb'
  primary: '#c4c1fb'
  on-primary: '#2d2a5b'
  primary-container: '#1e1b4b'
  on-primary-container: '#8683ba'
  inverse-primary: '#5b598c'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#331d00'
  on-tertiary-container: '#c07a00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c1fb'
  on-primary-fixed: '#181445'
  on-primary-fixed-variant: '#444173'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 20px
  margin: 24px
---

## Brand & Style
The design system is engineered for cognitive ease and high-performance productivity. It adopts a **Minimalist-Glassmorphic** aesthetic, prioritizing the "flow state" by reducing visual noise and using depth to categorize information. 

The personality is professional, precise, and encouraging. It uses transparency and blurring effects to create a sense of layering without clutter, ensuring the user feels grounded in their current task. Transitions between "Focus" and "Break" states are signaled through subtle environmental shifts rather than jarring UI changes, fostering a sense of calm and rhythmic work.

## Colors
The palette is centered around **Deep Focus Indigo**, which serves as the primary canvas to minimize eye strain and anchor the user's attention. 

- **Primary (Indigo):** Used for the main background and active focus states.
- **Secondary (Sage Green):** Dedicated to "Break" states and success confirmations, promoting a sense of calm and replenishment.
- **Tertiary (Amber):** Reserved for alerts, time-sensitive notifications, or nearing the end of a session.
- **Neutral:** A range of cool slates and frosted whites are used for secondary text and borders to maintain a high-performance, technical feel.

## Typography
This design system utilizes **Geist** for all display elements and labels to evoke a precise, developer-centric efficiency. Its monospaced-influenced proportions ensure that timers and numerical data remain stable and highly legible. 

**Inter** is employed for body text and notes, providing a humanist touch that ensures long-form reading (like task descriptions or AI-generated summaries) remains comfortable. Type is scaled using a minor third ratio to maintain clear hierarchy while keeping the interface compact and focused.

## Layout & Spacing
The layout follows a **12-column fluid grid** for desktop and a **single-column fluid layout** for mobile. The spacing rhythm is strictly based on a 4px baseline, ensuring all elements align with mathematical precision.

- **Desktop:** Centralized focus area with a max-width of 1200px to prevent visual scanning fatigue.
- **Margins:** Generous outer margins (24px+) are used to create a "breathing room" effect around the central timer.
- **Reflow:** On mobile, secondary glassmorphic panels stack vertically, with the circular progress indicator maintaining a prominent top-center position.

## Elevation & Depth
Depth is created through **Glassmorphism** rather than traditional drop shadows. This design system uses three primary tiers of elevation:

1.  **Floor:** The deep indigo background (#1E1B4B), acting as the base.
2.  **Glass Panels:** Semi-transparent layers (White at 5-10% opacity) with a `20px` backdrop blur. These house primary content like task lists and notes.
3.  **Floating Elements:** Higher-contrast glass panels with a thin `1px` inner stroke (White at 20% opacity) to signify interactive elements or active modals. 

Shadows are used sparingly and are "Ambient"—low opacity, highly diffused, and tinted with the primary indigo to prevent them from looking "dirty."

## Shapes
Shapes in this design system balance organic comfort with technical precision. 

Standard components (Cards, Inputs) use a **0.5rem (8px)** corner radius. For larger containers and "Glass Panels," a **1rem (16px)** radius is preferred to soften the overall appearance of the workspace. Interactive "Chips" or status indicators utilize pill-shaping to distinguish them from actionable buttons.

## Components

### Buttons
Primary actions use a high-saturation fill (Indigo or Sage) with white text. Secondary buttons are "ghost" style with a 1px border and a subtle glass background that intensifies on hover.

### Glassmorphic Cards
Cards are the primary container. They must feature a `backdrop-filter: blur(20px)` and a soft `1px` border to define edges against the dark background. No solid backgrounds should be used for cards.

### Circular Progress Indicators
The central timer uses a thick, non-rounded stroke. The track is a low-opacity version of the state color (e.g., 10% Sage), while the progress bar is the solid state color. Numerical time is centered in Geist Bold.

### Input Fields
Inputs are "Underlined" or "Soft Boxed." They use a dark, semi-transparent fill that darkens on focus. The active cursor and label should adopt the Secondary (Sage) color to signal "Ready to record/write."

### Chips
Used for task tagging. These are small, pill-shaped elements with low-contrast backgrounds and high-contrast text to remain legible but non-distracting.

### AI Recording Feedback
A pulsed "Glow" effect using the Sage green color should emanate from the recording card to provide non-verbal feedback that audio is being captured.
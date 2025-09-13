# AI Code Generation Platform Design Guidelines

## Design Approach
**System-Based Approach**: Using modern dark UI patterns inspired by developer tools like GitHub Copilot, VS Code, and Linear for maximum usability in coding environments.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (as specified by user):
- Background: Pure black (#000000)
- Primary accent: 220 100% 60% (bright blue for CTAs)
- Secondary: 220 20% 15% (dark gray for cards/containers)
- Text primary: 0 0% 95% (near white)
- Text secondary: 0 0% 70% (muted gray)
- Success: 120 60% 50% (green for copy confirmations)
- Border: 220 20% 20% (subtle gray borders)

### B. Typography
- **Primary**: Inter or SF Pro (via Google Fonts CDN)
- **Code**: JetBrains Mono or Fira Code for code displays
- **Sizes**: text-sm (14px), text-base (16px), text-lg (18px), text-xl (20px)
- **Weights**: font-normal (400), font-medium (500), font-semibold (600)

### C. Layout System
**Tailwind Spacing**: Consistent use of 4, 6, 8, 12, 16 unit increments
- Padding: p-4, p-6, p-8
- Margins: m-4, m-6, m-8  
- Gaps: gap-4, gap-6, gap-8
- Heights: h-12 (buttons), h-64 (text areas)

### D. Component Library

**Input Components**:
- Large textarea with rounded corners (rounded-lg)
- Dark background with subtle border
- Placeholder text in muted gray
- Focus states with blue accent border

**Toggle Switch**:
- Modern pill-shaped toggle
- Clear visual indication of Normal/Advanced mode
- Smooth transition animations
- Labels clearly visible in dark theme

**Buttons**:
- Primary: Blue background with white text
- Secondary: Outlined with blue border
- Generous padding (px-6 py-3)
- Rounded corners (rounded-md)

**Code Output Area**:
- Syntax-highlighted code display
- Dark editor-like appearance
- Copy button in top-right corner
- Scrollable for long code outputs
- Monospace font family

**Cards/Containers**:
- Subtle dark gray backgrounds
- Thin borders for definition
- Rounded corners (rounded-lg)
- Proper spacing between elements

### E. Layout Structure
**Single-page application** with clean, centered layout:
- Maximum width container (max-w-4xl)
- Centered content with proper margins
- Responsive design for mobile/tablet
- Header with platform title and mode toggle
- Main content area with input/output sections
- Footer with attribution if needed

**No hero images** - This is a utility-focused developer tool requiring minimal visual distraction and maximum functional clarity.

### F. Interaction Patterns
- **Minimal animations**: Subtle hover states and focus indicators only
- **Copy feedback**: Brief success message or icon change
- **Loading states**: Simple spinner or progress indicator during code generation
- **Error handling**: Clear, non-intrusive error messages
- **Responsive behavior**: Stacked layout on mobile, side-by-side on desktop

### G. Accessibility
- High contrast ratios for all text
- Keyboard navigation support
- Screen reader friendly labels
- Focus indicators clearly visible
- Consistent dark theme across all form inputs

This design prioritizes developer experience with a clean, distraction-free interface optimized for code generation workflows.
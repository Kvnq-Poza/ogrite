# Ogrite Documentation Site

Documentation for Ogrite - the build-time OG image compiler.

## Features

- **Modern Stack**: Next.js 16 App Router, React 18, TypeScript
- **Dark Theme**: Optimized dark-first color scheme
- **Responsive Design**: Mobile-first Tailwind CSS
- **Interactive Components**: Animated buttons and navigation
- **Code Highlighting**: Syntax-highlighted code blocks

## Getting Started

### Prerequisites

- Node.js 18+
- npm 10+

### Installation & Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Project Structure

```
app/
├── components/
│   ├── Navigation.tsx              # Top navigation
│   ├── Footer.tsx                  # Footer
│   ├── CodeBlock.tsx               # Code highlighting
│   ├── FeatureCard.tsx             # Feature cards
│   ├── PipelineDiagram.tsx         # Visual diagram
│   ├── animations/                 # Animation components
│   ├── pages/                      # Page content
│   └── ui/
│       └── AnimatedButton.tsx      # Button component
├── layout.tsx                      # Root layout
├── page.tsx                        # Home page
├── globals.css                     # Global styles & theme
├── getting-started/page.tsx        # Getting started
├── docs/page.tsx                   # Documentation
└── not-found.tsx                   # 404 page
```

## Production Build

```bash
npm run build
npm start
```

## Customization

Edit theme colors in `app/globals.css`:

```css
:root {
  --accent-primary: #f59e0b;
  --text-primary: #fafafa;
  --background-primary: #0a0a0a;
  /* 60+ additional CSS variables */
}
```

## Performance

- App Router with automatic code splitting
- Tailwind CSS 4 with purged styles
- Next.js 16 optimizations

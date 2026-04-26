# project-aset-assessment-03

A reusable Next.js application created with **Template Next**.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **React Compiler** - Enabled in the scaffold
- **Tailwind CSS** - Utility-first CSS framework
- **Turbopack** - Fast local development bundler
- **Shadcn/ui preset `b1YmqvjRA`** - Pre-configured component baseline
- **AGENTS.md** - Default guidance for coding agents working in the app
- **next-themes** - Theme switching support
- **Prettier** - Code formatting with Tailwind plugin

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Seed the demo screen data:

```bash
npm run seed:screens
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
project-aset-assessment-03/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── theme-provider.tsx
│   │   └── ui/
│   └── lib/
├── public/
├── AGENTS.md
├── .prettierrc
├── .vscode/
│   └── settings.json
├── components.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── package.json
```

## Adding Components

This project uses Shadcn/ui. Add new components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint code with ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check formatting without writing changes
- `npm run seed:screens` - Seed the demo cinema screens from `src/seed/screens.ts`

## Contributing

Created with [Template Next](https://www.npmjs.com/package/@edward-hyde/template-next)

## License

MIT License

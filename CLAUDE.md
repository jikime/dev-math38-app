# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Project Architecture

This is a Next.js 15.4.2 application for a Korean academy management system (수학생각 학원 관리 시스템). The codebase uses:

- **Framework**: Next.js with App Router (React 19.1.0)
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Language**: TypeScript with strict mode enabled
- **Theme**: next-themes for dark/light mode support

### Key Directories

- `/src/app/` - Next.js app router pages
  - Main dashboard at `page.tsx`
  - Feature pages: `cloud/`, `create-problems/`, `exams/`, `materials/`, `report-card/`, `repository/`, `textbooks/`, `wrong-similar/`
- `/src/components/` - React components
  - `/ui/` - Reusable UI components (shadcn/ui based)
  - Feature-specific components for academy management
- `/src/lib/` - Utility functions

### Import Aliases

- `@/*` maps to `./src/*`
- Common usage: `@/components`, `@/lib/utils`, `@/components/ui`

### Component Patterns

The project uses shadcn/ui components configured with:
- Style: "new-york"
- Base color: slate
- CSS variables enabled
- Icon library: lucide-react

Components follow a consistent pattern with TypeScript interfaces and className utilities via `cn()` from `@/lib/utils`.

## Workflow Guidance

- Git and Issue Management:
  - Always create a git commit after completing a task
  - Create a corresponding git issue to track progress and document the task
  - Example workflow: `요청사항을 완료하면 git commit 과 git issue로 등록해줘.`

# MasterPlan - Goal Accountability App

## Project Overview

MasterPlan is a goal tracking and accountability app designed to help students stay organized, motivated and productive. The application allows users to create goals, break them down into manageable sub-goals, track their progress, and share achievements.

## Features

- Goal creation and management
- Sub-goal tracking
- Progress visualization
- Goal sharing
- Motivational quotes
- User profiles
- Dashboard with progress summary

## Tech Stack

This project is built with:

- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and development server
- **React Router**: For navigation and routing
- **TanStack Query**: For data fetching and state management
- **Tailwind CSS**: For styling with utility classes
- **shadcn/ui**: Component library built on Radix UI
- **Recharts**: For data visualization
- **UUID**: For generating unique IDs

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone <your-repo-url>

# Navigate to the project directory
cd masterplan

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
masterplan/
├── public/            # Static assets
├── src/
│   ├── components/    # React components
│   │   ├── auth/      # Authentication components
│   │   ├── dashboard/ # Dashboard components
│   │   ├── goals/     # Goal management components
│   │   ├── layout/    # Layout components
│   │   ├── profile/   # User profile components
│   │   └── ui/        # UI components (shadcn)
│   ├── contexts/      # React contexts for state management
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main App component
│   ├── main.tsx       # Entry point
│   └── index.css      # Global styles
├── index.html         # HTML template
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## Building for Production

```sh
# Build the app
npm run build

# Preview the production build locally
npm run preview
```

## Customizing

- Edit `src/index.css` to modify global styles and theme variables
- Update `tailwind.config.ts` to customize the Tailwind configuration

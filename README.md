# Stock Analysis Dashboard

<img width="1547" alt="image" src="https://github.com/user-attachments/assets/7916cb41-3b10-42f4-b4f7-7e3f890495e0" />

A comprehensive stock market analysis application built with Next.js and TypeScript. This dashboard provides real-time market data, interactive charts, sector analysis, and technical indicators to help investors make informed decisions.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [UI Components](#-ui-components)
- [Data Architecture](#-data-architecture)
- [Animations](#-animations)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Market Overview**: Real-time market indices, heatmaps, and summary statistics
- **Stock Analysis**: Detailed stock information with price history and key metrics
- **Sector Analysis**: Performance breakdown by market sectors
- **Interactive Charts**: Visualize stock price movements and technical indicators
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Animated UI**: Smooth transitions and interactive elements
- **Dark/Light Mode**: Theme support for different viewing preferences

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**:
  - [Radix UI](https://www.radix-ui.com/)
  - Custom UI components
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Hooks
- **Linting**: [Biome](https://biomejs.dev/)
- **Package Manager**: npm/yarn/pnpm/bun

## 📁 Project Structure

```
stock-analysis/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── markets/     # Market-related components
│   │   ├── ui/          # Reusable UI components
│   │   └── ...          # Other component categories
│   ├── data/            # Mock data and data utilities
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions and services
│       └── data/        # Data services and types
├── .next/               # Next.js build output
├── README.md            # Project documentation
└── ...                  # Configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stock-analysis.git
   cd stock-analysis
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🧩 UI Components

The application includes a variety of reusable UI components:

- **Data Visualization**: Charts, heatmaps, and data tables
- **Navigation**: Headers, sidebars, and navigation menus
- **Interactive Elements**: Buttons, forms, and modals
- **Layout Components**: Grids, cards, and containers
- **Animated Components**: Transitions and interactive animations

### Animated Group Component

The `AnimatedGroup` component provides easy-to-use animations for lists and groups of elements:

```tsx
import { AnimatedGroup } from "@/components/ui/animated-group";

// Example usage
<AnimatedGroup preset="fade">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</AnimatedGroup>
```

Available animation presets include:
- fade
- slide
- scale
- blur
- blur-slide
- zoom
- flip
- bounce
- rotate
- swing

## 📊 Data Architecture

The application uses a centralized data architecture designed for easy transition from mock data to real API integration.

For detailed information about the data architecture, see [README-DATA-ARCHITECTURE.md](./README-DATA-ARCHITECTURE.md).

Key components:
- **Type Definitions**: Strong typing for all data structures
- **Mock Data**: Realistic sample data for development
- **Data Services**: Interface between components and data sources
- **Formatting Utilities**: Consistent data formatting across the application

## ✨ Animations

The application uses Framer Motion for smooth, performant animations:

- **Page Transitions**: Smooth transitions between pages
- **UI Feedback**: Subtle animations for user interactions
- **Data Visualization**: Animated charts and graphs
- **Component Animations**: Entrance and exit animations for components

The `AnimatedGroup` component provides a simple way to add staggered animations to lists of elements with various animation presets.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using Next.js and TypeScript

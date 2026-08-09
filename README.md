# 🖥️ GridSense Frontend Subsystem — Deep Architectural Blueprint

> **Enterprise Next.js 15 Web Application with Real-Time Socket.IO Hydration, Floating Glassmorphic AI Copilot, `Plus Jakarta Sans` Typography, and Vercel Deployment.**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-Live%20Curves-22B5BF?style=for-the-badge)](https://recharts.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Client-010101?style=for-the-badge&logo=socketdotio)](https://socket.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Live%20Deploy-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## 🌟 Frontend Architectural Overview

The **GridSense Frontend Subsystem** is an enterprise real-time dashboard built to monitor solar farm telemetry, visualize live array power curves, display active grid fault alerts, and interact with the autonomous AI Copilot.

### 💡 Core Engineering Capabilities
1. **Hybrid Next.js 15 App Router Architecture:** Utilizes Server-Side Rendering (SSR) for instant page hydration ($<400\text{ms}$ FCP) paired with scoped Client Component boundaries (`'use client'`) for interactive socket widgets.
2. **Real-Time WebSocket State Hydration (`usePanels.ts`):** Custom hooks buffer high-frequency 2-second telemetry streams using functional state setters, eliminating parent component re-renders.
3. **Floating Glassmorphic AI Copilot Widget (`CopilotChat.tsx`):** Features one-click quick prompt chips (⚡ *System Status*, 🚨 *Active Alerts*, ✨ *Panel Beta Health*, 🛠️ *Error E01 Guide*), auto-scrolling message views, and agent execution loading states.
4. **Optimized Power Curve Visualizations (`EnergyChart.tsx`):** Renders real-time array power outputs using Recharts with memoized historical data slicing and `isAnimationActive={false}` to eliminate 300ms CSS stroke lag.
5. **Glassmorphic Dark Design System (`app/globals.css`):** Styled with Google Font `Plus Jakarta Sans`, translucent backdrop blurs (`backdrop-blur-xl`), glowing radial shadows, and high-contrast status badges.

---

## 📐 Frontend Architecture Flowchart

```mermaid
flowchart TB
    subgraph Core ["Next.js App Router Layer"]
        Layout["Root Layout - Plus Jakarta Sans Font"]
        DashboardPage["Dashboard Page - /dashboard"]
        PanelsPage["Panel Details Page - /dashboard/panels/id"]
        BillingPage["Billing Page - /dashboard/billing"]
    end

    subgraph StateAndHooks ["Custom Hooks & State Hydration"]
        AuthHook["useAuth Hook - JWT Token Management"]
        SocketHook["useSocket Hook - WebSocket Connection"]
        PanelsHook["usePanels Hook - Real-time Telemetry Buffer"]
    end

    subgraph Components ["Glassmorphic Component Architecture"]
        StatsBar["StatsBar Component - Glowing Radial Badges"]
        PanelGrid["PanelGrid & PanelCard Component - Efficiency Bars"]
        AlertFeed["AlertPanel Component - Active Fault Feed"]
        EnergyChart["EnergyChart Component - Recharts Power Curves"]
        CopilotWidget["CopilotChat Widget - Glassmorphic AI Drawer"]
    end

    Layout --> AuthHook
    AuthHook --> SocketHook
    SocketHook --> PanelsHook
    PanelsHook --> DashboardPage
    
    DashboardPage --> StatsBar
    DashboardPage --> PanelGrid
    DashboardPage --> AlertFeed
    DashboardPage --> EnergyChart
    DashboardPage --> CopilotWidget
```

---

## 🤖 Floating AI Copilot Widget Lifecycle (`CopilotChat.tsx`)

```mermaid
flowchart TD
    StateClosed([Floating Action Button: Ask AI Copilot]) -->|Click Widget| DrawerOpen[Open Glassmorphic Drawer Window]
    
    DrawerOpen --> PromptChoice{User Selection}
    
    PromptChoice -- Quick Prompt Pill --> SelectPrompt[Trigger Quick Action: e.g. System Status]
    PromptChoice -- Custom Input --> TypeQuery[User Types Custom Question]
    
    SelectPrompt --> SendAPI[POST /api/copilot/chat]
    TypeQuery --> SendAPI
    
    SendAPI --> LoadingState[Show Animated Grid Data Analysis Indicator]
    LoadingState --> ReceiveResponse[Receive Agent Structured Markdown Response]
    ReceiveResponse --> RenderBubbles[Render Glassmorphic Response Bubbles & Scroll to Bottom]
```

---

## 📡 Real-Time Socket Telemetry Hydration Flowchart

```mermaid
sequenceDiagram
    autonumber
    participant Server as Socket.IO Backend Server
    participant Hook as usePanels Hook
    participant State as React Telemetry State
    participant UI as Dashboard Components

    Server->>Hook: Broadcast Event 'panel:readings' (2s Frequency)
    Hook->>State: Update Latest Panel Readings Map
    Hook->>State: Append to readingsHistory Array Buffer
    State->>UI: Re-render PanelCards with Glowing Efficiency Gradients
    State->>UI: Update EnergyChart Power Lines
```

---

## 🎨 Design System Tokens & Color Palette

GridSense follows modern enterprise dark-mode aesthetics:

```mermaid
mindmap
  root((GridSense UI Palette))
    Primary Background
      #060D17 Deep Space Navy
    Secondary Container
      #0B172A Slate Midnight
    Glass Panels
      rgba 15 33 61 0.7 Blur 16px
    Brand Accent
      #F97316 Vibrant Solar Orange
    Status Indicators
      #10B981 Emerald Normal
      #F59E0B Amber Warning
      #F43F5E Rose Critical
```

---

## 📁 File-by-File Codebase Directory Architecture

| File Path | Primary Responsibility |
| :--- | :--- |
| **`app/layout.tsx`** | Root layout loading Google Font `Plus Jakarta Sans`, Razorpay SDK, `AuthProvider`, and `ToastProvider`. |
| **`app/globals.css`** | Tailwind directives, `.glass-panel` backdrop blurs, glow utilities, and custom scrollbars. |
| **`app/(dashboard)/dashboard/page.tsx`** | Main telemetry dashboard coordinating real-time hooks, expiry notices, and dashboard views. |
| **`app/(dashboard)/dashboard/panels/[id]/page.tsx`** | Individual panel diagnostic view displaying granular voltage, current, power, and thermal gauges. |
| **`app/(dashboard)/dashboard/billing/page.tsx`** | Subscription billing center displaying plan cards (`FREE`, `PRO`, `ENTERPRISE`) and payment histories. |
| **`components/CopilotChat.tsx`** | Floating AI Copilot drawer with quick action chips, auto-scrolling message views, and loading states. |
| **`components/dashboard/PanelCard.tsx`** | Glassmorphic panel card with glowing efficiency progress bars, telemetry readouts, and fault icons. |
| **`components/dashboard/StatsBar.tsx`** | High-contrast metric cards with radial glowing icons displaying power, generation, and health scores. |
| **`components/dashboard/AlertPanel.tsx`** | Vertical live fault feed component displaying severity badges (`CRITICAL`, `WARNING`). |
| **`components/dashboard/EnergyChart.tsx`** | Live power output chart rendered via Recharts with memoized historical data slicing. |
| **`hooks/useAuth.ts`** | Authentication context hook managing JWT token state and `localStorage` persistence. |
| **`hooks/useSocket.ts`** | Socket.IO connection hook managing WebSocket connections and authentication handshakes. |
| **`hooks/usePanels.ts`** | Telemetry hydration hook buffering 2-second readings in React state without parent re-renders. |
| **`lib/api.ts`** | Axios HTTP client instance configuring base URLs and automatic JWT Bearer request headers. |

---

## 🚀 Development & Production Build Commands

```bash
# Navigate to client directory
cd client

# Install Dependencies
npm install

# Run Development Server (http://localhost:3000)
npm run dev

# Compile Production Build
npm run build
```

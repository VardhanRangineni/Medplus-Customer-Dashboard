# MedPlus Customer Dashboard | Technical Documentation

**Version:** 2.0.0  
**Status:** Waiting for the review  
**Last Updated:** December 2025

---

## 1. Executive Summary
The **MedPlus Customer Dashboard** is an enterprise-grade analytics platform designed to empower stakeholders with actionable insights into sales performance, customer retention, and operational efficiency. By leveraging a hierarchical data model and real-time client-side aggregation, the application provides instant visibility into key performance indicators (KPIs) across multiple organizational levels—from State to individual Managers.

The platform features a bespoke "Indigo & Slate" design system, ensuring a premium, accessible, and responsive user experience across all devices.

---

## 2. System Architecture

The application follows a **Component-Based Architecture** powered by React.js, utilizing a unidirectional data flow.

```mermaid
graph TD
    User[User Interaction] -->|Selects Filter| App[App.js Controller]
    App -->|Updates State| StateMgr[State Management]
    StateMgr -->|Triggers| Aggregator[Data Aggregator Utility]
    
    subgraph Data Layer
        MockData[Mock Data Provider] --> Aggregator
    end
    
    Aggregator -->|Returns Aggregated Object| App
    App -->|Passes Props| Dashboard[DashboardSections Component]
    App -->|Passes Props| FilterBar[FilterBar Component]
    
    Dashboard -->|Renders| Charts[Chart.js Visualizations]
    Dashboard -->|Renders| KPIs[KPI Cards]
    Dashboard -->|Renders| Tables[Data Tables]
```

### 2.1 Core Technologies
*   **Frontend Framework**: React 18 (Functional Components, Hooks)
*   **State Management**: React Context / Local State (useState, useMemo)
*   **Visualization Engine**: Chart.js with React-Chartjs-2 wrapper
*   **Styling Engine**: CSS Variables (Custom Properties) & React Bootstrap Grid
*   **Build Tool**: Create React App (Webpack/Babel)

---

## 3. Data Integration Strategy

The application is architected to be agnostic of the data source, currently utilizing a **Mock Data Layer** for development and prototyping purposes. This allows for rapid UI/UX iteration without backend dependencies.

### 3.1 Current Implementation (Mock Mode)
*   **Source**: Static JSON files located in `src/Assets/`.
*   **Processing**: Client-side aggregation via `src/utils/dataAggregator.js`.
*   **Purpose**: Simulates the hierarchical data structure (State -> Area -> Supervisor) to validate frontend logic and visualization components.

### 3.2 Future Backend Integration
The production roadmap involves replacing the mock layer with a robust RESTful API or GraphQL endpoint.
*   **API Pattern**: The frontend expects a JSON payload matching the component interfaces.
*   **Server-Side Aggregation**: Heavy computational tasks (summing KPIs, cohort analysis) will be offloaded to the backend to improve performance at scale.
*   **Authentication**: JWT-based authentication will be implemented to secure data access based on user roles (e.g., Manager vs. Regional Director).

---

## 4. Component Reference

### 4.1 `App.js` (Root Controller)
Acts as the single source of truth for the application state.
*   **Responsibilities**:
    *   Maintains filter state (`selectedState`, `selectedArea`, etc.).
    *   Memoizes derived lists (e.g., list of Supervisors for the current State).
    *   Orchestrates data flow between the Aggregator and UI components.

### 4.2 `DashboardSections.js` (Presentation Layer)
A pure presentational component responsible for rendering the visualized data.
*   **Props**:
    *   `data`: The fully aggregated data object.
    *   `selectedState`: Used for conditional rendering (e.g., Confetti effects).
*   **Sub-components**:
    *   `Bar` (Revenue Trends)
    *   `Line` (MAU/DAU)
    *   `Doughnut` (Segmentation)

### 4.3 `FilterBar.js` (Control Layer)
Provides the interface for data slicing.
*   **Features**:
    *   **Context Awareness**: Disables "Area" dropdown until a "State" is selected.
    *   **Custom UI**: Replaces native `<select>` with styled `Dropdown` components for brand consistency.

---

## 5. Functional Modules

The dashboard is divided into four primary analytical sections, each targeting a specific aspect of business performance.

### 5.1 KPIs & Customer Segmentation
This section provides a high-level health check of the business.
*   **Key Performance Indicators (KPIs)**:
    *   **DAU/MAU Ratio**: Measures user engagement stickiness (Target: >25%).
    *   **Today's Active Users**: Real-time count of unique users active in the last 24 hours.
    *   **Total Revenue**: Aggregate revenue with a "Confetti" celebration effect when targets are met.
    *   **MTD Pharma Plans**: Month-to-date sales count of pharmaceutical plans.
*   **Visualizations**:
    *   **Customer Split by Purchase Value** (Bar Chart): Segments users based on their spending tiers.
    *   **Customer Split by Channel** (Pie Chart): Analyzes the distribution of users across different acquisition channels (Online, In-store, App).
    *   **Top Customers** (Table): A leaderboard of high-value clients sorted by purchase volume.

### 5.2 Sales & Invoice Analytics
Focuses on financial metrics and transaction behaviors.
*   **Revenue Split by Channel** (Pie Chart): Break down of total revenue by sales channel.
*   **Revenue Split by Type** (Bar Chart): Categorizes revenue into different product or service types.
*   **Invoice Split by Purchase Slab** (Bar Chart): Shows the distribution of invoice values, helping identify average basket sizes.
*   **Average Invoice Count** (Bar Chart): Tracks the frequency of invoicing over time.

### 5.3 Trend Panel
Provides time-series analysis to identify growth patterns and anomalies.
*   **Monthly Revenue Trend** (Line Chart): Visualizes revenue trajectory with a filled area chart for better impact.
*   **MAU & DAU Trends** (Multi-Line Chart): Overlays Monthly Active Users against Daily Active Users to track engagement growth.
*   **New Customer Acquisition** (Line Chart): Tracks the rate of new user onboarding.
*   **Customer Churn %** (Line Chart): Monitors the percentage of users leaving the platform, highlighting retention risks.

### 5.4 Customer Retention
A deep dive into user lifecycle and loyalty.
*   **Cohort Analysis** (Heatmap Table): Tracks user retention rates over a 12-month period (M0 to M12). Cells are color-coded (Green opacity) to visually indicate retention strength.
*   **Retention by Category** (Table): Breaks down retention metrics by specific product categories (e.g., Pharma Brand, Pharma Generic, Surgical), allowing for granular analysis of product stickiness.

---

## 6. Design System Specifications

The UI is built upon a strict set of design tokens defined in `src/styles/dashboard.css`.

### 6.1 Color Theory
| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--primary-color` | `#4f46e5` | Primary actions, active states, key data points |
| `--surface-color` | `#ffffff` | Card backgrounds, modal windows |
| `--background-color` | `#f8fafc` | Global application background |
| `--text-secondary` | `#64748b` | Labels, secondary metadata |

### 6.2 Typography
*   **Display Font**: `Outfit` (Weights: 500, 600, 700) - Used for KPIs and Section Headers.
*   **Body Font**: `Inter` (Weights: 400, 500) - Used for tables, charts, and controls.

---

## 7. Development Standards

### 7.1 Code Style
*   **Functional Programming**: Prefer pure functions for logic (e.g., aggregators).
*   **Hooks Pattern**: Use `useMemo` for expensive calculations to ensure 60fps rendering.
*   **Component Composition**: Break down complex UIs into smaller, reusable atoms.

### 7.2 Performance Optimization
*   **Memoization**: The `areas`, `supervisors`, and `managers` lists are memoized to prevent unnecessary recalculations during re-renders.
*   **Lazy Evaluation**: Data aggregation only runs when filter dependencies change.

---

## 8. Setup & Deployment

### 8.1 Local Development Environment
```bash
# Clone repository
git clone <repo-url>

# Install dependencies
npm install

# Start development server (Hot Reloading enabled)
npm start
```

### 8.2 Production Build
The application is optimized for static hosting (S3, Vercel, Netlify).
```bash
# Generate production bundle
npm run build
```
*Output*: A minified, tree-shaken `build/` directory ready for deployment.

---

**Confidentiality Notice**: This software and its documentation are proprietary to MedPlus. Unauthorized distribution is strictly prohibited.

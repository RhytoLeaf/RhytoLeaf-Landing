# EconoFlo - Economics 101 Product Requirements Document

## Product Overview

**Product Name:** EconoFlo

**Version:** 1.0

**Last Updated:** February 4, 2026

**Product Type:** Interactive Financial Visualization & Education Tool

### Mission Statement

EconoFlo is designed to demystify the "Time Value of Money" through immersive, generative visualizations. By transforming abstract financial formulas into dynamic particle systems and interactive charts, it empowers students and curious minds to visualize how capital grows, flows, and compounds over time.

---

## Executive Summary

EconoFlo is a single-page web application that combines a robust financial calculator with a creative coding environment. Built using **p5.js**, the tool allows users to input core financial variables—Principal, Periodic Annuity, Interest Rate, and Time—and witness a real-time procedural representation of their wealth's trajectory.

### Core Value Proposition

* **Generative Art for Finance:** Uses procedural "seeds" to create unique visual signatures for financial data.
* **Real-Time Simulation:** Instantaneous feedback loop between parameter adjustment and visual output.
* **Educational Scaffolding:** Integrated definitions and mathematical breakdowns for complex economic terms.
* **High-Fidelity Aesthetics:** A premium "FinTech" aesthetic utilizing dark mode and sophisticated typography.

---

## User Personas

### Primary Persona: The Finance Student

* **Profile:** Currently enrolled in Econ 101 or Corporate Finance.
* **Pain Point:** Struggles to conceptualize the difference between linear and exponential growth or the impact of compounding.
* **Goal:** To see a "physical" representation of how interest builds over 30 years versus 5 years.

### Secondary Persona: The Data Artist/Hobbyist

* **Profile:** Interested in creative coding and data visualization.
* **Pain Point:** Finds traditional spreadsheets and financial charts boring and static.
* **Goal:** To explore the intersection of math, money, and generative art.

---

## Feature Requirements

### 1. Generative Visualization Engine (p5.js)

**Priority:** P0 (Must Have)

**Description:** The heart of the app—a dynamic canvas that renders financial growth as a particle system or "flow."

**Requirements:**

* **Procedural Seeds:** Every calculation can be rendered through different "seeds" (1 to 999,999) to change the visual pattern.
* **Growth Visualization:** Particle density and flow speed should correlate with interest rates and principal amounts.
* **Canvas Controls:** Ability to randomize seeds, navigate seeds sequentially, and download the canvas as a PNG.

---

### 2. Time Value of Money (TVM) Calculator

**Priority:** P0 (Must Have)

**Description:** A sidebar interface for inputting financial data and viewing immediate mathematical results.

**Input Fields:**

* **Principal ($):** Initial investment amount.
* **Periodic Annuity ($):** Regular contributions made each period.
* **Interest Rate (%):** Annual or periodic rate.
* **Periods (N):** Number of compounding cycles (years/months).

**Output Displays:**

* **Future Value (FV):** The total value at the end of the term.
* **Present Worth (PW):** The current value of the total future sum.
* **Interest Earned:** The total profit generated over the term.

---

### 3. Educational Information System

**Priority:** P1 (Should Have)

**Description:** A modal-based glossary that explains the variables used in the calculator.

**Requirements:**

* Info icons (ⓘ) next to each input label.
* Overlays containing:
* **Definitions:** Plain-English explanations.
* **Formula Insight:** How the specific variable impacts the math (e.g., "The Power of n").
* **Pro Tips:** Practical financial advice related to that variable.



---

### 4. Interactive Sidebar & UI

**Priority:** P0 (Must Have)

**Description:** A glass-morphism sidebar for navigation and parameter control.

**Requirements:**

* **Tabbed Navigation:** Switch between "Visualization" controls and "Documentation/About."
* **Reset Functionality:** A "Reset to Default" button to clear experimental values.
* **Responsive Layout:** Sidebar should collapse or adjust for mobile/tablet viewing.

---

## Technical Architecture

### Frontend Stack

* **HTML5/CSS3:** Grid-based layout with custom animations (`fadeInUp`, `gridMove`).
* **p5.js:** Canvas rendering and particle system logic.
* **Google Fonts:** - *Instrument Serif:* For headings and a classic academic feel.
* *JetBrains Mono:* For data, numbers, and code-like precision.
* *DM Sans:* For body text and readability.



### Design System

* **Theme:** "Deep Void" (Dark Mode).
* **Colors:**
* Background: `#0a0e1a`
* Accent (Cyan): `#38bdf8`
* Grid Lines: `rgba(56, 189, 248, 0.08)`


* **Styling:** Glass-morphism (blur: 12px), high-contrast borders, and neon glow effects.

---

## Mathematical Logic

The application uses standard financial engineering formulas:

**Future Value (FV) Calculation:**

```javascript
FV = (P * (1 + i)^n) + (A * (((1 + i)^n - 1) / i))

```

*Where P = Principal, A = Annuity, i = interest rate, n = periods.*

---

## User Flows

1. **The Explorer Flow:**
* User lands on the page and sees the default visualization.
* User changes the "Interest Rate" to 15% and watches the particle flow accelerate.
* User clicks "Randomize Seed" to find a visual pattern they like.
* User hits "Download PNG" to save the artwork.


2. **The Student Flow:**
* User opens the "Periodic Annuity" info modal to understand how it differs from Principal.
* User inputs their real-world savings goals.
* User reviews the "Future Value" vs. "Total Interest Earned" to understand the impact of compounding.



---

## Success Metrics

* **Visual Engagement:** Number of seed changes per session.
* **Educational Depth:** Percentage of users who open more than two info modals.
* **Retention:** Return visits to use the calculator for different financial scenarios.

---

## Future Enhancements

* **Multi-Graph View:** Compare two different interest scenarios side-by-side.
* **Inflation Adjustment:** A toggle to see "Real Value" vs. "Nominal Value."
* **Export to CSV:** Ability to download a period-by-period breakdown of growth.

---

## Document Control

**Owner:** RhytoLeaf

**Status:** Approved / Active

**Last Modified:** Feb 4, 2026
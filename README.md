
# GeoGaurd
### Geographic Fraud Risk Analyzer

GeoGaurd is a full-stack FinTech application designed to identify potentially fraudulent financial transactions through geographic analysis.

By analyzing transaction locations, timestamps, geographic distances, and estimated travel times, GeoGaurd aims to detect suspicious transaction patterns, particularly **impossible-travel scenarios**.

The goal of GeoGaurd is not to replace existing fraud detection systems, but rather to provide financial institutions with an **additional layer of fraud protection** through geographic risk analysis.

## Project Overview

Financial fraud continues to be a significant concern for financial institutions and consumers.

GeoGaurd explores how geographic information can help identify suspicious financial activity.

For example, if two transactions occur in distant locations within an unrealistically short period, GeoGaurd can evaluate whether traveling between those locations would have been physically possible.

By identifying these geographic inconsistencies, GeoGaurd aims to provide additional information that can support fraud investigations.

## Key Features

### 1. Synthetic Transaction Generation
- Generates synthetic financial transactions using Faker.js.
- Simulates legitimate and potentially fraudulent transaction scenarios.
- Generates transaction details such as amounts, timestamps, transaction types, and geographic locations.
- Enables testing without using real customer financial data.

### 2. Geographic Fraud Analysis
- Calculates geographic distances between transaction locations.
- Analyzes timestamps to determine the time available between transactions.
- Uses estimated travel times to evaluate geographic feasibility.
- Identifies potentially impossible-travel scenarios.

### 3. Database Integration
- Uses Supabase to store and retrieve generated transaction data.
- Supports communication between the database and backend.

### 4. Transaction Dashboard
- Developed using React and TypeScript.
- Displays transaction activity and fraud-related statistics.
- Retrieves generated transaction data through the backend.
- Provides a foundation for future fraud monitoring features.

### 5. OpenRouteService API Integration
- Uses OpenRouteService to obtain road-routing information.
- Calculates estimated driving distances and travel durations when supported routes are available.
- Compares travel estimates with transaction timestamps.
- Helps identify geographically suspicious transaction sequences.

## How GeoGaurd Works

GeoGaurd analyzes financial transactions through four main steps:

**Step 1: Receive Transaction Data**

The system receives transaction details, including geographic locations, timestamps, and transaction types.

**Step 2: Analyze Geographic Information**

GeoGaurd calculates distances between consecutive transactions and examines their geographic relationship.

**Step 3: Evaluate Travel Feasibility**

The application compares the amount of time between transactions with estimated travel requirements.

**Step 4: Identify Suspicious Activity**

If the travel requirements appear inconsistent with the available time, GeoGaurd identifies the transaction sequence as potentially suspicious.

These results are intended to provide additional geographic context rather than independently confirm fraudulent activity.

## Technology Stack

| Category | Technology |
|----------|------------|
| Programming Languages | JavaScript, TypeScript |
| Frontend | React |
| Backend | Node.js |
| Database | Supabase |
| Geographic Routing API | OpenRouteService |
| Synthetic Data Generation | Faker.js |
| UI/UX Design | Figma |
| Development Environment | Visual Studio Code |
| Version Control | Git & GitHub |

## Current Development Progress

The following functionality has been developed:

- [x] Initial project setup
- [x] Synthetic transaction generation
- [x] Simulated fraud scenarios
- [x] Supabase database integration
- [x] Geographic distance calculations
- [x] Travel feasibility analysis
- [x] Initial UI/UX design
- [x] React dashboard implementation
- [x] Dashboard integration with generated transaction data

GeoGaurd is currently under active development.

Some application pages still use placeholder information while backend integration continues.

## Future Development

Planned improvements include:

- [ ] Replace hardcoded data on the Transactions page with generated transactions.
- [ ] Integrate a realistic, interactive geographic map.
- [ ] Display transaction locations and geographic relationships.
- [ ] Connect the Fraud Alerts page to backend analysis results.
- [ ] Improve handling of different transportation scenarios.
- [ ] Incorporate additional geographic risk factors, including GPS accuracy.
- [ ] Improve analysis of merchant and device location inconsistencies.
- [ ] Explore geographic risk scoring.
- [ ] Expand testing and improve application reliability.

## Project Purpose

GeoGaurd is being developed as an educational FinTech project focused on exploring geographic fraud detection techniques.

Its long-term objective is to demonstrate how geographic risk analysis could complement existing financial fraud prevention systems by providing additional information to support suspicious transaction investigations.

## Project Status

**Status:** In Development

GeoGaurd is currently a prototype that uses synthetic transaction data for development and testing.

It is not intended for production financial fraud detection in its current state.

## Acknowledgments

Special thanks to **Tejan Dolas**, my mentor, for introducing the original project idea and providing guidance throughout the development process.

This project is being developed as part of a professional shadowing program and has provided valuable hands-on experience in full-stack development, database integration, API implementation, and financial technology.

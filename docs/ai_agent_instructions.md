# Car Inspection App - AI Agent Implementation Guide

This document serves as the master blueprint for AI Agents to build and implement the Car Inspection Mobile Application. It is derived from the official Implementation Plan and provides a structured roadmap, technical specifications, and step-by-step instructions.

## 1. Project Overview
The Car Inspection App is a self-guided, AI-assisted mobile application that allows non-experts to perform professional vehicle inspections.

- **Primary Goal:** Enable high-quality, photo-documented vehicle inspections.
- **Core Value:** Automated image validation and offline-first reliability.
- **Target Platform:** Mobile (iOS/Android) via Expo.

## 2. Technical Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React Native (Expo SDK 51), Expo Router, TypeScript |
| **State Management** | Zustand (Global), React Query (Server-side) |
| **Local Database** | SQLite (Offline-first data storage) |
| **Backend** | AWS Lambda (Node.js), API Gateway |
| **Authentication** | AWS Cognito (Proxy) |
| **Cloud Storage** | AWS S3 (Images & Reports) |
| **Cloud Database** | AWS RDS (PostgreSQL) + DynamoDB (Sync tracking) |
| **AI/ML** | AWS Rekognition (Scene classification) + On-device Blur Detection |

## 3. Milestone Roadmap (2-Week MVP)

### Week 1: Foundation, Camera & Offline Core
- **Day 1: Project Initialization**
    - Initialize Expo project with TypeScript.
    - Set up folder structure: `/src/components`, `/src/hooks`, `/src/services`, `/src/store`.
- **Day 2: Authentication Flow**
    - Implement login/signup using AWS Cognito.
    - Secure storage for JWT tokens using `Expo.SecureStore`.
- **Day 3: Local Database & Sync Logic**
    - Setup SQLite schema for inspections and image metadata.
    - Implement a local sync queue for outgoing data.
- **Day 4: AI Camera Foundation**
    - Integrate `expo-camera`.
    - Implement real-time guide overlays for specific car angles.
- **Day 5: Image Validation (Part 1 - Quality)**
    - Implement Blur Detection (Laplacian variance algorithm).
    - Implement Luminance/Brightness checks.
- **Day 6: Image Validation (Part 2 - Stability)**
    - Implement accelerometer-based shake detection.
    - Implement scale/distance heuristics.
- **Day 7: Week 1 Integration**
    - Combine camera with validation layers.
    - Perform end-to-end local testing.

### Week 2: Inspection Flow, AWS Backend & Polish
- **Day 8: Inspection Wizard**
    - Build a 25-point multi-step form (Exterior, Interior, Mechanical, Tyres, Documents).
- **Day 9: Summary & Review**
    - Create a screen for users to review all photos and data before submission.
- **Day 10: AWS Backend - Core API**
    - Develop AWS Lambda functions for inspection metadata processing.
    - Set up API Gateway endpoints.
- **Day 11: Cloud Storage (S3)**
    - Implement presigned URL logic for secure image uploads from the app.
- **Day 12: Background Sync Worker**
    - Implement NetInfo monitoring.
    - Background task to process the SQLite sync queue when online.
- **Day 13: Report Generation**
    - Lambda-based PDF generation (using the 25 points and S3 images).
    - Store generated reports in S3.
- **Day 14: Final Polish & EAS Build**
    - UI/UX refinements.
    - Trigger EAS production builds for iOS and Android.

## 4. Key Implementation Details

### Image Validation Pipeline (6 Layers)
1. **Bounding Box:** Visual guides on the camera UI.
2. **Blur Detection:** Laplacian variance check to ensure focus.
3. **Luminance:** Check if the environment is too dark/bright.
4. **Distance/Scale:** Ensure the car part fits correctly in frame.
5. **Stability:** Ensure the device is held still during capture.
6. **Scene Classification:** (Optional/Cloud-side) AWS Rekognition to verify "Engine Bay" actually contains an engine.

### Offline-First Strategy
- All inspections are saved locally first.
- Images are stored in the app's document directory.
- `NetInfo` listens for connectivity changes.
- A dedicated sync service retries uploads until successful.

## 5. Next Steps for AI Agent
1. **Initialize Workspace:** Run `npx create-expo-app@latest -t expo-template-blank-typescript`.
2. **Setup Directories:** Create the recommended folder structure.
3. **Dependency Installation:** Install `expo-camera`, `expo-sqlite`, `expo-secure-store`, `lucide-react-native`, `zustand`.
4. **Begin Day 1 Tasks.**

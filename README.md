# HRMS Lite - Frontend

## 🚀 Overview
The frontend of HRMS Lite is a sleek, modern **React** application built with **Vite**. It provides an intuitive interface for HR administrators to manage personnel and track daily attendance with real-time feedback.

## 🎨 Design Philosophy
- **Modern Aesthetics**: Vibrant colors, clean typography (DM Sans), and a glassmorphic feel.
- **Responsive**: Fully functional on mobile, tablet, and desktop.
- **State Aware**: Built-in loading, empty, and error states for a premium user experience.

## 🛠 Tech Stack
- **React 18**: Component-based UI library.
- **Vite**: Ultra-fast development environment and bundler.
- **React Router 6**: Client-side routing for seamless navigation.
- **Vanilla CSS**: Custom CSS Modules for precise, high-performance styling.

## 📁 Key Directories
- `src/pages/`: Main views (Dashboard, Employees, Attendance).
- `src/components/`: Reusable UI elements (Layout, Loading, ErrorState).
- `src/api/`: Custom API client wrapper for backend communication.
- `src/App.jsx`: Root component and routing configuration.

## ⚙️ Environment Variables
Required variables in `.env`:
- `VITE_API_URL`: The base URL of your FastAPI backend (e.g., `http://localhost:8000`).

## 🛠 Setup
1. `npm install`
2. Configure `.env` with your backend URL.
3. `npm run dev`

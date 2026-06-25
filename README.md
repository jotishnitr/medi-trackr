<div align="center">

<img src="public/icon.png" alt="MediTrackr Logo" width="80" />

# MediTrackr

**Personal health operating system — track medicines, vitals, and daily wellness.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-jotishnitr.github.io%2Fmedi--trackr-blue?style=for-the-badge)](https://jotishnitr.github.io/medi-trackr/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-EF0176?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

</div>

---

## Overview

MediTrackr is a client-side health management app built with React. It helps users manage their prescriptions, get browser-based medication reminders, track daily vitals, and look up verified drug information — all stored locally with no backend required.

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | Overview of active medicines, today's schedule, and vitals snapshot |
| **My Medicines** | Full prescription list with dosage, type, instructions, and status |
| **Reminders** | Timeline view of today's doses with TAKEN / PENDING / MISSED tracking and browser push notifications |
| **Search Medicines** | Live drug lookup via the [FDA OpenFDA API](https://open.fda.gov/apis/drug/label/) with usage and warnings |
| **Health Log** | Log daily vitals (heart rate, blood pressure, weight) and symptoms |
| **Profile** | Personal health card — name, age, blood type, height, weight, allergies, emergency contact |

---

## Tech Stack

- **React 19** — UI and state management
- **Vite 8** — build tooling
- **Framer Motion** — page transition animations
- **Web Notifications API** — browser push reminders
- **OpenFDA Drug Label API** — medicine search
- **localStorage** — persistent client-side storage
- **GitHub Pages** — deployment

---

## Getting Started

```bash
# Clone
git clone https://github.com/jotishnitr/medi-trackr.git
cd medi-trackr

# Install
npm install

# Dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Custom Notification Sound

MediTrackr plays `notificationSound.mp3` from the `public/` folder when a reminder fires.

To use your own sound:

1. Get any `.mp3` file
2. Rename it to `notificationSound.mp3`
3. Drop it into the `public/` folder (replace existing)
4. Redeploy:
```bash
   npm run deploy
```

Sound only plays if **Notification Sound** toggle is enabled in the Reminders settings panel.

---

## Deployment

Deployed via `gh-pages` to GitHub Pages.

```bash
npm run deploy
```

Live at: [https://jotishnitr.github.io/medi-trackr/](https://jotishnitr.github.io/medi-trackr/)

---

## Project Structure

```
medi-trackr/
├── public/               # Static assets (icons, sounds)
├── src/
│   ├── App.jsx           # Root component, global state, notification loop
│   ├── Navbar.jsx        # Sidebar + mobile drawer navigation
│   ├── Dashboard.jsx     # Home overview
│   ├── MyMedicines.jsx   # Prescription list with search
│   ├── Reminders.jsx     # Schedule timeline + notification settings
│   ├── SearchMedicine.jsx# FDA API medicine lookup
│   ├── HealthLog.jsx     # Vitals and symptom logger
│   ├── ProfileModal.jsx  # User health profile
│   └── utils/
│       └── medicineUtils.jsx  # Status calculation logic
├── vite.config.js
└── package.json
```

---

## Screenshots

<img width="1512" height="788" alt="image" src="https://github.com/user-attachments/assets/200b7f77-e1ce-4f62-9595-aafb0e97d99b" />

---

## License

MIT © [Jotish](https://github.com/jotishnitr)

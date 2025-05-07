# PDF Explorer

A minimal yet professional React + Vite application that lets you browse a folder of PDFs (including any nested sub‑folders) and view multiple files side‑by‑side using a tabbed interface.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser, click **Pick folder…**, select any directory that contains PDF files, and start exploring.

## Build for production

```bash
npm run build
npm run preview   # Optional: test the build locally
```

## Features

- **Folder picker** – Uses the File‑System Access API (`webkitdirectory`) so the user can select an entire directory tree at once (Chrome/Edge/Opera/etc.).
- **Automatic recursion** – All PDFs in the chosen folder and every sub‑folder are detected instantly.
- **Material UI** – Clean & familiar look‑and‑feel with accessible components.
- **Tabs** – Open many PDFs at once and switch between them easily.
- **Rich viewer** – Powered by [`react‑pdf‑viewer`](https://react-pdf-viewer.dev) with built‑in zoom, search, page navigation, and full‑screen.
- **100 % client‑side** – No backend needed; everything runs securely in the browser.

## Browser support & limitations

- Folder picking (`webkitdirectory`) currently works in Chromium‑based browsers. Firefox can still be used by selecting multiple files manually.
- Because web apps cannot read the user’s disk arbitrarily, the user must actively choose the folder first.

---
**License:** MIT

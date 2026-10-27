# PlaceTrack Frontend &mdash; React.js + Vite

Responsive single-page web dashboard for the Student Placement Management System built with React.js and Vite.

---

## 🚀 Prerequisites
- **Node.js:** v18+ (`node -v`)
- **npm:** v9+ (`npm -v`)

---

## 🛠️ Setup & Installation

1. Enter this frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment (Optional):
   By default, the application connects to `http://localhost:8080/api`. If your backend runs on a different port or host, create `.env`:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

---

## 🏃‍♂️ How to Run Locally

Start Vite development server:
```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 📦 Production Build
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 📤 Pushing to Your Frontend GitHub Repository
When ready to publish this frontend separately:
```bash
cd frontend
git init
git add .
git commit -m "feat: complete React Vite placement management frontend"
git branch -M main
git remote add origin https://github.com/<your-username>/placement-management-frontend.git
git push -u origin main
```

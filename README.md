# Nexcribe Frontend

React 18 + Vite + Tailwind CSS

## Quick start

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# App runs at http://localhost:5173
```

## Build for production

```bash
npm run build
# Output in dist/
```

## Project structure

```
src/
  api/           Axios client + all endpoint functions
  components/
    layout/      PublicLayout, DashboardLayout, Sidebar, Topbar, Nav
    ui/          Spinner, Modal, EmptyState
  features/
    landing/     Landing page
    auth/        Login, Register, ForgotPassword, ResetPassword, Verify, Profile
    dashboard/   Dashboard home with wallet summary + quick actions
    plans/       Plan browser + purchase modal (M-Pesa / card)
    affiliates/  Referral link, commission cascade bars, commission history
    writing/     Job listings, job detail, apply + submit flow
    transcription/ Task listings, claim, inline audio player, transcript editor
    games/       Game lobby, individual game play (quiz, slots, word puzzle, typing)
    wheel/       Canvas lucky wheel with server-side spin
    payments/    Wallet cards, transaction history, withdrawal modal
    notifications/ Notification feed with mark-read
  router/        All routes (public + protected)
  store/         Zustand auth store (persisted)
  utils/         formatters (fmtUSD, fmtKES, fmtDate), helpers, constants
```

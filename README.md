# PharmaLink - Angular front end

[![Angular 20](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![API](https://img.shields.io/badge/Backend-.NET_API-512BD4?logo=dotnet&logoColor=white)](https://github.com/HosamAyoub/PharmaLink)

PharmaLink brings pharmacies into one place: find a medicine, see which nearby pharmacy has it in stock, get AI-suggested alternatives when it's out, and order it.

This repository is the **Angular front end**. The ASP.NET Core Web API lives in **[HosamAyoub/PharmaLink](https://github.com/HosamAyoub/PharmaLink)**.

**Live demo:** https://pharma-link.runasp.net

## One app, three roles

**Customers**
- Browse medicines by category, search, and view drug details
- Find pharmacies on a Google Map and browse each pharmacy's products
- Favorites, cart and checkout (cash on delivery or Stripe)
- AI chatbot (Google Gemini) that suggests alternative medicines
- Profile page

**Pharmacies**
- Dashboard and analytics charts (Chart.js)
- Inventory management
- Incoming orders and requests in real time (SignalR)

**Admins**
- Dashboard across the whole platform
- Manage medicines, pharmacies, users and orders, with live order updates (SignalR)

**Accounts**
- Customer and pharmacy sign-up, email confirmation, login with JWT
- Pending and suspended states for pharmacy accounts
- Role-based route guards

## Tech stack

| Area | Tools |
|---|---|
| Framework | Angular 20, TypeScript, RxJS |
| UI | Bootstrap 5, custom shared components (toasts, alerts, loaders) |
| Real time | SignalR (`@microsoft/signalr`) |
| Maps | Google Maps (`@angular/google-maps`) |
| AI | Google Gemini API |
| Charts | Chart.js |
| Backend | [PharmaLink .NET API](https://github.com/HosamAyoub/PharmaLink) with JWT auth |

## Project structure

```text
src/app/
  core/                 checkout service, environment helpers, guards
  features/
    auth/               login, sign-up, pharmacy sign-up, email confirmation
    client-dashboard/   home, products, pharmacies, maps, cart, favorites, AI chatbot
    pharmacy-dashboard/ dashboard, inventory, orders, analytics
    admin-dashboard/    dashboard, medicines, pharmacies, users, orders
  shared/               reusable components, directives, guards, enums
```

## Getting started

```bash
npm install
npm start          # ng serve, opens http://localhost:4200
npm run build      # production build in dist/
```

Set your own keys and API URL in `src/environments/environment.ts` (see `environment.prod.template.ts`):

- `apiBaseUrl` and `apiHubsUrl` - the PharmaLink API
- `googleMapsApiKey` - Google Maps
- `geminiApiKey` - Google Gemini

Never commit real keys.

## Team

Built as the graduation project of ITI's Full-Stack .NET program by a team led by [Hosam Ayoub](https://github.com/HosamAyoub). See the [contributors](https://github.com/HosamAyoub/PharmaLink-Angular/graphs/contributors).

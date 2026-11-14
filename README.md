# Tu Firma Digital - Collaborative Platform

## Project Overview

Tu Firma Digital is a comprehensive collaboration platform designed to streamline team workflows, enhance communication, and boost productivity.

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios (HTTP Client)

## Features

- Real-time Collaboration
- Task Management
- Secure Communication
- User Authentication
- Responsive Design

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/tu-firma-digital.git
```

2. Install dependencies
```bash
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
- In the [Firebase Console](https://console.firebase.google.com/), open **Project settings > General > Your apps** and select your web app (register one if needed).
- Copy the values from **SDK setup and configuration > Config** into the matching `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local`. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is optional.
- Use the web app configuration, not a service account private key. Never put private credentials in `NEXT_PUBLIC_*` variables: they are included in the browser bundle.
- Restart the development server after changing `.env.local`. For production, configure these variables before running the build.

If startup fails with `Firebase: Error (auth/invalid-api-key)`, first check that `.env.local` exists in the project root and that `NEXT_PUBLIC_FIREBASE_API_KEY` contains your Firebase web app's `apiKey`, then restart the server. If it persists, verify that the key still exists in the same Google Cloud project and that its API/application restrictions allow the intended Firebase usage.

### Running the Project

```bash
# Development mode
yarn dev

# Production build
yarn build
yarn start
```

## Project Structure

```
src/
├── app/               # Next.js routes
├── components/        # Reusable UI components
├── core/              # Core application logic
│   ├── auth/          # Authentication module
│   └── shared/        # Shared utilities
├── types/             # TypeScript type definitions
└── styles/            # Global styles
```

## Authentication Flow

- Public routes: Accessible without login
- Auth routes: Login, Register
- Protected routes: Dashboard, Team Management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]

## Contact

[Your Contact Information]

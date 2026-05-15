# Lequorum

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build and Push Image](https://github.com/srujanee20/lequorum/actions/workflows/docker-push.yml/badge.svg)](https://github.com/srujanee20/lequorum/actions/workflows/docker-push.yml)

**Lequorum** is a modern, real-time polling platform designed for professional and anonymous data gathering. It features a clean, minimalist design with powerful real-time analytics and a seamless user experience across devices.

## Features

-   **Real-time Updates**: Live voting counters powered by Socket.io.
-   **Poll Discovery**: A dedicated home page for public active polls with paginated discovery.
-   **Anonymous vs. Authenticated**: Support for both private user-only polls and public anonymous polls.
-   **Comprehensive Analytics**: Visualize response data with dynamic charts and participation statistics.
-   **Security**: JWT-based authentication with strict ownership validation.
-   **Premium UI**: Built with a curated aesthetic using DM Sans, DM Serif Display, and Lucide Icons.
-   **Docker Ready**: Fully containerized backend for easy deployment.

## Tech Stack

### Frontend
-   **Framework**: React 19 (Vite)
-   **Styling**: Chakra UI (v3)
-   **Routing**: TanStack Router
-   **Data Fetching**: TanStack Query
-   **Icons**: Lucide React
-   **Charts**: Recharts

### Backend
-   **Runtime**: Node.js (ESM)
-   **Framework**: Express 5
-   **Database**: PostgreSQL
-   **ORM**: Sequelize
-   **Real-time**: Socket.io
-   **Logging**: Pino

## Project Structure

```text
lequorum/
├── lequorum-api/     # Express backend
│   ├── src/
│   │   ├── configs/  # Database & Socket configurations
│   │   ├── controllers/
│   │   ├── models/   # Sequelize models
│   │   ├── routes/
│   │   └── validators/
│   └── Dockerfile
└── lequorum-ui/      # React frontend
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── hooks/
    │   └── libs/     # Axios & utility configs
    └── public/
```

## Getting Started

### Prerequisites
-   Node.js (v20+)
-   PostgreSQL instance

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/srujanee20/lequorum.git
    cd lequorum
    ```

2.  **Backend Setup**:
    ```bash
    cd lequorum-api
    npm install
    # Create a .env file based on .env.example
    npm run dev
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../lequorum-ui
    npm install
    # Create a .env file with VITE_API_BASE_URL
    npm run dev
    ```

## Environment Variables

### Backend (`lequorum-api/.env`)
| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (Default: 8000) |
| `DB_NAME` | PostgreSQL Database Name |
| `DB_USER` | PostgreSQL Username |
| `DB_PASS` | PostgreSQL Password |
| `DB_HOST` | PostgreSQL Host |
| `JWT_SECRET` | Secret key for JWT signing |
| `CLIENT_URL` | Frontend URL for CORS (e.g., http://localhost:5173) |

### Frontend (`lequorum-ui/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | Backend API URL (e.g., http://localhost:8000) |

## Deployment

-   **Backend**: Can be deployed to platforms like **Render**, **Railway**, or as a **Docker** container.
-   **Frontend**: Optimized for static hosting on **Vercel**, **Netlify**, or **Render Static Sites**.
-   **Database**: Compatible with **Supabase**, **Neon**, or any managed PostgreSQL service.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

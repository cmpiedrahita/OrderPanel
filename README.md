# OrderPanel

A real-time order tracking dashboard built with WebSockets. Status changes made in the admin panel are instantly reflected on every connected client — no polling, no page refresh.

![hero](client/src/assets/hero.png)

---

## Features

- **Live updates** — order status changes propagate instantly to all connected clients via Socket.io
- **Admin panel** — create new orders and advance their status through the pipeline
- **Client view** — filterable board with live connection indicator and per-status counters
- **Progress tracker** — animated delivery icon that moves along a progress bar as the order advances
- **Persistent storage** — orders are stored in PostgreSQL and survive server restarts

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19, Vite, Tailwind CSS v4   |
| Backend  | Node.js, Express, Socket.io       |
| Database | PostgreSQL 16 (Docker)            |

## Architecture

```
Client (React)
    │
    │  HTTP GET /orders          ← initial load
    │  HTTP POST /orders         ← create order
    │  HTTP PATCH /orders/:id    ← advance status
    │
    │  WebSocket (Socket.io)
    │  ← order:new               ← broadcast on create
    │  ← order:updated           ← broadcast on status change
    │
Server (Express + Socket.io)
    │
    └── PostgreSQL
```

When a status change is made, the server updates the database and immediately emits an event to **all** connected clients — including the one that triggered the change.

## Order Lifecycle

```
pending → preparing → on_the_way → delivered
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/OrderPanel.git
cd OrderPanel
```

**2. Start the database**

```bash
docker-compose up -d
```

**3. Start the server**

```bash
cd server
npm install
npm run dev
```

**4. Start the client**

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment Variables

The server reads from `server/.env`. Default values match the Docker Compose configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_NAME=<your_db_name>
PORT=3001
```

## Project Structure

```
OrderPanel/
├── docker-compose.yml
├── server/
│   ├── index.js        # Express app + Socket.io setup
│   ├── db.js           # PostgreSQL pool, queries, seed data
│   └── package.json
└── client/
    └── src/
        ├── App.jsx
        ├── socket.js           # Shared Socket.io instance
        ├── constants.js        # Statuses, labels, styles
        └── components/
            ├── OrderBoard.jsx  # Client view
            ├── AdminPanel.jsx  # Admin view
            └── OrderCard.jsx   # Card with progress tracker
```

## API Reference

| Method  | Endpoint                  | Description              |
|---------|---------------------------|--------------------------|
| `GET`   | `/orders`                 | Fetch all orders         |
| `POST`  | `/orders`                 | Create a new order       |
| `PATCH` | `/orders/:id/status`      | Update an order's status |

### Socket.io Events

| Event           | Direction        | Payload        |
|-----------------|------------------|----------------|
| `order:new`     | Server → Clients | Order object   |
| `order:updated` | Server → Clients | Order object   |

## License

[MIT](LICENSE)

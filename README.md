# Stockroom Product Catalog

React + Vite frontend for the Point-of-Sale product catalog.

## Run locally

1. Start the Express + SQLite API at `http://localhost:5000`.
2. Install frontend dependencies with `npm install`.
3. Start Vite with `npm run dev`.

The frontend expects these API routes:

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

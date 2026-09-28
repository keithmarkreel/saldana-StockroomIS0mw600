# Stockroom Product Catalog

React + Vite frontend for the Point-of-Sale product catalog.

## Run locally

1. Start **MySQL** from the XAMPP Control Panel.
2. In the project folder, create your local environment file by copying the template. In PowerShell, run `Copy-Item .env.example .env` (or copy `.env.example` manually and rename the copy to `.env`).
3. Open `.env` and set the connection values for your XAMPP MySQL server:

	| Setting | Typical XAMPP value | Purpose |
	| --- | --- | --- |
	| `DB_HOST` | `127.0.0.1` | MySQL server running on this computer |
	| `DB_PORT` | `3306` | MySQL port (check XAMPP if you changed it) |
	| `DB_USER` | `root` | MySQL username |
	| `DB_PASSWORD` | *(blank by default)* | Password for that MySQL user |
	| `DB_NAME` | `stockroom` | Database name the API creates and uses |
	| `PORT` | `5000` | Port for the Express API |

	XAMPP's default MySQL setup commonly uses `root` with no password. If you configured a password, enter it as the value after `DB_PASSWORD=`. Do not commit `.env`; it is ignored by Git.

4. Install dependencies with `npm install`.
5. Start the Express + MySQL API at `http://localhost:5000` with `npm run server`.
6. In a second terminal, start Vite with `npm run dev`.

On startup, the API creates the `stockroom` database (or the name in `DB_NAME`) and its `products` table if they do not exist. The configured MySQL user needs permission to create the database and table.

The frontend expects these API routes:

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

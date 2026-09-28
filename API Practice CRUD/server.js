import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mysql from 'mysql2/promise'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const port = Number(process.env.PORT) || 5000
const databaseName = process.env.DB_NAME || 'stockroom'
const connectionOptions = {
	host: process.env.DB_HOST || '127.0.0.1',
	port: Number(process.env.DB_PORT) || 3306,
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
}

if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) {
	throw new Error('DB_NAME may contain only letters, numbers, and underscores.')
}

const pool = mysql.createPool({
	...connectionOptions,
	database: databaseName,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	decimalNumbers: true,
})

const app = express()
const productColumns = 'id, name, category, price, stock, sku'

app.use(cors({ origin: /^http:\/\/(localhost|127\.0\.0\.1):\d+$/ }))
app.use(express.json({ limit: '100kb' }))

function asyncHandler(handler) {
	return (request, response, next) => {
		Promise.resolve(handler(request, response, next)).catch(next)
	}
}

function validateProduct(payload) {
	if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
		return { error: 'Request body must be a product object.' }
	}

	const name = typeof payload.name === 'string' ? payload.name.trim() : ''
	const category = typeof payload.category === 'string' ? payload.category.trim() : ''
	const sku = typeof payload.sku === 'string' ? payload.sku.trim() : ''
	const price = payload.price === '' || payload.price == null ? NaN : Number(payload.price)
	const stock = payload.stock === '' || payload.stock == null ? NaN : Number(payload.stock)

	if (!name || !category || !sku) {
		return { error: 'Name, category, and SKU are required.' }
	}
	if (!Number.isFinite(price) || price < 0) {
		return { error: 'Price must be a non-negative number.' }
	}
	if (!Number.isSafeInteger(stock) || stock < 0) {
		return { error: 'Stock must be a non-negative whole number.' }
	}

	return { product: { name, category, price, stock, sku } }
}

function parseProductId(value) {
	if (!/^\d+$/.test(value)) return null
	const id = Number(value)
	return Number.isSafeInteger(id) && id > 0 ? id : null
}

function handleDatabaseError(error, response) {
	if (error.code === 'ER_DUP_ENTRY') {
		return response.status(409).json({ error: 'A product with this SKU already exists.' })
	}
	if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED' || error.code === 'ER_WARN_DATA_OUT_OF_RANGE') {
		return response.status(400).json({ error: 'Product data violates a database constraint.' })
	}

	console.error(error)
	return response.status(500).json({ error: 'An unexpected server error occurred.' })
}

export async function initializeDatabase() {
	const connection = await mysql.createConnection(connectionOptions)
	try {
		await connection.query(
			`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
		)
	} finally {
		await connection.end()
	}

	await pool.execute(`
		CREATE TABLE IF NOT EXISTS products (
			id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR(255) NOT NULL,
			category VARCHAR(255) NOT NULL,
			price DECIMAL(10, 2) NOT NULL,
			stock INT UNSIGNED NOT NULL,
			sku VARCHAR(100) NOT NULL UNIQUE,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
	`)
}

app.get('/api/products', asyncHandler(async (_request, response) => {
	const [products] = await pool.execute(`
		SELECT ${productColumns} FROM products ORDER BY id DESC
	`)
	response.json(products)
}))

app.get('/api/products/:id', asyncHandler(async (request, response) => {
	const id = parseProductId(request.params.id)
	if (id === null) return response.status(400).json({ error: 'Product ID must be a positive integer.' })

	const [products] = await pool.execute(`
		SELECT ${productColumns} FROM products WHERE id = ?
	`, [id])
	if (products.length === 0) return response.status(404).json({ error: 'Product not found.' })

	return response.json(products[0])
}))

app.post('/api/products', asyncHandler(async (request, response) => {
	const result = validateProduct(request.body)
	if (result.error) return response.status(400).json({ error: result.error })

	const { name, category, price, stock, sku } = result.product
	const [insert] = await pool.execute(`
		INSERT INTO products (name, category, price, stock, sku) VALUES (?, ?, ?, ?, ?)
	`, [name, category, price, stock, sku])
	const [products] = await pool.execute(`
		SELECT ${productColumns} FROM products WHERE id = ?
	`, [insert.insertId])
	return response.status(201).json(products[0])
}))

app.put('/api/products/:id', asyncHandler(async (request, response) => {
	const id = parseProductId(request.params.id)
	if (id === null) return response.status(400).json({ error: 'Product ID must be a positive integer.' })

	const result = validateProduct(request.body)
	if (result.error) return response.status(400).json({ error: result.error })

	const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [id])
	if (existing.length === 0) return response.status(404).json({ error: 'Product not found.' })

	const { name, category, price, stock, sku } = result.product
	await pool.execute(`
		UPDATE products SET name = ?, category = ?, price = ?, stock = ?, sku = ? WHERE id = ?
	`, [name, category, price, stock, sku, id])
	const [products] = await pool.execute(`
		SELECT ${productColumns} FROM products WHERE id = ?
	`, [id])
	return response.json(products[0])
}))

app.delete('/api/products/:id', asyncHandler(async (request, response) => {
	const id = parseProductId(request.params.id)
	if (id === null) return response.status(400).json({ error: 'Product ID must be a positive integer.' })

	const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id])
	if (result.affectedRows === 0) return response.status(404).json({ error: 'Product not found.' })
	return response.status(204).end()
}))

app.use((request, response) => {
	response.status(404).json({ error: `Route not found: ${request.method} ${request.path}` })
})

app.use((error, _request, response, _next) => {
	if (error.type === 'entity.parse.failed') {
		return response.status(400).json({ error: 'Request body contains invalid JSON.' })
	}
	if (error.type === 'entity.too.large') {
		return response.status(413).json({ error: 'Request body is too large.' })
	}
	return handleDatabaseError(error, response)
})

export { app, pool }

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
	initializeDatabase()
		.then(() => {
			app.listen(port, () => {
				console.log(`Product API listening at http://localhost:${port}`)
				console.log(`Connected to MySQL database "${databaseName}" at ${connectionOptions.host}:${connectionOptions.port}`)
			})
		})
		.catch(async (error) => {
			console.error('Could not initialize MySQL. Check XAMPP and your DB_* settings.', error.message)
			await pool.end()
			process.exitCode = 1
		})
}

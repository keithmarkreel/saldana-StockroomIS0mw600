export const API_BASE_URL = 'http://localhost:5000'

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const payload = await response.json()
      message = payload.error || payload.message || message
    } catch {
      // Keep the HTTP status message when the API has no JSON body.
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

export function formatPrice(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(Number(value) || 0)
}

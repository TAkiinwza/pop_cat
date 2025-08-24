const API_BASE = import.meta.env.VITE_API_BASE || '/api'
export async function postClick(country = 'TH', n = 1) {
  const res = await fetch(`${API_BASE}/click`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country, n })
  })
  if (!res.ok) throw new Error('click failed')
  return res.json()
}
export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`)
  if (!res.ok) throw new Error('stats failed')
  return res.json()
}

import { createClient } from 'redis'

const url = process.env.REDIS_URL || 'redis://redis:6379'
export const redis = createClient({ url })
redis.on('error', err => console.error('Redis error', err))
await redis.connect()

// Sorted set for per-country counts; string key for total
export const ZKEY = 'country_clicks'
export const TKEY = 'clicks_total'

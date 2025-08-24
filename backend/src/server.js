import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { redis, ZKEY, TKEY } from './redis.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const limiter = rateLimit({ windowMs: 5_000, max: 200, standardHeaders: true })
app.use('/api/', limiter)

app.get('/healthz', (_,res)=>res.send('ok'))
app.get('/readyz', async (_,res)=>{
  try { await redis.ping(); res.send('ready') } catch { res.status(500).send('no-redis') }
})

app.post('/api/click', async (req,res)=>{
  let { country, n } = req.body || {}
  if (typeof country !== 'string' || country.length < 2 || country.length > 3) country = 'TH'
  n = Number.isFinite(+n) ? Math.max(1, Math.min(1000, +n)) : 1
  try {
    await redis.multi()
      .zincrby(ZKEY, n, country.toUpperCase())
      .incrBy(TKEY, n)
      .exec()
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ ok:false, error: 'db' }) }
})

app.get('/api/stats', async (_req,res)=>{
  try {
    const top = await redis.zRangeWithScores(ZKEY, -20, -1, { REV: true })
    const total = Number(await redis.get(TKEY) || 0)
    res.json({ total, top: top.map(x=>({ country: x.value, count: Math.trunc(x.score) })) })
  } catch { res.status(500).json({ total:0, top:[] }) }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, ()=> console.log('listening', PORT))

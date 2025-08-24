import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<500'] },
  scenarios: {
    click_spike: {
      executor: 'ramping-arrival-rate',
      startRate: 50, timeUnit: '1s', preAllocatedVUs: 100, maxVUs: 1000,
      stages: [
        { target: 200, duration: '30s' },
        { target: 800, duration: '60s' },
        { target: 0,   duration: '20s' }
      ]
    }
  }
}

const BASE = __ENV.BASE || 'https://popcat.example.com'

export default function(){
  const body = JSON.stringify({ country: 'TH', n: 1 })
  const res = http.post(`${BASE}/api/click`, body, { headers: { 'Content-Type':'application/json' } })
  check(res, { '200': r => r.status === 200 })
  if (__ITER % 10 === 0) http.get(`${BASE}/api/stats`)
  sleep(0.1)
}

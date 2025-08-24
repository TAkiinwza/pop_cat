import { useEffect, useMemo, useRef, useState } from 'react'
import { postClick, getStats } from './api'

const COUNTRIES = ['TH','US','JP','KR','VN','SG','MY','PH','ID','IN','CN','TW','GB','DE','FR']

export default function App(){
  const [country, setCountry] = useState('TH')
  const [local, setLocal] = useState(0)
  const [total, setTotal] = useState(0)
  const [board, setBoard] = useState([])
  const queueRef = useRef(0)
  const timerRef = useRef(null)

  function flush(){
    const n = queueRef.current
    if (!n) return
    queueRef.current = 0
    postClick(country, n).catch(()=>{})
  }

  function click(){
    setLocal(v=>v+1)
    queueRef.current += 1
  }

  useEffect(()=>{
    timerRef.current = setInterval(flush, 300)
    const poll = setInterval(()=>{
      getStats().then(d=>{ setTotal(d.total||0); setBoard(d.top||[]) }).catch(()=>{})
    }, 2000)
    return ()=>{ clearInterval(timerRef.current); clearInterval(poll) }
  },[])

  useEffect(()=>{ flush() }, [country])

  const topRows = useMemo(()=>board.map((r,i)=> (
    <tr key={r.country}><td>{i+1}</td><td>{r.country}</td><td className="center">{r.count.toLocaleString()}</td></tr>
  )), [board])

  return (
    <div className="card">
      <h2>🐱 Popcat Cloud</h2>
      <div className="grid">
        <div>
          <div className="small">Country</div>
          <select className="select" value={country} onChange={e=>setCountry(e.target.value)}>
            {COUNTRIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="center">
          <div className="small">Your clicks (local)</div>
          <div style={{fontSize:24}}>{local}</div>
        </div>
      </div>

      <div style={{display:'grid', placeItems:'center', margin:'16px 0'}}>
        <button className="btn" onClick={click} aria-label="pop">
          <span role="img" aria-label="cat">😺</span>
        </button>
      </div>

      <div className="grid">
        <div>
          <div className="small">Total</div>
          <div style={{fontSize:20}}>{total.toLocaleString()}</div>
        </div>
        <div className="center">
          <div className="small">Live board</div>
        </div>
      </div>
      <table className="table">
        <thead><tr><th>#</th><th>Country</th><th className="center">Clicks</th></tr></thead>
        <tbody>{topRows}</tbody>
      </table>
    </div>
  )
}

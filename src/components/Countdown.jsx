import { useEffect, useState } from 'react'
export default function Countdown({ date, time }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  if (!date) return null
  const diff = new Date(`${date}T${time || '00:00'}`).getTime() - now
  if (isNaN(diff) || diff <= 0) return null
  const s = Math.floor(diff / 1000)
  const cells = [[Math.floor(s / 86400), 'Kun'], [Math.floor(s / 3600) % 24, 'Soat'], [Math.floor(s / 60) % 60, 'Daqiqa'], [s % 60, 'Soniya']]
  return (
    <div className="cd"><p>Tadbirgacha</p>
      <div>{cells.map(([n, l]) => <span key={l}><b>{String(n).padStart(2, '0')}</b><i>{l}</i></span>)}</div>
    </div>
  )
}

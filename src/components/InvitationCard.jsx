import { useEffect, useRef, useState } from 'react'
import { TEMPLATES, FONTS } from '../data/templates.js'
import { MONTHS } from '../data/invitationTypes.js'

function fmtDate(d, t) {
  if (!d) return t || ''
  const [y, m, day] = d.split('-').map(Number)
  if (!y) return t || ''
  return `${day} ${MONTHS[m - 1]} ${y}${t ? ' · ' + t : ''}`
}

function Rsvp() {
  const [ans, setAns] = useState(() => { try { return localStorage.getItem('invitex-rsvp') } catch { return null } })
  const [open, setOpen] = useState(false)
  const pick = (v) => { setAns(v); setOpen(false); try { localStorage.setItem('invitex-rsvp', v) } catch {} }
  return (
    <div className="rsvp" data-no-export="1">
      {ans && !open ? <p>{ans === 'yes' ? '✓ Ishtirok etasiz' : 'Javobingiz saqlandi'} <button onClick={() => setOpen(true)}>o'zgartirish</button></p>
        : open ? <><p>Taklifnomani qabul qildingizmi?</p><div><button onClick={() => pick('yes')}>Ha, albatta</button><button onClick={() => pick('no')}>Afsuski, yo'q</button></div></>
        : <button className="rsvp-main" onClick={() => setOpen(true)}>Ishtirok etaman</button>}
    </div>
  )
}

export default function InvitationCard({ d, image, cardRef }) {
  const t = TEMPLATES.find((x) => x.id === d.template) || TEMPLATES[0]
  const audio = useRef(null)
  const [playing, setPlaying] = useState(false)
  useEffect(() => { if (!d.musicOn && audio.current) { audio.current.pause(); setPlaying(false) } }, [d.musicOn])
  const toggle = () => {
    const a = audio.current; if (!a) return
    if (playing) { a.pause(); setPlaying(false) } else a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }
  const parts = d.names.split('&').map((s) => s.trim()).filter(Boolean)
  const initials = parts.map((p) => p[0]).join('&')
  return (
    <div ref={cardRef} className={`card t-${t.id} f-${d.font}`}
      style={{ '--bg': t.bg, '--ink': t.ink, '--ac': d.color || t.ac, fontFamily: FONTS[d.font].css }}>
      <span className="orn o1" aria-hidden="true" /><span className="orn o2" aria-hidden="true" />
      <div className="frame">
        {d.title && <p className="eyebrow">{d.title}</p>}
        <div className="photo">{image ? <img src={image} alt="Taklifnoma rasmi" /> : <span>{initials || '✦'}</span>}</div>
        {parts.length === 2 && t.id !== 'minimal'
          ? <h2 className="names">{parts[0]}<em>&amp;</em>{parts[1]}</h2>
          : <h2 className="names one">{d.names}</h2>}
        {d.message && <p className="msg">{d.message}</p>}
        <div className="rule"><i /></div>
        {(d.date || d.time) && <p className="when">{fmtDate(d.date, d.time)}</p>}
        {d.location && <p className="where"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg> {d.location}</p>}
        {d.rsvpOn && <Rsvp />}
      </div>
      {d.musicOn && <>
        <audio ref={audio} src="/music.wav" loop preload="none" />
        <button className="music" data-no-export="1" onClick={toggle} aria-label="Musiqa">{playing ? '❚❚' : '♪'}</button>
      </>}
    </div>
  )
}
